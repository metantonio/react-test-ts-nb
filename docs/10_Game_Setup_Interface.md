# Game Setup Interface

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/components/ui/sheet.tsx](/src/components/ui/sheet.tsx)
- [src/pages/GameSetup.tsx](/src/pages/GameSetup.tsx)

</details>



## Purpose and Scope

The Game Setup Interface serves as the central orchestration component for initializing and configuring basketball game simulations. It provides the main user interface for selecting leagues, teams, and game modes, while managing the complex state transitions required to prepare a game for simulation. This component acts as the primary entry point after authentication and coordinates data fetching from external basketball simulation APIs.

For information about the actual game simulation mechanics, see [Basketball Simulation](./14_Basketball_Simulation.md). For details about the authentication system that precedes this interface, see [Authentication System](./6_Authentication_System.md).

## Component Architecture Overview

The `GameSetup` component implements a tabbed interface architecture that separates different game simulation modes while sharing common setup functionality.

```mermaid
graph TD
    GameSetup["GameSetup Component<br/>(src/pages/GameSetup.tsx)"]
    
    subgraph "Tab Components"
        FullSeason["FullSeasonVersion<br/>Line 564-583"]
        SingleGame["SingleGameVersion<br/>Line 586"]
        Instructions["Instructions<br/>Line 589"]
    end
    
    subgraph "UI Components"
        Tabs["Tabs/TabsList/TabsContent<br/>Lines 556-591"]
        Button["Button component<br/>Line 553"]
    end
    
    subgraph "Context Dependencies"
        ApiContext["useApi hook<br/>Line 227"]
        Navigate["useNavigate hook<br/>Line 228"]
    end
    
    GameSetup --> FullSeason
    GameSetup --> SingleGame
    GameSetup --> Instructions
    GameSetup --> Tabs
    GameSetup --> Button
    GameSetup --> ApiContext
    GameSetup --> Navigate
```

**Tab Structure:**
- **Full Season Version**: Complete league and team setup with live data
- **Single Game Version**: Simplified game mode with hardcoded data  
- **Instructions**: User guidance and documentation

Sources: [src/pages/GameSetup.tsx:556-591]()

## Data Flow and State Management

The component maintains extensive state for managing the game setup process, with cascading effects that trigger API calls as selections are made.

```mermaid
graph TD
    subgraph "Initial Load"
        useEffect1["useEffect leagues<br/>Lines 491-495"]
        handleFetchLeagues["handleFetchLeagues()<br/>Lines 318-332"]
        leagues["leagues state<br/>Line 229"]
    end
    
    subgraph "League Selection Flow"
        selectedLeague["selectedLeague state<br/>Line 231"]
        useEffect2["useEffect selectedLeague<br/>Lines 497-505"]
        handleFetchTeams["handleFetchTeams()<br/>Lines 334-348"]
        teams["teams state<br/>Line 232"]
    end
    
    subgraph "Team Selection Flow"
        selectedTeams1["selectedTeams1 state<br/>Line 233"]
        selectedTeams2["selectedTeams2 state<br/>Line 234"]
        useEffect3["useEffect teams<br/>Lines 507-515"]
        handleSingleGameInitial["handleSingleGameInitial()<br/>Lines 350-366"]
    end
    
    subgraph "Player Data Flow"
        useEffect4["useEffect team1<br/>Lines 517-532"]
        useEffect5["useEffect team2<br/>Lines 534-548"]
        handleFetchPlayersTeam1["handleFetchPlayersTeam1()<br/>Lines 421-436"]
        handleFetchPlayersTeam2["handleFetchPlayersTeam2()<br/>Lines 438-453"]
        playersTeam1["playersTeam1 state<br/>Line 239"]
        playersTeam2["playersTeam2 state<br/>Line 278"]
    end
    
    useEffect1 --> handleFetchLeagues
    handleFetchLeagues --> leagues
    leagues --> selectedLeague
    selectedLeague --> useEffect2
    useEffect2 --> handleFetchTeams
    handleFetchTeams --> teams
    teams --> selectedTeams1
    teams --> selectedTeams2
    selectedTeams1 --> useEffect3
    selectedTeams2 --> useEffect3
    useEffect3 --> handleSingleGameInitial
    selectedTeams1 --> useEffect4
    useEffect4 --> handleFetchPlayersTeam1
    handleFetchPlayersTeam1 --> playersTeam1
    selectedTeams2 --> useEffect5
    useEffect5 --> handleFetchPlayersTeam2
    handleFetchPlayersTeam2 --> playersTeam2
```

Sources: [src/pages/GameSetup.tsx:491-548]()

## API Integration Points

The component integrates with multiple external API endpoints through the `fetchWithAuth` method, handling authentication and error management consistently.

