
import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Loader2 } from 'lucide-react';

// Keep the existing interfaces from FullSeasonVersion.tsx
interface League {
  league_name: string;
}

interface Team {
  teams: string;
}

interface PlayerChar {
  name: string;
  positions: string;
  // Add other properties from PlayerChar as needed
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

interface DraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leagues: League[];
  teams: Team[];
  currentTeamPlayers: PlayerChar[];
  currentTeam: Team | null;
  currentLeague: League | null;
  draftablePlayers: PlayerChar[];
  selectedLeagueDraft: League | null;
  setSelectedLeagueDraft: (league: League | null) => void;
  selectedTeamDraft: Team | null;
  setSelectedTeamDraft: (team: Team | null) => void;
  onSave: () => Promise<void>;
  draftActions: DraftAction[];
  setDraftActions: React.Dispatch<React.SetStateAction<DraftAction[]>>;
  handleFetchTeamsDraft: () => void;
}

const DraftDialog: React.FC<DraftDialogProps> = ({
  open,
  onOpenChange,
  leagues,
  teams,
  currentTeamPlayers,
  currentTeam,
  currentLeague,
  draftablePlayers,
  selectedLeagueDraft,
  setSelectedLeagueDraft,
  selectedTeamDraft,
  setSelectedTeamDraft,
  onSave,
  draftActions,
  setDraftActions,
  handleFetchTeamsDraft,
}) => {
  const [draggedPlayer, setDraggedPlayer] = useState<PlayerChar | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedLeagueDraft) {
      handleFetchTeamsDraft();
    }
  }, [selectedLeagueDraft]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      onOpenChange(false);
    } finally {
      setIsSaving(false);
      setDraftActions([])
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    player: PlayerChar
  ) => {
    setDraggedPlayer(player);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(player));
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    targetPlayer: PlayerChar
  ) => {
    e.preventDefault();
    if (!draggedPlayer || !currentLeague || !currentTeam || !selectedLeagueDraft || !selectedTeamDraft) return;

    // Prevent dropping on the same list
    if (draftablePlayers.find(p => p.name === draggedPlayer.name)) {
        const newAction: DraftAction = {
            action: 'replace',
            original_league: currentLeague.league_name,
            original_team: currentTeam.teams,
            original_player: targetPlayer.name,
            new_player_league: selectedLeagueDraft.league_name,
            new_player_team: selectedTeamDraft.teams,
            new_player_name: draggedPlayer.name,
        };

        setDraftActions(prevActions => [...prevActions, newAction]);

        // Optimistically update UI
        // This is a simple replacement. You might want a more sophisticated state management
        const updatedPlayers = currentTeamPlayers.map(p =>
            p.name === targetPlayer.name ? { ...draggedPlayer, name: `${draggedPlayer.name} (Drafted)` } : p
        );
        // This optimistic update is visual only. The actual state `playersTeam2` is not changed here.
        // A more robust solution would involve lifting the state up or using a context.
    }

    setDraggedPlayer(null);
  };

  const displayedCurrentPlayers = useMemo(() => {
    return currentTeamPlayers.map(player => {
      const draftAction = draftActions.find(action => action.original_player === player.name);
      if (draftAction) {
        return { ...player, name: `${draftAction.new_player_name} (Drafted)` };
      }
      return player;
    });
  }, [currentTeamPlayers, draftActions]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Draft Players</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 flex-grow min-h-0">
          <div className="border p-2 rounded-md flex flex-col overflow-hidden">
            <h3 className="text-lg font-semibold mb-2 flex-shrink-0">{currentTeam?.teams}</h3>
            <div className="overflow-y-auto flex-grow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedCurrentPlayers.map(player => (
                    <TableRow
                      key={player.name}
                      onDragOver={handleDragOver}
                      onDrop={e => handleDrop(e, player)}
                      className="cursor-pointer"
                    >
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.positions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="border p-2 rounded-md flex flex-col overflow-hidden">
            <div className="flex flex-col md:flex-row gap-2 mb-2 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {selectedLeagueDraft ? selectedLeagueDraft.league_name : 'Select League'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="h-[200px] overflow-y-auto">
                  {leagues.map(league => (
                    <DropdownMenuItem
                      key={league.league_name}
                      onSelect={() => {
                        setSelectedLeagueDraft(league);
                        setSelectedTeamDraft(null); // Reset team when league changes
                      }}
                    >
                      {league.league_name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full" disabled={!selectedLeagueDraft}>
                    {selectedTeamDraft ? selectedTeamDraft.teams : 'Select Team'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="h-[200px] overflow-y-auto">
                  {teams.map(team => (
                    <DropdownMenuItem
                      key={team.teams}
                      onSelect={() => setSelectedTeamDraft(team)}
                    >
                      {team.teams}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="overflow-y-auto flex-grow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftablePlayers.map(player => (
                    <TableRow
                      key={player.name}
                      draggable
                      onDragStart={e => handleDragStart(e, player)}
                      className="cursor-grab"
                    >
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.positions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DraftDialog;
