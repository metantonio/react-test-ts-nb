import React from 'react';

export const instructionData = {
    gameSetup: (
        <div className="space-y-4">
            <p>
                The <strong>Game Setup</strong> page is your starting point. Here you can configure the parameters for your simulation.
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Select League:</strong> Choose the league you want to simulate from the dropdown menu.</li>
                <li><strong>Select Teams:</strong> Once a league is selected, pick the Home and Away teams.</li>
                <li><strong>Simulation Modes:</strong>
                    <ul className="list-circle pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                        <li><strong>Predict:</strong> Simulates a single game matchup based on team stats.</li>
                        <li><strong>Full Season:</strong> Enters the comprehensive season simulation mode.</li>
                        <li><strong>Play 82:</strong> Simulates an entire 82-game season schedule.</li>
                    </ul>
                </li>
            </ul>
        </div>
    ),
    fullSeason: (
        <div className="space-y-4">
            <p>
                In the <strong>Full Season</strong> view, you have deeper control over your team's management and simulation settings.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Setup & Tools</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Configure simulation settings like "Save Box Score" or "Keep Play-by-Play".</li>
                        <li>Access team tools to modify rosters and strategies.</li>
                        <li>View current standings and team statistics.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Results</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>View detailed game logs and box scores.</li>
                        <li>Analyze play-by-play data for specific matches.</li>
                        <li>Track season progress through the schedule.</li>
                    </ul>
                </div>
            </div>
        </div>
    ),
    draftingPlayers: (
        <div className="space-y-4">
            <p>
                The <strong>Draft Dialog</strong> allows you to customize your team's roster by importing players from other leagues or teams.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>
                    <strong>Open Draft:</strong> Click the "Draft Players" button in the Team Tools section.
                </li>
                <li>
                    <strong>Select Source:</strong> On the right side of the dialog, select a source League and Team to view their available players.
                </li>
                <li>
                    <strong>Drag and Drop:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                        Click and drag a player from the <em>Source</em> list (right) and drop them onto a player in your <em>Current Team</em> list (left).
                        This will replace the current player with the new drafted player.
                    </p>
                </li>
                <li>
                    <strong>Save Changes:</strong> Once you are satisfied with your roster changes, click "Save Changes" to apply them.
                </li>
            </ol>
        </div>
    ),
    substitutionPattern: (
        <div className="space-y-4">
            <p>
                The <strong>Substitution Pattern Sheet</strong> gives you granular control over your lineup rotation in 4-minute blocks throughout the game.
            </p>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">How it Works</h4>
                    <p className="text-sm text-muted-foreground">
                        The game is divided into 4 quarters, and each quarter is split into three 4-minute intervals (0-4, 4-8, 8-12).
                        You define which 5 players are on the court for each interval.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold">Setting the Pattern</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>
                            <strong>Available Players:</strong> Your roster is listed on the right side.
                        </li>
                        <li>
                            <strong>Drag and Drop:</strong> Drag a player from the "Available Players" list to any slot in the grid.
                        </li>
                        <li>
                            <strong>Positions:</strong> By default, players must match the slot's position (C, PF, SF, SG, PG).
                            Check <em>"Allow any position"</em> to override this restriction.
                        </li>
                        <li>
                            <strong>Validation:</strong> The system prevents duplicate players in the same time interval.
                        </li>
                    </ul>
                </div>

                <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-semibold text-sm mb-1">Tip</h4>
                    <p className="text-xs text-muted-foreground">
                        Use the "Print" button to export your substitution pattern to a CSV file for offline reference or sharing.
                    </p>
                </div>
            </div>
        </div>
    )
};
