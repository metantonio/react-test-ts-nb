import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomRadio from '@/components/ui/CustomRadio';
import CustomCheckbox from '@/components/ui/CustomCheckbox';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';

interface SimulationSettingsProps {
    schedule: string | null;
    setSchedule: (val: string) => void;
    location: string | null;
    setLocation: (val: string) => void;
    keepPlayByPlay: string | null;
    setKeepPlayByPlay: (val: string) => void;
    saveBox: boolean;
    setSaveBox: (val: boolean) => void;
    isSimulating: boolean;
    onPlayGames: () => void;
    isLoading: boolean;
    canPlay: boolean;
}

const SimulationSettings: React.FC<SimulationSettingsProps> = ({
    schedule,
    setSchedule,
    location,
    setLocation,
    keepPlayByPlay,
    setKeepPlayByPlay,
    saveBox,
    setSaveBox,
    isSimulating,
    onPlayGames,
    isLoading,
    canPlay,
}) => {
    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader>
                <CardTitle>3. Simulation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Game Mode</h4>
                        <div className="flex flex-col space-y-2">
                            <CustomRadio name="schedule" value="8200" checked={schedule === '8200'} onChange={setSchedule} label="82/820/8200 Game Schedule" id="r1" />
                            <CustomRadio name="schedule" value="predict" checked={schedule === 'predict'} onChange={setSchedule} label="Predict Games" id="r2" />
                            <CustomRadio name="schedule" value="fullseason" checked={schedule === 'fullseason'} onChange={setSchedule} label="Replay Full League Season" id="r3" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                        <div className="flex flex-col space-y-2" aria-disabled={schedule === "fullseason"}>
                            <CustomRadio name="location" value="home" checked={location === 'home'} onChange={setLocation} label="Home" id="r4" />
                            <CustomRadio name="location" value="away" checked={location === 'away'} onChange={setLocation} label="Away" id="r5" />
                            <CustomRadio name="location" value="both" checked={location === 'both'} onChange={setLocation} label="Both" id="r6" />
                            <CustomRadio name="location" value="neutral" checked={location === 'neutral'} onChange={setLocation} label="Neutral" id="r7" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Options</h4>
                    <div className="space-y-2">
                        <CustomCheckbox
                            id="save-pbp"
                            checked={keepPlayByPlay === 'Y'}
                            onChange={() => setKeepPlayByPlay(keepPlayByPlay === 'Y' ? 'N' : 'Y')}
                            label="Save and Show Play-by-Play (<=100 games)"
                        />
                        <CustomCheckbox
                            id="save-box"
                            checked={saveBox}
                            onChange={setSaveBox}
                            label="Save Box Scores (Max 15,000 games)"
                        />
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <Button
                        size="lg"
                        className="w-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                        disabled={isLoading || isSimulating || !canPlay}
                        onClick={onPlayGames}
                    >
                        {isSimulating ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Simulating...
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-6 w-6 fill-current" />
                                PLAY GAMES
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SimulationSettings;
