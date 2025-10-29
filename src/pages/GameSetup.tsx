import React, { useState, useEffect } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { useNavigate } from 'react-router-dom';
import FullSeasonVersion from './FullSeasonVersion';
import SingleGameVersion from './SingleGameVersion';
import Instructions from './Instructions';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { authService } from '@/contexts/AuthService';
import { useUser } from '@/contexts/UserContext';
import { StringToBoolean } from 'class-variance-authority/types';

interface Message {
  message: string;
}

interface BodyResponse {
  body: string;
}

interface League {
  league_name: string;
}

interface LeagueResponse {
  body: string;
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

interface BoxScore { //this is the boxScore of the single game mode, different from full season box score
  box_line: string;
  game_number: string;
  line_number: string;
}

interface BoxScoreFullSeason { //this is the boxScore of the full season game mode
  text: string;
  game_number: string;
  line_number: string;
}

interface GameList { //this is the gameList of the full season game mode
  game_number: string;
  team_name1: string;
  team_name2: string;
  team1_homeaway: string;
  team2_homeaway: string;
  team1_score: string;
  team2_score: string;
}

interface GameListResponse { //this is the gameList of the full season game mode
  data: GameList[];
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

interface GetAlts {
  alt_sub: string;
}

interface GetAltsResponse {
  data: GetAlts[];
}

interface BoxScoreFullSeasonResponse {
  data: BoxScoreFullSeason[];
}

interface DraftAction {
  action: 'replace';
  original_league: string;
  original_team: string;
  original_player: string;
  new_player_league: string;
  new_player_team: string;
  new_player_name: string;
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

const SIMULATION_URL = import.meta.env.VITE_APP_API_SIMULATION
const API_KEY = import.meta.env.VITE_APP_API_KEY
const ELECTRON = import.meta.env.VITE_APP_TARGET

const GameSetup = () => {
  //const { fetchWithAuth, isLoading } = useApi();
  const { fetchWithAuth, isLoading, user } = useUser();
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Teams[]>([{ teams: "N/A" }]);
  const [teamsSchedule, setTeamsSchedule] = useState<TeamsSchedule[]>([{ teams: "N/A", games: "0" }]);
  const [selectedTeams1, setSelectedTeams1] = useState<Teams | null>(null);
  const [selectedTeams2, setSelectedTeams2] = useState<Teams | null>(null);
  const [isGameInitial, setIsGameInitial] = useState<boolean>(false);
  const [playByPlay, setPlayByPlay] = useState<PlayByPlay[]>([]);
  const [boxScore, setBoxScore] = useState<BoxScore[]>([]);
  const [boxScoreFullSeason, setBoxScoreFullSeason] = useState<BoxScoreFullSeason[]>([]);
  const [playerSubPattern, setPlayerSubPattern] = useState<PlayerSubPattern[] | null>([]);
  const [getAlts, setGetAlts] = useState<GetAlts[]>([]);
  const [getAltsSelected, setGetAltsSelected] = useState("Default-")
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard | null>(null);
  const [activeView, setActiveView] = useState('full-season');
  const [schedule, setSchedule] = useState('predict');
  const [location, setLocation] = useState('both');
  const [scheduleMultiplier, setScheduleMultiplier] = useState("82");
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
  const [gameList, setGameList] = useState<GameList[]>([])
  const [draftActions, setDraftActions] = useState<DraftAction[]>([])
  const [selectedLeagueDraft, setSelectedLeagueDraft] = useState<League | null>(null);
  const [selectedTeamsDraft, setSelectedTeamsDraft] = useState<Teams | null>(null);
  const [playersTeamDraft, setPlayersTeamDraft] = useState<PlayerChar[]>([{
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
  const [teamsDraft, setTeamsDraft] = useState<Teams[]>([{ teams: "N/A" }]);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFetchLeagues = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', { body: { method: "POST", endpoint: "get_leagues.php", content: "json" } });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch leagues.');
      }
      const data: BodyResponse = await response.json();
      const body: { data: League[] } = JSON.parse(data.body)
      //console.log("data", data)
      console.log("leagues", body)

      setLeagues(body.data);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleFetchTeams = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', { body: { ...selectedLeague, method: "POST", endpoint: "get_teams.php", content: "json", alt_sub: getAltsSelected } });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      //const data: TeamsResponse = await response.json();
      const data: BodyResponse = await response.json();
      console.log("teams: ", data)
      const body: { data: Teams[] } = JSON.parse(data.body)
      console.log("parsed teams: ",body.data)
      setTeams(body.data);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleFetchTeamsDraft = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', { body: { ...selectedLeagueDraft, method: "POST", endpoint: "get_teams.php", content: "json", alt_sub: getAltsSelected } });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: BodyResponse = await response.json();
      const body: { data: Teams[] } = JSON.parse(data.body)
      setTeamsDraft(body.data);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleSingleGameInitial = async () => { //for single mode
    setError(null);
    setIsGameInitial(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', { body: { endpoint: "playsinglegame_initial.php", method: "POST", homeaway: location, awayleague_name: selectedLeague?.league_name, homeleague_name: selectedLeague?.league_name, hometeam: selectedTeams2?.teams, awayteam: selectedTeams1?.teams, alt_sub: getAltsSelected } });
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
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', { body: { endpoint: "get_82_game_schedule.php", method: "POST", league_name: selectedLeague?.league_name, team_name: selectedTeams2?.teams } });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to setup the initial game.');
      }
      const data: BodyResponse = await response.json();
      //const data: TeamsScheduleResponse = await response.json();
      const body: { data: TeamsSchedule[] } = JSON.parse(data.body)
      setTeamsSchedule(body.data)
    } catch (err: any) {
      setError(`${err}`);
    } finally {
      setIsGameInitial(false);
    }
  };

