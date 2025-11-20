import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/utils';

interface ResultsSectionProps {
    gameList: any[];
    teamsSchedule: any[];
    selectedTeams2: any;
    keepPlayByPlay: string | null;
    handlePbpForGame: (gameNumber: string) => void;
    scheduleMultiplier: string;
    setScheduleMultiplier: (val: string) => void;
    setMultiplier: (val: number) => void;
    handleSchedule82: () => Promise<void>;
    setTeamsSchedule: (schedule: any[]) => void;
    teamLogos: { [key: string]: string };
    multiplier: number;
    rawStats: any[];
    boxScoreFullSeason: any[];
    isSimulating: boolean;
}

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ResultsSection: React.FC<ResultsSectionProps> = ({
    gameList,
    teamsSchedule,
    selectedTeams2,
    keepPlayByPlay,
    handlePbpForGame,
    scheduleMultiplier,
    setScheduleMultiplier,
    setMultiplier,
    handleSchedule82,
    setTeamsSchedule,
    teamLogos,
    multiplier,
    rawStats,
    boxScoreFullSeason,
    isSimulating,
}) => {
    const TeamLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => (
        logo ? <img src={logo} alt={`${name} Logo`} className="h-8 w-8 object-contain" /> : <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs">{name.substring(0, 3).toUpperCase()}</div>
    );

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Results & Schedule</CardTitle>
                <div className="flex gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" disabled={isSimulating} className={`${rawStats && rawStats.length <= 1 ? "" : "pulse-attention"}`}>{rawStats && rawStats.length <= 1 ? "Raw Stats" : "Raw Stats (!)"}</Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Raw Stats</SheetTitle>
                            </SheetHeader>
                            <div className="py-4">
                                {rawStats && rawStats.length > 0 ? (
                                    <pre className="text-sm">
                                        {rawStats.map(item => item.textlines).join('\n')}
                                    </pre>
                                ) : (
                                    <p>No box score data available.</p>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" disabled={isSimulating} className={`${boxScoreFullSeason && boxScoreFullSeason.length <= 1 ? "" : "pulse-attention"}`}>{boxScoreFullSeason && boxScoreFullSeason.length <= 1 ? "Show Box Score" : "Show Box Score (!)"}</Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Box Score</SheetTitle>
                            </SheetHeader>
                            <div className="py-4" >
                                {boxScoreFullSeason && boxScoreFullSeason.length > 0 ? (
                                    (() => {
                                        const games = boxScoreFullSeason.reduce((acc, item) => {
                                            const gameNum = item.game_number;
                                            if (!acc[gameNum]) {
                                                acc[gameNum] = [];
                                            }
                                            acc[gameNum].push(item.text);
                                            return acc;
                                        }, {} as Record<string, string[]>);

                                        return (Object.entries(games) as [string, string[]][]).map(([gameNum, lines]) => (
                                            <div key={gameNum} id={`game-${gameNum}`}>
                                                <pre className="text-sm">{lines.join('\n')}</pre>
                                            </div>
                                        ));
                                    })()
                                ) : (
                                    <p>No box score data available.</p>
                                )}
                            </div>
                            {boxScoreFullSeason && boxScoreFullSeason.length > 0 && (
                                <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">Go to Game</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
                                            {[...new Set(boxScoreFullSeason.map(item => item.game_number))].sort((a: any, b: any) => parseInt(a) - parseInt(b)).map((gameNum: any) => (
                                                <DropdownMenuItem key={gameNum} onSelect={() => {
                                                    const element = document.getElementById(`game-${gameNum}`);
                                                    if (element) {
                                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }
                                                }}>
                                                    Game {gameNum}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="games" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="games" style={{ border: "1px white solid" }}>Game List ({gameList.length})</TabsTrigger>
                        <TabsTrigger value="schedule" style={{ border: "1px white solid" }}>Schedule</TabsTrigger>
                    </TabsList>

                    <TabsContent value="games" className="space-y-4">
                        {gameList.length > 0 ? (
                            <>
                                <div className="flex justify-end">
                                    <Button variant="outline" size="sm" onClick={() => exportToCSV(gameList, `${selectedTeams2?.teams}_game_list.csv`)}>
                                        Export CSV
                                    </Button>
                                </div>
                                <div className="border rounded-md max-h-[500px] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[60px]">#</TableHead>
                                                <TableHead>Away</TableHead>
                                                <TableHead className="text-right">Score</TableHead>
                                                <TableHead className="text-center">vs</TableHead>
                                                <TableHead className="text-right">Score</TableHead>
                                                <TableHead>Home</TableHead>
                                                {keepPlayByPlay === "Y" && <TableHead className="w-[50px]">PBP</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {gameList.map((game, index) => (
                                                <TableRow key={game.game_number}>
                                                    <TableCell className="font-medium">{game.game_number}</TableCell>
                                                    <TableCell className="text-sm">{game.team_name1}</TableCell>
                                                    <TableCell className="text-right font-bold">{game.team1_score}</TableCell>
                                                    <TableCell className="text-center text-muted-foreground">@</TableCell>
                                                    <TableCell className="text-right font-bold">{game.team2_score}</TableCell>
                                                    <TableCell className="text-sm">{game.team_name2}</TableCell>
                                                    {keepPlayByPlay === "Y" && index < 100 && (
                                                        <TableCell>
                                                            <Button size="sm" variant="ghost" onClick={() => handlePbpForGame((index + 1).toString())}>
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border-2 border-dashed rounded-md">
                                <p>No games played yet.</p>
                                <p className="text-sm">Configure settings and click Play Games.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="schedule" className="space-y-4">
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            <Button
                                variant={!scheduleMultiplier ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    setScheduleMultiplier("");
                                    setTeamsSchedule([{ teams: "N/A", games: "0" }]);
                                }}
                            >
                                Zero
                            </Button>
                            <Button
                                variant={scheduleMultiplier === '82' ? 'default' : 'outline'}
                                size="sm"
                                disabled={!selectedTeams2}
                                onClick={async () => {
                                    setScheduleMultiplier("82");
                                    setMultiplier(100);
                                    await handleSchedule82();
                                }}
                            >
                                82
                            </Button>
                            <Button
                                variant={scheduleMultiplier === '820' ? 'default' : 'outline'}
                                size="sm"
                                disabled={!selectedTeams2}
                                onClick={async () => {
                                    setScheduleMultiplier("820");
                                    setMultiplier(10);
                                    await handleSchedule82();
                                }}
                            >
                                820
                            </Button>
                            <Button
                                variant={scheduleMultiplier === '8200' ? 'default' : 'outline'}
                                size="sm"
                                disabled={!selectedTeams2}
                                onClick={async () => {
                                    setScheduleMultiplier("8200");
                                    setMultiplier(1);
                                    await handleSchedule82();
                                }}
                            >
                                8200
                            </Button>
                        </div>

                        {teamsSchedule && teamsSchedule.length > 1 && selectedTeams2?.teams ? (
                            <div className="border rounded-md max-h-[400px] overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Team</TableHead>
                                            <TableHead className="text-right">Games</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teamsSchedule.map((item) => {
                                            if (item.teams !== selectedTeams2?.teams) {
                                                return (
                                                    <TableRow key={item.teams}>
                                                        <TableCell className="flex items-center gap-2">
                                                            <TeamLogo logo={teamLogos[item.teams]} name={item.teams} />
                                                            {item.teams}
                                                        </TableCell>
                                                        <TableCell className="text-right">{parseInt(item.games) / multiplier}</TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border-2 border-dashed rounded-md">
                                <p>No schedule generated.</p>
                                <p className="text-sm">Select a home team and schedule length.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default ResultsSection;
