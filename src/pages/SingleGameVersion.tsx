import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomRadio from '../components/ui/CustomRadio';
import CustomCheckbox from '../components/ui/CustomCheckbox';
import { useUser } from '@/contexts/UserContext';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface League {
  league_name: string;
}

interface Team {
  teams: string;
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

interface SingleGameVersionProps {
  selectedLeague: League | null;
  selectedTeams1: Team | null; // Away Team
  selectedTeams2: Team | null; // Home Team
  teamLogos: { [key: string]: string };
  getAltsSelected: string;
  playersTeam1: PlayerChar[];
  playersTeam2: PlayerChar[];
  leagues: League[];
  teams: Team[];
  setSelectedLeague: React.Dispatch<React.SetStateAction<League | null>>;
  setSelectedTeams1: React.Dispatch<React.SetStateAction<Team | null>>;
  setSelectedTeams2: React.Dispatch<React.SetStateAction<Team | null>>;
  handleFetchTeams: () => Promise<void>;
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
}

interface PlayByPlay {
  color: string;
  pbp_line: string;
}

interface BoxScore {
  box_line: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

const SingleGameVersion: React.FC<SingleGameVersionProps> = ({
  selectedLeague,
  selectedTeams1,
  selectedTeams2,
  teamLogos,
  getAltsSelected,
  playersTeam1,
  playersTeam2,
  leagues,
  teams,
  setSelectedLeague,
  setSelectedTeams1,
  setSelectedTeams2,
  handleFetchTeams
}) => {
  const { fetchWithAuth } = useUser();
  const { toast } = useToast();

  // State for UI controls
  const [awayTeamMode, setAwayTeamMode] = useState('computer');
  const [homeTeamMode, setHomeTeamMode] = useState('computer');
  const [pauseOptions, setPauseOptions] = useState('do-not-pause');
  const [displayOptions, setDisplayOptions] = useState('both');
  const [showPlayByPlay, setShowPlayByPlay] = useState(true);
  const [showBoxScore, setShowBoxScore] = useState(true);
  const [showCourtStats, setShowCourtStats] = useState(true);
  const [showTheScore, setShowTheScore] = useState(true);
  const [enhancedPBP, setEnhancedPBP] = useState(false);
  const [midlineScroll, setMidlineScroll] = useState(false);

  // Game Data State
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard | null>(null);
  const [playByPlay, setPlayByPlay] = useState<PlayByPlay[]>([]);
  const [boxScore, setBoxScore] = useState<BoxScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const handleStartGame = async () => {
    if (!selectedLeague || !selectedTeams1 || !selectedTeams2) {
      toast({
        title: "Error",
        description: "Please select a league and both teams.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          endpoint: "playsinglegame_initial.php",
          method: "POST",
          homeaway: "home", // Assuming home game for selectedTeams2
          awayleague_name: selectedLeague.league_name,
          homeleague_name: selectedLeague.league_name,
          hometeam: selectedTeams2.teams,
          awayteam: selectedTeams1.teams,
          alt_sub: getAltsSelected
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to start game.');
      }

      setIsGameStarted(true);
      await fetchGameData();
      toast({
        title: "Game Started",
        description: "The game has been initialized.",
      });

    } catch (err: any) {
      toast({
        title: "Error starting game",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameStep = async () => {
    if (!isGameStarted) return;

    setIsLoading(true);
    let option = "4"; // Default: run to end
    if (pauseOptions === 'each-line') option = "1";
    if (pauseOptions === 'each-possession') option = "2";
    if (pauseOptions === 'end-of-quarter') option = "3";

    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          endpoint: "playsinglegame_step.php",
          method: "POST",
          options: option,
          alt_sub: getAltsSelected
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to advance game.');
      }

      await fetchGameData();

    } catch (err: any) {
      toast({
        title: "Error advancing game",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGameData = async () => {
    try {
      // Fetch Scoreboard
      const scoreResponse = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: { endpoint: "get_singlegame_stats.php", method: "POST", alt_sub: getAltsSelected }
      });
      if (scoreResponse.ok) {
        const data = await scoreResponse.json();
        const body = JSON.parse(data.body);
        if (body.scoreboard && body.scoreboard.length > 0) {
          setScoreBoard(body.scoreboard[0]);
        }
      }

      // Fetch Play by Play
      const pbpResponse = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: { endpoint: "get_singlegame_pbp.php", method: "POST", alt_sub: getAltsSelected }
      });
      if (pbpResponse.ok) {
        const data = await pbpResponse.json();
        const body = JSON.parse(data.body);
        setPlayByPlay(body.playbyplay || []);
      }

      // Fetch Box Score
      const boxResponse = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: { endpoint: "get_singlegame_box.php", method: "POST", alt_sub: getAltsSelected }
      });
      if (boxResponse.ok) {
        const data = await boxResponse.json();
        const body = JSON.parse(data.body);
        setBoxScore(body.boxscore || []);
      }

    } catch (err) {
      console.error("Error fetching game data:", err);
    }
  };

  const TeamLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => (
    logo ? <img src={logo} alt={`${name} Logo`} className="h-14 w-14 object-contain" /> : <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">{name.substring(0, 3).toUpperCase()}</div>
  );

  return (
    <div className="p-2 md:p-4 bg-background text-foreground text-xs md:text-sm">
      {/* Top Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mb-2">
        <div className="col-span-1 md:col-span-2 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <Button size="sm" onClick={handleStartGame} disabled={isLoading || isGameStarted} className="flex-1 md:flex-none">
            {isLoading ? "Loading..." : "Start Game"}
          </Button>

          <Sheet open={isStatsOpen} onOpenChange={setIsStatsOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="flex-1 md:flex-none">Player Stats</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[540px] overflow-y-auto" side="left">
              <SheetHeader>
                <SheetTitle>Actual Player Statistics</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <h3 className="font-bold mb-2">{selectedTeams1?.teams} (Away)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Pos</TableHead>
                      <TableHead>PTS</TableHead>
                      <TableHead>REB</TableHead>
                      <TableHead>AST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playersTeam1.map((player, i) => (
                      <TableRow key={i}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.positions}</TableCell>
                        <TableCell>{player.ptsg}</TableCell>
                        <TableCell>{player.totreb}</TableCell>
                        <TableCell>{player.ming}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <h3 className="font-bold mt-6 mb-2">{selectedTeams2?.teams} (Home)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Pos</TableHead>
                      <TableHead>PTS</TableHead>
                      <TableHead>REB</TableHead>
                      <TableHead>AST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playersTeam2.map((player, i) => (
                      <TableRow key={i}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.positions}</TableCell>
                        <TableCell>{player.ptsg}</TableCell>
                        <TableCell>{player.totreb}</TableCell>
                        <TableCell>{player.ming}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SheetContent>
          </Sheet>

          <Button size="sm" disabled className="flex-1 md:flex-none">Pause</Button>
        </div>

        <div className="col-span-1 md:col-span-2 border rounded-md p-2">
          <h3 className="font-bold text-center mb-1">Away Team</h3>
          <div className="flex flex-row md:flex-col gap-2 md:gap-0 justify-around">
            <CustomRadio name="away-team-mode" value="manual" checked={awayTeamMode === 'manual'} onChange={setAwayTeamMode} label="Manual" id="away-manual" />
            <CustomRadio name="away-team-mode" value="auto" checked={awayTeamMode === 'auto'} onChange={setAwayTeamMode} label="Auto" id="away-auto" />
            <CustomRadio name="away-team-mode" value="computer" checked={awayTeamMode === 'computer'} onChange={setAwayTeamMode} label="Comp" id="away-computer" />
          </div>
        </div>

        <div className="col-span-1 md:col-span-4">
          {/* Setup Section */}
          <div className="flex flex-col gap-2 p-2 border rounded-md">
            <div className="flex gap-2">
              <Select value={selectedLeague?.league_name} onValueChange={(val) => {
                const league = leagues.find(l => l.league_name === val);
                setSelectedLeague(league || null);
                // Trigger team fetch when league changes
                setTimeout(() => handleFetchTeams(), 0);
              }}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="League" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((l) => (
                    <SelectItem key={l.league_name} value={l.league_name}>{l.league_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={selectedTeams1?.teams} onValueChange={(val) => {
                const team = teams.find(t => t.teams === val);
                setSelectedTeams1(team || null);
              }}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Away Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.teams} value={t.teams}>{t.teams}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTeams2?.teams} onValueChange={(val) => {
                const team = teams.find(t => t.teams === val);
                setSelectedTeams2(team || null);
              }}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Home Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.teams} value={t.teams}>{t.teams}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 border rounded-md p-2">
          <h3 className="font-bold text-center mb-1">Home Team</h3>
          <div className="flex flex-row md:flex-col gap-2 md:gap-0 justify-around">
            <CustomRadio name="home-team-mode" value="manual" checked={homeTeamMode === 'manual'} onChange={setHomeTeamMode} label="Manual" id="home-manual" />
            <CustomRadio name="home-team-mode" value="auto" checked={homeTeamMode === 'auto'} onChange={setHomeTeamMode} label="Auto" id="home-auto" />
            <CustomRadio name="home-team-mode" value="computer" checked={homeTeamMode === 'computer'} onChange={setHomeTeamMode} label="Comp" id="home-computer" />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 border rounded-md p-2">
          <h3 className="font-bold text-center mb-1">Pause Options</h3>
          <div className="flex flex-wrap md:flex-col gap-2 md:gap-0 justify-around">
            <CustomRadio name="pause-options" value="each-line" checked={pauseOptions === 'each-line'} onChange={setPauseOptions} label="Line" id="pause-line" />
            <CustomRadio name="pause-options" value="each-possession" checked={pauseOptions === 'each-possession'} onChange={setPauseOptions} label="Poss" id="pause-possession" />
            <CustomRadio name="pause-options" value="end-of-quarter" checked={pauseOptions === 'end-of-quarter'} onChange={setPauseOptions} label="Qtr" id="pause-quarter" />
            <CustomRadio name="pause-options" value="do-not-pause" checked={pauseOptions === 'do-not-pause'} onChange={setPauseOptions} label="None" id="pause-none" />
          </div>
        </div>

        <div className="col-span-1 md:col-start-11 md:col-span-2">
          <Button size="sm" className="w-full" onClick={() => setIsGameStarted(false)}>Reset Game</Button>
        </div>
      </div>

      {/* Main Scoreboard and Display Options */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mb-2 p-2 border rounded-md">
        <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col items-center justify-between md:justify-center">
          <div className="font-bold text-lg md:text-xl">{selectedTeams1?.teams || "Away"}</div>
          {selectedTeams1 && <TeamLogo logo={teamLogos[selectedTeams1.teams]} name={selectedTeams1.teams} />}
          <div className="text-4xl md:text-5xl font-bold text-red-500">{scoreBoard?.away_score || "0"}</div>
          <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-xs md:text-sm">
            <span>Fouls: {scoreBoard?.away_fouls || "0"}</span>
            <span>Poss: {scoreBoard?.away_possessions || "0"}</span>
          </div>
        </div>

        <div className="col-span-1 md:col-span-6 text-center flex flex-col justify-center my-2 md:my-0">
          <div className="text-3xl md:text-2xl font-bold">{scoreBoard?.clock || "12:00"}</div>
          <div className="text-xl md:text-lg">Qtr {scoreBoard?.quarter || "1"}</div>
        </div>

        <div className="col-span-1 md:col-span-3 flex flex-row-reverse md:flex-col items-center justify-between md:justify-center">
          <div className="font-bold text-lg md:text-xl">{selectedTeams2?.teams || "Home"}</div>
          {selectedTeams2 && <TeamLogo logo={teamLogos[selectedTeams2.teams]} name={selectedTeams2.teams} />}
          <div className="text-4xl md:text-5xl font-bold text-blue-500">{scoreBoard?.home_score || "0"}</div>
          <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-xs md:text-sm">
            <span>Poss: {scoreBoard?.home_possessions || "0"}</span>
            <span>Fouls: {scoreBoard?.home_fouls || "0"}</span>
          </div>
        </div>

        {/* Sub Buttons Row */}
        <div className="col-span-1 md:col-span-12 grid grid-cols-3 gap-2 mt-2">
          <Button className="w-full text-xs" size="sm" variant="outline">Away Subs</Button>
          <Button className="w-full text-xs" size="sm" variant="outline">Subs/Def</Button>
          <Button className="w-full text-xs" size="sm" variant="outline">Home Subs</Button>
        </div>

        <div className="col-span-1 md:col-span-12 flex flex-col md:flex-row items-center gap-4 mt-2 justify-center">
          <div className="border rounded p-1 flex gap-2">
            <span className="font-bold mr-2 hidden md:inline">Display:</span>
            <CustomRadio name="display-options" value="play-by-play" checked={displayOptions === 'play-by-play'} onChange={setDisplayOptions} label="PBP" id="disp-pbp" />
            <CustomRadio name="display-options" value="box-score" checked={displayOptions === 'box-score'} onChange={setDisplayOptions} label="Box" id="disp-box" />
            <CustomRadio name="display-options" value="both" checked={displayOptions === 'both'} onChange={setDisplayOptions} label="Both" id="disp-both" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <CustomCheckbox id="check-pbp" checked={showPlayByPlay} onChange={setShowPlayByPlay} label="PBP" />
            <CustomCheckbox id="check-box" checked={showBoxScore} onChange={setShowBoxScore} label="Box" />
            <CustomCheckbox id="check-court" checked={showCourtStats} onChange={setShowCourtStats} label="Court" />
            <CustomCheckbox id="check-score" checked={showTheScore} onChange={setShowTheScore} label="Score" />
            <CustomCheckbox id="check-enhanced" checked={enhancedPBP} onChange={setEnhancedPBP} label="Enh PBP" />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-2">
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['20', 'T-out', 'HC', 'R', 'PG', 'SG', 'SF', 'PF', 'C'].map(b => <Button key={b} variant="outline" size="sm" className="px-2 min-w-[30px]">{b}</Button>)}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button size="sm" onClick={handleGameStep} disabled={!isGameStarted || isLoading} className="flex-1 md:flex-none">
            {isLoading ? "..." : "Continue/Step"}
          </Button>
          <Button size="sm" variant="ghost">No</Button>
        </div>
        <div className="hidden md:block">
          <CustomCheckbox id="midline-scroll" checked={midlineScroll} onChange={setMidlineScroll} label="Mid-line scroll" />
        </div>
      </div>

      {/* Play-by-Play and Box Score */}
      <div className={`grid gap-2 h-[500px] md:h-96 ${displayOptions === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {(displayOptions === 'play-by-play' || displayOptions === 'both') && showPlayByPlay && (
          <div className="border rounded-md p-2 overflow-y-auto bg-gray-800 text-white font-mono text-xs h-full">
            {playByPlay.map((p, i) => (
              <div key={i} className={`mb-1 ${p.color === '1' ? 'text-blue-300' : p.color === '2' ? 'text-red-300' : 'text-gray-300'}`}>
                {p.pbp_line}
              </div>
            ))}
          </div>
        )}
        {(displayOptions === 'box-score' || displayOptions === 'both') && showBoxScore && (
          <div className="border rounded-md p-2 overflow-y-auto bg-gray-800 text-white font-mono text-xs h-full">
            {boxScore.map((b, i) => (
              <div key={i} className="whitespace-pre-wrap">{b.box_line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleGameVersion;
