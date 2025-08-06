
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomRadio from '../components/ui/CustomRadio';
import CustomCheckbox from '../components/ui/CustomCheckbox';

const SingleGameVersion = () => {
  // Dummy data based on the image
  const awayTeamStats = [
    { bs: 0, to: 2, st: 0, fls: 1, ast: 2, treb: 6, pts: 5, min: 24, player: 'Clint Capela', pf: 0, pos: 'C' },
    { bs: 0, to: 0, st: 1, fls: 2, ast: 2, treb: 7, pts: 7, min: 32, player: 'Saddiq Bey', pf: 0, pos: 'PF' },
    { bs: 0, to: 0, st: 1, fls: 1, ast: 5, treb: 5, pts: 16, min: 0, player: 'De Andre Hunter', pf: 1, pos: 'SF' },
    { bs: 0, to: 2, st: 3, fls: 2, ast: 5, treb: 5, pts: 24, min: 36, player: 'Dejounte Murray', pf: 3, pos: 'SG' },
    { bs: 0, to: 4, st: 0, fls: 3, ast: 9, treb: 4, pts: 34, min: 36, player: 'Trae Young', pf: 3, pos: 'PG' },
  ];

  const homeTeamStats = [
    { min: 31, pts: 10, treb: 8, ast: 2, pf: 0, player: 'Nic Claxton', pos: 'C', fls: 1, st: 1, to: 0, bs: 4 },
    { min: 27, pts: 5, treb: 4, ast: 4, pf: 2, player: 'Cameron Johnson', pos: 'PF', fls: 1, st: 0, to: 1, bs: 0 },
    { min: 27, pts: 13, ast: 4, treb: 5, pf: 1, player: 'Mikal Bridges', pos: 'SF', fls: 1, st: 2, to: 1, bs: 0 },
    { min: 36, pts: 13, ast: 4, treb: 4, pf: 4, player: 'Dorian Finney-Smith', pos: 'SG', fls: 1, st: 0, to: 1, bs: 0 },
    { min: 28, pts: 15, ast: 3, treb: 6, pf: 1, player: 'Dennis Schroder', pos: 'PG', fls: 3, st: 1, to: 2, bs: 0 },
  ];

  const playByPlayData = [
    { text: 'Nets coming downcourt...', color: 'text-blue-400' },
    { text: 'Mets bring the ball upcourt', color: 'text-blue-400' },
    { text: 'Dorian Finney-Smith heads downcourt, pass right side to Cameron Johnson.', color: 'text-red-400' },
    { text: 'Cameron Johnson lob pass to Dennis Schroder, dribbles up the floor.', color: 'text-red-400' },
    { text: 'Dennis Schroder cross wing to Mikal Bridges.', color: 'text-red-400' },
  ];

  const boxScoreData = `
23-24 Atlanta Hawks
AWAY
YEAR TEAM PLAYERS      POS HT   MIN  FG   3PFG  FT   REB      AST FLS DQ ST TO BS PTS IND
2324 ATL *Capela Clint C   6.10 24   2- 5  0- 0  1- 2  0- 6- 6  2   1   0  2  0  5  20
... (rest of the data)
  `;

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


  return (
    <div className="p-4 bg-background text-foreground text-xs">
      {/* Top Controls */}
      <div className="grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-2 flex flex-col gap-2">
          <Button size="sm">Start Game</Button>
          <Button size="sm">Actual Player Statistics</Button>
          <Button size="sm" disabled>Pause Game</Button>
        </div>
        <div className="col-span-2 border rounded-md p-2">
          <h3 className="font-bold text-center">Away Team</h3>
          <CustomRadio name="away-team-mode" value="manual" checked={awayTeamMode === 'manual'} onChange={setAwayTeamMode} label="Manual Pass" id="away-manual" />
          <CustomRadio name="away-team-mode" value="auto" checked={awayTeamMode === 'auto'} onChange={setAwayTeamMode} label="Auto Pass" id="away-auto" />
          <CustomRadio name="away-team-mode" value="computer" checked={awayTeamMode === 'computer'} onChange={setAwayTeamMode} label="Computer" id="away-computer" />
        </div>
        <div className="col-span-4">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">2023-24 Atlanta Hawks</TableHead>
                <TableHead>1</TableHead>
                <TableHead>2</TableHead>
                <TableHead>3</TableHead>
                <TableHead>4</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-24 Brooklyn Nets</TableCell>
                <TableCell>26</TableCell>
                <TableCell>28</TableCell>
                <TableCell>28</TableCell>
                <TableCell>38</TableCell>
                <TableCell className="text-right">120</TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>31</TableCell>
                <TableCell>27</TableCell>
                <TableCell>35</TableCell>
                <TableCell>25</TableCell>
                <TableCell className="text-right">118</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="col-span-2 border rounded-md p-2">
          <h3 className="font-bold text-center">Home Team</h3>
          <CustomRadio name="home-team-mode" value="manual" checked={homeTeamMode === 'manual'} onChange={setHomeTeamMode} label="Manual Pass" id="home-manual" />
          <CustomRadio name="home-team-mode" value="auto" checked={homeTeamMode === 'auto'} onChange={setHomeTeamMode} label="Auto Pass" id="home-auto" />
          <CustomRadio name="home-team-mode" value="computer" checked={homeTeamMode === 'computer'} onChange={setHomeTeamMode} label="Computer" id="home-computer" />
        </div>
        <div className="col-span-2 border rounded-md p-2">
          <h3 className="font-bold text-center">Pause Options</h3>
          <CustomRadio name="pause-options" value="each-line" checked={pauseOptions === 'each-line'} onChange={setPauseOptions} label="Pause after each line" id="pause-line" />
          <CustomRadio name="pause-options" value="each-possession" checked={pauseOptions === 'each-possession'} onChange={setPauseOptions} label="Pause after each possession" id="pause-possession" />
          <CustomRadio name="pause-options" value="end-of-quarter" checked={pauseOptions === 'end-of-quarter'} onChange={setPauseOptions} label="Pause after end of quarter" id="pause-quarter" />
          <CustomRadio name="pause-options" value="do-not-pause" checked={pauseOptions === 'do-not-pause'} onChange={setPauseOptions} label="Do not pause" id="pause-none" />
        </div>
        <div className="col-start-11 col-span-2">
            <Button size="sm" className="w-full">Reset Game</Button>
        </div>
      </div>

      {/* Main Scoreboard and Display Options */}
      <div className="grid grid-cols-12 gap-4 mb-2 p-2 border rounded-md">
        <div className="col-span-3 flex flex-col items-center">
            <div className="font-bold text-lg">Away Team</div>
            <div className="text-5xl font-bold text-red-500">120</div>
            <div className="flex gap-4">
                <span>Fouls: 3</span>
                <span>Possessions: 0</span>
            </div>
        </div>
        <div className="col-span-6 text-center">
            <div className="text-2xl font-bold">0:00</div>
            <div className="text-lg">Qtr 4</div>
            <div className="flex items-center justify-center gap-2 mt-2">
                <Select defaultValue="PRO2023-24">
                    <SelectTrigger className="w-[150px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PRO2023-24">PRO2023-24</SelectItem>
                    </SelectContent>
                </Select>
                <span className="font-bold">YEAR</span>
                <Select defaultValue="23-24 Atlanta Hawks">
                    <SelectTrigger className="w-[200px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="23-24 Atlanta Hawks">23-24 Atlanta Hawks</SelectItem>
                        <SelectItem value="23-24 Brooklyn Nets">23-24 Brooklyn Nets</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="col-span-3 flex flex-col items-center">
            <div className="font-bold text-lg">Home Team</div>
            <div className="text-5xl font-bold text-blue-500">118</div>
            <div className="flex gap-4">
                <span>Possessions: 0</span>
                <span>Fouls: 4</span>
            </div>
        </div>
        <div className="col-span-3">
            <Button className="w-full" size="sm">Away Team Sub Pattern</Button>
        </div>
        <div className="col-span-3 col-start-10">
            <Button className="w-full" size="sm">Home Team Sub Pattern</Button>
        </div>
        <div className="col-span-3 col-start-5">
            <Button className="w-full" size="sm">Subs/Defense</Button>
        </div>
        <div className="col-span-3 col-start-10 flex items-center gap-4">
            <div className="border rounded p-1">
                <h3 className="font-bold">Display Options</h3>
                <CustomRadio name="display-options" value="play-by-play" checked={displayOptions === 'play-by-play'} onChange={setDisplayOptions} label="Play by Play" id="disp-pbp" />
                <CustomRadio name="display-options" value="box-score" checked={displayOptions === 'box-score'} onChange={setDisplayOptions} label="Box Score" id="disp-box" />
                <CustomRadio name="display-options" value="both" checked={displayOptions === 'both'} onChange={setDisplayOptions} label="Both" id="disp-both" />
            </div>
            <div>
                <CustomCheckbox id="check-pbp" checked={showPlayByPlay} onChange={setShowPlayByPlay} label="Play by Play" />
                <CustomCheckbox id="check-box" checked={showBoxScore} onChange={setShowBoxScore} label="Box Score" />
                <CustomCheckbox id="check-court" checked={showCourtStats} onChange={setShowCourtStats} label="Court/stats" />
                <CustomCheckbox id="check-score" checked={showTheScore} onChange={setShowTheScore} label="the score" />
            </div>
             <div>
                <CustomCheckbox id="check-enhanced" checked={enhancedPBP} onChange={setEnhancedPBP} label="Enhanced PBP" />
            </div>
        </div>
      </div>

      {/* Player Stats Tables */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Table className="border">
          <TableHeader>
            <TableRow>
              {['BS', 'TO', 'ST', 'FLS', 'AST', 'TREB', 'PTS', 'MIN', 'Player', 'PF', 'POS'].map(h => <TableHead key={h}>{h}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {awayTeamStats.map((p, i) => (
              <TableRow key={i}>
                <TableCell>{p.bs}</TableCell>
                <TableCell>{p.to}</TableCell>
                <TableCell>{p.st}</TableCell>
                <TableCell>{p.fls}</TableCell>
                <TableCell>{p.ast}</TableCell>
                <TableCell>{p.treb}</TableCell>
                <TableCell>{p.pts}</TableCell>
                <TableCell>{p.min}</TableCell>
                <TableCell className="w-[120px]">{p.player}</TableCell>
                <TableCell>{p.pf}</TableCell>
                <TableCell>{p.pos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table className="border">
          <TableHeader>
            <TableRow>
              {['Player', 'PF', 'POS', 'MIN', 'PTS', 'TREB', 'AST', 'FLS', 'ST', 'TO', 'BS'].map(h => <TableHead key={h}>{h}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {homeTeamStats.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="w-[120px]">{p.player}</TableCell>
                <TableCell>{p.pf}</TableCell>
                <TableCell>{p.pos}</TableCell>
                <TableCell>{p.min}</TableCell>
                <TableCell>{p.pts}</TableCell>
                <TableCell>{p.treb}</TableCell>
                <TableCell>{p.ast}</TableCell>
                <TableCell>{p.fls}</TableCell>
                <TableCell>{p.st}</TableCell>
                <TableCell>{p.to}</TableCell>
                <TableCell>{p.bs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex gap-1">
            {['20', 'T-out', 'HC', 'R', 'PG', 'SG', 'SF', 'PF', 'C'].map(b => <Button key={b} variant="outline" size="sm">{b}</Button>)}
        </div>
        <div className="flex items-center gap-2">
            <span>Continue Game</span>
            <Button size="sm">Yes</Button>
            <Button size="sm">No</Button>
        </div>
        <CustomCheckbox id="midline-scroll" checked={midlineScroll} onChange={setMidlineScroll} label="Mid-line scroll" />
      </div>

      {/* Play-by-Play and Box Score */}
      <div className="grid grid-cols-2 gap-2 h-64">
        <div className="border rounded-md p-2 overflow-y-auto bg-gray-800">
            {playByPlayData.map((p, i) => <p key={i} className={p.color}>{p.text}</p>)}
        </div>
        <div className="border rounded-md p-2 overflow-y-auto bg-gray-800">
            <pre className="text-white">{boxScoreData}</pre>
        </div>
      </div>
    </div>
  );
};

export default SingleGameVersion;
