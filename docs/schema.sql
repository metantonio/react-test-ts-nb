-- PostgreSQL Schema for Predicted Games

-- 1. Leagues Table
CREATE TABLE IF NOT EXISTS leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- 2. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(league_id, name)
);

-- 3. Games Table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    game_type VARCHAR(50) NOT NULL CHECK (game_type IN ('single', 'season')),
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    season_game_number INTEGER, -- Optional, for full season tracking
    cognito_user_id VARCHAR(255) -- Optional, links to AWS Cognito User ID
);

-- Indexes for faster lookup of games by team
CREATE INDEX idx_games_home_team ON games(home_team_id);
CREATE INDEX idx_games_away_team ON games(away_team_id);

-- 4. Play-by-Play Table
CREATE TABLE IF NOT EXISTS game_play_by_play (
    id BIGSERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    text TEXT NOT NULL,
    color VARCHAR(50) -- Stores color code or class name from UI
);

-- Index for retrieving PBP for a specific game in order
CREATE INDEX idx_pbp_game_id ON game_play_by_play(game_id, line_number);

-- 5. Box Scores Table
CREATE TABLE IF NOT EXISTS game_box_scores (
    id BIGSERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    text TEXT NOT NULL
);

-- Index for retrieving Box Score for a specific game in order
CREATE INDEX idx_box_game_id ON game_box_scores(game_id, line_number);

-- 6. Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL, -- Cognito User ID
    balance DECIMAL(12,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Wallet Transactions Table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, bet_placed, bet_won
    reference_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bets Table
CREATE TABLE IF NOT EXISTS bets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    game_id INTEGER REFERENCES games(id) ON DELETE SET NULL,
    bet_type VARCHAR(50) NOT NULL, -- winner, over_under, spread
    selection VARCHAR(255) NOT NULL, -- e.g., 'home_team', 'over_210.5'
    odds DECIMAL(6,2) NOT NULL,
    stake DECIMAL(12,2) NOT NULL,
    potential_payout DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP WITH TIME ZONE
);

-- 9. User Bet Stats Table
CREATE TABLE IF NOT EXISTS user_bet_stats (
    user_id VARCHAR(255) PRIMARY KEY,
    total_bets INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    total_wagered DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    win_rate DECIMAL(5,2)
);

-- Indexes for betting system
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_game_id ON bets(game_id);
CREATE INDEX idx_transactions_wallet_id ON wallet_transactions(wallet_id);
