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

-- Indexing (Optional but recommended for JSONB queries)
-- CREATE INDEX idx_games_play_by_play ON games USING GIN (play_by_play);
-- CREATE INDEX idx_games_box_score ON games USING GIN (box_score);
