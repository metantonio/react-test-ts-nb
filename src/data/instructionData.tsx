import React from 'react';

export const instructionData = {
    gettingStarted: (
        <div className="space-y-4">
            <p>
                To play just one game click on the <strong>Single Game Version</strong> tab. Then click on one of the YEAR dropdown arrows to choose which season to play, and once the dropdown appears scroll down and click on a season. That click will set both the home and away teams to that season. Then click on one of the TEAM dropdown arrows and scroll down and click on a team. The left dropdown is for the Away team and the right dropdown is for the Home team.
            </p>
            <p>
                If you want to play teams from different seasons against one another then once you have chosen one team click on the YEAR dropdown for the other team, click on a different season, then click on the TEAM dropdown to select the opposing team.
            </p>
            <p>
                To play a quick game, click your setting toggles to “Away Team – Computer”, “Home Team – Computer”, “Pause Options – Do Not Pause”, and “Display Options – Both”. Then click on “Start Game”.
            </p>
        </div>
    ),
    singleGame: (
        <div className="space-y-4">
            <p>
                As a game is played all player matchups are displayed in the center game screen, a text commentary similar to a radio broadcast describes the action in a window at the bottom left, and a box score on the bottom right compiles and displays the player statistics.
            </p>
            <h4 className="font-semibold mt-4">Passing Modes</h4>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Computer Passing:</strong> The computer controls all the action in the game. You can adjust how the text commentary pauses using the Pause Options.</li>
                <li><strong>Automatic Passing:</strong> The computer controls all the passing, but you control all player substitutions.</li>
                <li><strong>Manual Passing:</strong> You as coach can control action on the floor by dictating who to pass the ball to on many team possessions, while also controlling all player substitutions.</li>
            </ul>
            <h4 className="font-semibold mt-4">Manual Passing Details</h4>
            <p>
                The <strong>Possession Factor (PF)</strong> rates players for how often they handle the ball on offense, rated on a scale of 3, 2, 1, and 0. Players rated as a 3 handle the ball the most (high touches), while players rated as 0 the least.
            </p>
            <p>
                During a game with manual passing, "position buttons" will light up indicating that position is available to receive the ball. Players with PF=3 are almost always available, while PF=0 are the least available.
            </p>
            <p>
                <strong>HC (Half Court):</strong> Can be used usually every other team possession to start a possession with a non-PG with a PF=2 or 3.
                <br />
                <strong>R (Random):</strong> The player to next receive the ball is chosen at random.
            </p>
        </div>
    ),
    fullSeason: (
        <div className="space-y-4">
            <p>
                The Full Season Version plays tens, hundreds, even thousands of games in just seconds. This allows you to try out different what-if scenarios quickly, such as changing the substitution pattern, replacing a starting player, or trading a player.
            </p>
            <p>
                You can "re-play" current and past seasons, trade players to teams and simulate a season, or even make changes to players’ statistical profiles and simulate entire seasons to see the impact.
            </p>
            <h4 className="font-semibold mt-4">Use Cases</h4>
            <ul className="list-disc pl-6 space-y-1">
                <li>Simulating an entire pro season (e.g., all 1230 games).</li>
                <li>Simulating a season of 82, 820, or 8200 games for any single team.</li>
                <li>Determining whether a future trade or free agent signing would be advantageous.</li>
                <li>Determining how a team would perform without a certain player or with changed minutes.</li>
                <li>Determining a team's best substitution pattern.</li>
                <li>Predicting the outcome of a single upcoming game.</li>
            </ul>
        </div>
    ),
    fullSeasonModes: (
        <div className="space-y-4">
            <h4 className="font-semibold">1. 82/820/8200 Game Schedule Version</h4>
            <p>
                This version can be used for making changes to a team and then simulating games against that team’s actual schedule. The key is to play as many games as possible (e.g., 8200) to get an "average" result and see the true impact of your changes.
            </p>

            <h4 className="font-semibold mt-4">2. Predict Games Version</h4>
            <p>
                Best used for playing hundreds or thousands of games between two specific teams to predict the outcome of a single game. You can set up matches between specific teams and play up to 10,000 games.
            </p>
            <p>
                <em>Tip:</em> Before choosing teams, set up team substitution patterns that reflect the players currently playing for those specific teams. If a star player is injured, remove them from the pattern.
            </p>

            <h4 className="font-semibold mt-4">3. Replay Entire League Season</h4>
            <p>
                Plays an entire season (e.g., all 1230 games for all 30 teams) based on real-life player and team statistics.
            </p>
        </div>
    ),
    playerStats: (
        <div className="space-y-4">
            <p>The Actual Players Statistics screen shows all relevant player statistics.</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>SCORE FG%:</strong> (2pters + 1.5 x 3pters + FTM/2) / (FGA + FTA/2)</li>
                <li><strong>Rebounding Ratings (OFF/DEF/TOT):</strong> Measures rebounding ability per 48 minutes. Average player grabs 1 offensive rebound for every 2 defensive rebounds.</li>
                <li><strong>DEF RAT:</strong> Individual player defensive field goal percentage rating. How much the defender increases or decreases the FG% of the offensive players he guards. (-5.0% is very good, +5.0% is very poor).</li>
                <li><strong>%PF / %ST:</strong> How often the defender commits fouls and steals per 100 minutes.</li>
                <li><strong>%BS:</strong> Percentage of shots the defender blocks out of total shots taken by opposing team while on court.</li>
            </ul>
        </div>
    ),
    boxScores: (
        <div className="space-y-4">
            <p>Definitions for statistics listed in the box scores:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <li><strong>IND POSS:</strong> Individual possessions (touches).</li>
                <li><strong>PASSES THR REC:</strong> Passes thrown and caught.</li>
                <li><strong>TIMES FOULED AOSF:</strong> Times fouled in act of shooting.</li>
                <li><strong>TIMES FOULED NSF:</strong> Times fouled in non-shooting situation.</li>
                <li><strong>DEF FGM FGA:</strong> Shots made/attempted by opponents guarded by the player.</li>
            </ul>
        </div>
    ),
    finalStats: (
        <div className="space-y-4">
            <p>The Raw Stats file contains comprehensive data including:</p>

            <h4 className="font-semibold mt-4">1st Section - Shooting & Rebounding Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><strong>G:</strong> Games played</div>
                <div><strong>MIN:</strong> Minutes played</div>
                <div><strong>FGM/FGA:</strong> Field goals made/attempted</div>
                <div><strong>FG%:</strong> Field goal percentage</div>
                <div><strong>EFF FG%:</strong> (2pters + 1.5 x 3pters)/FGA</div>
                <div><strong>SCORE FG%:</strong> (2pters + 1.5 x 3pters + FTM/2) / (FGA + FTA/2)</div>
                <div><strong>2PT FGM/FGA:</strong> 2pt field goals made/attempted</div>
                <div><strong>2PT FG%:</strong> 2pt field goal percentage</div>
                <div><strong>3PT FGM/FGA:</strong> 3pt field goals made/attempted</div>
                <div><strong>3PT FG%:</strong> 3pt field goal percentage</div>
                <div><strong>FGmiss:</strong> Missed shots</div>
                <div><strong>FGmiss offreb:</strong> Missed shots rebounded by offense</div>
                <div><strong>FGmiss defreb:</strong> Missed shots rebounded by defense</div>
                <div><strong>FGmiss offtmreb:</strong> Missed shots followed by offensive team rebound</div>
                <div><strong>FGmiss deftmreb:</strong> Missed shots followed by defensive team rebound</div>
                <div><strong>FTmiss no reb:</strong> Missed 1st of 2 FTs (no rebound)</div>
                <div><strong>FTmiss offreb:</strong> Missed FTs rebounded by offense</div>
                <div><strong>FTmiss defreb:</strong> Missed FTs rebounded by defense</div>
                <div><strong>FTmiss offtmreb:</strong> Missed FTs followed by offensive team rebound</div>
                <div><strong>FTmiss deftmreb:</strong> Missed FTs followed by defensive team rebound</div>
            </div>

            <h4 className="font-semibold mt-4">2nd Section - General Stats</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><strong>FTM/FTA:</strong> Free throws made/attempted</div>
                <div><strong>FT%:</strong> Free throw percentage</div>
                <div><strong>OFF REB:</strong> Offensive rebounds</div>
                <div><strong>DEF REB:</strong> Defensive rebounds</div>
                <div><strong>TOT REB:</strong> Total rebounds</div>
                <div><strong>AST:</strong> Assists</div>
                <div><strong>PF:</strong> Personal fouls</div>
                <div><strong>DQ:</strong> Disqualifications (fouled out)</div>
                <div><strong>ST:</strong> Steals</div>
                <div><strong>TO:</strong> Turnovers</div>
                <div><strong>BS:</strong> Blocked shots</div>
                <div><strong>PTS:</strong> Points scored</div>
            </div>

            <h4 className="font-semibold mt-4">Advanced Metrics</h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>PTS ZEROPTPOSS:</strong> Points scored per zero point team possession personally responsible for (measure of offensive efficiency).</li>
                <li><strong>POSS FACT:</strong> Touches per minute.</li>
                <li><strong>PASSING POSS FACT:</strong> Touches per minute minus offensive rebounds.</li>
                <li><strong>PERFORMANCE POINTS:</strong> Generic number to measure overall individual performance (pts + reb + ast + st + bs - to - pf - FGmissed - FTmissed).</li>
                <li><strong>+/- IN/OUT:</strong> Plus/minus points when player was IN vs OUT of the game.</li>
                <li><strong>PLAYER PTS/POSS:</strong> Team points scored per possession when player was ON vs OFF the floor.</li>
            </ul>
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
                <p className="text-sm">
                    Note: All player substitutions occur at a change of possession between the teams unless a player fouls out.
                </p>
            </div>
        </div>
    )
};
