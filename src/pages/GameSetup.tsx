import React, { useState, useEffect } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FullSeasonVersion from './FullSeasonVersion';
import SingleGameVersion from './SingleGameVersion';
import Instructions from './Instructions';
import { Button } from '@/components/ui/button';

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

interface TeamsSchedule {
  teams: string;
  games: string;
}

interface TeamsScheduleResponse {
  data: TeamsSchedule[];
}

interface PlayerChar { //this scheme is shared with playerChar editable stats, so two values could refer to the same stat but it has different name depending if is editable or not
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
  g: string;
  min: string;
  ming: string;
  ptsg: string;
  positions: string;
  fgpct: string;
  scorefgpct: string;
  twoptfgpct: string;
  threeptfgpct: string;
  ftpct: string;
  offreb: string;
  defreb: string;
  totreb: string;
  defrat: string;
  pctpf: string;
  pctst: string;
  pctbs: string;
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

interface PlayerSubPattern {
  pos1: string;
  pos2: string;
  pos3: string;
  pos4: string;
  pos5: string;
}

interface PlayerSubPatternResponse {
  data: PlayerSubPattern[];
}

const teamLogos: { [key: string]: string } = {
  "Atlanta Hawks": "https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg",
  "Boston Celtics": "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
  "Brooklyn Nets": "https://upload.wikimedia.org/wikipedia/commons/4/44/Brooklyn_Nets_newlogo.svg",
  "Charlotte Hornets": "https://upload.wikimedia.org/wikipedia/en/c/c4/Charlotte_Hornets_%282014%29.svg",
  "Chicago Bulls": "https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg", 
  "Cleveland Cavaliers": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cleveland_Cavaliers_logo.svg", 
  "Dallas Mavericks": "https://upload.wikimedia.org/wikipedia/en/9/97/Dallas_Mavericks_logo.svg",
  "Denver Nuggets": "https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg",
  "Detroit Pistons": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Logo_of_the_Detroit_Pistons.svg",
  "Golden State Warriors": "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
  "Houston Rockets": "https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Rockets.svg",
  "Indiana Pacers": "https://upload.wikimedia.org/wikipedia/en/1/1b/Indiana_Pacers.svg",
  "Los Angeles Clippers": "https://upload.wikimedia.org/wikipedia/en/e/ed/Los_Angeles_Clippers_%282024%29.svg",
  "Los Angeles Lakers": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
  "Memphis Grizzlies": "https://upload.wikimedia.org/wikipedia/en/f/f1/Memphis_Grizzlies.svg",
  "Miami Heat": "https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg",
  "Milwaukee Bucks": "https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg",
  "Minnesota Timberwolves": "https://upload.wikimedia.org/wikipedia/en/c/c2/Minnesota_Timberwolves_logo.svg",
  "New Orleans Pelicans": "https://upload.wikimedia.org/wikipedia/en/0/0d/New_Orleans_Pelicans_logo.svg",
  "New York Knicks": "https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg",
  "Oklahoma City Thunder": "https://upload.wikimedia.org/wikipedia/en/5/5d/Oklahoma_City_Thunder.svg",
  "Orlando Magic": "https://upload.wikimedia.org/wikipedia/en/1/10/Orlando_Magic_logo.svg",
  "Philadelphia 76ers": "https://upload.wikimedia.org/wikipedia/en/0/0e/Philadelphia_76ers_logo.svg",
  "Phoenix Suns": "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
  "Portland Trail Blazers": "https://upload.wikimedia.org/wikipedia/en/2/21/Portland_Trail_Blazers_logo.svg",
  "Sacramento Kings": "https://upload.wikimedia.org/wikipedia/en/c/c7/SacramentoKings.svg",
  "San Antonio Spurs": "https://upload.wikimedia.org/wikipedia/en/a/a2/San_Antonio_Spurs.svg",
  "Toronto Raptors": "https://upload.wikimedia.org/wikipedia/en/3/36/Toronto_Raptors_logo.svg",
  "Utah Jazz": "https://upload.wikimedia.org/wikipedia/en/7/77/Utah_Jazz_logo_2025.svg",
  "Washington Wizards": "https://upload.wikimedia.org/wikipedia/en/0/02/Washington_Wizards_logo.svg",
};

const GameSetup = () => {
  const { fetchWithAuth, isLoading } = useApi();
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Teams[]>([{ teams: "N/A" }, { teams: "N/A" }]);
  const [teamsSchedule, setTeamsSchedule] = useState<TeamsSchedule[]>([{ teams: "N/A", games:"0"}]);
  const [selectedTeams1, setSelectedTeams1] = useState<Teams | null>(null);
  const [selectedTeams2, setSelectedTeams2] = useState<Teams | null>(null);
  const [isGameInitial, setIsGameInitial] = useState<boolean>(false);
  const [playByPlay, setPlayByPlay] = useState<PlayByPlay[]>([]);
  const [boxScore, setBoxScore] = useState<BoxScore[]>([]);
  const [playerSubPattern, setPlayerSubPattern] = useState<PlayerSubPattern[]>([]);
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard | null>(null);
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
    g: "",
    min: "",
    ming: "",
    ptsg: "",
    positions: "",
    fgpct: "",
    scorefgpct: "",
    twoptfgpct: "",
    threeptfgpct: "",
    ftpct: "",
    offreb: "",
    defreb: "",
    totreb: "",
    defrat: "",
    pctpf: "",
    pctst: "",
    pctbs: ""
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
    g: "",
    min: "",
    ming: "",
    ptsg: "",
    positions: "",
    fgpct: "",
    scorefgpct: "",
    twoptfgpct: "",
    threeptfgpct: "",
    ftpct: "",
    offreb: "",
    defreb: "",
    totreb: "",
    defrat: "",
    pctpf: "",
    pctst: "",
    pctbs: ""
  }]);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFetchLeagues = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/get_leagues.php`, 'POST');
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
      const response = await fetchWithAuth(`${API_URL}/get_teams.php`, 'POST', selectedLeague);
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
      const response = await fetchWithAuth(`${API_URL}/playsinglegame_initial.php`, 'POST', { homeaway: "away", awayleague_name: selectedLeague?.league_name, homeleague_name: selectedLeague?.league_name, hometeam: selectedTeams2?.teams, awayteam: selectedTeams1?.teams });
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

  const handleSchedule82 = async () => {
    setError(null);
    setIsGameInitial(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/get_82_game_schedule.php`, 'POST', {league_name: selectedLeague?.league_name, team_name: selectedTeams2?.teams });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to setup the initial game.');
      }
      const data: TeamsScheduleResponse = await response.json();
      setTeamsSchedule(data.data)
    } catch (err: any) {
      setError(`${err}`);
    } finally {
      setIsGameInitial(false);
    }
  };

  const handleFetchScoreBoard = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/get_singlegame_stats.php`, 'POST');
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
      const response = await fetchWithAuth(`${API_URL}/play_predict.php`, 'POST', {
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
      const response = await fetchWithAuth(`${API_URL}/playsinglegame_step.php`, 'POST', { options: "4" });
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

  const handleFetchPlayersTeam1 = async () => { //this is for actual player stats, for editable stats is: http://api.bballsports.com/simulationAPI/get_players_chars.php
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/get_actual_player_stats.php`, 'POST', { ...selectedLeague, team_name: selectedTeams1?.teams });
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

  const handleFetchPlayersTeam2 = async () => {//this is for actual player stats, for editable stats is: http://api.bballsports.com/simulationAPI/get_players_chars.php
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/get_actual_player_stats.php`, 'POST', { ...selectedLeague, team_name: selectedTeams2?.teams });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: PlayerCharResponse = await response.json();
      setPlayersTeam2(data.data);
      await handleSchedule82()
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleFetchPlayByPlay = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/get_singlegame_pbp.php`, 'POST');
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
      const response = await fetchWithAuth(`${API_URL}/get_singlegame_box.php`, 'POST');
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

  const handleFetchPlayerSubpattern = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/get_players_subs.php`, 'POST', {...selectedLeague, team_name: selectedTeams2?.teams});
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch players sub pattern.');
        
      }
      const data: PlayerSubPatternResponse = await response.json();
      setPlayerSubPattern(data.data);
      return data.data
    } catch (err: any) {
      setError(`${err}`);
      return null
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

  useEffect(()=>{console.log("82 games schedule")},[teamsSchedule])

  return (
    <div className="p-4 bg-background text-foreground">
      <h1 className="text-xl font-bold mb-2">NBA Game Simulation</h1>
      <Button onClick={goLoginPage} disabled={isLoading} variant="outline">
        Go to Login
      </Button>
      <Tabs defaultValue="full-season">

        <TabsList>
          <TabsTrigger value="full-season" className='mx-1'>Full Season Version</TabsTrigger>
          <TabsTrigger value="single-game" className='mx-1'>Single Game Version (hardcode data)</TabsTrigger>
          <TabsTrigger value="instructions" className='mx-1'>Instructions</TabsTrigger>
        </TabsList>
        <TabsContent value="full-season">
          <FullSeasonVersion
            leagues={leagues}
            selectedLeague={selectedLeague}
            setSelectedLeague={setSelectedLeague}
            teams={teams}
            teamsSchedule={teamsSchedule}
            setTeamsSchedule={setTeamsSchedule}
            selectedTeams1={selectedTeams1}
            setSelectedTeams1={setSelectedTeams1}
            selectedTeams2={selectedTeams2}
            setSelectedTeams2={setSelectedTeams2}
            error={error}
            isLoading={isLoading}
            boxScore={boxScore}
            setBoxScore={setBoxScore}
            playersTeam1={playersTeam1}
            playersTeam2={playersTeam2}
            handleFetchScoreBoard={handleFetchScoreBoard}
            handleFetchPlayByPlay={handleFetchPlayByPlay}
            handleFetchBoxScore={handleFetchBoxScore}
            handleSchedule82={handleSchedule82}
            handleFetchPlayerSubpattern={handleFetchPlayerSubpattern}
            teamLogos={teamLogos}
            
          />
        </TabsContent>
        <TabsContent value="single-game">
          <SingleGameVersion />
        </TabsContent>
        <TabsContent value="instructions">
          <Instructions />
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default GameSetup;
