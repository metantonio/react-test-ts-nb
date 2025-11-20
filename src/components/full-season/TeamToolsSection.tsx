import React from 'react';
import HelpModal from '@/components/ui/HelpModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Users, Edit, FileText, BarChart2, Trash2 } from 'lucide-react';
import SubstitutionPatternSheet from '@/components/SubstitutionPatternSheet';
import PlayerStatsEditor, { EditablePlayerStats } from '@/components/PlayerStatsEditor';
import { exportToCSV } from '@/lib/utils';

interface PlayerSubPattern {
    pos1: string;
    pos2: string;
    pos3: string;
    pos4: string;
    pos5: string;
}

interface TeamToolsSectionProps {
    selectedLeague: any;
    selectedTeams1: any;
    selectedTeams2: any;
    playersTeam1: any[];
    playersTeam2: any[];
    availablePlayers: any[];
    isSubPatternSheetOpen: boolean;
    setIsSubPatternSheetOpen: (open: boolean) => void;
    isFetchingSubPattern: boolean;
    handleSubPatternClick: () => void;
    playerSubPattern: PlayerSubPattern[] | null;
    setPlayerSubPattern: React.Dispatch<React.SetStateAction<PlayerSubPattern[] | null>>;
    handleFetchSetPlayerSubpattern: () => Promise<void | null>;
    isStatsEditorOpen: boolean;
    setIsStatsEditorOpen: (open: boolean) => void;
    handleStatsEditorClick: () => void;
    isFetchingStats: boolean;
    editablePlayers: EditablePlayerStats[];
    handleSavePlayerStats: (players: EditablePlayerStats[]) => Promise<void>;
    setIsDraftDialogOpen: (open: boolean) => void;
    onResetLeague: () => Promise<void>;
}

