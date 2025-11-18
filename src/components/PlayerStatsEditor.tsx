import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

export interface EditablePlayerStats {
    name: string;
    position: string;
    poss_fact: string;
    two_pt_fg_pct: string;
    three_pt_fg_pct: string;
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
    [key: string]: string | undefined;
}

interface PlayerStatsEditorProps {
    players: EditablePlayerStats[];
    teamName: string;
    onSave: (updatedPlayers: EditablePlayerStats[]) => Promise<void>;
    isLoading: boolean;
}

const PlayerStatsEditor: React.FC<PlayerStatsEditorProps> = ({
    players,
    teamName,
    onSave,
    isLoading,
}) => {
    const [editedPlayers, setEditedPlayers] = useState<EditablePlayerStats[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditedPlayers(players);
    }, [players]);

    const handleInputChange = (index: number, field: string, value: string) => {
        const updatedPlayers = [...editedPlayers];
        updatedPlayers[index] = {
            ...updatedPlayers[index],
            [field]: value,
        };
        setEditedPlayers(updatedPlayers);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(editedPlayers);
        setIsSaving(false);
    };

    const editableFields = [
        { key: 'poss_fact', label: 'Poss Fact' },
        { key: 'two_pt_fg_pct', label: '2Pt FG%' },
        { key: 'three_pt_fg_pct', label: '3Pt FG%' },
        { key: 'three_pt_pct_shot', label: '3Pt Shot%' },
        { key: 'ft_pct', label: 'FT%' },
        { key: 'pct_shot', label: '% Shot' },
        { key: 'pct_fouled', label: '% Fouled' },
        { key: 'pct_to', label: '% TO' },
        { key: 'pct_pass', label: '% Pass' },
        { key: 'off_reb', label: 'Off Reb' },
        { key: 'def_reb', label: 'Def Reb' },
        { key: 'def_fg_pct', label: 'Def FG%' },
        { key: 'pct_pf', label: '% PF' },
        { key: 'pct_st', label: '% ST' },
        { key: 'pct_bs', label: '% BS' },
        { key: 'deny_fact', label: 'Deny Fact' },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{teamName} - Edit Player Characteristics</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(editedPlayers, `${teamName}_editable_stats.csv`)}>
                        Export to CSV
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading || isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="border rounded-md overflow-x-auto">
                <div className="h-[600px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px] sticky left-0 bg-background z-10">Name</TableHead>
                                <TableHead className="w-[80px]">Pos</TableHead>
                                {editableFields.map((field) => (
                                    <TableHead key={field.key} className="w-[100px] text-center">
                                        {field.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {editedPlayers.map((player, index) => (
                                <TableRow key={player.name}>
                                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                                        {player.name}
                                    </TableCell>
                                    <TableCell>{player.positions || player.position}</TableCell>
                                    {editableFields.map((field) => (
                                        <TableCell key={field.key} className="p-1">
                                            <Input
                                                className="h-8 w-full text-center px-1"
                                                value={player[field.key] || ''}
                                                onChange={(e) => handleInputChange(index, field.key, e.target.value)}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default PlayerStatsEditor;
