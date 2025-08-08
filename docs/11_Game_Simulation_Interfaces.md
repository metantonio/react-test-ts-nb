# Game Simulation Interfaces

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/components/PlayerStatsTable.tsx](src/components/PlayerStatsTable.tsx)
- [src/components/Scoreboard.tsx](src/components/Scoreboard.tsx)
- [src/components/ui/CustomRadio.tsx](src/components/ui/CustomRadio.tsx)
- [src/components/ui/table.tsx](src/components/ui/table.tsx)
- [src/gamesetup_result_image.png](src/gamesetup_result_image.png)
- [src/lib/utils.ts](src/lib/utils.ts)
- [src/pages/FullSeasonVersion.tsx](src/pages/FullSeasonVersion.tsx)
- [src/pages/Instructions.tsx](src/pages/Instructions.tsx)
- [src/pages/SingleGameVersion.tsx](src/pages/SingleGameVersion.tsx)

</details>



This document covers the user interface components that provide interactive basketball game simulation experiences. These interfaces allow users to configure and run basketball simulations, from single games to full season schedules, and view real-time results including statistics, play-by-play action, and box scores.

For information about the underlying basketball simulation mechanics and algorithms, see [Basketball Simulation](./14_Basketball_Simulation.md). For details about the initial game setup and team selection process, see [Game Setup Interface](./10_Game_Setup_Interface.md).

## Overview

The application provides two primary simulation interfaces, each optimized for different use cases:

- **Full Season Version**: Batch simulation interface for running multiple games with statistical analysis
- **Single Game Version**: Interactive real-time simulation interface with detailed game controls

Both interfaces integrate with the external basketball simulation API and provide comprehensive statistical tracking and export capabilities.

## Full Season Simulation Interface

The `FullSeasonVersion` component provides a comprehensive interface for running large-scale basketball simulations. This interface is designed for statistical analysis and batch processing of multiple games.

### Component Architecture

```mermaid
graph TD
    FSV["FullSeasonVersion"] --> DD1["DropdownMenu (League Selection)"]
    FSV --> DD2["DropdownMenu (Team Selection)"]
    FSV --> CR1["CustomRadio (Schedule Options)"]
    FSV --> CR2["CustomRadio (Location Options)"]
    FSV --> CB1["CustomCheckbox (Save Options)"]
    FSV --> Sheet1["Sheet (Player Statistics)"]
    FSV --> Sheet2["Sheet (Box Score)"]
    FSV --> Table1["Table (Player Stats Display)"]
    FSV --> Button1["Button (PLAY GAMES)"]
    
    FSV --> API["handleFetchScoreBoard()"]
    FSV --> API2["handleFetchPlayByPlay()"]
    FSV --> API3["handleFetchBoxScore()"]
</mermaid>

**Sources:** [src/pages/FullSeasonVersion.tsx:1-447]()

### Key Features

The full season interface supports three main simulation modes configured through radio buttons [src/pages/FullSeasonVersion.tsx:391-394]():

| Mode | Description | Purpose |
|------|-------------|---------|
| `schedule` | 82/820/8200 Game Schedule | Standard season simulation |
| `predict` | Predict Games | Predictive analytics mode |
| `replay` | Replay Full League Season | Historical replay functionality |

### Game Location Configuration

Location options control where games are played [src/pages/FullSeasonVersion.tsx:398-402]():

- **Home**: Home team advantage only
- **Away**: Away team scenarios only  
- **Both**: Mixed home/away games
- **Neutral**: Neutral venue games

### Data Export and Statistics

The interface provides comprehensive player statistics with CSV export functionality [src/pages/FullSeasonVersion.tsx:257-258]() and [src/pages/FullSeasonVersion.tsx:321-322](). Player statistics include detailed performance metrics defined in the `PlayerChar` interface [src/pages/FullSeasonVersion.tsx:44-82]():

```mermaid
graph LR
    PS["Player Statistics"] --> Basic["Basic Stats"]
    PS --> Advanced["Advanced Stats"] 
    PS --> Shooting["Shooting Stats"]
    
    Basic --> G["Games (g)"]
    Basic --> MIN["Minutes (min/ming)"]
    Basic --> PTS["Points (ptsg)"]
    
    Advanced --> REB["Rebounds (offreb/defreb/totreb)"]
    Advanced --> AST["Assists (pct_pass)"]
    Advanced --> DEF["Defense (def_fg_pct/pct_st/pct_bs)"]
    
    Shooting --> FG["Field Goal % (fgpct/scorefgpct)"]
    Shooting --> ThreeP["3-Point % (threeptfgpct)"]
    Shooting --> FT["Free Throw % (ftpct)"]
</mermaid>

**Sources:** [src/pages/FullSeasonVersion.tsx:44-82](), [src/pages/FullSeasonVersion.tsx:252-380]()

### Simulation Controls

The main simulation trigger uses the `handlePlayGames` function [src/pages/FullSeasonVersion.tsx:141-147]() which orchestrates three API calls:

1. `handleFetchScoreBoard()` - Retrieves game scores
2. `handleFetchPlayByPlay()` - Fetches play-by-play data  
3. `handleFetchBoxScore()` - Gets detailed box score statistics

**Sources:** [src/pages/FullSeasonVersion.tsx:141-147](), [src/pages/FullSeasonVersion.tsx:409-412]()

## Single Game Simulation Interface

The `SingleGameVersion` component provides an interactive, real-time basketball simulation experience with granular control over game progression and team behavior.

### Real-time Game Controls

