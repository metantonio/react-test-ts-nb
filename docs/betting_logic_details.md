# P2P Betting System: Technical Specification (Enhanced)

This document details the business logic, database interactions, and AWS Lambda functions for the Peer-to-Peer betting system with external wallet and escrow integration.

## 0. Process Overview Diagram

```mermaid
sequenceDiagram
    participant User as User (A/B)
    participant App as Frontend (React)
    participant Lambda as AWS Lambda
    participant DB as PostgreSQL
    participant ExtWallet as External Wallet API
    participant Escrow as Platform Escrow Vault

    Note over User, Escrow: 1. Challenge Creation (User A)
    User->>App: Clicks "Bet on Game/Player"
    App->>Lambda: create_bet_offer(stake, selection, stats)
    Lambda->>Lambda: Validate Min Stake (Anti-Spam)
    Lambda->>ExtWallet: Verify Balance User A (Stake + Gas Fee)
    ExtWallet-->>Lambda: Balance OK
    Lambda->>ExtWallet: Initiate Transfer(UserA -> Escrow)
    Lambda->>DB: INSERT INTO bets (status='escrow_pending')
    ExtWallet-->>Lambda: Transfer Confirmed
    Lambda->>DB: UPDATE bets (status='open')
    Lambda-->>App: Bet Published

    Note over User, Escrow: 2. Challenge Acceptance (User B)
    User->>App: Clicks "Accept Bet"
    App->>Lambda: accept_bet_offer(bet_id)
    Lambda->>ExtWallet: Verify Balance User B (Stake + Gas Fee)
    Lambda->>ExtWallet: Initiate Transfer(UserB -> Escrow)
    Lambda->>DB: UPDATE bets (status='matching')
    ExtWallet-->>Lambda: Transfer Confirmed
    Lambda->>DB: UPDATE bets (status='matched', acceptor_id=UserB)
    Lambda-->>App: Bet Matched

    Note over User, Escrow: 3. Simulation & Payout
    DB-->>Lambda: Game/Stats Finalized Trigger
    Lambda->>DB: SELECT wins/losses based on results
    Lambda->>Lambda: Economic Viability Audit (Fee < Pot?)
    alt Gas is too high
        Lambda->>DB: UPDATE bets (status='high_gas_wait')
    else Economic Viability OK
        Lambda->>DB: UPDATE bets (status='paying_out') [Atomic Lock]
        Lambda->>ExtWallet: Transfer Pot(Escrow -> Winner, Idempotency_Key)
        Lambda->>DB: UPDATE bets (status='won'/'lost')
        Lambda->>DB: Update user_bet_stats
    end
```

---

## 1. User Initialization (`cognito_post_confirmation`)

**Objective**: Link the user to the application's betting context immediately upon sign-up.

### Tables & Values
- **Table**: `wallets`
- **Actions**: Create a record with the `user_id` (Cognito `sub`) and a placeholder for the `external_wallet_address`.

### Lambda Snippet (Python)
```python
import json
import psycopg2

def lambda_handler(event, context):
    user_id = event['request']['userAttributes']['sub']
    
    conn = psycopg2.connect("dbname=... user=... password=... host=...")
    cur = conn.cursor()
    
    try:
        cur.execute(
            "INSERT INTO wallets (user_id, balance) VALUES (%s, 0.00) ON CONFLICT DO NOTHING",
            (user_id,)
        )
        conn.commit()
    except Exception as e:
        print(f"Error creating wallet: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()
        
    return event
```

---

## 2. Initiating a Challenge (`create_bet_offer`)

**Objective**: Lock User A's funds in escrow based on a game or specific player stats.

### Specific Steps & Logic:
1.  **Selection**: User A picks a game or player stat and sets the `stake`.
2.  **Minimum Stake Validation**: Lambda checks if `stake >= MIN_PAYOUT_THRESHOLD` (e.g., stake must be high enough that `stake * 2` significantly exceeds transaction gas).
3.  **Fee Calculation**: Lambda estimates the `Total_Fee` required to cover transaction gas for (Stake Transfer In + Acceptance Transfer In + Winner Payout).
4.  **External Check**: Lambda calls the external wallet service to verify User A has `balance >= (stake + Total_Fee)`.
5.  **Tx Initiation**: Lambda initiates a transfer from User A to the **Platform Escrow Vault** for `(stake + Total_Fee)`.
6.  **Local Record**: Create a record in `bets` with `status='escrow_pending'`.
7.  **Audit**: Create a `wallet_transactions` entry (Type: `escrow_in`).
8.  **Confirmation**: Once the external service confirms the transfer, update `bets.status = 'open'`.

