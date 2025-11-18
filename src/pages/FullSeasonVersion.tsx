import React, { useState, useEffect } from 'react';
import CustomRadio from '../components/ui/CustomRadio';
import CustomCheckbox from '../components/ui/CustomCheckbox';
import { exportToCSV } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import PlayerStatsTable from '@/components/PlayerStatsTable';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Loader2, Info } from 'lucide-react';
import SubstitutionPatternSheet from '@/components/SubstitutionPatternSheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DraftDialog from '@/components/DraftDialog';
import PlayerStatsEditor, { EditablePlayerStats } from '@/components/PlayerStatsEditor';
import SetupSection from '@/components/full-season/SetupSection';
import TeamToolsSection from '@/components/full-season/TeamToolsSection';
import SimulationSettings from '@/components/full-season/SimulationSettings';
import ResultsSection from '@/components/full-season/ResultsSection';
import { useUser } from '@/contexts/UserContext';
import { useToast } from "@/hooks/use-toast";

interface Message {
  message: string;
}

interface BodyResponse {
  body: string;
}

interface League {
  league_name: string;
}

interface Team {
  teams: string;
}

interface TeamsSchedule {
  teams: string;
  games: string;
}

interface BoxScore {
  box_line: string;
  game_number: string;
  line_number: string;
}

interface BoxScoreFullSeason { //this is the boxScore of the full season game mode
  text: string;
  game_number: string;
  line_number: string;
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
  [key: string]: any;
}

interface PlayerSubPattern {
  pos1: string;
  pos2: string;
  pos3: string;
  pos4: string;
  pos5: string;
}

