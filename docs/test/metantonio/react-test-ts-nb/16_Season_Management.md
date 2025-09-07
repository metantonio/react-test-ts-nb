# Season Management

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/components/ui/table.tsx](src/components/ui/table.tsx)
- [src/lib/utils.ts](src/lib/utils.ts)
- [src/pages/FullSeasonVersion.tsx](src/pages/FullSeasonVersion.tsx)
- [src/pages/GameSetup.tsx](src/pages/GameSetup.tsx)
- [src/player_subs_pattern.png](src/player_subs_pattern.png)

</details>



This document covers the full season simulation capabilities of the NBA simulation application, including batch game processing, schedule management, player substitution patterns, and comprehensive statistics analysis. For individual game simulation features, see [Basketball Simulation](#5.1). For the initial game configuration interface, see [Game Setup Interface](#4.2).

## Overview

The Season Management system enables users to simulate complete basketball seasons with varying scales of games (82, 820, or 8200 games), manage player substitution patterns, and analyze comprehensive statistics across multiple games. The system is implemented primarily through the `FullSeasonVersion` component and provides both automated batch processing and detailed configuration options.

## Core Architecture

The season management functionality is centered around the `FullSeasonVersion` component, which orchestrates full season simulations through the parent `GameSetup` component:

```mermaid
graph TB
    subgraph "Season Management Core"
        GameSetup["GameSetup Component<br/>Main Orchestrator"]
        FullSeasonVersion["FullSeasonVersion<br/>UI Component"]
        handlePredictMode["handlePredictMode()<br/>Simulation Engine"]
        handleSchedule82["handleSchedule82()<br/>Schedule Generator"]
    end
    
    subgraph "Data Structures"
        TeamsSchedule["TeamsSchedule[]<br/>teams, games"]
        PlayerChar["PlayerChar[]<br/>Player Statistics"]
        BoxScoreFullSeason["BoxScoreFullSeason[]<br/>text, game_number, line_number"]
        PlayerSubPattern["PlayerSubPattern[]<br/>pos1-pos5, 12 intervals"]
    end
    
    subgraph "API Endpoints"
        get_82_game_schedule["get_82_game_schedule.php<br/>Schedule Generation"]
        play_predict["play_predict.php<br/>Predict Mode"]
        play_82["play_82<br/>8200 Game Mode"]
        play_fsv["play_fsv<br/>Full Season Mode"]
        get_raw_box_scores["get_raw_box_scores.php<br/>Box Score Data"]
    end
    
    GameSetup --> FullSeasonVersion
    GameSetup --> handlePredictMode
    GameSetup --> handleSchedule82
    
    handleSchedule82 --> get_82_game_schedule
    handlePredictMode --> play_predict
    handlePredictMode --> play_82
    handlePredictMode --> play_fsv
    
    get_82_game_schedule --> TeamsSchedule
    play_predict --> BoxScoreFullSeason
    handlePredictMode --> get_raw_box_scores
    
    FullSeasonVersion --> PlayerSubPattern
    FullSeasonVersion --> PlayerChar
```

Sources: [src/pages/GameSetup.tsx:427-447](), [src/pages/GameSetup.tsx:467-494](), [src/pages/FullSeasonVersion.tsx:1-792](), [src/pages/GameSetup.tsx:635-680]()

## Schedule Generation System

The schedule generation system creates game schedules through the `handleSchedule82` function, which calls the `get_82_game_schedule.php` API endpoint. The system uses a multiplier-based approach for displaying different game counts:

| Multiplier | Display Count | API Response | Purpose |
|------------|---------------|--------------|---------|
| 100 | 82 games | Actual schedule | Standard NBA season |
| 10 | 820 games | Actual × 10 | Extended simulation display |
| 1 | 8200 games | Actual × 100 | Statistical analysis display |

```mermaid
graph LR
    subgraph "Schedule Generation Flow"
        TeamSelection["selectedTeams2<br/>Home Team Selection"]
        LeagueSelection["selectedLeague<br/>League Context"]
        HandleSchedule82["handleSchedule82()<br/>GameSetup Function"]
        APICall["get_82_game_schedule.php<br/>API Endpoint"]
        ResponseData["BodyResponse<br/>JSON String Response"]
        ParsedData["TeamsSchedule[]<br/>teams, games fields"]
        StateUpdate["setTeamsSchedule()<br/>State Update"]
        DisplayTable["Schedule Display<br/>with multiplier"]
    end
    
    TeamSelection --> HandleSchedule82
    LeagueSelection --> HandleSchedule82
    HandleSchedule82 --> APICall
    APICall --> ResponseData
    ResponseData --> ParsedData
    ParsedData --> StateUpdate
    StateUpdate --> DisplayTable
```

Sources: [src/pages/GameSetup.tsx:428-447](), [src/pages/FullSeasonVersion.tsx:753-784](), [src/pages/GameSetup.tsx:37-44]()

## Substitution Pattern Management

The substitution pattern system provides granular control over player rotations during games, organized in 4-minute intervals across four quarters:

### Pattern Structure

```mermaid
graph TB
    subgraph "Substitution Pattern Structure"
        PlayerSubPattern["PlayerSubPattern[]<br/>12 Intervals Total"]
        
        subgraph "Quarter 1"
            Interval0["0-4 min<br/>pos1-pos5"]
            Interval1["4-8 min<br/>pos1-pos5"]
            Interval2["8-12 min<br/>pos1-pos5"]
        end
        
        subgraph "Quarter 2"
            Interval3["12-16 min<br/>pos1-pos5"]
            Interval4["16-20 min<br/>pos1-pos5"]
            Interval5["20-24 min<br/>pos1-pos5"]
        end
        
        subgraph "Quarter 3"
            Interval6["24-28 min<br/>pos1-pos5"]
            Interval7["28-32 min<br/>pos1-pos5"]
            Interval8["32-36 min<br/>pos1-pos5"]
        end
        
        subgraph "Quarter 4"
            Interval9["36-40 min<br/>pos1-pos5"]
            Interval10["40-44 min<br/>pos1-pos5"]
            Interval11["44-48 min<br/>pos1-pos5"]
        end
    end
    
    PlayerSubPattern --> Interval0
    PlayerSubPattern --> Interval3
    PlayerSubPattern --> Interval6
    PlayerSubPattern --> Interval9
```

Sources: [src/pages/FullSeasonVersion.tsx:96-102](), [src/pages/FullSeasonVersion.tsx:227-229]()

### Drag-and-Drop Interface

The substitution pattern interface supports drag-and-drop functionality for assigning players to positions:

```mermaid
sequenceDiagram
    participant User
    participant PlayerList["Available Players<br/>playersTeam2[]"]
    participant DropZone["Position Cell<br/>TableCell"]
    participant ValidationLogic["handleDrop()<br/>Duplicate Check"]
    participant StateUpdate["playerSubPattern<br/>State Update"]
    
    User->>PlayerList: "Drag Player"
    PlayerList->>DropZone: "onDragStart<br/>setData(player_name)"
    User->>DropZone: "Drop on Position"
    DropZone->>ValidationLogic: "handleDrop(intervalIndex, posKey)"
    ValidationLogic->>ValidationLogic: "Check Duplicate in Interval"
    alt No Duplicate
        ValidationLogic->>StateUpdate: "Update Pattern"
    else Duplicate Found
        ValidationLogic->>User: "Toast Error Message"
    end
```

Sources: [src/pages/FullSeasonVersion.tsx:194-221](), [src/pages/FullSeasonVersion.tsx:517-532]()

## Simulation Modes

The system supports three distinct simulation modes controlled by the `schedule` state variable and executed through the `handlePredictMode` function:

### Predict Games Mode (`schedule === "predict"`)

Executes prediction simulations using the `play_predict.php` endpoint:

```mermaid
graph LR
    subgraph "Predict Mode Execution"
        PredictRadio["CustomRadio<br/>value='predict'"]
        PlayGamesButton["PLAY GAMES Button<br/>handlePlayGames()"]
        HandlePredictMode["handlePredictMode()<br/>GameSetup Function"]
        APIEndpoint["play_predict.php<br/>API Endpoint"]
        FetchBoxScoreFullSeason["handleFetchBoxScoreFullSeason()<br/>Results Retrieval"]
        BoxScoreData["boxScoreFullSeason[]<br/>State Update"]
    end
    
    PredictRadio --> PlayGamesButton
    PlayGamesButton --> HandlePredictMode
    HandlePredictMode --> APIEndpoint
    APIEndpoint --> FetchBoxScoreFullSeason
    FetchBoxScoreFullSeason --> BoxScoreData
```

### 8200 Game Schedule Mode (`schedule === "8200"`)

Full season simulation with advanced configuration options:

```mermaid
graph TB
    subgraph "8200 Mode Features"
        EightTwoHundredRadio["CustomRadio<br/>value='8200'"]
        AltsDropdown["getAlts Dropdown<br/>Alternative Substitutions"]
        SubPattern["Substitution Pattern<br/>4-minute intervals"]
        LocationRadio["Location Settings<br/>home/away/both/neutral"]
        SaveOptions["Save Checkboxes<br/>savePbp, saveBox"]
        APICall["play_82 endpoint<br/>keeppbp='Y'"]
    end
    
    EightTwoHundredRadio --> AltsDropdown
    EightTwoHundredRadio --> SubPattern
    EightTwoHundredRadio --> LocationRadio
    EightTwoHundredRadio --> SaveOptions
    EightTwoHundredRadio --> APICall
```

**Key Parameters for 8200 Mode:**
- `endpoint`: `"play_82"`
- `keeppbp`: `"Y"` (save play-by-play)
- `gamearray`: Contains prediction configuration
- `gamemode`: `"8200"`

### Full Season Replay Mode (`schedule === "fullseason"`)

Executes through the `play_fsv` endpoint for complete league season replay:

```mermaid
graph LR
    subgraph "Full Season Mode"
        FullSeasonRadio["CustomRadio<br/>value='fullseason'"]
        HandlePredictMode2["handlePredictMode()<br/>GameSetup Function"]
        PlayFSVEndpoint["play_fsv<br/>API Endpoint"]
        KeepPBP["keeppbp='N'<br/>No play-by-play"]
        Results["Season Results<br/>Processing"]
    end
    
    FullSeasonRadio --> HandlePredictMode2
    HandlePredictMode2 --> PlayFSVEndpoint
    PlayFSVEndpoint --> KeepPBP
    KeepPBP --> Results
```

Sources: [src/pages/GameSetup.tsx:467-494](), [src/pages/FullSeasonVersion.tsx:717-719](), [src/pages/FullSeasonVersion.tsx:291-305](), [src/pages/FullSeasonVersion.tsx:401-419]()

## Data Export and Analysis

The system provides comprehensive data export capabilities:

### Export Features

| Data Type | Export Function | File Format |
|-----------|----------------|-------------|
| Player Statistics | `exportToCSV(playersTeam1, filename)` | CSV |
| Substitution Patterns | `exportToCSV(playerSubPattern, filename)` | CSV |
| Box Scores | Sheet display with copy functionality | Text |

```mermaid
graph TB
    subgraph "Export System"
        PlayerStats["Player Statistics<br/>PlayerChar[]"]
        SubPatterns["Substitution Patterns<br/>PlayerSubPattern[]"]
        BoxScoreData["Box Score Data<br/>BoxScore[]"]
        
        ExportCSV["exportToCSV()<br/>Utils Function"]
        SheetDisplay["Sheet Component<br/>Display Interface"]
        
        PlayerStats --> ExportCSV
        SubPatterns --> ExportCSV
        BoxScoreData --> SheetDisplay
    end
```

Sources: [src/pages/FullSeasonVersion.tsx:411-411](), [src/pages/FullSeasonVersion.tsx:553-553](), [src/pages/FullSeasonVersion.tsx:617-617](), [src/lib/utils.ts:8-42]()

## User Interface Components

The Season Management interface is organized into several key sections:

### Navigation Tabs

Quick access buttons for different views and functionalities:

```mermaid
graph LR
    subgraph "Navigation Tabs"
        GameSetup["Game Setup<br/>Button"]
        RawStats["Raw Stats<br/>Button"]
        BoxScoreSheet["Show Box Score<br/>Sheet Trigger"]
        SortableStats["Sortable Stats<br/>Button"]
        SortableBox["Sortable Box Scores<br/>Button"]
        PlayByPlay["Play by Play<br/>Button"]
    end
```

Sources: [src/pages/FullSeasonVersion.tsx:281-304]()

### Configuration Panel

Main configuration area with team selection and game mode options:

- **League Selection**: Dropdown with available leagues
- **Team Selection**: Separate dropdowns for away and home teams
- **Alternative Substitutions**: Available when in schedule mode
- **Simulation Mode Radios**: Schedule, Predict, or Replay options
- **Location Options**: Home, Away, Both, or Neutral settings
- **Save Options**: Checkboxes for play-by-play and box score saving

Sources: [src/pages/FullSeasonVersion.tsx:308-720]()

### Schedule Display

Real-time display of generated schedules with team logos and game counts:

```mermaid
graph TB
    subgraph "Schedule Display"
        ScheduleTable["Schedule Table<br/>Table Component"]
        TeamLogos["TeamLogo Component<br/>Logo Display"]
        GameCounts["Game Counts<br/>Calculated from multiplier"]
        
        TeamsScheduleData["teamsSchedule[]<br/>Schedule Data"]
        TeamLogosData["teamLogos{}<br/>Logo Mapping"]
        
        TeamsScheduleData --> ScheduleTable
        TeamLogosData --> TeamLogos
        TeamLogos --> ScheduleTable
    end
```

Sources: [src/pages/FullSeasonVersion.tsx:753-784](), [src/pages/FullSeasonVersion.tsx:261-263]()

## State Management

The component manages extensive state for season simulation:

### Core State Variables

| State Variable | Type | Values | Purpose |
|----------------|------|--------|---------|
| `schedule` | string | `"predict"`, `"8200"`, `"fullseason"` | Current simulation mode |
| `location` | string | `"home"`, `"away"`, `"both"`, `"neutral"` | Game location setting |
| `savePbp` | boolean | `true`/`false` | Save play-by-play flag |
| `saveBox` | boolean | `true`/`false` | Save box scores flag |
| `isSimulating` | boolean | `true`/`false` | Simulation in progress |
| `multiplier` | number | `1`, `10`, `100` | Schedule display scale factor |
| `playerSubPattern` | PlayerSubPattern[] \| null | Array of 12 intervals | Substitution patterns |
| `isSubPatternSheetOpen` | boolean | `true`/`false` | Sheet visibility control |
| `isFetchingSubPattern` | boolean | `true`/`false` | Loading state for patterns |

Sources: [src/pages/FullSeasonVersion.tsx:194-202](), [src/pages/GameSetup.tsx:287-289]()

### Props Interface

The `FullSeasonVersion` component receives comprehensive props from the parent `GameSetup` component:

```mermaid
graph TB
    subgraph "FullSeasonVersionProps Interface"
        ConfigData["leagues: League[]<br/>selectedLeague: League | null<br/>teams: Team[]<br/>selectedTeams1/2: Team | null"]
        PlayerData["playersTeam1: PlayerChar[]<br/>playersTeam2: PlayerChar[]"]
        ScheduleData["teamsSchedule: TeamsSchedule[]<br/>setTeamsSchedule: Dispatch"]
        SimulationData["boxScoreFullSeason: BoxScoreFullSeason[]<br/>setBoxScoreFullSeason: Dispatch"]
        APIHandlers["handleFetchScoreBoard: () => Promise<void><br/>handleSchedule82: () => Promise<void><br/>handlePredictMode: () => Promise<void>"]
        SubstitutionData["handleFetchPlayerSubpattern: () => Promise<PlayerSubPattern[] | null><br/>handleFetchSetPlayerSubpattern: () => Promise<void | null>"]
        UtilityData["teamLogos: { [key: string]: string }<br/>getAlts: GetAlts[]<br/>getAltsSelected: string | null<br/>error: string | null<br/>isLoading: boolean"]
        StateControls["schedule: string | null<br/>setSchedule: Dispatch<string><br/>location: string | null<br/>setLocation: Dispatch<string>"]
    end
```

Sources: [src/pages/FullSeasonVersion.tsx:115-151](), [src/pages/GameSetup.tsx:896-932]()

## Integration Points

The Season Management system integrates with several external systems:

### API Integration

- **Basketball Simulation API**: Handles game simulation requests
- **Schedule Generation**: Creates game schedules based on selected parameters
- **Player Data Retrieval**: Fetches player statistics and characteristics
- **Substitution Pattern API**: Manages player rotation data

### State Management Integration

- **ApiContext**: Receives API handler functions and state
- **Parent Component**: Inherits configuration from GameSetup component
- **Toast Notifications**: Provides user feedback through toast system

Sources: [src/pages/FullSeasonVersion.tsx:29-29](), [src/pages/FullSeasonVersion.tsx:126-133]()