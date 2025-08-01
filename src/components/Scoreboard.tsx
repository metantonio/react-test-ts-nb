import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreBoard {
  away_score: string;
  home_score: string;
  quarter: string;
  clock: string;
  away_possessions: string;
  home_possessions: string;
  away_fouls: string;
  home_fouls: string;
  home_team_offense: string;
  player_with_ball: string;
}

interface ScoreboardProps {
  scoreboardData: ScoreBoard;
  awayTeamName: string;
  homeTeamName: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ scoreboardData, awayTeamName, homeTeamName }) => {
  if (!scoreboardData) {
    return null;
  }

  const {
    away_score,
    home_score,
    quarter,
    clock,
    away_fouls,
    home_fouls,
    home_team_offense,
  } = scoreboardData;

  const isHomeTeamOffense = home_team_offense === '1';

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 text-white border-2 border-gray-700 shadow-lg rounded-lg">
      <CardHeader className="text-center p-4 border-b border-gray-700">
        <CardTitle className="text-3xl font-bold tracking-wider uppercase">Live Score</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="w-1/3 text-center">
            <h2 className="text-2xl font-extrabold text-yellow-400">{awayTeamName}</h2>
            <p className="text-7xl font-mono font-bold">{away_score}</p>
            <div className="flex justify-center items-center mt-2 space-x-4">
              <span className="text-lg">Fouls: {away_fouls}</span>
              {!isHomeTeamOffense && <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>}
            </div>
          </div>
          <div className="w-1/3 text-center border-x-2 border-gray-700 px-4">
            <div className="text-2xl font-bold">Q:{quarter}</div>
            <div className="text-5xl font-mono font-bold text-green-400">{clock}</div>
          </div>
          <div className="w-1/3 text-center">
            <h2 className="text-2xl font-extrabold text-yellow-400">{homeTeamName}</h2>
            <p className="text-7xl font-mono font-bold">{home_score}</p>
            <div className="flex justify-center items-center mt-2 space-x-4">
              <span className="text-lg">Fouls: {home_fouls}</span>
              {isHomeTeamOffense && <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
