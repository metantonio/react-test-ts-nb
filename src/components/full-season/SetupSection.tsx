import React from 'react';
import HelpModal from '@/components/ui/HelpModal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SetupSectionProps {
    leagues: any[];
    selectedLeague: any;
    setSelectedLeague: (league: any) => void;
    teams: any[];
    selectedTeams1: any;
    setSelectedTeams1: (team: any) => void;
    selectedTeams2: any;
    setSelectedTeams2: (team: any) => void;
    getAlts: any[];
    getAltsSelected: string | null;
    setGetAltsSelected: (alt: string) => void;
    schedule: string | null;
    onClear: () => void;
}

const SetupSection: React.FC<SetupSectionProps> = ({
    leagues,
    selectedLeague,
    setSelectedLeague,
    teams,
    selectedTeams1,
    setSelectedTeams1,
    selectedTeams2,
    setSelectedTeams2,
    getAlts,
    getAltsSelected,
    setGetAltsSelected,
    schedule,
    onClear,
}) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span>1. Game Setup</span>
                        <HelpModal title="Game Setup" contentKey="gameSetup" />
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
                        Reset All
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* League Selection */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Select League</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={`w-full justify-between ${!selectedLeague ? 'border-primary/50 pulse-attention' : ''}`}>
                                {selectedLeague ? selectedLeague.league_name : "Choose League..."}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
                            {leagues?.map((league) => (
                                <DropdownMenuItem key={league.league_name} onSelect={() => setSelectedLeague(league)}>
                                    {league.league_name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Team Selection */}
                {selectedLeague && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {schedule !== '8200' && (
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Away Team</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className={`${selectedTeams1 ? "w-full justify-between" : "w-full justify-between pulse-attention"}`}>
                                            {selectedTeams1 ? selectedTeams1.teams : "Select Away Team..."}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                                        {teams.map((team) => (
                                            <DropdownMenuItem key={`away-${team.teams}`} onSelect={() => setSelectedTeams1(team)}>
                                                {team.teams}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Home Team</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className={`${selectedTeams2 ? "w-full justify-between" : "w-full justify-between pulse-attention"}`}>
                                        {selectedTeams2 ? selectedTeams2.teams : "Select Home Team..."}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                                    {teams.map((team) => (
                                        <DropdownMenuItem key={`home-${team.teams}`} onSelect={() => setSelectedTeams2(team)}>
                                            {team.teams}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                )}

                {/* Alt Subs Selection */}
                {selectedLeague && selectedTeams2 && getAlts.length > 0 && (
                    <div className="flex flex-col space-y-2 pt-2 border-t">
                        <label className="text-sm font-medium text-muted-foreground">Substitution Pattern (Home Team)</label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {getAltsSelected || "Default Pattern"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                                {getAlts.map((item) => (
                                    <DropdownMenuItem key={item.alt_sub} onSelect={() => setGetAltsSelected(item.alt_sub)}>
                                        {item.alt_sub}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SetupSection;
