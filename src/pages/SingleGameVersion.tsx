import React, { useState, useEffect, useRef } from 'react';
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
import PBP2DVisualizer from '../components/PBP2DVisualizer';
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
  selectedTeams1: Team | null; // Away Team
  selectedTeams2: Team | null; // Home Team
  teamLogos: { [key: string]: string };
  getAltsSelected: string;
  playersTeam1: PlayerChar[];
  playersTeam2: PlayerChar[];
  leagues: League[];
  setSelectedTeams1: React.Dispatch<React.SetStateAction<Team | null>>;
  setSelectedTeams2: React.Dispatch<React.SetStateAction<Team | null>>;
}

interface ScoreBoard {
  away_score: number;
  home_score: number;
  quarter: number;
  clock: string;
  line_score1: string;
  line_score2: string;
  line_score3: string;
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
}

interface PlayByPlay {
  color: number;
  pbp_line: string;
}

interface BoxScore {
  game_number: string;
  line_number: string;
  text: string;
}

const SIMULATION_URL = import.meta.env.VITE_APP_API_SIMULATION
const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_APP_API_KEY;

const SingleGameVersion: React.FC<SingleGameVersionProps> = ({
  selectedTeams1,
  selectedTeams2,
  teamLogos,
  getAltsSelected,
  playersTeam1,
  playersTeam2,
  leagues,
  setSelectedTeams1,
  setSelectedTeams2
}) => {
  const { fetchWithAuth } = useUser();
  const { toast } = useToast();

  // Separate league selection for away and home teams
  const [selectedLeagueAway, setSelectedLeagueAway] = useState<League | null>(null);
  const [selectedLeagueHome, setSelectedLeagueHome] = useState<League | null>(null);
  const [teamsAway, setTeamsAway] = useState<Team[]>([]);
  const [teamsHome, setTeamsHome] = useState<Team[]>([]);

  // State for UI controls
  const [displayOptions, setDisplayOptions] = useState('both');
  const [showPlayByPlay, setShowPlayByPlay] = useState(true);
  const [showBoxScore, setShowBoxScore] = useState(true);
  const [showCourtStats, setShowCourtStats] = useState(true);
  const [showTheScore, setShowTheScore] = useState(true);
  const [enhancedPBP, setEnhancedPBP] = useState(false);
  const [midlineScroll, setMidlineScroll] = useState(true);

  // Game Data State
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard | null>(null);
  const [playByPlay, setPlayByPlay] = useState<PlayByPlay[]>([]);
  const [boxScore, setBoxScore] = useState<BoxScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Playback Animation State
  const [fullCourtData, setFullCourtData] = useState<ScoreBoard[]>([]);
  const [fullPlayByPlayData, setFullPlayByPlayData] = useState<PlayByPlay[]>([]);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs for scrollable containers
  const playByPlayRef = useRef<HTMLDivElement>(null);
  const boxScoreRef = useRef<HTMLDivElement>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x, 4x

  // Fetch teams when league changes
  useEffect(() => {
    const fetchTeamsAway = async () => {
      if (!selectedLeagueAway) return;
      try {
        const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
          body: {
            league_name: selectedLeagueAway.league_name,
            method: "POST",
            endpoint: "get_teams.php",
            content: "json",
            alt_sub: getAltsSelected
          }
        });
        if (response.ok) {
          const data = await response.json();
          const body = JSON.parse(data.body);
          setTeamsAway(body.data || []);
        }
      } catch (err) {
        console.error("Error fetching away teams:", err);
      }
    };
    fetchTeamsAway();
  }, [selectedLeagueAway]);

  useEffect(() => {
    const fetchTeamsHome = async () => {
      if (!selectedLeagueHome) return;
      try {
        const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
          body: {
            league_name: selectedLeagueHome.league_name,
            method: "POST",
            endpoint: "get_teams.php",
            content: "json",
            alt_sub: getAltsSelected
          }
        });
        if (response.ok) {
          const data = await response.json();
          const body = JSON.parse(data.body);
          setTeamsHome(body.data || []);
        }
      } catch (err) {
        console.error("Error fetching home teams:", err);
      }
    };
    fetchTeamsHome();
  }, [selectedLeagueHome]);

  // Playback animation loop
  useEffect(() => {
    if (!isPlaying || fullCourtData.length === 0) return;

    const baseDelay = 500; // Base delay in ms
    const delay = baseDelay / playbackSpeed;

    const interval = setInterval(() => {
      setCurrentPlayIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        // Stop at the end
        if (nextIndex >= fullCourtData.length) {
          setIsPlaying(false);
          return prevIndex;
        }

        // Update scoreboard with current play
        setScoreBoard(fullCourtData[nextIndex]);

        // Accumulate play-by-play up to current index
        setPlayByPlay(fullPlayByPlayData.slice(0, nextIndex + 1));

        return nextIndex;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, fullCourtData, fullPlayByPlayData]);

  // Auto-scroll to bottom when midlineScroll is enabled or when data updates
  useEffect(() => {
    if (midlineScroll) {
      if (playByPlayRef.current) {
        playByPlayRef.current.scrollTop = playByPlayRef.current.scrollHeight;
      }
      if (boxScoreRef.current) {
        boxScoreRef.current.scrollTop = boxScoreRef.current.scrollHeight;
      }
    }
  }, [playByPlay, boxScore, midlineScroll]);

  // Playback control functions
  const handlePlay = () => {
    if (currentPlayIndex >= fullCourtData.length - 1) {
      // If at the end, restart from beginning
      setCurrentPlayIndex(0);
      setScoreBoard(fullCourtData[0]);
      setPlayByPlay([fullPlayByPlayData[0]]);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleJumpToStart = () => {
    setIsPlaying(false);
    setCurrentPlayIndex(0);
    if (fullCourtData.length > 0) {
      setScoreBoard(fullCourtData[0]);
      setPlayByPlay([fullPlayByPlayData[0]]);
    }
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    const endIndex = fullCourtData.length - 1;
    setCurrentPlayIndex(endIndex);
    if (fullCourtData.length > 0) {
      setScoreBoard(fullCourtData[endIndex]);
      setPlayByPlay(fullPlayByPlayData);
    }
  };

  const handleStartGame = async () => {
    if (!selectedLeagueAway || !selectedLeagueHome || !selectedTeams1 || !selectedTeams2) {
      toast({
        title: "Error",
        description: "Please select leagues and both teams.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`${SIMULATION_URL}/play_sgv_fast.php`, 'POST', {
        homeleague: selectedLeagueHome.league_name,
        awayleague: selectedLeagueAway.league_name,
        hometeam: selectedTeams2.teams,
        awayteam: selectedTeams1.teams,
        apikey: API_KEY
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to start game.');
      }

      const data = await response.json();
      // The API returns the JSON directly, or wrapped in body? 
      // Based on previous code it was wrapped in 'body' string sometimes, but the new doc implies direct JSON.
      // I'll check if 'body' exists and parse it, otherwise use data directly.
      let gameData = data;
      if (data.body && typeof data.body === 'string') {
        try {
          gameData = JSON.parse(data.body);
        } catch (e) {
          gameData = data;
        }
      }

      if (gameData.court && gameData.court.length > 0) {
        // Store full data for playback
        setFullCourtData(gameData.court);
        setFullPlayByPlayData(gameData.playbyplay || []);

        // Set to end of game initially
        const endIndex = gameData.court.length - 1;
        setCurrentPlayIndex(endIndex);
        setScoreBoard(gameData.court[endIndex]);
      }
      if (gameData.playbyplay) {
        setPlayByPlay(gameData.playbyplay);
      }
      if (gameData.box) {
        setBoxScore(gameData.box);
      }

      setIsGameStarted(true);
      toast({
        title: "Game Finished",
        description: "The game has been simulated. Use playback controls to replay.",
      });

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error starting game",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TeamLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => (
    logo ? <img src={logo} alt={`${name} Logo`} className="h-14 w-14 object-contain" /> : <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">{name.substring(0, 3).toUpperCase()}</div>
  );

  const getPbpColorClass = (color: number) => {
    // 16711680 is Red (0xFF0000)
    // 255 is Blue (0x0000FF) - Assumption based on standard colors
    // 0 is Black/Default
    if (color === 16711680) return 'text-red-300';
    if (color === 255 || color === 16711935 || color === 65535) return 'text-blue-300'; // 16711935 is Magenta, 65535 is Cyan, just covering bases or just default to blue for non-red/non-zero
    if (color !== 0) return 'text-blue-300'; // Default to blue for other colors for now
    return 'text-gray-300';
  };

  return (
    <div className="p-2 md:p-4 bg-background text-foreground text-xs md:text-sm">
      {/* Top Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mb-2">
        <div className="col-span-1 md:col-span-2 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <Button size="sm" onClick={handleStartGame} disabled={isLoading} className="flex-1 md:flex-none">
            {isLoading ? "Simulating..." : "Start Game"}
          </Button>

          {/* Playback Controls */}
          {isGameStarted && fullCourtData.length > 0 && (
            <>
              <div className="flex gap-1 flex-1 md:flex-none">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleJumpToStart}
                  className="flex-1 px-2"
                  title="Jump to Start"
                >
                  ⏮
                </Button>
                <Button
                  size="sm"
                  variant={isPlaying ? "destructive" : "default"}
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="flex-1"
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleJumpToEnd}
                  className="flex-1 px-2"
                  title="Jump to End"
                >
                  ⏭
                </Button>
              </div>

              <Select value={playbackSpeed.toString()} onValueChange={(val) => setPlaybackSpeed(parseFloat(val))}>
                <SelectTrigger className="h-8 w-full md:w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="4">4x</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-xs text-muted-foreground text-center">
                Play {currentPlayIndex + 1} / {fullCourtData.length}
              </div>
            </>
          )}

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
        </div>

        <div className="col-span-1 md:col-span-4">
          {/* Setup Section */}
          <div className="flex flex-col gap-2 p-2 border rounded-md">
            <div className="text-xs font-semibold text-muted-foreground mb-1">League & Team Selection</div>

            {/* Away Team Section */}
            <div className="space-y-2 pb-2 border-b">
              <label className="text-xs text-muted-foreground">Away Team</label>
              <Select value={selectedLeagueAway?.league_name} onValueChange={(val) => {
                const league = leagues.find(l => l.league_name === val);
                setSelectedLeagueAway(league || null);
                setSelectedTeams1(null); // Reset team selection when league changes
              }}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Select Away League" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((l) => (
                    <SelectItem key={l.league_name} value={l.league_name}>{l.league_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedLeagueAway && (
                <Select value={selectedTeams1?.teams} onValueChange={(val) => {
                  const team = teamsAway.find(t => t.teams === val);
                  setSelectedTeams1(team || null);
                }}>
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Select Away Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamsAway.map((t) => (
                      <SelectItem key={t.teams} value={t.teams}>{t.teams}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Home Team Section */}
            <div className="space-y-2 pt-2">
              <label className="text-xs text-muted-foreground">Home Team</label>
              <Select value={selectedLeagueHome?.league_name} onValueChange={(val) => {
                const league = leagues.find(l => l.league_name === val);
                setSelectedLeagueHome(league || null);
                setSelectedTeams2(null); // Reset team selection when league changes
              }}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Select Home League" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((l) => (
                    <SelectItem key={l.league_name} value={l.league_name}>{l.league_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedLeagueHome && (
                <Select value={selectedTeams2?.teams} onValueChange={(val) => {
                  const team = teamsHome.find(t => t.teams === val);
                  setSelectedTeams2(team || null);
                }}>
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Select Home Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamsHome.map((t) => (
                      <SelectItem key={t.teams} value={t.teams}>{t.teams}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-start-11 md:col-span-2">
          <Button size="sm" className="w-full" onClick={() => {
            setIsGameStarted(false);
            setScoreBoard(null);
            setPlayByPlay([]);
            setBoxScore([]);
          }}>Reset Game</Button>
        </div>
      </div>

      {/* Main Scoreboard and Display Options */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mb-2 p-2 border rounded-md">
        <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col items-center justify-between md:justify-center">
          <div className="font-bold text-lg md:text-xl">{selectedTeams1?.teams || "Away"}</div>
          {selectedTeams1 && <TeamLogo logo={teamLogos[selectedTeams1.teams]} name={selectedTeams1.teams} />}
          <div className="text-4xl md:text-5xl font-bold text-red-500">{scoreBoard?.away_score || "0"}</div>
        </div>

        <div className="col-span-1 md:col-span-6 text-center flex flex-col justify-center my-2 md:my-0">
          <div className="text-3xl md:text-2xl font-bold">{scoreBoard?.clock || "0:00"}</div>
          <div className="text-xl md:text-lg">Qtr {scoreBoard?.quarter || "1"}</div>
          <div className="overflow-x-auto mt-2 flex flex-col items-center">
            <div className="text-[10px] md:text-xs font-mono whitespace-pre">
              {scoreBoard?.line_score1}
            </div>
            <div className="text-[10px] md:text-xs font-mono whitespace-pre">
              {scoreBoard?.line_score2}
            </div>
            <div className="text-[10px] md:text-xs font-mono whitespace-pre">
              {scoreBoard?.line_score3}
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-3 flex flex-row-reverse md:flex-col items-center justify-between md:justify-center">
          <div className="font-bold text-lg md:text-xl">{selectedTeams2?.teams || "Home"}</div>
          {selectedTeams2 && <TeamLogo logo={teamLogos[selectedTeams2.teams]} name={selectedTeams2.teams} />}
          <div className="text-4xl md:text-5xl font-bold text-blue-500">{scoreBoard?.home_score || "0"}</div>
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
        <div className="hidden md:block">
          <CustomCheckbox id="midline-scroll" checked={midlineScroll} onChange={setMidlineScroll} label="Mid-line scroll" />
        </div>
      </div>

      {/* 2D Visualization Section */}
      {showCourtStats && (
        <div className="mb-4">
          <PBP2DVisualizer
            scoreBoard={scoreBoard}
            currentPlay={playByPlay[currentPlayIndex]?.pbp_line}
            playersAway={playersTeam1}
            playersHome={playersTeam2}
          />
        </div>
      )}

      {/* Play-by-Play and Box Score */}
      <div className={`grid gap-2 h-[500px] md:h-96 ${displayOptions === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {(displayOptions === 'play-by-play' || displayOptions === 'both') && showPlayByPlay && (
          <div
            ref={playByPlayRef}
            className="border rounded-md p-2 overflow-y-auto bg-gray-800 text-white font-mono text-xs h-full"
          >
            {/* Only render the last 1000 items for performance */}
            {playByPlay.slice(-1000).map((p, i) => (
              <div key={i} className={`mb-1 ${getPbpColorClass(p.color)}`}>
                {p.pbp_line}
              </div>
            ))}
            {playByPlay.length > 1000 && (
              <div className="text-yellow-400 mb-2">
                ... showing last 1000 of {playByPlay.length} plays
              </div>
            )}
          </div>
        )}
        {(displayOptions === 'box-score' || displayOptions === 'both') && showBoxScore && (
          <div
            ref={boxScoreRef}
            className="border rounded-md p-2 overflow-y-auto bg-gray-800 text-white font-mono text-xs h-full"
          >
            {/* Only render the last 1000 items for performance */}
            {boxScore.slice(-1000).map((b, i) => (
              <div key={i} className="whitespace-pre-wrap">{b.text}</div>
            ))}
            {boxScore.length > 1000 && (
              <div className="text-yellow-400 mb-2">
                ... showing last 1000 of {boxScore.length} lines
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleGameVersion;
