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
  playersTeam1: PlayerChar[];
  playersTeam2: PlayerChar[];
  handleFetchScoreBoard: () => Promise<void>;
  handleFetchPlayByPlay: () => Promise<void>;
  handleFetchBoxScore: () => Promise<void>;
  //handleFetchBoxScoreFullSeason: () => Promise<void>;
  handleSchedule82: () => Promise<void>;
  handleFetchPlayerSubpattern: () => Promise<PlayerSubPattern[] | null>;
  teamLogos: { [key: string]: string };
  handleFetchSetPlayerSubpattern: () => Promise<void | null>;
  getAlts: GetAlts[];
  //setGetAlts: React.Dispatch<React.SetStateAction<GetAlts[]>>;
  getAltsSelected: string | null;
  setGetAltsSelected: React.Dispatch<React.SetStateAction<string>>;
  schedule: string | null;
  setSchedule: React.Dispatch<React.SetStateAction<string>>;
  location: string | null;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  handlePredictMode: () => Promise<void | null>;
  scheduleMultiplier: string;
  setScheduleMultiplier: React.Dispatch<React.SetStateAction<string>>;
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
    boxScoreFullSeason,
    setBoxScoreFullSeason,
    //handleFetchBoxScoreFullSeason,
    handlePredictMode,
    //scheduleMultiplier,
    setScheduleMultiplier,
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
  }
) => {
  //const [schedule, setSchedule] = useState('predict');
  //const [location, setLocation] = useState('both');
  const [savePbp, setSavePbp] = useState(false);
  const [saveBox, setSaveBox] = useState(true);
  const [isClear, setIsClear] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false);
  const [multiplier, setMultiplier] = useState(100)
  const [isSubPatternSheetOpen, setIsSubPatternSheetOpen] = useState(false);
  const [isFetchingSubPattern, setIsFetchingSubPattern] = useState(false);
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);

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
  }



  return (
    <div>
      <div className="flex gap-2 mb-4 border-b-2 border-border pb-2">
        <Button variant="outline" size="sm">Game Setup</Button>
        <Button variant="outline" size="sm">Raw Stats</Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" disabled={isSimulating} className={`${boxScoreFullSeason.length <= 1 ? "" : "pulse-attention"}`}>{boxScoreFullSeason.length <= 1 ? "Show Box Score" : "Show Box Score (!)"}</Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Box Score</SheetTitle>
            </SheetHeader>
            <div className="py-4" >
              {boxScoreFullSeason.length > 0 ? (
                <pre className="text-sm">{boxScoreFullSeason.map((item: any) => item.text).join('\n')}</pre>
              ) : (
                <p>No box score data available.</p>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Button variant="outline" size="sm">Sortable Stats</Button>
        <Button variant="outline" size="sm">Sortable Box Scores</Button>
        <Button variant="outline" size="sm">Play by Play</Button>
      </div>



      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setSelectedLeague(null)
                  setSelectedTeams1(null)
                  setSelectedTeams2(null)
                  setBoxScoreFullSeason([])
                  setTeamsSchedule([])
                  setGameList([])
                  setIsClear(!isClear)
                }}>Clear</Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={leagues?.length === 0} className={selectedLeague ? "" : 'pulse-attention'}>
                      {selectedLeague ? selectedLeague.league_name : "Choose League"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                    {leagues?.length > 0 && leagues.map((league: any) => (
                      <DropdownMenuItem key={league.league_name} onSelect={() => setSelectedLeague(league)}>
                        {league.league_name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {selectedLeague ? <div className="mt-2">
                {/* <label className="text-sm font-medium text-center">Away Team - Home Team</label> */}
                <div className="flex gap-2 mt-1">
                  {schedule != '8200' ? <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className={`${selectedTeams1 ? "" : "pulse-attention"}`} disabled={teams.length === 0}>
                        {selectedTeams1 ? `Away Team: ${selectedTeams1.teams}` : "Select Away Team"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                      {teams.length > 0 && teams.map((item: any) => (
                        <DropdownMenuItem key={`away-${item.teams}`} onSelect={() => setSelectedTeams1(item)}>
                          {item.teams}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu> : <></>
                  }
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className={`${selectedTeams2 ? "" : "pulse-attention"}`} disabled={teams.length === 0}>
                        {selectedTeams2 ? `Home Team: ${selectedTeams2.teams}` : "Select Home Team"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                      {teams.length > 0 && teams.map((item: any) => (
                        <DropdownMenuItem key={`home-${item.teams}`} onSelect={() => setSelectedTeams2(item)}>
                          {item.teams}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div> : <></>}
              {selectedLeague && selectedTeams2 ? <>
                <label className="text-sm font-medium">Alts Subs (Home Team)</label>
                <div className="grid grid-cols-1 gap-2 mt-4">

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={teams.length === 0}>
                        {getAltsSelected ? getAltsSelected : "Select Alts Sub"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                      {getAlts.length > 0 && getAlts.map((item: any) => (
                        <DropdownMenuItem key={item.alt_sub} onSelect={() => setGetAltsSelected(item.alt_sub)}>
                          {item.alt_sub}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div></> : <></>}
              {selectedLeague && (selectedTeams1 || selectedTeams2) ? <>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {/* START Sheet of 4 minute substitution pattern */}
                  <Sheet open={isSubPatternSheetOpen} onOpenChange={setIsSubPatternSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" onClick={handleSubPatternClick} disabled={schedule !== "8200" || isFetchingSubPattern}>Substitution Pattern</Button>
                    </SheetTrigger>
                    <SheetContent className="max-w-none w-[100vw] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>4 Minute Substitution Pattern - {selectedTeams2?.teams}</SheetTitle>
                      </SheetHeader>
                      <SubstitutionPatternSheet
                        isFetching={isFetchingSubPattern}
                        playerSubPattern={playerSubPattern}
                        setPlayerSubPattern={setPlayerSubPattern}
                        playersTeam2={playersTeam2}
                        selectedTeam={selectedTeams2}
                        onSetPattern={handleFetchSetPlayerSubpattern}
                      />
                    </SheetContent>
                  </Sheet>
                  {/* END Sheet of 4 minute substitution pattern */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Actual Player Statistics</Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Player Statistics</SheetTitle>
                      </SheetHeader>
                      <>
                        <div className="flex flex-col xl:flex-row gap-4 mt-8">
                          {playersTeam1.length > 1 && (
                            <div className="w-full l:w-1/1">
                              <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams1?.teams}</h2>
                                <Button variant="outline" size="sm" onClick={() => exportToCSV(playersTeam1, `${selectedTeams1?.teams}_stats.csv`)}>Export to CSV</Button>
                              </div>
                              <div className="overflow-x-auto">
                                <div className="h-[500px] overflow-y-auto">
                                  <Table className="border">
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="h-10">Name</TableHead>
                                        <TableHead className="h-10">Position</TableHead>
                                        <TableHead className="h-10">Height</TableHead>
                                        <TableHead className="h-10">G</TableHead>
                                        <TableHead className="h-10">Min</TableHead>
                                        <TableHead className="h-10">Min/G</TableHead>
                                        <TableHead className="h-10">Pts/G</TableHead>
                                        <TableHead className="h-10">FG%</TableHead>
                                        <TableHead className="h-10">Score FG%</TableHead>
                                        <TableHead className="h-10">2 Pts FG%</TableHead>
                                        <TableHead className="h-10">3 Pts FG%</TableHead>
                                        <TableHead className="h-10">FT%</TableHead>
                                        <TableHead className="h-10">OFF REB</TableHead>
                                        <TableHead className="h-10">DEF REB</TableHead>
                                        <TableHead className="h-10">TOT REB</TableHead>
                                        <TableHead className="h-10">DEF RAT</TableHead>
                                        <TableHead className="h-10">%PF</TableHead>
                                        <TableHead className="h-10">%ST</TableHead>
                                        <TableHead className="h-10">%BS</TableHead>

                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {playersTeam1.map((player: any) => (
                                        <TableRow key={player.name}>
                                          <TableCell className="h-10">{player.name}</TableCell>
                                          <TableCell className="h-10">{player.positions}</TableCell>
                                          <TableCell className="h-10">{player.height}</TableCell>
                                          <TableCell className="h-10">{player.g}</TableCell>
                                          <TableCell className="h-10">{player.min}</TableCell>
                                          <TableCell className="h-10">{player.ming}</TableCell>
                                          <TableCell className="h-10">{player.ptsg}</TableCell>
                                          <TableCell className="h-10">{player.fgpct}</TableCell>
                                          <TableCell className="h-10">{player.scorefgpct}</TableCell>
                                          <TableCell className="h-10">{player.twoptfgpct}</TableCell>
                                          <TableCell className="h-10">{player.threeptfgpct}</TableCell>
                                          <TableCell className="h-10">{player.ftpct}</TableCell>
                                          <TableCell className="h-10">{player.offreb}</TableCell>
                                          <TableCell className="h-10">{player.defreb}</TableCell>
                                          <TableCell className="h-10">{player.totreb}</TableCell>
                                          <TableCell className="h-10">{player.defrat}</TableCell>
                                          <TableCell className="h-10">{player.pctpf}</TableCell>
                                          <TableCell className="h-10">{player.pctst}</TableCell>
                                          <TableCell className="h-10">{player.pctbs}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          )}

                          {playersTeam2.length > 1 && (
                            <div className="w-full l:w-1/1">
                              <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams2?.teams}</h2>
                                <Button variant="outline" size="sm" onClick={() => exportToCSV(playersTeam2, `${selectedTeams2?.teams}_stats.csv`)}>Export to CSV</Button>
                              </div>
                              <div className="overflow-x-auto">
                                <div className="h-[500px] overflow-y-auto">
                                  <Table className="border">
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="h-10">Name</TableHead>
                                        <TableHead className="h-10">Position</TableHead>
                                        <TableHead className="h-10">Height</TableHead>
                                        <TableHead className="h-10">G</TableHead>
                                        <TableHead className="h-10">Min</TableHead>
                                        <TableHead className="h-10">Min/G</TableHead>
                                        <TableHead className="h-10">Pts/G</TableHead>
                                        <TableHead className="h-10">FG%</TableHead>
                                        <TableHead className="h-10">Score FG%</TableHead>
                                        <TableHead className="h-10">2 Pts FG%</TableHead>
                                        <TableHead className="h-10">3 Pts FG%</TableHead>
                                        <TableHead className="h-10">FT%</TableHead>
                                        <TableHead className="h-10">OFF REB</TableHead>
                                        <TableHead className="h-10">DEF REB</TableHead>
                                        <TableHead className="h-10">TOT REB</TableHead>
                                        <TableHead className="h-10">DEF RAT</TableHead>
                                        <TableHead className="h-10">%PF</TableHead>
                                        <TableHead className="h-10">%ST</TableHead>
                                        <TableHead className="h-10">%BS</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {playersTeam2.map((player: any) => (
                                        <TableRow key={player.name}>
                                          <TableCell className="h-10">{player.name}</TableCell>
                                          <TableCell className="h-10">{player.positions}</TableCell>
                                          <TableCell className="h-10">{player.height}</TableCell>
                                          <TableCell className="h-10">{player.g}</TableCell>
                                          <TableCell className="h-10">{player.min}</TableCell>
                                          <TableCell className="h-10">{player.ming}</TableCell>
                                          <TableCell className="h-10">{player.ptsg}</TableCell>
                                          <TableCell className="h-10">{player.fgpct}</TableCell>
                                          <TableCell className="h-10">{player.scorefgpct}</TableCell>
                                          <TableCell className="h-10">{player.twoptfgpct}</TableCell>
                                          <TableCell className="h-10">{player.threeptfgpct}</TableCell>
                                          <TableCell className="h-10">{player.ftpct}</TableCell>
                                          <TableCell className="h-10">{player.offreb}</TableCell>
                                          <TableCell className="h-10">{player.defreb}</TableCell>
                                          <TableCell className="h-10">{player.totreb}</TableCell>
                                          <TableCell className="h-10">{player.defrat}</TableCell>
                                          <TableCell className="h-10">{player.pctpf}</TableCell>
                                          <TableCell className="h-10">{player.pctst}</TableCell>
                                          <TableCell className="h-10">{player.pctbs}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    </SheetContent>
                  </Sheet>
                  <Button variant="outline" onClick={() => setIsDraftDialogOpen(true)}>Draft Players</Button>
                  <Button variant="outline" disabled>Change Player Characteristics</Button>

                </div>

                <div className="flex gap-4 mt-4">
                  <div className="border p-2 rounded-md bg-card text-card-foreground">
                    <div className="flex flex-col space-y-1">
                      <CustomRadio name="schedule" value="8200" checked={schedule === '8200'} onChange={setSchedule} label="82/820/8200 Game Schedule" id="r1" />
                      <CustomRadio name="schedule" value="predict" checked={schedule === 'predict'} onChange={setSchedule} label="Predict Games" id="r2" />
                      <CustomRadio name="schedule" value="fullseason" checked={schedule === 'fullseason'} onChange={setSchedule} label="Replay Full League Season" id="r3" />
                    </div>
                  </div>
                  <div className="border p-2 rounded-md bg-card text-card-foreground">
                    <div className="flex flex-col space-y-1" aria-disabled={schedule === "fullseason"} >
                      <CustomRadio name="location" value="home" checked={location === 'home'} onChange={setLocation} label="Home" id="r4" />
                      <CustomRadio name="location" value="away" checked={location === 'away'} onChange={setLocation} label="Away" id="r5" />
                      <CustomRadio name="location" value="both" checked={location === 'both'} onChange={setLocation} label="Both" id="r6" />
                      <CustomRadio name="location" value="neutral" checked={location === 'neutral'} onChange={setLocation} label="Neutral" id="r7" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <CustomCheckbox id="save-pbp" checked={savePbp} onChange={setSavePbp} label="Save Play-by-Play (<=100 games)" />
                  <CustomCheckbox id="save-box" checked={saveBox} onChange={setSaveBox} label="Save Box Scores - no more than 15,000 games" />
                </div>
                <Button variant="outline" disabled={isLoading || isSimulating} className="mt-4" onClick={async () => {
                  setGameList([])
                  if (schedule == "predict") {
                    await handlePlayGames()
                  } else {
                    await handlePlayGames()
                  }

                }}>
                  {isSimulating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  PLAY GAMES
                </Button>
                {gameList.length > 0 /* && (schedule === "fullseason" || schedule === "predict") */ ? (
                  <div className="mt-4 border rounded-md bg-card text-card-foreground">
                    <Button variant="default" size="sm" onClick={() => exportToCSV(gameList || [], `${selectedTeams2?.teams}_fullseason_game_list.csv`)}>Print</Button>

                    <h3 className="text-lg font-semibold p-4 border-b">Games List</h3>
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[85px]">Game #</TableHead>
                            <TableHead>Team 1</TableHead>
                            <TableHead className="w-[50px] text-center">H/A</TableHead>
                            <TableHead className="w-[80px] text-right">Score</TableHead>
                            <TableHead>Team 2</TableHead>
                            <TableHead className="w-[50px] text-center">H/A</TableHead>
                            <TableHead className="w-[80px] text-right">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gameList.map((game: GameList) => (
                            <TableRow key={game.game_number}>
                              <TableCell className="font-medium">{game.game_number}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {/* <TeamLogo logo={teamLogos[game.team_name1]} name={game.team_name1} /> */}
                                  <span>{game.team_name1}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">{game.team1_homeaway}</TableCell>
                              <TableCell className="text-right font-bold">{game.team1_score}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {/*  <TeamLogo logo={teamLogos[game.team_name2]} name={game.team_name2} /> */}
                                  <span>{game.team_name2}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">{game.team2_homeaway}</TableCell>
                              <TableCell className="text-right font-bold">{game.team2_score}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : <></>}
              </> : <></>}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <Button variant="outline" className="w-full">Zero Schedule</Button>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button variant="outline" onClick={async () => {
              setScheduleMultiplier("82")
              setMultiplier(100)
              await handleSchedule82()

            }} disabled={selectedTeams2 == null}>82 Games</Button>
            <Button variant="outline" disabled={selectedTeams2 == null} onClick={async () => {
              setScheduleMultiplier("820")
              setMultiplier(10)
              await handleSchedule82()

            }}>820 Games</Button>
            <Button variant="outline" disabled={selectedTeams2 == null} onClick={async () => {
              setScheduleMultiplier("8200")
              setMultiplier(1)
              await handleSchedule82()
            }}>8200 Games</Button>
          </div>
          <div className="mt-2 border rounded-md max-h-96 overflow-y-auto bg-card text-card-foreground">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TEAM NAME</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTeams1 && <TableRow><TableCell><div className="flex items-center justify-center gap-2"><TeamLogo logo={teamLogos[selectedTeams1?.teams || '']} name={selectedTeams1?.teams || 'Away'} /><span>{selectedTeams1.teams}</span></div></TableCell><TableCell className="text-center align-middle">0</TableCell></TableRow>}
                {selectedTeams2 && <TableRow><TableCell><div className="flex items-center justify-center gap-2"><TeamLogo logo={teamLogos[selectedTeams2?.teams || '']} name={selectedTeams2?.teams || 'Home'} /><span>{selectedTeams2.teams}</span></div></TableCell><TableCell className="text-center align-middle">0</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>

          {teamsSchedule && teamsSchedule.length > 1 && selectedTeams2?.teams ?
            <div className="mt-2 border rounded-md max-h-96 overflow-y-auto bg-card text-card-foreground">
              <div className="grid grid-cols-2 gap-3 mt-2 p-2 text-center">{selectedTeams2?.teams} Schedule<TeamLogo logo={teamLogos[selectedTeams2?.teams || '']} name={selectedTeams2?.teams || 'Home'} /> </div>
              <Table>
                <TableHeader>
                  <TableHead>TEAM NAME</TableHead>
                  <TableHead className="text-right">GAMES</TableHead>
                </TableHeader>
                <TableBody>
                  {teamsSchedule.map((item: TeamsSchedule, index: any) => {
                    if (index == 0) { gameCounter = 0 }
                    if (item.teams != selectedTeams2?.teams) {
                      gameCounter += parseInt(item.games) / multiplier
                      //console.log(gameCounter)
                      return (
                        <TableRow key={item.teams}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TeamLogo logo={teamLogos[item.teams || '']} name={item.teams || 'Home'} />
                              <span>{item.teams}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{parseInt(item.games) / multiplier}</TableCell>
                        </TableRow>
                      )
                    }
                  })}
                </TableBody>
              </Table>
            </div> :
            <></>
          }
        </div>
      </div>
      <DraftDialog
        open={isDraftDialogOpen}
        onOpenChange={setIsDraftDialogOpen}
        leagues={leagues}
        teams={teamsDraft}
        currentTeamPlayers={playersTeam2}
        currentTeam={selectedTeams2}
        currentLeague={selectedLeague}
        draftablePlayers={playersTeamDraft}
        selectedLeagueDraft={selectedLeagueDraft}
        setSelectedLeagueDraft={setSelectedLeagueDraft}
        selectedTeamDraft={selectedTeamDraft}
        setSelectedTeamDraft={setSelectedTeamDraft}
        onSave={handleFetchSetPlayerDraft}
        draftActions={draftActions}
        setDraftActions={setDraftActions}
        handleFetchTeamsDraft={handleFetchTeamsDraft}
      />
    </div>
  );

};

export default FullSeasonVersion;
