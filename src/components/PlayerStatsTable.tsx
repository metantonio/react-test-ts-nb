import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface PlayerStats {
    name: string;
    pts: string;
    reb: string;
    ast: string;
    pf: string;
}

interface PlayerStatsTableProps {
    teamName: string;
    players: PlayerStats[];
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ teamName, players }) => {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mt-8 mb-4 text-center">{teamName} - Player Stats</h2>
            <Table className="border rounded-lg">
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                    <TableRow>
                        <TableHead className="font-bold">Player</TableHead>
                        <TableHead className="font-bold text-center">PTS</TableHead>
                        <TableHead className="font-bold text-center">REB</TableHead>
                        <TableHead className="font-bold text-center">AST</TableHead>
                        <TableHead className="font-bold text-center">PF</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {players.map((player, index) => (
                        <TableRow key={index} className="dark:hover:bg-gray-700">
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell className="text-center">{player.pts}</TableCell>
                            <TableCell className="text-center">{player.reb}</TableCell>
                            <TableCell className="text-center">{player.ast}</TableCell>
                            <TableCell className="text-center">{player.pf}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default PlayerStatsTable;
