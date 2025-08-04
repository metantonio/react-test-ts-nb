import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Scoreboard from '@/components/Scoreboard';
import PlayerStatsTable from '@/components/PlayerStatsTable';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface Message {
  message: string;
}

interface League {
  league_name: string;
}

interface LeagueResponse {
  data: League[];
}

interface Teams {
  teams: string;
}

interface TeamsResponse {
  data: Teams[];
}

interface PlayerChar {
  name: string;
  position: string;
  poss_fact: string;
  two_pt_fg_pct: string;
  ft_pct: string;
  pct_shot: string;
  three_pt_pct_shot: string;
  pct_fouled: string;
  pct_to: string;
  pct_pass: string;
  off_reb: string;
  def_reb: string;
  def_fg_pct: string;
  pct_pf: string;
  pct_st: string;
  pct_bs: string;
  year: string;
  team_code: string;
  height: string;
  deny_fact: string;
}

interface PlayerCharResponse {
  data: PlayerChar[];
}

interface PlayPredictResponse {
  data: PlayerChar[];
}

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
  away_player1: string;
  away_player2: string;
  away_player3: string;
  away_player4: string;
  away_player5: string;
  home_player1: string;
  home_player2: string;
  home_player3: string;
  home_player4: string;
  home_player5: string;
  away_player1_pts: string;
  away_player2_pts: string;
  away_player3_pts: string;
  away_player4_pts: string;
  away_player5_pts: string;
  home_player1_pts: string;
  home_player2_pts: string;
  home_player3_pts: string;
  home_player4_pts: string;
  home_player5_pts: string;
  away_player1_reb: string;
  away_player2_reb: string;
  away_player3_reb: string;
  away_player4_reb: string;
  away_player5_reb: string;
  home_player1_reb: string;
  home_player2_reb: string;
  home_player3_reb: string;
  home_player4_reb: string;
  home_player5_reb: string;
  away_player1_ast: string;
  away_player2_ast: string;
  away_player3_ast: string;
  away_player4_ast: string;
  away_player5_ast: string;
  home_player1_ast: string;
  home_player2_ast: string;
  home_player3_ast: string;
  home_player4_ast: string;
  home_player5_ast: string;
  away_player1_pf: string;
  away_player2_pf: string;
  away_player3_pf: string;
  away_player4_pf: string;
  away_player5_pf: string;
  home_player1_pf: string;
  home_player2_pf: string;
  home_player3_pf: string;
  home_player4_pf: string;
  home_player5_pf: string;
  away_player1_possfact: string;
  away_player2_possfact: string;
  away_player3_possfact: string;
  away_player4_possfact: string;
  away_player5_possfact: string;
  home_player1_possfact: string;
  home_player2_possfact: string;
  home_player3_possfact: string;
  home_player4_possfact: string;
  home_player5_possfact: string;
  off_position1: string;
  off_position2: string;
  off_position3: string;
  off_position4: string;
  off_position5: string;
  def_position1: string;
  def_position2: string;
  def_position3: string;
  def_position4: string;
  def_position5: string;
  passable1: string;
  passable2: string;
  passable3: string;
  passable4: string;
  passable5: string;
  passable6: string;
  passable7: string;
  away_players: []
  home_players: []
}

interface ScoreBoardResponse {
  scoreboard: ScoreBoard[];
}

interface PlayByPlay {
  color: string;
  pbp_line: string;
}

interface UpdatePlayByPlayResponse {
  playbyplay: PlayByPlay[];
}

interface BoxScore {
  box_line: string;
  game_number: string;
  line_number: string;
}

interface BoxScoreResponse {
  boxscore: BoxScore[];
}

