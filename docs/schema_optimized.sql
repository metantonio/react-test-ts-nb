-- Optimized Database Schema (JSONB Approach)
-- This schema uses JSONB columns for play-by-play and box scores to improve performance.

-- 1. Leagues Table
CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- 2. Teams Table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    league_id INTEGER REFERENCES leagues(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Games Table (Optimized)
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    game_type VARCHAR(50) NOT NULL, -- 'single' or 'season'
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    played_at TIMESTAMP DEFAULT NOW(),
    season_game_number INTEGER,
    cognito_user_id VARCHAR(255),
    
    -- Optimized Columns: Storing arrays of data as JSONB
    play_by_play JSONB, 
    -- Structure: [{ "line_number": 1, "text": "...", "color": "..." }, ...]
    
    box_score JSONB
    -- Structure: [{ "line_number": 1, "text": "..." }, ...]
);

-- 4. Game Player Stats (For structured analysis)
CREATE TABLE game_player_stats (
    id BIGSERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id),
    player_name VARCHAR(255) NOT NULL,
    team_id INTEGER REFERENCES teams(id),
    
    -- Stats columns
    points INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    steals INTEGER DEFAULT 0,
    blocks INTEGER DEFAULT 0,
    turnovers INTEGER DEFAULT 0,
    
    -- Storing precise shooting stats if needed
    field_goals_made INTEGER DEFAULT 0,
    field_goals_attempted INTEGER DEFAULT 0,
    three_pointers_made INTEGER DEFAULT 0,
    three_pointers_attempted INTEGER DEFAULT 0,
    free_throws_made INTEGER DEFAULT 0,
    free_throws_attempted INTEGER DEFAULT 0
);

-- CREATE INDEX idx_games_box_score ON games USING GIN (box_score);

-- 5. Wallets Table
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Wallet Transactions Table
CREATE TABLE wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallets(id),
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Bets Table
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    game_id INTEGER REFERENCES games(id),
    bet_type VARCHAR(50) NOT NULL,
    selection VARCHAR(255) NOT NULL,
    odds DECIMAL(6,2) NOT NULL,
    stake DECIMAL(12,2) NOT NULL,
    potential_payout DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    settled_at TIMESTAMP
);

-- 8. User Bet Stats Table
CREATE TABLE user_bet_stats (
    user_id VARCHAR(255) PRIMARY KEY,
    total_bets INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    total_wagered DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    win_rate DECIMAL(5,2)
);