const TeamToolsSection: React.FC<TeamToolsSectionProps> = ({
    selectedLeague,
    selectedTeams1,
    selectedTeams2,
    playersTeam1,
    playersTeam2,
    availablePlayers,
    isSubPatternSheetOpen,
    setIsSubPatternSheetOpen,
    isFetchingSubPattern,
    handleSubPatternClick,
    playerSubPattern,
    setPlayerSubPattern,
    handleFetchSetPlayerSubpattern,
    isStatsEditorOpen,
    setIsStatsEditorOpen,
    handleStatsEditorClick,
    isFetchingStats,
    editablePlayers,
    handleSavePlayerStats,
    setIsDraftDialogOpen,
    onResetLeague,
}) => {
    const [isResetting, setIsResetting] = React.useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);

    const handleResetConfirm = async () => {
        setIsResetting(true);
        try {
            await onResetLeague();
            setIsResetDialogOpen(false);
        } catch (error) {
            console.error("Failed to reset league:", error);
        } finally {
            setIsResetting(false);
        }
    };

    if (!selectedLeague || (!selectedTeams1 && !selectedTeams2)) {
        return (
            <Card className="w-full opacity-50 pointer-events-none">
                <CardHeader>
                    <CardTitle>2. Team Tools</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Select teams to enable tools.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span>2. Team Tools</span>
                        <HelpModal title="Full Season Simulation" contentKey="fullSeason" />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                {/* Substitution Pattern */}
                <Sheet open={isSubPatternSheetOpen} onOpenChange={setIsSubPatternSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={handleSubPatternClick} disabled={isFetchingSubPattern || !selectedTeams2}>
                            <Users className="h-6 w-6" />
                            <span className="text-xs">Sub Pattern</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="max-w-none w-[100vw] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>4 Minute Substitution Pattern - {selectedTeams2?.teams}</SheetTitle>
                        </SheetHeader>
                        <SubstitutionPatternSheet
                            isFetching={isFetchingSubPattern}
                            playerSubPattern={playerSubPattern}
                            setPlayerSubPattern={setPlayerSubPattern}
                            availablePlayers={availablePlayers}
                            selectedTeam={selectedTeams2}
                            onSetPattern={handleFetchSetPlayerSubpattern}
                        />
                    </SheetContent>
                </Sheet>

                {/* Player Stats Editor */}
                <Sheet open={isStatsEditorOpen} onOpenChange={setIsStatsEditorOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={handleStatsEditorClick} disabled={isFetchingStats || !selectedTeams2}>
                            <Edit className="h-6 w-6" />
                            <span className="text-xs">Edit Stats</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="max-w-none w-[100vw] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Edit Player Characteristics</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                            {isFetchingStats ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : (
                                <PlayerStatsEditor
                                    players={editablePlayers}
                                    teamName={selectedTeams2?.teams || ''}
                                    onSave={handleSavePlayerStats}
                                    isLoading={isFetchingStats}
                                />
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Draft Dialog Trigger */}
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setIsDraftDialogOpen(true)}>
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">Draft</span>
                </Button>

                {/* View Actual Stats */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                            <BarChart2 className="h-6 w-6" />
                            <span className="text-xs">View Stats</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto max-w-[90vw] w-full">
                        <SheetHeader>
                            <SheetTitle>Actual Player Statistics</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col xl:flex-row gap-4 mt-8">
                            {/* Team 1 Stats */}
                            {playersTeam1.length > 0 && (
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold">{selectedTeams1?.teams}</h3>
                                        <Button variant="ghost" size="sm" onClick={() => exportToCSV(playersTeam1, `${selectedTeams1?.teams}_stats.csv`)}>Export CSV</Button>
                                    </div>
                                    <div className="border rounded-md overflow-hidden">
                                        <div className="max-h-[400px] overflow-y-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Pos</TableHead>
                                                        <TableHead>Min/G</TableHead>
                                                        <TableHead>Pts/G</TableHead>
                                                        <TableHead>FG%</TableHead>
                                                        <TableHead>3P%</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {playersTeam1.map((p) => (
                                                        <TableRow key={p.name}>
                                                            <TableCell>{p.name}</TableCell>
                                                            <TableCell>{p.positions}</TableCell>
                                                            <TableCell>{p.ming}</TableCell>
                                                            <TableCell>{p.ptsg}</TableCell>
                                                            <TableCell>{p.fgpct}</TableCell>
                                                            <TableCell>{p.threeptfgpct}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Team 2 Stats */}
                            {playersTeam2.length > 0 && (
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold">{selectedTeams2?.teams}</h3>
                                        <Button variant="ghost" size="sm" onClick={() => exportToCSV(playersTeam2, `${selectedTeams2?.teams}_stats.csv`)}>Export CSV</Button>
                                    </div>
                                    <div className="border rounded-md overflow-hidden">
                                        <div className="max-h-[400px] overflow-y-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Pos</TableHead>
                                                        <TableHead>Min/G</TableHead>
                                                        <TableHead>Pts/G</TableHead>
                                                        <TableHead>FG%</TableHead>
                                                        <TableHead>3P%</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {playersTeam2.map((p) => (
                                                        <TableRow key={p.name}>
                                                            <TableCell>{p.name}</TableCell>
                                                            <TableCell>{p.positions}</TableCell>
                                                            <TableCell>{p.ming}</TableCell>
                                                            <TableCell>{p.ptsg}</TableCell>
                                                            <TableCell>{p.fgpct}</TableCell>
                                                            <TableCell>{p.threeptfgpct}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>


            </CardContent>
            <CardContent className="grid grid-cols-1 gap-3">
                {/* Reset League Button */}
                <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="h-auto py-4 flex flex-col gap-2">
                            <Trash2 className="h-6 w-6" />
                            <span className="text-xs">Reset League</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your current league progress and reset all player data to default values.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
                            <Button
                                variant="destructive"
                                onClick={handleResetConfirm}
                                disabled={isResetting}
                            >
                                {isResetting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    'Continue'
                                )}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
};

export default TeamToolsSection;