  const handleFetchScoreBoard = async () => { //this is to use in the single season mode
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', { body: { endpoint: "get_singlegame_stats.php", method: "POST", alt_sub: getAltsSelected } });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: BodyResponse = await response.json();
      //const data: ScoreBoardResponse = await response.json();
      const body: { scoreboard: ScoreBoard[] } = JSON.parse(data.body)
      setScoreBoard(body.scoreboard[0]);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handlePredictMode = async () => { //this is to use in the full season mode
    setError(null);
    try {
      let body: { body: { [key: string]: any }, [key: string]: any };
      let response;
      if (schedule == "predict") {
        body = {
          body: {
            endpoint: "play_predict.php",
            method: "POST",
            "league_name": selectedLeague?.league_name,
            "numgames": "normal",
            "homeaway": location || "home",
            "gamemode": schedule,
            "keeppbp": "N",
            "gamearray": [{ "predicthome": selectedTeams2?.teams, "predictaway": selectedTeams1?.teams, "predictgames": "20" }],
            "hometeam": selectedTeams2?.teams,
            alt_sub: getAltsSelected
            //apikey: schedule == "predict" ? "" : API_KEY
          },
          //apikey: schedule == "predict" ? "" : API_KEY
        }
      } else if (schedule == "fullseason") {
        body = {
          body: {
            endpoint: "play_fsv.php",
            method: "POST",
            "league_name": selectedLeague?.league_name,
            "numgames": "normal",
            "homeaway": "home",
            "gamemode": schedule,
            "keeppbp": "N",
            alt_sub: getAltsSelected
            //apikey: API_KEY
          },
          //apikey: API_KEY
        }
      } else {
        body = {
          body: {
            endpoint: "play_82.php",
            method: "POST",
            "league_name": selectedLeague?.league_name,
            "numgames": scheduleMultiplier == "82"? "normal": scheduleMultiplier,
            "homeaway": location,
            "gamemode": schedule,
            "keeppbp": "Y",
            "hometeam": selectedTeams2?.teams,
            alt_sub: getAltsSelected
            //apikey: API_KEY
          },
          //apikey: API_KEY
        }
      }
      //`${API_URL}/conversionjs to use apigateway, else use the api
      if (ELECTRON === "electron" || ELECTRON === "web") {
        if ('body' in body && typeof body.body === 'object' && body.body !== null) {
          body.body.apikey = API_KEY;
          body.apikey = API_KEY;
          delete body.body.method;
          delete body.body.endpoint
        }
        //delete body.body.authorization;
        response = await fetchWithAuth(schedule == "predict" ? `${SIMULATION_URL}/play_predict.php` : schedule == "fullseason" ? `${SIMULATION_URL}/play_fsv.php` : `${SIMULATION_URL}/play_82.php`, 'POST', { ...body.body })
      }
      else {
        response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', body)
      }
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);

        /* await handleFetchBoxScoreFullSeason();
        if (schedule == "fullseason") {
          await handleFetchGameListFullSeason();
        } */

        throw new Error(`${err.message}`);
      }
      console.log("was ok")
      await Promise.all([
          handleFetchGameListFullSeason(),
          handleFetchBoxScoreFullSeason()])

      /* if (schedule == "fullseason") {
        await Promise.all([
          handleFetchGameListFullSeason(),
          handleFetchBoxScoreFullSeason()])
      } else if (schedule == "predict") {
        await Promise.all([
          handleFetchGameListFullSeason(),
          handleFetchBoxScoreFullSeason()])
      } else {
        await Promise.all([
          handleFetchGameListFullSeason(),
          handleFetchBoxScoreFullSeason()])
      } */

      //await handleFetchScoreBoard(); //this is wrong in the full season mode
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handlePredictPlay = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversion.js`, 'POST', {
        body: {
          endpoint: "playsinglegame_step.php", method: "POST",
          options: "4",
          alt_sub: getAltsSelected
        }
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

  const handleFetchPlayersTeam1 = async () => { //this is for actual player stats, for editable stats is: http://api.bballsports.com/simulationAPI/get_players_chars.php
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          ...selectedLeague, team_name: selectedTeams1?.teams,
          endpoint: "get_actual_player_stats.php", method: "POST",
          alt_sub: getAltsSelected
        }
      });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: BodyResponse = await response.json();
      //const data: PlayerCharResponse = await response.json();
      const body: { data: PlayerChar[] } = JSON.parse(data.body)
      setPlayersTeam1(body.data);
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleFetchPlayersTeam2 = async () => {//this is for actual player stats, for editable stats is: http://api.bballsports.com/simulationAPI/get_players_chars.php
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          ...selectedLeague, 
          endpoint: "get_actual_player_stats.php", method: "POST",
          team_name: selectedTeams2?.teams,
          alt_sub: getAltsSelected
        }
      });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: BodyResponse = await response.json();
      const body: { data: PlayerChar[] } = JSON.parse(data.body)
      setPlayersTeam2(body.data);
      await handleSchedule82()
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleFetchPlayersTeamDraft = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          ...selectedLeagueDraft, 
          endpoint: "get_actual_player_stats.php", 
          method: "POST",
          team_name: selectedTeamsDraft?.teams,
          alt_sub: getAltsSelected
        }
      });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch draftable players.');
      }
      const data: BodyResponse = await response.json();
      const body: { data: PlayerChar[] } = JSON.parse(data.body)
      setPlayersTeamDraft(body.data);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleFetchPlayByPlay = async () => { //this should be for the single game mode
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          endpoint: "get_singlegame_pbp.php", method: "POST",
          alt_sub: getAltsSelected
        }
      }
      );
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch leagues.');
      }
      const data: BodyResponse = await response.json();
      console.log("playbyplay response:", data)
      const body: { playbyplay: PlayByPlay[] } = JSON.parse(data.body)
      //const data: UpdatePlayByPlayResponse = await response.json();
      setPlayByPlay(body.playbyplay);
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const handleFetchBoxScore = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, "POST", {
        body: {
          endpoint: "get_singlegame_box.php",
          method: "POST",
          alt_sub: getAltsSelected
        },
      });

      if (!response.ok) {
        let errMsg = "Failed to fetch box score.";
        try {
          const err: Message = await response.json();
          if (err?.message) errMsg = err.message;
        } catch {
          // si no se puede parsear el error, se deja el genérico
        }
        setError(`error: ${errMsg}`);
        throw new Error(errMsg);
      }

      const data: BodyResponse = await response.json();

      let parsed: unknown;
      try {
        parsed = JSON.parse(data.body);
      } catch {
        throw new Error("Invalid JSON in response body.");
      }

      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "boxscore" in parsed
      ) {
        const body = parsed as { boxscore: BoxScore[] };
        setBoxScore(body.boxscore);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleFetchBoxScoreFullSeason = async () => {
    setError(null);
    try {
      let response;
      if (ELECTRON === "electron" || ELECTRON === "web") {

        response = await fetchWithAuth(`${SIMULATION_URL}/get_raw_box_scores.php`, 'POST', {
          //method: "POST",
          game_number: "ALL",
          alt_sub: getAltsSelected
        })
      } else {
        response = await fetchWithAuth(`${API_URL}/conversionjs`, "POST", {
          body: {
            endpoint: "get_raw_box_scores.php",
            method: "POST",
            game_number: "ALL",
            alt_sub: getAltsSelected
          },
        });
      }


      if (!response.ok) {
        let errMsg = "Failed to fetch box score full season.";
        try {
          const err: Message = await response.json();
          if (err?.message) errMsg = err.message;
        } catch {
          // si no se puede parsear el error, se deja el genérico
        }
        setError(`error: ${errMsg}`);
        throw new Error(errMsg);
      }

      if (ELECTRON === "electron" || ELECTRON === "web") {
        const data: BoxScoreFullSeasonResponse = await response.json();
        setBoxScoreFullSeason(data.data);
      } else {
        const data: BodyResponse = await response.json();
        const parsed = JSON.parse(data.body);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "data" in parsed
        ) {
          const body = parsed as { data: BoxScoreFullSeason[] };
          setBoxScoreFullSeason(body.data);
        } else {
          throw new Error("Unexpected response format.");
        }
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleFetchGameListFullSeason = async () => {
    setError(null);
    try {
      let response;
      if (ELECTRON === "electron" || ELECTRON === "web") {

        response = await fetchWithAuth(`${SIMULATION_URL}/get_played_game_list.php`, 'POST', {alt_sub: getAltsSelected})
      } else {
        response = await fetchWithAuth(`${API_URL}/conversionjs`, "POST", {
          body: {
            endpoint: "get_played_game_list.php",
            method: "POST",
            alt_sub: getAltsSelected
          },
        });
      }


      if (!response.ok) {
        let errMsg = "Failed to fetch box score full season.";
        try {
          const err: Message = await response.json();
          if (err?.message) errMsg = err.message;
        } catch {
          // si no se puede parsear el error, se deja el genérico
        }
        setError(`error: ${errMsg}`);
        throw new Error(errMsg);
      }

      if (ELECTRON === "electron" || ELECTRON === "web") {
        const data: GameListResponse = await response.json();
        setGameList(data.data);
      } else {
        const data: BodyResponse = await response.json();
        console.log("gamelist1: ", data)
        let parsed: unknown;
        try {
          parsed = JSON.parse(data.body);
        } catch {
          throw new Error("Invalid JSON in response body.");
        }

        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "data" in parsed
        ) {
          const body = parsed as { data: GameList[] };
          console.log("gamelist2: ", body.data)
          setGameList(body.data);
        } else {
          throw new Error("Unexpected response format.");
        }
      }

    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleFetchPlayerSubpattern = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          ...selectedLeague, team_name: selectedTeams2?.teams,
          endpoint: "get_players_subs.php", method: "POST",
          alt_sub: getAltsSelected
        }
      });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch players sub pattern.');

      }
      //const data: PlayerSubPatternResponse = await response.json();
      const data: BodyResponse = await response.json();
      const body: { data: PlayerSubPattern[] } = JSON.parse(data.body)
      console.log("Player Subs: ", body)
      setPlayerSubPattern(body.data);
      return body.data
    } catch (err: any) {
      setError(`${err}`);
      return null
    }
  };

  const handleFetchSetPlayerSubpattern = async () => {
    setError(null);
    try {
      let body: { body: { [key: string]: any }, [key: string]: any };
      let response;
      body = {
        body:{
          ...selectedLeague, team_name: selectedTeams2?.teams, data: playerSubPattern,
          endpoint: "set_players_subs.php", method: "POST",
          alt_sub: getAltsSelected
        }}

      if (ELECTRON === "electron" || ELECTRON === "web") {
        if ('body' in body && typeof body.body === 'object' && body.body !== null) {
          body.body.apikey = API_KEY;
          body.apikey = API_KEY;
          delete body.body.method;
          delete body.body.endpoint
        }
        //delete body.body.authorization;
        response = await fetchWithAuth(`${SIMULATION_URL}/set_players_subs.php`, 'POST', { ...body.body })
      }
      else {
        response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', body)
      }

      /* const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          ...selectedLeague, team_name: selectedTeams2?.teams, data: playerSubPattern,
          endpoint: "set_players_subs.php", method: "POST",
          alt_sub: getAltsSelected
        }
      }); */
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch players sub pattern.');

      }
      //const data: PlayerSubPatternResponse = await response.json();
      //setPlayerSubPattern(data.data);
      //return data.data
      return
    } catch (err: any) {
      setError(`${err}`);
      return null
    }
  };

  const handleFetchSetGetAlts = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          ...selectedLeague, team_name: selectedTeams2?.teams,
          endpoint: "get_alts.php", method: "POST",
        }
      });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch players sub pattern.');

      }
      const data: BodyResponse = await response.json();
      //const data: GetAltsResponse = await response.json();
      const body: { data: GetAlts[] } = JSON.parse(data.body)
      console.log("Alts: ", body.data)
      setGetAlts(body.data)
      //setGetAltsSelected(body.data[0].alt_sub)
      setGetAltsSelected("Default-")
      //return data.data
      return
    } catch (err: any) {
      setError(`${err}`);
      return null
    }
  };

  const handleFetchSetPlayerDraft = async (): Promise<void> => {
    setError(null);
    try {
      let body: { body: { [key: string]: any }, [key: string]: any };
      let response;
      body = {
        body:{
          ...selectedLeague, team_name: selectedTeams2?.teams, data: draftActions,
          endpoint: "set_players_drafts.php", method: "POST",
          alt_sub: getAltsSelected
        }}

      if (ELECTRON === "electron" || ELECTRON === "web") {
        if ('body' in body && typeof body.body === 'object' && body.body !== null) {
          body.body.apikey = API_KEY;
          body.apikey = API_KEY;
          delete body.body.method;
          delete body.body.endpoint
        }
        //delete body.body.authorization;
        response = await fetchWithAuth(`${SIMULATION_URL}/set_players_drafts.php`, 'POST', { ...body.body })
      }
      else {
        response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', body)
      }

      /* const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          ...selectedLeague, team_name: selectedTeams2?.teams, data: playerSubPattern,
          endpoint: "set_players_subs.php", method: "POST",
          alt_sub: getAltsSelected
        }
      }); */
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch players sub pattern.');

      }
      await handleFetchPlayersTeam2();
      //const data: PlayerSubPatternResponse = await response.json();
      //setPlayerSubPattern(data.data);
      //return data.data
      return
    } catch (err: any) {
      setError(`${err}`);
    }
  };

  const goLoginPage = async () => {
    await authService.signOut()
    localStorage.clear();
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
      if (selectedTeams2) {
        //setGetAltsSelected("Default-")
        handleFetchSetGetAlts()
      }
    }
  }, [selectedLeague]);

  useEffect(() => {
    const loadGameInitial = async () => {
      await handleSingleGameInitial();
    }

    if (selectedTeams1 && selectedTeams2 && activeView === "single-game") {
      loadGameInitial();
    } else if (selectedTeams1 && selectedTeams2 && activeView === "full-season") {
      if (schedule == "predict") {
        //handlePredictMode()
        console.log("a")
      }
    }
  }, [activeView, getAltsSelected]);

  useEffect(() => {
    const loadPlayers = async () => {
      const loadedData = await handleFetchPlayersTeam1()
      return loadedData;
    }

    if (selectedTeams1) {
      loadPlayers()
      //handlePredictPlay()
    }

    /* if (selectedTeams2 && selectedTeams1) {
      handlePredictMode()
    } */

  }, [selectedTeams1])

  useEffect(() => {
    const loadPlayers = async () => {
      const loadedData = await handleFetchPlayersTeam2()
      return loadedData;
    }

    if (selectedTeams2) {
      loadPlayers()
      //handlePredictPlay()
      handleFetchSetGetAlts()
    }

    /* if (selectedTeams2 && selectedTeams1) {
      handlePredictMode()
    } */
  }, [selectedTeams2])

  useEffect(() => {
    if (selectedLeagueDraft) {
      handleFetchTeamsDraft();
    }
  }, [selectedLeagueDraft]);

  useEffect(() => {
    if (selectedTeamsDraft) {
      handleFetchPlayersTeamDraft();
    }
  }, [selectedTeamsDraft]);

  useEffect(() => { console.log("82 games schedule") }, [teamsSchedule])
  /* useEffect(() => {
    console.log("game mode: ", schedule)
    if (selectedTeams2 && selectedTeams1) {
      handlePredictMode()
    }
  }, [schedule]) */


  return (
    <div className="p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">NBA Game Simulation</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-base font-semibold">Welcome, {user?.name}</p>
            <p className="text-xs text-muted-foreground">Ready to simulate?</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-1/3">
              <div className="flex flex-col h-full p-8">
                <div className="flex-grow">
                  <Button
                    variant={activeView === 'full-season' ? 'secondary' : 'ghost'}
                    onClick={() => setActiveView('full-season')}
                    className="justify-start mb-2 w-full"
                  >
                    Full Season Version
                  </Button>
                  <Button
                    variant={activeView === 'single-game' ? 'secondary' : 'ghost'}
                    onClick={() => setActiveView('single-game')}
                    className="justify-start mb-2 w-full"
                  >
                    Single Game Version (hardcode data)
                  </Button>
                  <Button
                    variant={activeView === 'instructions' ? 'secondary' : 'ghost'}
                    onClick={() => setActiveView('instructions')}
                    className="justify-start w-full"
                  >
                    Instructions
                  </Button>
                </div>
                <Button onClick={async () => { goLoginPage() }} disabled={isLoading} variant="outline" className="mt-auto">
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mt-4">
        {activeView === 'full-season' &&
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
            handleFetchSetPlayerSubpattern={handleFetchSetPlayerSubpattern}
            getAlts={getAlts}
            //setGetAlts = {setGetAlts}
            getAltsSelected={getAltsSelected}
            setGetAltsSelected={setGetAltsSelected}
            schedule={schedule}
            setSchedule={setSchedule}
            location={location}
            setLocation={setLocation}
            //handleFetchBoxScoreFullSeason={handleFetchBoxScoreFullSeason}
            boxScoreFullSeason={boxScoreFullSeason}
            setBoxScoreFullSeason={setBoxScoreFullSeason}
            handlePredictMode={handlePredictMode}
            scheduleMultiplier={scheduleMultiplier}
            setScheduleMultiplier={setScheduleMultiplier}
            gameList={gameList}
            setGameList={setGameList}
            playerSubPattern={playerSubPattern}
            setPlayerSubPattern={setPlayerSubPattern}
            draftActions={draftActions}
            setDraftActions={setDraftActions}
            selectedLeagueDraft={selectedLeagueDraft}
            setSelectedLeagueDraft={setSelectedLeagueDraft}
            selectedTeamDraft={selectedTeamsDraft}
            setSelectedTeamDraft={setSelectedTeamsDraft}
            playersTeamDraft={playersTeamDraft}
            handleFetchTeamsDraft={handleFetchTeamsDraft}
            handleFetchSetPlayerDraft={handleFetchSetPlayerDraft}
            teamsDraft={teamsDraft}
          />
        }
        {activeView === 'single-game' &&
          <SingleGameVersion />
        }
        {activeView === 'instructions' &&
          <Instructions />
        }
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default GameSetup;