### Lambda Snippet (Python Example)
```python
def create_bet_offer(user_id, game_id, selection, stake):
    # 1. Dynamic Minimum Stake Guard
    min_stake = calculate_dynamic_min_stake() # Based on current network gas
    if stake < min_stake:
        return {"error": f"Stake too low. Minimum required: {min_stake}"}

    # 2. Dynamic Fee Calculation (Escrow In + Acceptance In + Payout Out)
    platform_fee = calculate_dynamic_gas_fee()
    total_required = stake + platform_fee

    # 3. External Balance Verification
    if not external_wallet.has_funds(user_id, total_required):
        return {"error": "Insufficient funds to cover stake and transaction gas"}

    # 4. Transfer Total (Stake + Gas Fee) to Escrow
    tx_id = external_wallet.transfer(source=user_id, destination=PLATFORM_ESCROW, amount=total_required)

    # 5. DB Persistence
    db.execute(
        "INSERT INTO bets (user_id, game_id, selection, stake, fee_paid, escrow_tx_id, status) VALUES (%s, %s, %s, %s, %s, %s, 'escrow_pending')",
        (user_id, game_id, selection, stake, platform_fee, tx_id)
    )
    return {"status": "pending_confirmation", "tx_id": tx_id}
```

---

## 3. Accepting a Challenge (`accept_bet_offer`)

**Objective**: Match the challenge by taking User B's stake into escrow.

### Specific Steps:
1.  **Verification**: Lambda verifies User B has sufficient funds and the bet is still `status='open'`.
2.  **Fee Calculation**: Lambda verifies User B's balance covers `Stake + Gas_Fee` (In-transfer + portion of Payout gas).
3.  **Ext Transfer**: Lambda initiates a transfer from User B to the **Platform Escrow Vault** (Stake + AcceptanceFee).
4.  **Matching**: Set `bets.status = 'matched'` and `bets.acceptor_id = UserB` ONLY AFTER the transfer is confirmed by the external service.

---

## 4. Game Result & Settlement (`process_settlement_escrow`)

**Objective**: Resolve the bet using simulation data or player metrics and release the pot.

### Settlement Logic Details:
- **Simulation Source**: `games.home_score` vs `games.away_score`.
- **Stat Source**: `game_player_stats` (points, rebounds, etc.).
- **Payout Calculation**:
    - **Total Pot** = `stake * 2`. (Transaction fees/gas were pre-collected from both parties).
    - **Final Check**: Run `Global_Liquidity_Audit` to verify the Vault balance matches all `matched` bets.
    - **Transfer**: Call `External_Wallet_API.transfer(from: PlatformEscrow, to: Winner, amount: Pot)`.

### Lambda Snippet (Python Example)
```python
def settle_bet(bet):
    game = db.get_game(bet.game_id)
    winner_id = determine_winner(bet, game) # Selection vs Actual Results
    
    if winner_id:
        total_pot = bet.stake * 2
        
        # 1. Economic Viability Check
        current_gas_fee = external_wallet.estimate_fee(destination=winner_id)
        if current_gas_fee >= total_pot:
            db.execute("UPDATE bets SET status='high_gas_wait' WHERE id=%s", (bet.id,))
            return

        # 2. Atomic Transaction Lock (Idempotency Key)
        # Using bet_id + "payout" ensures the API provider only executes once
        idempotency_key = f"{bet.id}_payout"
        
        # Mark as 'paying_out' to prevent concurrent Lambda triggers from retrying
        db.execute("UPDATE bets SET status='paying_out' WHERE id=%s AND status != 'paying_out'", (bet.id,))
        if db.row_count == 0: return # Already being processed

        # 3. Secure Transfer from Escrow to Winner
        try:
            tx_id = external_wallet.transfer(
                source=PLATFORM_ESCROW, 
                destination=winner_id, 
                amount=total_pot,
                idempotency_key=idempotency_key
            )
            
            # 4. Final Confirmation
            db.execute("UPDATE bets SET status='won', settled_at=NOW(), payout_tx_id=%s WHERE id=%s", (tx_id, bet.id))
            update_user_stats(winner_id, win=True, profit=bet.stake)
        except Exception as e:
            # Handle communication error (Status stays 'paying_out' for reconciliation)
            alert_admin(f"Payout exception for {bet.id}: {e}")
```