interface GetAlts {
  alt_sub: string;
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

interface DraftAction {
  action: 'replace';
  original_league: string;
  original_team: string;
  original_player: string;
  new_player_league: string;
  new_player_team: string;
  new_player_name: string;
}

interface GetPlayByPlay { //full season mode
  color: string;
  line_number: string;
  game_number: string;
  text: string;
}

interface RawStats { //raw (pre-formatted) text for the last user executed game simulation
  textlines: string;
}

interface FullSeasonVersionProps {
  leagues: League[];
  selectedLeague: League | null;
  setSelectedLeague: React.Dispatch<React.SetStateAction<League | null>>;
  teams: Team[];
  selectedTeams1: Team | null;
  teamsSchedule: TeamsSchedule[];
  setTeamsSchedule: React.Dispatch<React.SetStateAction<TeamsSchedule[]>>;
  setSelectedTeams1: React.Dispatch<React.SetStateAction<Team | null>>;
  selectedTeams2: Team | null;
  setSelectedTeams2: React.Dispatch<React.SetStateAction<Team | null>>;
  error: string | null;
  isLoading: boolean;
  boxScore: BoxScore[];
  boxScoreFullSeason: BoxScoreFullSeason[];
  setBoxScore: React.Dispatch<React.SetStateAction<BoxScore[]>>;
  setBoxScoreFullSeason: React.Dispatch<React.SetStateAction<BoxScoreFullSeason[]>>;
  rawStats: RawStats[];
  playersTeam1: PlayerChar[];
  playersTeam2: PlayerChar[];
  handleFetchScoreBoard: () => Promise<void>;
  //handleFetchPlayByPlay: () => Promise<void>;
  handleFetchBoxScore: () => Promise<void>;
  handleFetchPlayByPlayFullSeason: (gameNumber: string) => Promise<void>;
  //handleFetchBoxScoreFullSeason: () => Promise<void>;
  handleSchedule82: () => Promise<void>;
  handleFetchPlayerSubpattern: () => Promise<PlayerSubPattern[] | null>;
  teamLogos: { [key: string]: string };
  handleFetchSetPlayerSubpattern: () => Promise<void | null>;
  getAlts: GetAlts[];
  //setGetAlts: React.Dispatch<React.SetStateAction<GetAlts[]>>;
  getAltsSelected: string | null;
  setGetAltsSelected: React.Dispatch<React.SetStateAction<string>>;
  keepPlayByPlay: string | null;
  setKeepPlayByPlay: React.Dispatch<React.SetStateAction<string>>;
  schedule: string | null;
  setSchedule: React.Dispatch<React.SetStateAction<string>>;
  location: string | null;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  handlePredictMode: () => Promise<void | null>;
  scheduleMultiplier: string;
  setScheduleMultiplier: React.Dispatch<React.SetStateAction<string>>;
  playByPlay: GetPlayByPlay[];
  setPlayByPlay: React.Dispatch<React.SetStateAction<GetPlayByPlay[]>>;
  gameList: GameList[];
  setGameList: React.Dispatch<React.SetStateAction<GameList[]>>;
  playerSubPattern: PlayerSubPattern[] | null;
  setPlayerSubPattern: React.Dispatch<React.SetStateAction<PlayerSubPattern[] | null>>;
  draftActions: DraftAction[];
  setDraftActions: React.Dispatch<React.SetStateAction<DraftAction[]>>;
  selectedLeagueDraft: League | null;
  setSelectedLeagueDraft: React.Dispatch<React.SetStateAction<League | null>>;
  selectedTeamDraft: Team | null;
  setSelectedTeamDraft: React.Dispatch<React.SetStateAction<Team | null>>;
  playersTeamDraft: PlayerChar[];
  handleFetchTeamsDraft: () => Promise<void>;
  handleFetchSetPlayerDraft: () => Promise<void>;
  teamsDraft: Team[];
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

const FullSeasonVersion: React.FC<FullSeasonVersionProps> = (
  {
    leagues,
    selectedLeague,
    setSelectedLeague,
    teams,
    selectedTeams1,
    setSelectedTeams1,
    selectedTeams2,
    setSelectedTeams2,
    //error,
    isLoading,
    //boxScore,
    //setBoxScore,
    playersTeam1,
    playersTeam2,
    //handleFetchScoreBoard,
    //handleFetchPlayByPlay,
    //handleFetchBoxScore,
    handleFetchPlayByPlayFullSeason,
    teamLogos,
    handleSchedule82,
    teamsSchedule,
    setTeamsSchedule,
    handleFetchPlayerSubpattern,
    handleFetchSetPlayerSubpattern,
    getAlts,
    //setGetAlts,
    getAltsSelected,
    setGetAltsSelected,
    schedule,
    setSchedule,
    location,
    setLocation,
    setBoxScoreFullSeason,
    //handleFetchBoxScoreFullSeason,
    handlePredictMode,
    scheduleMultiplier,
    setScheduleMultiplier,
    playByPlay,
    //setPlayByPlay,
    gameList,
    setGameList,
    playerSubPattern,
    setPlayerSubPattern,
    draftActions,
    setDraftActions,
    selectedLeagueDraft,
    setSelectedLeagueDraft,
    selectedTeamDraft,
    setSelectedTeamDraft,
    playersTeamDraft,
    handleFetchTeamsDraft,
    handleFetchSetPlayerDraft,
    teamsDraft,
    keepPlayByPlay,
    setKeepPlayByPlay,
    rawStats,
    boxScoreFullSeason,
  }
) => {
  //const [schedule, setSchedule] = useState('predict');
  //const [location, setLocation] = useState('both');
  const [savePbp, setSavePbp] = useState(true);
  const [saveBox, setSaveBox] = useState(true);
  const [isClear, setIsClear] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false);
  const [multiplier, setMultiplier] = useState(100)
  const [isSubPatternSheetOpen, setIsSubPatternSheetOpen] = useState(false);
  const [isFetchingSubPattern, setIsFetchingSubPattern] = useState(false);
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);
  const [isPbpSheetOpen, setIsPbpSheetOpen] = useState(false);

  // Player Stats Editor State
  const { fetchWithAuth } = useUser();
  const { toast } = useToast();
  const [editablePlayers, setEditablePlayers] = useState<EditablePlayerStats[]>([]);
  const [isStatsEditorOpen, setIsStatsEditorOpen] = useState(false);
  const [isFetchingStats, setIsFetchingStats] = useState(false);