```mermaid
graph TD
    SGV["SingleGameVersion"] --> TeamControls["Team Control Modes"]
    SGV --> PauseControls["Pause Options"]
    SGV --> DisplayControls["Display Options"]
    SGV --> GameState["Game State Management"]
    
    TeamControls --> Manual["Manual Pass"]
    TeamControls --> Auto["Auto Pass"] 
    TeamControls --> Computer["Computer"]
    
    PauseControls --> EachLine["Pause after each line"]
    PauseControls --> EachPoss["Pause after each possession"]
    PauseControls --> EndQuarter["Pause after end of quarter"]
    PauseControls --> NoPause["Do not pause"]
    
    DisplayControls --> PBP["Play by Play"]
    DisplayControls --> BoxScore["Box Score"]
    DisplayControls --> Both["Both"]
</mermaid>

**Sources:** [src/pages/SingleGameVersion.tsx:47-56](), [src/pages/SingleGameVersion.tsx:70-72](), [src/pages/SingleGameVersion.tsx:108-110](), [src/pages/SingleGameVersion.tsx:114-117]()

### Interactive Scoreboard Display

The interface features a prominent scoreboard section [src/pages/SingleGameVersion.tsx:125-175]() displaying:

- Live game scores with large numerical displays
- Quarter and time information
- Team fouls and possession indicators
- Substitution pattern controls

### Player Statistics Tables

Real-time player statistics are displayed in dual tables [src/pages/SingleGameVersion.tsx:195-244]() showing:

| Away Team Stats | Home Team Stats |
|----------------|-----------------|
| BS, TO, ST, FLS, AST, TREB, PTS | Player, PF, POS, MIN, PTS, TREB, AST |
| MIN, Player, PF, POS | FLS, ST, TO, BS |

**Sources:** [src/pages/SingleGameVersion.tsx:14-28](), [src/pages/SingleGameVersion.tsx:195-244]()

### Play-by-Play Integration

The interface includes live play-by-play display [src/pages/SingleGameVersion.tsx:260-267]() with colored text formatting for different types of game events. This integrates with the basketball simulation API to provide real-time game narrative.

**Sources:** [src/pages/SingleGameVersion.tsx:30-36](), [src/pages/SingleGameVersion.tsx:260-267]()

## Supporting Components

### PlayerStatsTable Component

The `PlayerStatsTable` component [src/components/PlayerStatsTable.tsx:1-57]() provides a reusable interface for displaying player performance data:

```mermaid
graph LR
    PST["PlayerStatsTable"] --> Props["PlayerStatsTableProps"]
    Props --> TeamName["teamName: string"]
    Props --> Players["players: PlayerStats[]"]
    
    PST --> Table["Table Component"]
    Table --> Header["TableHeader (Player, PTS, REB, AST, PF)"]
    Table --> Body["TableBody (scrollable)"]
    
    Body --> Rows["TableRow (per player)"]
```

**Sources:** [src/components/PlayerStatsTable.tsx:19-26](), [src/components/PlayerStatsTable.tsx:29-50]()

### Scoreboard Component

The `Scoreboard` component [src/components/Scoreboard.tsx:1-101]() renders game status information:

```mermaid
graph TD
    SB["Scoreboard"] --> Props["ScoreboardProps"]
    Props --> ScoreData["scoreboardData: ScoreBoard"]
    Props --> TeamInfo["awayTeamName, homeTeamName"]
    Props --> Logos["awayTeamLogo, homeTeamLogo"]
    
    SB --> Display["Display Elements"]
    Display --> TeamLogos["TeamLogo components"]
    Display --> Scores["Score displays (away_score, home_score)"]
    Display --> GameInfo["Quarter, Clock, Fouls"]
    Display --> Possession["Possession indicators"]
</mermaid>

**Sources:** [src/components/Scoreboard.tsx:16-22](), [src/components/Scoreboard.tsx:47-49](), [src/components/Scoreboard.tsx:52-98]()

### Data Export Utilities

The `exportToCSV` function [src/lib/utils.ts:8-42]() provides data export capabilities used by both simulation interfaces:

- Handles CSV header generation from object keys
- Manages special character escaping for CSV format
- Creates downloadable blob files for browser download

**Sources:** [src/lib/utils.ts:8-42]()

## User Interaction Flow

The typical user workflow through the game simulation interfaces follows this pattern:

```mermaid
sequenceDiagram
    participant U as "User"
    participant FSV as "FullSeasonVersion"
    participant SGV as "SingleGameVersion"
    participant API as "Basketball API"
    
    Note over U,API: Full Season Flow
    U->>FSV: Select teams and options
    U->>FSV: Configure schedule/location
    U->>FSV: Click "PLAY GAMES"
    FSV->>API: handleFetchScoreBoard()
    FSV->>API: handleFetchPlayByPlay()
    FSV->>API: handleFetchBoxScore()
    API-->>FSV: Return simulation results
    FSV-->>U: Display statistics and export options
    
    Note over U,API: Single Game Flow  
    U->>SGV: Configure team control modes
    U->>SGV: Set pause and display options
    U->>SGV: Start game
    SGV->>API: Real-time simulation requests
    API-->>SGV: Live game updates
    SGV-->>U: Update scoreboard and stats
```

**Sources:** [src/pages/FullSeasonVersion.tsx:141-147](), [src/pages/SingleGameVersion.tsx:59-268]()

The interfaces provide complementary experiences: the full season version focuses on batch processing and statistical analysis, while the single game version emphasizes real-time interaction and detailed game progression control.