### Financial Risk & Liquidity Safety

In a **Peer-to-Peer (P2P)** model, the platform acts as a facilitator, not a bookmaker. However, there are still risks that could lead to financial loss:

#### 1. Transaction Cost Risk (Gas/Tolls)
- **Risk**: If the `Platform Fee` is lower than the total gas spent to move funds (User -> Escrow -> Winner), the platform loses money on every bet.
- **Mitigation**: The system calculates a dynamic fee or a fixed percentage that covers the maximum estimated gas for at least 3 transfers (2 into escrow, 1 out).

#### 2. The "Double-Payout" Risk
- **Risk**: A race condition or bug in the Lambda could trigger two payout transfers for the same `bet_id`.
- **Mitigation**: 
    - Use **Database Transactions**: Mark the bet as `status='settling'` before initiating the transfer.
    - **Idempotency**: Use a unique `Idempotency Key` (e.g., `bet_id + "payout"`) when calling the External Wallet API to ensure the transfer only happens once.

#### 3. Platform Insolvency (Liquidity)
- **Risk**: Errors in accounting or external hacks.
- **Safety Lock**: The `Global_Liquidity_Audit` must run before **every** payout batch.
    - **Formula**: `Escrow_Account_Balance >= SUM(Matched_Stakes * 2)`.
    - If this fails, the system automatically shuts down payouts and alerts admins.

> [!TIP]
> **Profitability Rule**: `Net Margin = (Total_Fees_Collected) - (Gas_In_A + Gas_In_B + Gas_Payout_Winner)`. 
> The platform should only process bets where the Margin is positive.

### Payout Idempotency & Error Recovery

**Objective**: Ensure that a payout is never executed twice, even in the event of a network timeout or Lambda failure.

1.  **Status Atomic Lock**: The bet status transitions to `paying_out` **before** the API call. If the Lambda crashes, the bet stays in this state.
2.  **External Idempotency**: The `external_wallet.transfer` call MUST include a unique `idempotency_key`. If the platform retries an identical request, the wallet provider returns the original `tx_id` instead of moving funds again.
3.  **Reconciliation Loop**: A separate "Reconciler" service (Lambda triggered by EventBridge) periodically checks for bets stuck in `paying_out` for > 15 minutes.
    - It queries the External Wallet API to check if the `idempotency_key` (bet_id) has a confirmed transaction.
    - If **Yes**: Updates DB to `status='won'`.
    - If **No**: Reverts DB to `status='matched'` (or retries).

---

## 5. High Gas & Dust Management

**Objective**: Prevent the platform from processing irrational transactions where the network cost exceeds the value of the prize.

### 1. Economic Viability Rule
A payout is considered **economically viable** if:
`Pot_Amount > (Current_Network_Gas * Multiplier)`.
- If `current_gas >= pot`, the status is set to `high_gas_wait`.
- If the prize is extremely small (Dust), the platform may consolidate payouts or offer a "Claim" mechanism where the user pays the gas.

### 2. The `high_gas_wait` Status
- Bets in this status are checked every hour by a scheduled Lambda trigger.
- When network congestion clears and `gas < pot * 0.5` (or a defined safety threshold), the transfer is executed automatically.
- Users see a "Congested Network - Pending Payout" message in the UI.

### 3. Anti-Spam & Platform Defense
To prevent "Dust Attacks" (creating thousands of tiny bets that are unprofitable to settle), the platform enforces:
- **Minimum Stake Requirement**: A bet must be at least `Current_Gas * 5` to be created.
- **Dynamic Throttle**: If a user creates more than 5 `unmatched` bets in 1 minute, the API temporarily rate-limits their `create_bet_offer` calls.
- **Dust Consolidation**: For small wins, the platform may encourage users to "Batch Claim" multiple winnings into a single transaction to save on gas.