  const handleFetchEditablePlayerStats = async () => {
    if (!selectedTeams2 || !selectedLeague) return;

    setIsFetchingStats(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          endpoint: "get_players_chars.php",
          method: "POST",
          league_name: selectedLeague.league_name,
          team_name: selectedTeams2.teams,
          alt_sub: getAltsSelected
        }
      });

      if (!response.ok) {
        const err: Message = await response.json();
        throw new Error(err.message);
      }

      const data: BodyResponse = await response.json();
      const body: { data: EditablePlayerStats[] } = JSON.parse(data.body);
      setEditablePlayers(body.data);
    } catch (err: any) {
      toast({
        title: "Error fetching stats",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsFetchingStats(false);
    }
  };

  const handleSavePlayerStats = async (updatedPlayers: EditablePlayerStats[]) => {
    if (!selectedTeams2 || !selectedLeague) return;

    try {
      const response = await fetchWithAuth(`${API_URL}/conversionjs`, 'POST', {
        body: {
          endpoint: "set_players_chars.php",
          method: "POST",
          league_name: selectedLeague.league_name,
          team_name: selectedTeams2.teams,
          alt_sub: getAltsSelected,
          data: updatedPlayers
        }
      });

      if (!response.ok) {
        const err: Message = await response.json();
        throw new Error(err.message);
      }

      toast({
        title: "Success",
        description: "Player statistics saved successfully.",
      });

      // Refresh the data
      await handleFetchEditablePlayerStats();

    } catch (err: any) {
      toast({
        title: "Error saving stats",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleStatsEditorClick = async () => {
    await handleFetchEditablePlayerStats();
    setIsStatsEditorOpen(true);
  };

  const handlePbpForGame = async (gameNumber: string) => {
    await handleFetchPlayByPlayFullSeason(gameNumber);
    setIsPbpSheetOpen(true);
  }

  const handleSubPatternClick = async () => {
    setIsFetchingSubPattern(true);
    const data = await handleFetchPlayerSubpattern();
    if (data) {
      setPlayerSubPattern(data);
    } else {
      setPlayerSubPattern([]); // Clear if no data
    }
    setIsSubPatternSheetOpen(true);
    setIsFetchingSubPattern(false);
  };

  let gameCounter = 0

  const TeamLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => (
    logo ? <img src={logo} alt={`${name} Logo`} className="h-14 w-14 object-contain" /> : <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">{name.substring(0, 3).toUpperCase()}</div>
  );

  useEffect(() => {
    console.log("should reset all")
  }, [isClear])

  const handlePlayGames = async () => {
    setIsSimulating(true);
    await handlePredictMode();
    //await handleFetchScoreBoard(); //this is wrong in the full season mode
    //await handleFetchPlayByPlay(); //check if this should comes here, is for single game mode

    //await handleFetchBoxScore();
    //await handleFetchBoxScoreFullSeason();

    /* if(boxScoreFullSeason.length==0){
      //await handleFetchBoxScore();
      await handleFetchBoxScoreFullSeason();
    } */
    setIsSimulating(false);
    setScheduleMultiplier("82")
    setMultiplier(100)
    await handleSchedule82()

  }
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Full Season Simulation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Setup & Configuration (4 cols on large screens) */}
        <div className="lg:col-span-4 space-y-6">
          <SetupSection
            leagues={leagues}
            selectedLeague={selectedLeague}
            setSelectedLeague={setSelectedLeague}
            teams={teams}
            selectedTeams1={selectedTeams1}
            setSelectedTeams1={setSelectedTeams1}
            selectedTeams2={selectedTeams2}
            setSelectedTeams2={setSelectedTeams2}
            getAlts={getAlts}
            getAltsSelected={getAltsSelected}
            setGetAltsSelected={setGetAltsSelected}
            schedule={schedule}
            onClear={() => {
              setSelectedLeague(null);
              setSelectedTeams1(null);
              setSelectedTeams2(null);
              setBoxScoreFullSeason([]);
              setTeamsSchedule([]);
              setGameList([]);
              setIsClear(!isClear);
            }}
          />

          <TeamToolsSection
            selectedLeague={selectedLeague}
            selectedTeams1={selectedTeams1}
            selectedTeams2={selectedTeams2}
            playersTeam1={playersTeam1}
            playersTeam2={playersTeam2}
            isSubPatternSheetOpen={isSubPatternSheetOpen}
            setIsSubPatternSheetOpen={setIsSubPatternSheetOpen}
            isFetchingSubPattern={isFetchingSubPattern}
            handleSubPatternClick={handleSubPatternClick}
            playerSubPattern={playerSubPattern}
            setPlayerSubPattern={setPlayerSubPattern}
            handleFetchSetPlayerSubpattern={handleFetchSetPlayerSubpattern}
            isStatsEditorOpen={isStatsEditorOpen}
            setIsStatsEditorOpen={setIsStatsEditorOpen}
            handleStatsEditorClick={handleStatsEditorClick}
            isFetchingStats={isFetchingStats}
            editablePlayers={editablePlayers}
            handleSavePlayerStats={handleSavePlayerStats}
            setIsDraftDialogOpen={setIsDraftDialogOpen}
          />

          <SimulationSettings
            schedule={schedule}
            setSchedule={setSchedule}
            location={location}
            setLocation={setLocation}
            keepPlayByPlay={keepPlayByPlay}
            setKeepPlayByPlay={setKeepPlayByPlay}
            saveBox={saveBox}
            setSaveBox={setSaveBox}
            isSimulating={isSimulating}
            onPlayGames={handlePlayGames}
            isLoading={isLoading}
            canPlay={!!(selectedLeague && selectedTeams2)}
          />
        </div>

        {/* Right Column: Results & Schedule (8 cols on large screens) */}
        <div className="lg:col-span-8 h-full min-h-[500px]">
          <ResultsSection
            gameList={gameList}
            teamsSchedule={teamsSchedule}
            selectedTeams2={selectedTeams2}
            keepPlayByPlay={keepPlayByPlay}
            handlePbpForGame={handlePbpForGame}
            scheduleMultiplier={scheduleMultiplier}
            setScheduleMultiplier={setScheduleMultiplier}
            setMultiplier={setMultiplier}
            handleSchedule82={handleSchedule82}
            setTeamsSchedule={setTeamsSchedule}
            teamLogos={teamLogos}
            multiplier={multiplier}
            rawStats={rawStats}
            boxScoreFullSeason={boxScoreFullSeason}
            isSimulating={isSimulating}
          />
        </div>
      </div>

      {/* Hidden/Utility Components */}
      <DraftDialog
        open={isDraftDialogOpen}
        onOpenChange={setIsDraftDialogOpen}
        leagues={leagues}
        selectedLeagueDraft={selectedLeagueDraft}
        setSelectedLeagueDraft={setSelectedLeagueDraft}
        teams={teamsDraft}
        currentTeamPlayers={playersTeam2}
        currentTeam={selectedTeams2}
        currentLeague={selectedLeague}
        selectedTeamDraft={selectedTeamDraft}
        setSelectedTeamDraft={setSelectedTeamDraft}
        draftablePlayers={playersTeamDraft}
        handleFetchTeamsDraft={handleFetchTeamsDraft}
        onSave={handleFetchSetPlayerDraft}
        draftActions={draftActions}
        setDraftActions={setDraftActions}
      />

      <Sheet open={isPbpSheetOpen} onOpenChange={setIsPbpSheetOpen}>
        <SheetContent className="overflow-y-auto max-w-[800px] w-full">
          <SheetHeader>
            <SheetTitle>Play by Play</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {playByPlay && playByPlay.length > 0 ? (
              (() => {
                const games = playByPlay.reduce((acc, item) => {
                  const gameNum = item.game_number;
                  if (!acc[gameNum]) {
                    acc[gameNum] = [];
                  }
                  acc[gameNum].push(item);
                  return acc;
                }, {} as Record<string, GetPlayByPlay[]>);

                return Object.entries(games).map(([gameNum, lines]) => (
                  <div key={gameNum} id={`game-pbp-${gameNum}`}>
                    <h4 className="font-bold text-lg mt-4 text-center">Game {gameNum}</h4>
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/2 text-center">Home Team</TableHead>
                          <TableHead className="w-1/2 text-center">Away Team</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lines.map((line, index) => (
                          <TableRow key={index}>
                            {line.color === '0' ? (
                              <TableCell colSpan={2} className="text-center font-bold">
                                {line.text}
                              </TableCell>
                            ) : line.color === '2' ? (
                              <>
                                <TableCell className="text-left">{line.text}</TableCell>
                                <TableCell></TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell></TableCell>
                                <TableCell className="text-right">{line.text}</TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ));
              })()
            ) : (
              <p>No Play by Play data available.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FullSeasonVersion;