```mermaid
graph LR
    subgraph "API Functions"
        fetchWithAuth["fetchWithAuth<br/>from useApi()"]
    end
    
    subgraph "Basketball Simulation Endpoints"
        getLeagues["get_leagues.php<br/>Line 321"]
        getTeams["get_teams.php<br/>Line 337"]
        playSingle["playsinglegame_initial.php<br/>Line 354"]
        getStats["get_singlegame_stats.php<br/>Line 371"]
        getPlayers["get_actual_player_stats.php<br/>Lines 424, 441"]
        getPBP["get_singlegame_pbp.php<br/>Line 458"]
        getBox["get_singlegame_box.php<br/>Line 474"]
        playPredict["play_predict.php<br/>Line 387"]
        playStep["playsinglegame_step.php<br/>Line 409"]
    end
    
    subgraph "State Updates"
        setLeagues["setLeagues<br/>Line 328"]
        setTeams["setTeams<br/>Line 344"] 
        setScoreBoard["setScoreBoard<br/>Line 378"]
        setPlayersTeam1["setPlayersTeam1<br/>Line 431"]
        setPlayersTeam2["setPlayersTeam2<br/>Line 447"]
        setPlayByPlay["setPlayByPlay<br/>Line 465"]
        setBoxScore["setBoxScore<br/>Line 481"]
    end
    
    fetchWithAuth --> getLeagues
    fetchWithAuth --> getTeams
    fetchWithAuth --> playSingle
    fetchWithAuth --> getStats
    fetchWithAuth --> getPlayers
    fetchWithAuth --> getPBP
    fetchWithAuth --> getBox
    fetchWithAuth --> playPredict
    fetchWithAuth --> playStep
    
    getLeagues --> setLeagues
    getTeams --> setTeams
    getStats --> setScoreBoard
    getPlayers --> setPlayersTeam1
    getPlayers --> setPlayersTeam2
    getPBP --> setPlayByPlay
    getBox --> setBoxScore
```

**Key API Endpoints:**
| Endpoint | Purpose | Trigger |
|----------|---------|---------|
| `get_leagues.php` | Fetch available leagues | Component mount |
| `get_teams.php` | Fetch teams for selected league | League selection |
| `playsinglegame_initial.php` | Initialize single game | Both teams selected |
| `get_actual_player_stats.php` | Fetch player statistics | Team selection |
| `play_predict.php` | Set prediction mode | Both teams selected |

Sources: [src/pages/GameSetup.tsx:318-485]()

## TypeScript Interface System

The component defines comprehensive TypeScript interfaces that structure the API response data and internal state management.

```mermaid
graph TD
    subgraph "Core Data Interfaces"
        League["League<br/>Lines 14-16"]
        Teams["Teams<br/>Lines 22-24"] 
        PlayerChar["PlayerChar<br/>Lines 30-68"]
        ScoreBoard["ScoreBoard<br/>Lines 78-168"]
    end
    
    subgraph "Response Interfaces"
        LeagueResponse["LeagueResponse<br/>Lines 18-20"]
        TeamsResponse["TeamsResponse<br/>Lines 26-28"]
        PlayerCharResponse["PlayerCharResponse<br/>Lines 70-72"]
        ScoreBoardResponse["ScoreBoardResponse<br/>Lines 170-172"]
    end
    
    subgraph "Game Data Interfaces"
        PlayByPlay["PlayByPlay<br/>Lines 174-177"]
        BoxScore["BoxScore<br/>Lines 183-187"]
        UpdatePlayByPlayResponse["UpdatePlayByPlayResponse<br/>Lines 179-181"]
        BoxScoreResponse["BoxScoreResponse<br/>Lines 189-191"]
    end
    
    League --> LeagueResponse
    Teams --> TeamsResponse
    PlayerChar --> PlayerCharResponse
    ScoreBoard --> ScoreBoardResponse
    PlayByPlay --> UpdatePlayByPlayResponse
    BoxScore --> BoxScoreResponse
```

**Key Interface Details:**
- `PlayerChar` interface contains 45+ properties covering all basketball statistics
- `ScoreBoard` interface tracks real-time game state including player positions and statistics
- Response interfaces wrap data arrays from API calls
- All numeric values are typed as strings due to API response format

Sources: [src/pages/GameSetup.tsx:10-191]()

## Team Logo and Asset Management

The component includes a comprehensive mapping of NBA team names to their official logo URLs for visual enhancement of the interface.

```mermaid
graph LR
    subgraph "Asset Configuration"
        teamLogos["teamLogos object<br/>Lines 193-224"]
    end
    
    subgraph "Team Data Integration"
        selectedTeams1["selectedTeams1"]
        selectedTeams2["selectedTeams2"]
        FullSeasonVersion["FullSeasonVersion component"]
    end
    
    subgraph "External Resources"
        WikipediaLogos["Wikipedia Commons<br/>Logo SVG files"]
    end
    
    teamLogos --> FullSeasonVersion
    selectedTeams1 --> FullSeasonVersion  
    selectedTeams2 --> FullSeasonVersion
    WikipediaLogos --> teamLogos
```

The `teamLogos` object maps 30 NBA team names to their Wikipedia Commons SVG logo URLs, providing visual identification in the game interface.

Sources: [src/pages/GameSetup.tsx:193-224](), [src/pages/GameSetup.tsx:582]()

## Error Handling and Loading States

The component implements consistent error handling and loading state management across all API operations.

| State Variable | Purpose | Usage |
|----------------|---------|-------|
| `error` | Store error messages | Set in catch blocks, displayed in UI |
| `isLoading` | Track API request status | From `useApi()` hook, disables buttons |
| `isGameInitial` | Track game initialization | Local loading state for game setup |

**Error Handling Pattern:**
1. Clear existing errors with `setError(null)`
2. Wrap API calls in try-catch blocks
3. Parse error responses and set descriptive error messages
4. Display errors in UI components

Sources: [src/pages/GameSetup.tsx:230](), [src/pages/GameSetup.tsx:235](), [src/pages/GameSetup.tsx:319-331]()