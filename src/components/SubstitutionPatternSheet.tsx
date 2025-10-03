import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from '@/lib/utils';
import CustomCheckbox from './ui/CustomCheckbox';

interface PlayerSubPattern {
  pos1: string;
  pos2: string;
  pos3: string;
  pos4: string;
  pos5: string;
}

interface PlayerChar {
  name: string;
  positions: string;
  height: string;
  [key: string]: any;
}

interface Team {
  teams: string;
}

interface SubstitutionPatternSheetProps {
  isFetching: boolean;
  playerSubPattern: PlayerSubPattern[] | null;
  setPlayerSubPattern: React.Dispatch<React.SetStateAction<PlayerSubPattern[] | null>>;
  playersTeam2: PlayerChar[];
  selectedTeam: Team | null;
  onSetPattern: () => Promise<void | null>;
}

const SubstitutionPatternSheet: React.FC<SubstitutionPatternSheetProps> = ({
  isFetching,
  playerSubPattern,
  setPlayerSubPattern,
  playersTeam2,
  selectedTeam,
  onSetPattern,
}) => {
  const { toast } = useToast();
  const [allowAnyPosition, setAllowAnyPosition] = useState(false);

  const positions: { key: keyof PlayerSubPattern, label: string }[] = [
    { key: 'pos1', label: 'C' }, { key: 'pos2', label: 'PF' }, { key: 'pos3', label: 'SF' }, { key: 'pos4', label: 'SG' }, { key: 'pos5', label: 'PG' },
  ];

  const handleDrop = (e: React.DragEvent, intervalIndex: number, posKey: keyof PlayerSubPattern) => {
    const playerDataJSON = e.dataTransfer.getData("player_data");
    if (!playerDataJSON || !playerSubPattern) return;

    const { name: playerName, position: playerPosition } = JSON.parse(playerDataJSON);

    const currentIntervalPattern = playerSubPattern[intervalIndex];

    const isDuplicate = Object.values(currentIntervalPattern).some(
      (name) => name === playerName
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Player",
        description: `Player ${playerName} is already in this 4-minute pattern.`,
        variant: "destructive",
      });
      return;
    }

    if (!allowAnyPosition) {
      const targetPosition = positions.find(p => p.key === posKey)?.label;
      if (targetPosition && !playerPosition.includes(targetPosition)) {
          toast({
              title: "Invalid Position",
              description: `Player ${playerName} (${playerPosition}) cannot be placed in the ${targetPosition} slot.`,
              variant: "destructive",
          });
          return;
      }
  }

    const newPlayerSubPattern = [...playerSubPattern];
    newPlayerSubPattern[intervalIndex] = {
      ...newPlayerSubPattern[intervalIndex],
      [posKey]: playerName,
    };
    setPlayerSubPattern(newPlayerSubPattern);
  };

  return (
    <div className="flex gap-2 mt-4 text-xs">
      {isFetching ? (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="mt-2">Loading player substitution data...</p>
        </div>
      ) : (
        <>
          <div className="overflow-auto pr-2" style={{ height: 'calc(100vh - 150px)' }}>
          <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeam?.teams}</h2>
              <div className="flex items-center gap-4">
                  <CustomCheckbox
                      id="allow-any-position"
                      checked={allowAnyPosition}
                      onChange={setAllowAnyPosition}
                      label="Allow any position"
                  />
                  <Button variant="default" size="sm" onClick={() => exportToCSV(playerSubPattern || [], `${selectedTeam?.teams}_4min_sub_pattern.csv`)}>Print</Button>
                  <Button variant="default" size="sm" onClick={onSetPattern}>Set Pattern</Button>
              </div>
            </div>
            <Table>
              <TableBody>
                {/* QTR 1 */}
                <TableRow>
                  <TableHead colSpan={1} className="w-16"></TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">0-4 min</TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">4-8 min</TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">8-12 min</TableHead>
                </TableRow>
                {playerSubPattern && playerSubPattern.length === 12 && positions.map((pos, posIndex) => (
                  <TableRow key={`q1-${pos.key}`} className=''>
                    {posIndex === 0 && <TableCell rowSpan={5} className="align-middle text-center font-bold w-16 bg-gray tb-border">Qtr1</TableCell>}
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 0, pos.key)}>{playerSubPattern[0][pos.key]}</TableCell>
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 1, pos.key)}>{playerSubPattern[1][pos.key]}</TableCell>
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 2, pos.key)}>{playerSubPattern[2][pos.key]}</TableCell>
                  </TableRow>
                ))}
                {/* QTR 2 */}
                <TableRow>
                  <TableHead colSpan={1} className="w-16"></TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">12-16 min</TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">16-20 min</TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">20-24 min</TableHead>
                </TableRow>
                {playerSubPattern && playerSubPattern.length === 12 && positions.map((pos, posIndex) => (
                  <TableRow key={`q2-${pos.key}`}>
                    {posIndex === 0 && <TableCell rowSpan={5} className="align-middle text-center font-bold w-16 bg-gray tb-border">Qtr2</TableCell>}
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 3, pos.key)}>{playerSubPattern[3][pos.key]}</TableCell>
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 4, pos.key)}>{playerSubPattern[4][pos.key]}</TableCell>
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 5, pos.key)}>{playerSubPattern[5][pos.key]}</TableCell>
                  </TableRow>
                ))}

                {/* QTR 3 */}
                <TableRow>
                  <TableHead colSpan={1} className="w-16"></TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">24-28 min</TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">28-32 min</TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">32-36 min</TableHead>
                </TableRow>
                {playerSubPattern && playerSubPattern.length === 12 && positions.map((pos, posIndex) => (
                  <TableRow key={`q3-${pos.key}`}>
                    {posIndex === 0 && <TableCell rowSpan={5} className="align-middle text-center font-bold w-16 bg-gray tb-border">Qtr3</TableCell>}
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 6, pos.key)}>{playerSubPattern[6][pos.key]}</TableCell>
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 7, pos.key)}>{playerSubPattern[7][pos.key]}</TableCell>
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 8, pos.key)}>{playerSubPattern[8][pos.key]}</TableCell>
                  </TableRow>
                ))}

                {/* QTR 4 */}
                <TableRow>
                  <TableHead colSpan={1} className="w-16"></TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">36-40 min</TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">40-44 min</TableHead>
                  <TableHead colSpan={2} className="text-center font-bold border tb-border">44-48 min</TableHead>
                </TableRow>
                {playerSubPattern && playerSubPattern.length === 12 && positions.map((pos, posIndex) => (
                  <TableRow key={`q4-${pos.key}`}>
                    {posIndex === 0 && <TableCell rowSpan={5} className="align-middle text-center font-bold w-16 bg-gray tb-border">Qtr4</TableCell>}
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 9, pos.key)}>{playerSubPattern[9][pos.key]}</TableCell>
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 10, pos.key)}>{playerSubPattern[10][pos.key]}</TableCell>
                    <TableCell className="font-bold border w-12 bg-danger">{pos.label}</TableCell>
                    <TableCell className="cursor-pointer hover:bg-muted border bg-muted" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 11, pos.key)}>{playerSubPattern[11][pos.key]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-1/3 border-l pl-2 mx-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-bold mb-2 text-sm">Available Players <Info className="h-4 w-4 inline-block ml-1" /></h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Drag players from here to the substitution pattern table</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Pos</TableHead>
                    <TableHead>Ht</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playersTeam2.map(player => (
                    <TableRow key={player.name} className='bg-muted'>
                      <TableCell
                        className="cursor-pointer hover:bg-muted"
                        draggable="true"
                        onDragStart={(e) => e.dataTransfer.setData("player_data", JSON.stringify({ name: player.name, position: player.positions }))}
                      >
                        {player.name}
                      </TableCell>
                      <TableCell className="cursor-pointer hover:bg-muted">{player.positions}</TableCell>
                      <TableCell className="cursor-pointer hover:bg-muted">{player.height}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubstitutionPatternSheet;
