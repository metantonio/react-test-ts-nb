import React from 'react';

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
  awayTeamLogo?: string; // Optional: URL or path to the team's logo
  homeTeamLogo?: string; // Optional: URL or path to the team's logo
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  scoreboardData,
  awayTeamName,
  homeTeamName,
  awayTeamLogo,
  homeTeamLogo,
}) => {
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

  const TeamLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => (
    logo ? <img src={logo} alt={`${name} Logo`} className="h-14 w-14 object-contain" /> : <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">{name.substring(0, 3).toUpperCase()}</div>
  );


  return (
    <div className="w-full max-w-5xl mx-auto font-sans bg-gray-900/80 backdrop-blur-sm text-white rounded-2xl shadow-2xl border-2 border-gray-700/50 overflow-hidden">
      {/* Main Scoreboard */}
      <div className="flex items-center justify-between p-3">
        {/* Away Team */}
        <div className="flex items-center gap-4 flex-1">
          <TeamLogo logo={awayTeamLogo} name={awayTeamName} />
          <span className="text-3xl font-bold tracking-wider">{awayTeamName.toUpperCase()}</span>
        </div>

        <div className="text-7xl font-mono font-extrabold text-yellow-300 w-32 text-center">{away_score}</div>

        {/* Center Info */}
        <div className="flex flex-col items-center justify-center text-center px-8">
          <div className="text-5xl font-mono font-bold text-red-500 tabular-nums">{clock}</div>
          <div className="text-2xl font-semibold tracking-widest">Q{quarter}</div>
        </div>

        {/* Home Team */}
        <div className="text-7xl font-mono font-extrabold text-yellow-300 w-32 text-center">{home_score}</div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <span className="text-3xl font-bold tracking-wider">{homeTeamName.toUpperCase()}</span>
          <TeamLogo logo={homeTeamLogo} name={homeTeamName} />
        </div>
      </div>

      {/* Bottom Bar for Fouls/Possession */}
      <div className="bg-black/50 flex justify-between items-center text-lg px-6 py-1">
        <div className="flex items-center gap-6">
          <div className={`w-4 h-4 rounded-full bg-red-500 transition-opacity duration-300 ${!isHomeTeamOffense ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">FOULS</span>
            <span className="font-mono text-2xl">{away_fouls}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">FOULS</span>
            <span className="font-mono text-2xl">{home_fouls}</span>
          </div>
          <div className={`w-4 h-4 rounded-full bg-red-500 transition-opacity duration-300 ${isHomeTeamOffense ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;