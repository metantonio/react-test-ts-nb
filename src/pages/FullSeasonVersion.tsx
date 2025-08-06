import React, { useState } from 'react';
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




const FullSeasonVersion = (
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
    isGameInitial,
    setIsGameInitial,
    playByPlay,
    setPlayByPlay,
    boxScore,
    setBoxScore,
    playersTeam1,
    setPlayersTeam1,
    playersTeam2,
    setPlayersTeam2,
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

  const TeamLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => (
    logo ? <img src={logo} alt={`${name} Logo`} className="h-14 w-14 object-contain" /> : <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">{name.substring(0, 3).toUpperCase()}</div>
  );

  return (
    <div>
      <div className="flex gap-2 mb-4 border-b-2 border-border pb-2">
        <Button variant="outline" size="sm">Game Setup</Button>
        <Button variant="outline" size="sm">Raw Stats</Button>
        <Button variant="outline" size="sm">Raw Box Scores</Button>
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
                <Button variant="outline">Clear</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={leagues.length === 0}>
                      {selectedLeague ? selectedLeague.league_name : "Choose League"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                    {leagues.length > 0 && leagues.map((league, index) => (
                      <DropdownMenuItem key={index} onSelect={() => setSelectedLeague(league)}>
                        {league.league_name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2">
                <label className="text-sm font-medium">Team</label>
                <div className="flex gap-2 mt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={teams.length === 0}>
                        {selectedTeams1 ? selectedTeams1.teams : "Select Away Team"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                      {teams.length > 0 && teams.map((item, index) => (
                        <DropdownMenuItem key={index} onSelect={() => setSelectedTeams1(item)}>
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
                      {teams.length > 0 && teams.map((item, index) => (
                        <DropdownMenuItem key={index} onSelect={() => setSelectedTeams2(item)}>
                          {item.teams}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" disabled>Substitution Pattern</Button>
                <Button variant="outline">Actual Player Statistics</Button>
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
              <Button variant="outline" disabled={isLoading} className="mt-4" onClick={() => {
                handleFetchScoreBoard()
                handleFetchPlayByPlay()
                handleFetchBoxScore()

              }}>PLAY GAMES</Button>
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
                {selectedTeams1 && <TableRow><TableCell> <TeamLogo logo={teamLogos[selectedTeams1?.teams || '']} name={selectedTeams1?.teams || 'Away'} />{selectedTeams1.teams}</TableCell><TableCell className="text-right">0</TableCell></TableRow>}
                {selectedTeams2 && <TableRow><TableCell><TeamLogo logo={teamLogos[selectedTeams2?.teams || '']} name={selectedTeams2?.teams || 'Home'} />{selectedTeams2.teams}</TableCell><TableCell className="text-right">0</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullSeasonVersion;