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
    season_game_number INTEGER -- Optional, for full season tracking
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
