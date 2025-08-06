import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

const FullSeasonVersion = ({ leagues, selectedLeague, setSelectedLeague, teams, selectedTeams1, setSelectedTeams1, selectedTeams2, setSelectedTeams2, error }) => {
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
                    {leagues.length>0 && leagues.map((league, index) => (
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
                      {teams.length>0 && teams.map((item, index) => (
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
                      {teams.length>0 && teams.map((item, index) => (
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
                  <RadioGroup defaultValue="schedule" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="schedule" id="r1" />
                      <Label htmlFor="r1">82/820/8200 Game Schedule</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="predict" id="r2" />
                      <Label htmlFor="r2">Predict Games</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="replay" id="r3" />
                      <Label htmlFor="r3">Replay Full League Season</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="border p-2 rounded-md bg-card text-card-foreground">
                  <RadioGroup defaultValue="both" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id="r4" />
                      <Label htmlFor="r4">Home</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="away" id="r5" />
                      <Label htmlFor="r5">Away</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="r6" />
                      <Label htmlFor="r6">Both</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="r7" />
                      <Label htmlFor="r7">Neutral</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="save-pbp" />
                  <label htmlFor="save-pbp" className="text-sm font-medium leading-none">
                    Save Play-by-Play (&lt;=100 games)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="save-box" defaultChecked />
                  <label htmlFor="save-box" className="text-sm font-medium leading-none">
                    Save Box Scores - no more than 15,000 games
                  </label>
                </div>
              </div>
              <Button variant="outline" disabled className="mt-4">PLAY GAMES</Button>
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
                        {selectedTeams1 && <TableRow><TableCell>{selectedTeams1.teams}</TableCell><TableCell className="text-right">0</TableCell></TableRow>}
                        {selectedTeams2 && <TableRow><TableCell>{selectedTeams2.teams}</TableCell><TableCell className="text-right">0</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FullSeasonVersion;