const teamLogos: { [key: string]: string } = {
  "Atlanta Hawks": "https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg",
  "Boston Celtics": "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
  "Brooklyn Nets": "https://upload.wikimedia.org/wikipedia/commons/4/44/Brooklyn_Nets_newlogo.svg",
  "Charlotte Hornets": "https://upload.wikimedia.org/wikipedia/en/c/c4/Charlotte_Hornets_logo.svg",
  "Chicago Bulls": "https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg",
  "Cleveland Cavaliers": "https://upload.wikimedia.org/wikipedia/en/4/4b/Cleveland_Cavaliers_logo.svg",
  "Dallas Mavericks": "https://upload.wikimedia.org/wikipedia/en/9/97/Dallas_Mavericks_logo.svg",
  "Denver Nuggets": "https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg",
  "Detroit Pistons": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Detroit_Pistons_logo.svg",
  "Golden State Warriors": "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
  "Houston Rockets": "https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Rockets.svg",
  "Indiana Pacers": "https://upload.wikimedia.org/wikipedia/en/1/1b/Indiana_Pacers.svg",
  "Los Angeles Clippers": "https://upload.wikimedia.org/wikipedia/en/b/bb/Los_Angeles_Clippers_logo.svg",
  "Los Angeles Lakers": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
  "Memphis Grizzlies": "https://upload.wikimedia.org/wikipedia/en/f/f1/Memphis_Grizzlies.svg",
  "Miami Heat": "https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg",
  "Milwaukee Bucks": "https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg",
  "Minnesota Timberwolves": "https://upload.wikimedia.org/wikipedia/en/c/c2/Minnesota_Timberwolves_logo.svg",
  "New Orleans Pelicans": "https://upload.wikimedia.org/wikipedia/en/0/0d/New_Orleans_Pelicans_logo.svg",
  "New York Knicks": "https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg",
  "Oklahoma City Thunder": "https://upload.wikimedia.org/wikipedia/en/5/5d/Oklahoma_City_Thunder.svg",
  "Orlando Magic": "https://upload.wikimedia.org/wikipedia/en/1/1e/Orlando_Magic_logo.svg",
  "Philadelphia 76ers": "https://upload.wikimedia.org/wikipedia/en/0/0e/Philadelphia_76ers_logo.svg",
  "Phoenix Suns": "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
  "Portland Trail Blazers": "https://upload.wikimedia.org/wikipedia/en/2/21/Portland_Trail_Blazers_logo.svg",
  "Sacramento Kings": "https://upload.wikimedia.org/wikipedia/en/c/c7/Sacramento_Kings.svg",
  "San Antonio Spurs": "https://upload.wikimedia.org/wikipedia/en/a/a2/San_Antonio_Spurs.svg",
  "Toronto Raptors": "https://upload.wikimedia.org/wikipedia/en/3/36/Toronto_Raptors_logo.svg",
  "Utah Jazz": "https://upload.wikimedia.org/wikipedia/en/0/04/Utah_Jazz_logo.svg",
  "Washington Wizards": "https://upload.wikimedia.org/wikipedia/en/0/02/Washington_Wizards_logo.svg",
};

