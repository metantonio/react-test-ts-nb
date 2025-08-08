import React, { useState, useEffect } from 'react';
import CustomRadio from '../components/ui/CustomRadio';
import CustomCheckbox from '../components/ui/CustomCheckbox';
import { Label } from '@/components/ui/label';
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
import { Loader2 } from 'lucide-react';

interface League {
  league_name: string;
}

interface Team {
  teams: string;
}

interface BoxScore {
  box_line: string;
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
}

interface FullSeasonVersionProps {
  leagues: League[];
  selectedLeague: League | null;
  setSelectedLeague: React.Dispatch<React.SetStateAction<League | null>>;
  teams: Team[];
  selectedTeams1: Team | null;
  setSelectedTeams1: React.Dispatch<React.SetStateAction<Team | null>>;
  selectedTeams2: Team | null;
  setSelectedTeams2: React.Dispatch<React.SetStateAction<Team | null>>;
  error: string | null;
  isLoading: boolean;
  boxScore: BoxScore[];
  setBoxScore: React.Dispatch<React.SetStateAction<BoxScore[]>>;
  playersTeam1: PlayerChar[];
  playersTeam2: PlayerChar[];
  handleFetchScoreBoard: () => Promise<void>;
  handleFetchPlayByPlay: () => Promise<void>;
  handleFetchBoxScore: () => Promise<void>;
  teamLogos: { [key: string]: string };
}

const FullSeasonVersion: React.FC<FullSeasonVersionProps> = (
  { leagues,
    selectedLeague,
    setSelectedLeague,
    teams,
    selectedTeams1,
    setSelectedTeams1,
    selectedTeams2,
    setSelectedTeams2,
    error,
    isLoading,
    boxScore,
    setBoxScore,
    playersTeam1,
    playersTeam2,
    handleFetchScoreBoard,
    handleFetchPlayByPlay,
    handleFetchBoxScore,
    teamLogos
  }
) => {
  const [schedule, setSchedule] = useState('schedule');
  const [location, setLocation] = useState('both');
  const [savePbp, setSavePbp] = useState(false);
  const [saveBox, setSaveBox] = useState(true);
  const [isClear, setIsClear] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false);

  const TeamLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => (
    logo ? <img src={logo} alt={`${name} Logo`} className="h-14 w-14 object-contain" /> : <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">{name.substring(0, 3).toUpperCase()}</div>
  );

  useEffect(()=>{
    console.log("should reset all")
  }, [isClear])

  const handlePlayGames = async () => {
    setIsSimulating(true);
    await handleFetchScoreBoard();
    await handleFetchPlayByPlay();
    await handleFetchBoxScore();
    setIsSimulating(false);
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 border-b-2 border-border pb-2">
        <Button variant="outline" size="sm">Game Setup</Button>
        <Button variant="outline" size="sm">Raw Stats</Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" disabled={isSimulating}>{boxScore.length === 0 ? "Show Box Score" : "Show Box Score (!)"}</Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Box Score</SheetTitle>
            </SheetHeader>
            <div className="py-4" >
              {boxScore.length > 0 ? (
                <pre className="text-sm">{boxScore.map((item: any) => item.box_line).join('\n')}</pre>
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

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setSelectedLeague(null)
                  setSelectedTeams1(null)
                  setSelectedTeams2(null)
                  setBoxScore([])
                  setIsClear(!isClear)
                }}>Clear</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={leagues.length === 0}>
                      {selectedLeague ? selectedLeague.league_name : "Choose League"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                    {leagues.length > 0 && leagues.map((league: any) => (
                      <DropdownMenuItem key={league.league_name} onSelect={() => setSelectedLeague(league)}>
                        {league.league_name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {selectedLeague ? <div className="mt-2">
                <label className="text-sm font-medium">Team</label>
                <div className="flex gap-2 mt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={teams.length === 0}>
                        {selectedTeams1 ? selectedTeams1.teams : "Select Away Team"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                      {teams.length > 0 && teams.map((item: any) => (
                        <DropdownMenuItem key={item.teams} onSelect={() => setSelectedTeams1(item)}>
                          {item.teams}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={teams.length === 0}>
                        {selectedTeams2 ? selectedTeams2.teams : "Select Home Team"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                      {teams.length > 0 && teams.map((item: any) => (
                        <DropdownMenuItem key={item.teams} onSelect={() => setSelectedTeams2(item)}>
                          {item.teams}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div> : <></>}
              {selectedLeague && (selectedTeams1 || selectedTeams2) ? <>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="outline" disabled>Substitution Pattern</Button>
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
                              <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams1?.teams}</h2>
                              <div className="overflow-x-auto h-[500px] overflow-y-auto">
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
                                      <TableHead className="h-10">Deny Fact</TableHead>
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
                                        <TableCell className="h-10">{player.deny_fact}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          )}

                          {playersTeam2.length > 1 && (
                            <div className="w-full l:w-1/1">
                              <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams2?.teams}</h2>
                              <div className="overflow-x-auto h-[500px] overflow-y-auto">
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
                                      <TableHead className="h-10">Deny Fact</TableHead>
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
                                        <TableCell className="h-10">{player.deny_fact}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    </SheetContent>
                  </Sheet>
                  <Button variant="outline" disabled>Draft Players</Button>
                  <Button variant="outline" disabled>Change Player Characteristics</Button>

                </div>

                <div className="flex gap-4 mt-4">
                  <div className="border p-2 rounded-md bg-card text-card-foreground">
                    <div className="flex flex-col space-y-1">
                      <CustomRadio name="schedule" value="schedule" checked={schedule === 'schedule'} onChange={setSchedule} label="82/820/8200 Game Schedule" id="r1" />
                      <CustomRadio name="schedule" value="predict" checked={schedule === 'predict'} onChange={setSchedule} label="Predict Games" id="r2" />
                      <CustomRadio name="schedule" value="replay" checked={schedule === 'replay'} onChange={setSchedule} label="Replay Full League Season" id="r3" />
                    </div>
                  </div>
                  <div className="border p-2 rounded-md bg-card text-card-foreground">
                    <div className="flex flex-col space-y-1">
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
                <Button variant="outline" disabled={isLoading || isSimulating} className="mt-4" onClick={handlePlayGames}>
                  {isSimulating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  PLAY GAMES
                </Button>
              </> : <></>}

            </div>
          </div>
        </div>

        <div className="col-span-1">
          <Button variant="outline" className="w-full">Zero Schedule</Button>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button variant="outline">82 Games</Button>
            <Button variant="outline">820 Games</Button>
            <Button variant="outline">8200 Games</Button>
          </div>
          <div className="mt-2 border rounded-md max-h-96 overflow-y-auto bg-card text-card-foreground">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TEAM NAME</TableHead>
                  <TableHead className="text-right">0</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                        {selectedTeams1 && <TableRow><TableCell><div className="flex items-center justify-center gap-2"><TeamLogo logo={teamLogos[selectedTeams1?.teams || '']} name={selectedTeams1?.teams || 'Away'} /><span>{selectedTeams1.teams}</span></div></TableCell><TableCell className="text-center align-middle">0</TableCell></TableRow>}
                        {selectedTeams2 && <TableRow><TableCell><div className="flex items-center justify-center gap-2"><TeamLogo logo={teamLogos[selectedTeams2?.teams || '']} name={selectedTeams2?.teams || 'Home'} /><span>{selectedTeams2.teams}</span></div></TableCell><TableCell className="text-center align-middle">0</TableCell></TableRow>}
                    </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );

};

export default FullSeasonVersion;