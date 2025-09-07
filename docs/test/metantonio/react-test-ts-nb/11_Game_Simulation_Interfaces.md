# Game Simulation Interfaces

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/components/PlayerStatsTable.tsx](src/components/PlayerStatsTable.tsx)
- [src/components/Scoreboard.tsx](src/components/Scoreboard.tsx)
- [src/components/ui/table.tsx](src/components/ui/table.tsx)
- [src/gamesetup_result_image.png](src/gamesetup_result_image.png)
- [src/lib/utils.ts](src/lib/utils.ts)
- [src/pages/FullSeasonVersion.tsx](src/pages/FullSeasonVersion.tsx)
- [src/pages/Instructions.tsx](src/pages/Instructions.tsx)
- [src/pages/SingleGameVersion.tsx](src/pages/SingleGameVersion.tsx)
- [src/player_subs_pattern.png](src/player_subs_pattern.png)

</details>



This document covers the user interface components responsible for basketball game simulation, including both full season and single game simulation modes. These interfaces provide controls for configuring simulations, displaying real-time results, and managing complex basketball-specific features like player substitution patterns.

For information about the underlying game simulation logic and mechanics, see [Basketball Simulation](#5.1). For the main orchestration interface that routes users to these simulation modes, see [Game Setup Interface](#4.2).

## Full Season Simulation Interface

The `FullSeasonVersion` component provides a comprehensive interface for simulating entire basketball seasons. This interface handles complex season-level operations including multi-team scheduling, player rotation management, and season-long statistics tracking.

### Component Architecture

```mermaid
graph TB
    subgraph "FullSeasonVersion Component"
        FSV[FullSeasonVersion] --> LT["League/Team Selection"]
        FSV --> SC["Simulation Controls"]
        FSV --> SP["Substitution Patterns"]
        FSV --> DS["Data Sheets"]
        FSV --> SS["Season Schedule"]
    end
    
    subgraph "Data Management"
        LT --> LI["League[]"]
        LT --> TI["Team[]"]
        SC --> BSF["BoxScoreFullSeason[]"]
        SP --> PSP["PlayerSubPattern[]"]
        SS --> TS["TeamsSchedule[]"]
    end
    
    subgraph "UI Components"
        DS --> PST["PlayerStatsTable"]
        DS --> SH["Sheet Components"]
        SP --> DDI["Drag & Drop Interface"]
        SC --> BTN["Button Controls"]
    end
    
    subgraph "External Actions"
        SC --> HFP["handleFetchPlayerSubpattern()"]
        SC --> HPM["handlePredictMode()"]
        SC --> HS82["handleSchedule82()"]
    end
```

Sources: [src/pages/FullSeasonVersion.tsx:1-1413]()

### Key Interfaces and Data Structures

The full season interface relies on several TypeScript interfaces that define the data structures for different aspects of season simulation:

| Interface | Purpose | Key Fields |
|-----------|---------|------------|
| `League` | League selection | `league_name` |
| `Team` | Team selection | `teams` |
| `TeamsSchedule` | Season scheduling | `teams`, `games` |
| `PlayerChar` | Player characteristics | `name`, `position`, `poss_fact`, `two_pt_fg_pct`, etc. |
| `PlayerSubPattern` | 4-minute substitution intervals | `pos1`, `pos2`, `pos3`, `pos4`, `pos5` |
| `BoxScoreFullSeason` | Season game results | `text`, `game_number`, `line_number` |

Sources: [src/pages/FullSeasonVersion.tsx:37-151]()

### Player Substitution Management

The full season interface includes a sophisticated drag-and-drop system for managing player substitutions across 4-minute intervals throughout a game:

```mermaid
graph LR
    subgraph "Substitution Pattern Interface"
        AP["Available Players"] --> DD["Drag & Drop"]
        DD --> QT1["Quarter 1<br/>0-4, 4-8, 8-12"]
        DD --> QT2["Quarter 2<br/>12-16, 16-20, 20-24"]
        DD --> QT3["Quarter 3<br/>24-28, 28-32, 32-36"]
        DD --> QT4["Quarter 4<br/>36-40, 40-44, 44-48"]
    end
    
    subgraph "Position Management"
        QT1 --> POS["pos1: C<br/>pos2: PF<br/>pos3: SF<br/>pos4: SG<br/>pos5: PG"]
    end
    
    subgraph "Validation"
        DD --> DV["Duplicate Validation"]
        DV --> TE["Toast Error"]
    end
```

The system prevents duplicate player assignments within the same 4-minute interval and provides visual feedback through the `handleDrop` function.

Sources: [src/pages/FullSeasonVersion.tsx:216-242](), [src/pages/FullSeasonVersion.tsx:245-279]()

### Sheet-Based Data Display

The interface uses sheet components to display various types of simulation data:

- **Box Score Sheet**: Displays full season box scores with attention indicators when new data is available
- **Player Statistics Sheet**: Shows detailed player stats for both teams with CSV export functionality
- **Substitution Pattern Sheet**: Full-screen drag-and-drop interface for managing player rotations

Sources: [src/pages/FullSeasonVersion.tsx:314-333](), [src/pages/FullSeasonVersion.tsx:569-708]()

## Single Game Simulation Interface

The `SingleGameVersion` component provides a real-time interface for simulating individual basketball games with granular control over game progression and display options.

### Control Systems Architecture

```mermaid
graph TB
    subgraph "Game Controls"
        TC["Team Control<br/>Manual/Auto/Computer"]
        PO["Pause Options<br/>Line/Possession/Quarter/None"]
        DO["Display Options<br/>PlayByPlay/BoxScore/Both"]
        GC["Game Commands<br/>Start/Pause/Reset"]
    end
    
    subgraph "Real-time Display"
        SB["Scoreboard<br/>Score/Time/Fouls"]
        PT["Player Tables<br/>Away/Home Teams"]
        PBP["Play-by-Play<br/>Live Commentary"]
        BS["Box Score<br/>Game Statistics"]
    end
    
    subgraph "State Management"
        TC --> ATS["awayTeamMode"]
        TC --> HTS["homeTeamMode"]
        PO --> PS["pauseOptions"]
        DO --> SPS["showPlayByPlay"]
        DO --> SBS["showBoxScore"]
    end
```

Sources: [src/pages/SingleGameVersion.tsx:46-56]()

### Real-time Game Display

The single game interface provides multiple synchronized views of the ongoing simulation:

| Component | Purpose | Data Source |
|-----------|---------|-------------|
| Live Scoreboard | Current score, time, fouls | `scoreboardData` |
| Player Statistics Tables | Real-time player stats | `awayTeamStats`, `homeTeamStats` |
| Play-by-Play Feed | Game commentary | `playByPlayData` |
| Box Score Display | Detailed game statistics | `boxScoreData` |

Sources: [src/pages/SingleGameVersion.tsx:14-44](), [src/pages/SingleGameVersion.tsx:125-175]()

## Supporting Components

### Scoreboard Component

The `Scoreboard` component provides a professional basketball scoreboard display with real-time game information:

```mermaid
graph LR
    subgraph "Scoreboard Data"
        SD["ScoreBoard Interface"] --> AS["away_score"]
        SD --> HS["home_score"]
        SD --> Q["quarter"]
        SD --> C["clock"]
        SD --> AF["away_fouls"]
        SD --> HF["home_fouls"]
        SD --> HTO["home_team_offense"]
    end
    
    subgraph "Visual Elements"
        AS --> ASC["Away Score Display"]
        HS --> HSC["Home Score Display"]
        Q --> QD["Quarter Display"]
        C --> CD["Clock Display"]
        HTO --> PI["Possession Indicator"]
    end
    
    subgraph "Team Information"
        TL["TeamLogo Component"] --> ATL["Away Team Logo"]
        TL --> HTL["Home Team Logo"]
    end
```

The scoreboard uses conditional styling to indicate which team has possession and includes fallback team abbreviations when logos are unavailable.

Sources: [src/components/Scoreboard.tsx:3-49](), [src/components/Scoreboard.tsx:52-98]()

### Player Statistics Table

The `PlayerStatsTable` component provides a reusable interface for displaying player performance data:

```mermaid
graph TB
    subgraph "PlayerStatsTable"
        PST["PlayerStatsTable"] --> TH["Table Headers<br/>Player/PTS/REB/AST/PF"]
        PST --> TB["Table Body"]
        TB --> PR["Player Rows"]
    end
    
    subgraph "Data Structure"
        PS["PlayerStats Interface"] --> PN["name: string"]
        PS --> PTS["pts: string"]
        PS --> REB["reb: string"]
        PS --> AST["ast: string"]
        PS --> PF["pf: string"]
    end
    
    subgraph "Styling"
        PST --> RS["Responsive Scrolling"]
        PST --> DT["Dark Theme Support"]
    end
```

Sources: [src/components/PlayerStatsTable.tsx:11-54]()

## Data Flow and State Management

### Full Season Simulation Flow

```mermaid
sequenceDiagram
    participant U as "User"
    participant FSV as "FullSeasonVersion"
    participant API as "Basketball API"
    participant S as "State Management"
    
    U->>FSV: Select League
    FSV->>S: setSelectedLeague()
    U->>FSV: Select Teams
    FSV->>S: setSelectedTeams1/2()
    U->>FSV: Configure Substitutions
    FSV->>API: handleFetchPlayerSubpattern()
    API-->>FSV: PlayerSubPattern[]
    U->>FSV: Start Simulation
    FSV->>API: handlePredictMode()
    API-->>FSV: BoxScoreFullSeason[]
    FSV->>S: setBoxScoreFullSeason()
    FSV-->>U: Display Results
```

Sources: [src/pages/FullSeasonVersion.tsx:115-151](), [src/pages/FullSeasonVersion.tsx:291-305]()

### State Coordination

Both simulation interfaces manage complex state through props passed from the parent `GameSetup` component. The full season interface handles over 20 state variables while the single game interface manages real-time game state:

| State Category | Full Season | Single Game |
|----------------|-------------|-------------|
| Team Selection | `selectedTeams1/2`, `selectedLeague` | Team mode controls |
| Simulation Data | `boxScoreFullSeason`, `teamsSchedule` | Live game stats |
| UI Controls | `schedule`, `location`, `getAltsSelected` | `pauseOptions`, `displayOptions` |
| Player Management | `playersTeam1/2`, `playerSubPattern` | Real-time player stats |

Sources: [src/pages/FullSeasonVersion.tsx:115-151](), [src/pages/SingleGameVersion.tsx:46-56]()

## User Interaction Patterns

### Export and Persistence

Both interfaces provide data export capabilities using the `exportToCSV` utility function. The full season interface supports exporting player statistics, substitution patterns, and season data, while maintaining persistent state across simulation runs.

### Visual Feedback Systems

The interfaces implement several visual feedback mechanisms:
- **Attention Indicators**: Pulsing buttons (`pulse-attention` class) when user action is required
- **Loading States**: Spinner components during API operations
- **Toast Notifications**: Error and success messages for user actions
- **Drag Feedback**: Visual cues during player substitution management

Sources: [src/pages/FullSeasonVersion.tsx:354-365](), [src/pages/FullSeasonVersion.tsx:227-232](), [src/lib/utils.ts:8-42]()