const GameSetup = () => {
  const { fetchWithAuth, isLoading } = useApi();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Teams[]>([{ teams: "dummy data teams 1" }, { teams: "dummy data teams 2" }]);
  const [selectedTeams1, setSelectedTeams1] = useState<Teams | null>(null);
  const [selectedTeams2, setSelectedTeams2] = useState<Teams | null>(null);
  const [isGameInitial, setIsGameInitial] = useState<boolean>(false);
  const [playByPlay, setPlayByPlay] = useState<PlayByPlay[]>([]);
  const [boxScore, setBoxScore] = useState<BoxScore[]>([]);
  const [playersTeam1, setPlayersTeam1] = useState<PlayerChar[]>([{
    name: "",
    position: "",
    poss_fact: "",
    two_pt_fg_pct: "",
    ft_pct: "",
    pct_shot: "",
    three_pt_pct_shot: "",
    pct_fouled: "",
    pct_to: "",
    pct_pass: "",
    off_reb: "",
    def_reb: "",
    def_fg_pct: "",
    pct_pf: "",
    pct_st: "",
    pct_bs: "",
    year: "",
    team_code: "",
    height: "",
    deny_fact: "",
  }]);
  const [playersTeam2, setPlayersTeam2] = useState<PlayerChar[]>([{
    name: "",
    position: "",
    poss_fact: "",
    two_pt_fg_pct: "",
    ft_pct: "",
    pct_shot: "",
    three_pt_pct_shot: "",
    pct_fouled: "",
    pct_to: "",
    pct_pass: "",
    off_reb: "",
    def_reb: "",
    def_fg_pct: "",
    pct_pf: "",
    pct_st: "",
    pct_bs: "",
    year: "",
    team_code: "",
    height: "",
    deny_fact: "",
  }]);
  const navigate = useNavigate();

  const handleFetchLeagues = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_leagues.php', 'POST');
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch leagues.');
      }
      const data: LeagueResponse = await response.json();
      setLeagues(data.data);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleFetchTeams = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_teams.php', 'POST', selectedLeague);
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: TeamsResponse = await response.json();
      setTeams(data.data);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleSingleGameInitial = async () => {
    setError(null);
    setIsGameInitial(true);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/playsinglegame_initial.php', 'POST', { homeaway: "away", awayleague_name: selectedLeague?.league_name, homeleague_name: selectedLeague?.league_name, hometeam: selectedTeams2?.teams, awayteam: selectedTeams1?.teams });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to setup the initial game.');
      }
      await handleFetchScoreBoard();
    } catch (err: any) {
      setError(`${err}`);
    } finally {
      setIsGameInitial(false);
    }
  };

  const handleFetchScoreBoard = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_singlegame_stats.php', 'POST');
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: ScoreBoardResponse = await response.json();
      setScoreBoard(data.scoreboard[0]);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handlePredictMode = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/play_predict.php', 'POST', {
        "league_name": selectedLeague?.league_name,
        "numgames": "normal",
        "homeaway": "both",
        "gamemode": "predict",
        "keeppbp": "N",
        "gamearray": [{ "predicthome": selectedTeams2?.teams, "predictaway": selectedTeams1?.teams, "predictgames": "20" }]
      });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to predict play.');
      }
      //await handleFetchScoreBoard();
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handlePredictPlay = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/playsinglegame_step.php', 'POST', { options: "4" });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to predict play.');
      }
      //await handleFetchScoreBoard();
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleFetchPlayersTeam1 = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_players_chars.php', 'POST', { ...selectedLeague, team_name: selectedTeams1?.teams });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: PlayerCharResponse = await response.json();
      setPlayersTeam1(data.data);
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleFetchPlayersTeam2 = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_players_chars.php', 'POST', { ...selectedLeague, team_name: selectedTeams2?.teams });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: PlayerCharResponse = await response.json();
      setPlayersTeam2(data.data);
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleFetchPlayByPlay = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_singlegame_pbp.php', 'POST');
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch leagues.');
      }
      const data: UpdatePlayByPlayResponse = await response.json();
      setPlayByPlay(data.playbyplay);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleFetchBoxScore = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_singlegame_box.php', 'POST');
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch leagues.');
      }
      const data: BoxScoreResponse = await response.json();
      setBoxScore(data.boxscore);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const goLoginPage = () => {
    navigate('/')
  }

  useEffect(() => {
    if (leagues.length == 0) {
      handleFetchLeagues()
    }
  }, [])

  useEffect(() => {
    const loadTeams = async () => {
      await handleFetchTeams();
    }

    if (selectedLeague) {
      loadTeams();
    }
  }, [selectedLeague]);

  useEffect(() => {
    const loadGameInitial = async () => {
      await handleSingleGameInitial();
    }

    if (selectedTeams1 && selectedTeams2) {
      loadGameInitial();
    }
  }, [selectedTeams1, selectedTeams2]);

  useEffect(() => {
    const loadPlayers = async () => {
      const loadedData = await handleFetchPlayersTeam1()
      return loadedData;
    }

    if (selectedTeams1) {
      loadPlayers()
      handlePredictPlay()
    }

    if (selectedTeams2 && selectedTeams1) {
      handlePredictMode()
    }

  }, [selectedTeams1])

  useEffect(() => {
    const loadPlayers = async () => {
      const loadedData = await handleFetchPlayersTeam2()
      return loadedData;
    }

    if (selectedTeams2) {
      loadPlayers()
      handlePredictPlay()
    }

    if (selectedTeams2 && selectedTeams1) {
      handlePredictMode()
    }
  }, [selectedTeams2])

  return (
    <div className="p-4">
      <Button onClick={goLoginPage} disabled={isLoading}>
        Go to Login
      </Button>
      <h1 className="text-2xl font-bold mb-4">NBA Leagues Names</h1>
      {/* <Button onClick={handleFetchLeagues} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Fetch Leagues'}
      </Button> */}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="flex flex-row gap-4 items-center">
        <label htmlFor="leagues-dropdown">Leagues</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id="leagues-dropdown" variant="outline" className="mt-4 ml-4" disabled={leagues.length === 0}>
              {selectedLeague ? selectedLeague.league_name : "Select a League"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
            {leagues && leagues.map((league, index) => (
              <DropdownMenuItem key={index} onSelect={() => setSelectedLeague(league)}>
                {league.league_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <label htmlFor="teams-dropdown-1">Away Team</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id="teams-dropdown-1" variant="outline" className="mt-4 ml-4" disabled={teams.length === 0}>
              {selectedTeams1 ? selectedTeams1.teams : "Select a Team 1"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
            {teams && teams.map((item, index) => (
              <DropdownMenuItem key={index} onSelect={() => setSelectedTeams1(item)}>
                {item.teams}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <label htmlFor="teams-dropdown-2">Home Team</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id="teams-dropdown-2" variant="outline" className="mt-4 ml-4" disabled={teams.length === 0}>
              {selectedTeams2 ? selectedTeams2.teams : "Select a Team 2"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
            {teams && teams.map((item, index) => (
              <DropdownMenuItem key={index} onSelect={() => setSelectedTeams2(item)}>
                {item.teams}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>


        <Button id="simulation-btn" variant="default" className="mt-4 ml-4" onClick={(e) => {
          handleFetchScoreBoard()
          handleFetchPlayByPlay()
          handleFetchBoxScore()

        }} disabled={isLoading}>
          Simulate Next Play
        </Button>

      </div>

      {scoreBoard && (
        <div className="mt-8">
          <Scoreboard
            scoreboardData={scoreBoard}
            awayTeamName={selectedTeams1?.teams || 'Away'}
            homeTeamName={selectedTeams2?.teams || 'Home'}
            awayTeamLogo={teamLogos[selectedTeams1?.teams || '']}
            homeTeamLogo={teamLogos[selectedTeams2?.teams || '']}
          />
        </div>
      )}

      <div className="flex flex-row gap-8 mt-8">
        {scoreBoard && scoreBoard.away_players && (
          <PlayerStatsTable teamName={selectedTeams1?.teams || 'Away'} players={scoreBoard.away_players} />
        )}
        {scoreBoard && scoreBoard.home_players && (
          <PlayerStatsTable teamName={selectedTeams2?.teams || 'Home'} players={scoreBoard.home_players} />
        )}
      </div>

      <div className="flex flex-row gap-4">
        {playersTeam1.length > 0 && (
          <div className="w-1/2">
            <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams1?.teams}</h2>
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="h-10">Name</TableHead>
                  <TableHead className="h-10">Position</TableHead>
                  <TableHead className="h-10">Poss Fact</TableHead>
                  <TableHead className="h-10">2pt FG Pct</TableHead>
                  <TableHead className="h-10">FT Pct</TableHead>
                  <TableHead className="h-10">Pct Shot</TableHead>
                  <TableHead className="h-10">3pt Pct Shot</TableHead>
                  <TableHead className="h-10">Pct Fouled</TableHead>
                  <TableHead className="h-10">Pct TO</TableHead>
                  <TableHead className="h-10">Pct Pass</TableHead>
                  <TableHead className="h-10">Off Reb</TableHead>
                  <TableHead className="h-10">Def Reb</TableHead>
                  <TableHead className="h-10">Def FG Pct</TableHead>
                  <TableHead className="h-10">Pct PF</TableHead>
                  <TableHead className="h-10">Pct ST</TableHead>
                  <TableHead className="h-10">Pct BS</TableHead>
                  <TableHead className="h-10">Year</TableHead>
                  <TableHead className="h-10">Team Code</TableHead>
                  <TableHead className="h-10">Height</TableHead>
                  <TableHead className="h-10">Deny Fact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersTeam1.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell className="h-10">{player.name}</TableCell>
                    <TableCell className="h-10">{player.position}</TableCell>
                    <TableCell className="h-10">{player.poss_fact}</TableCell>
                    <TableCell className="h-10">{player.two_pt_fg_pct}</TableCell>
                    <TableCell className="h-10">{player.ft_pct}</TableCell>
                    <TableCell className="h-10">{player.pct_shot}</TableCell>
                    <TableCell className="h-10">{player.three_pt_pct_shot}</TableCell>
                    <TableCell className="h-10">{player.pct_fouled}</TableCell>
                    <TableCell className="h-10">{player.pct_to}</TableCell>
                    <TableCell className="h-10">{player.pct_pass}</TableCell>
                    <TableCell className="h-10">{player.off_reb}</TableCell>
                    <TableCell className="h-10">{player.def_reb}</TableCell>
                    <TableCell className="h-10">{player.def_fg_pct}</TableCell>
                    <TableCell className="h-10">{player.pct_pf}</TableCell>
                    <TableCell className="h-10">{player.pct_st}</TableCell>
                    <TableCell className="h-10">{player.pct_bs}</TableCell>
                    <TableCell className="h-10">{player.year}</TableCell>
                    <TableCell className="h-10">{player.team_code}</TableCell>
                    <TableCell className="h-10">{player.height}</TableCell>
                    <TableCell className="h-10">{player.deny_fact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {playersTeam2.length > 0 && (
          <div className="w-1/2">
            <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams2?.teams}</h2>
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="h-10">Name</TableHead>
                  <TableHead className="h-10">Position</TableHead>
                  <TableHead className="h-10">Poss Fact</TableHead>
                  <TableHead className="h-10">2pt FG Pct</TableHead>
                  <TableHead className="h-10">FT Pct</TableHead>
                  <TableHead className="h-10">Pct Shot</TableHead>
                  <TableHead className="h-10">3pt Pct Shot</TableHead>
                  <TableHead className="h-10">Pct Fouled</TableHead>
                  <TableHead className="h-10">Pct TO</TableHead>
                  <TableHead className="h-10">Pct Pass</TableHead>
                  <TableHead className="h-10">Off Reb</TableHead>
                  <TableHead className="h-10">Def Reb</TableHead>
                  <TableHead className="h-10">Def FG Pct</TableHead>
                  <TableHead className="h-10">Pct PF</TableHead>
                  <TableHead className="h-10">Pct ST</TableHead>
                  <TableHead className="h-10">Pct BS</TableHead>
                  <TableHead className="h-10">Year</TableHead>
                  <TableHead className="h-10">Team Code</TableHead>
                  <TableHead className="h-10">Height</TableHead>
                  <TableHead className="h-10">Deny Fact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersTeam2.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell className="h-10">{player.name}</TableCell>
                    <TableCell className="h-10">{player.position}</TableCell>
                    <TableCell className="h-10">{player.poss_fact}</TableCell>
                    <TableCell className="h-10">{player.two_pt_fg_pct}</TableCell>
                    <TableCell className="h-10">{player.ft_pct}</TableCell>
                    <TableCell className="h-10">{player.pct_shot}</TableCell>
                    <TableCell className="h-10">{player.three_pt_pct_shot}</TableCell>
                    <TableCell className="h-10">{player.pct_fouled}</TableCell>
                    <TableCell className="h-10">{player.pct_to}</TableCell>
                    <TableCell className="h-10">{player.pct_pass}</TableCell>
                    <TableCell className="h-10">{player.off_reb}</TableCell>
                    <TableCell className="h-10">{player.def_reb}</TableCell>
                    <TableCell className="h-10">{player.def_fg_pct}</TableCell>
                    <TableCell className="h-10">{player.pct_pf}</TableCell>
                    <TableCell className="h-10">{player.pct_st}</TableCell>
                    <TableCell className="h-10">{player.pct_bs}</TableCell>
                    <TableCell className="h-10">{player.year}</TableCell>
                    <TableCell className="h-10">{player.team_code}</TableCell>
                    <TableCell className="h-10">{player.height}</TableCell>
                    <TableCell className="h-10">{player.deny_fact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSetup;
