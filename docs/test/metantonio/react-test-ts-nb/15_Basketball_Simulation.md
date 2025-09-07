# Basketball Simulation

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/components/PlayerStatsTable.tsx](src/components/PlayerStatsTable.tsx)
- [src/components/Scoreboard.tsx](src/components/Scoreboard.tsx)
- [src/gamesetup_result_image.png](src/gamesetup_result_image.png)
- [src/pages/GameSetup.tsx](src/pages/GameSetup.tsx)
- [src/pages/Instructions.tsx](src/pages/Instructions.tsx)
- [src/pages/SingleGameVersion.tsx](src/pages/SingleGameVersion.tsx)

</details>



This document covers the core basketball simulation functionality that powers the NBA game simulation features. The basketball simulation system handles game mechanics, player statistics, real-time game state management, and integration with external basketball APIs. For information about the user interface components that display simulation results, see [Game Simulation Interfaces](#4.3). For details about season-long management features, see [Season Management](#5.2).

## System Architecture

The basketball simulation system is built around a central orchestrator pattern where the `GameSetup` component coordinates all simulation activities through external API calls and state management.

```mermaid
graph TB
    subgraph "Simulation Orchestrator"
        GameSetup["GameSetup<br/>(Primary Controller)"]
    end
    
    subgraph "Simulation Modes"
        FullSeasonVersion["FullSeasonVersion<br/>(Season Simulation)"]
        SingleGameVersion["SingleGameVersion<br/>(Single Game UI)"]
    end
    
    subgraph "Data Management"
        PlayerChar["PlayerChar Interface<br/>(Player Statistics)"]
        ScoreBoard["ScoreBoard Interface<br/>(Game State)"]
        PlayByPlay["PlayByPlay Interface<br/>(Game Events)"]
        BoxScore["BoxScore Interface<br/>(Game Summary)"]
    end
    
    subgraph "External API"
        BasketballAPI["Basketball Simulation API<br/>(bballsports.com)"]
        Endpoints["API Endpoints:<br/>get_leagues.php<br/>get_teams.php<br/>playsinglegame_initial.php<br/>get_singlegame_stats.php<br/>play_predict.php"]
    end
    
    subgraph "Display Components"
        PlayerStatsTable["PlayerStatsTable<br/>(Statistics Display)"]
        Scoreboard["Scoreboard<br/>(Game Status)"]
    end
    
    GameSetup --> FullSeasonVersion
    GameSetup --> SingleGameVersion
    GameSetup --> PlayerChar
    GameSetup --> ScoreBoard
    GameSetup --> PlayByPlay
    GameSetup --> BoxScore
    GameSetup --> BasketballAPI
    BasketballAPI --> Endpoints
    
    PlayerChar --> PlayerStatsTable
    ScoreBoard --> Scoreboard
    
    style GameSetup fill:#f9f,stroke:#333,stroke-width:3px
    style BasketballAPI fill:#bbf,stroke:#333,stroke-width:2px
```

The simulation system operates through a series of coordinated API calls that manage game state, player data, and simulation execution. The `GameSetup` component serves as the central coordinator, managing data flow between the external basketball simulation API and the application's user interface components.

Sources: [src/pages/GameSetup.tsx:1-947](), [src/components/PlayerStatsTable.tsx:1-57](), [src/components/Scoreboard.tsx:1-101](), [src/pages/SingleGameVersion.tsx:1-273]()

## Game Simulation Modes

The basketball simulation supports two primary modes of operation, each with distinct data flows and API interaction patterns.

```mermaid
graph LR
    subgraph "Full Season Mode"
        LeagueSelection["handleFetchLeagues<br/>(get_leagues.php)"]
        TeamSelection["handleFetchTeams<br/>(get_teams.php)"]
        PlayerData["handleFetchPlayersTeam1/2<br/>(get_actual_player_stats.php)"]
        SeasonSim["handlePredictMode<br/>(play_predict.php)"]
        SeasonResults["handleFetchBoxScoreFullSeason<br/>(get_raw_box_scores.php)"]
    end
    
    subgraph "Single Game Mode"
        GameInit["handleSingleGameInitial<br/>(playsinglegame_initial.php)"]
        GameState["handleFetchScoreBoard<br/>(get_singlegame_stats.php)"]
        PlayEvents["handleFetchPlayByPlay<br/>(get_singlegame_pbp.php)"]
        GameBox["handleFetchBoxScore<br/>(get_singlegame_box.php)"]
    end
    
    subgraph "Shared Components"
        PlayerStats["PlayerChar Interface"]
        GameDisplay["Scoreboard Component"]
    end
    
    LeagueSelection --> TeamSelection
    TeamSelection --> PlayerData
    PlayerData --> SeasonSim
    SeasonSim --> SeasonResults
    
    GameInit --> GameState
    GameState --> PlayEvents
    PlayEvents --> GameBox
    
    PlayerData --> PlayerStats
    GameState --> GameDisplay
    
    style SeasonSim fill:#ffd,stroke:#333,stroke-width:2px
    style GameInit fill:#dff,stroke:#333,stroke-width:2px
```

### Full Season Simulation

Full season simulation operates through the `handlePredictMode` function which supports multiple simulation types controlled by the `schedule` state variable. The simulation can run in three modes: `"predict"` for predictive analysis, `"8200"` for full season play, and `"fsv"` for full season version.

Sources: [src/pages/GameSetup.tsx:467-494](), [src/pages/GameSetup.tsx:287-288]()

### Single Game Simulation

Single game simulation begins with `handleSingleGameInitial` which sets up the initial game state, followed by real-time updates through `handleFetchScoreBoard` to retrieve current game status. The system tracks detailed play-by-play events and maintains comprehensive box score statistics.

Sources: [src/pages/GameSetup.tsx:410-426](), [src/pages/GameSetup.tsx:449-465]()

## Player Data Management

The basketball simulation manages comprehensive player statistics through the `PlayerChar` interface, which contains both current season statistics and simulation-specific attributes.

| Category | Properties | Purpose |
|----------|------------|---------|
| Basic Info | `name`, `position`, `height`, `year`, `team_code` | Player identification |
| Simulation Stats | `poss_fact`, `two_pt_fg_pct`, `ft_pct`, `pct_shot` | Simulation mechanics |
| Game Stats | `ptsg`, `min`, `fgpct`, `threeptfgpct`, `totreb` | Performance metrics |
| Advanced Stats | `def_fg_pct`, `pct_pf`, `pct_st`, `pct_bs` | Defensive abilities |

```mermaid
graph TB
    subgraph "Player Data Flow"
        SelectTeam["Team Selection"]
        FetchPlayers["handleFetchPlayersTeam1/2"]
        PlayerChar["PlayerChar Interface<br/>(84 properties)"]
        StatsDisplay["PlayerStatsTable Component"]
    end
    
    subgraph "API Endpoints"
        ActualStats["get_actual_player_stats.php<br/>(Real Statistics)"]
        EditableStats["get_players_chars.php<br/>(Editable Statistics)"]
    end
    
    subgraph "Player Characteristics"
        SimulationAttrs["Simulation Attributes:<br/>poss_fact, deny_fact<br/>pct_shot, pct_fouled<br/>pct_to, pct_pass"]
        GameStats["Game Statistics:<br/>ptsg, min, fgpct<br/>threeptfgpct, ftpct<br/>offreb, defreb, totreb"]
        DefensiveStats["Defensive Stats:<br/>def_fg_pct, pct_pf<br/>pct_st, pct_bs<br/>defrat"]
    end
    
    SelectTeam --> FetchPlayers
    FetchPlayers --> ActualStats
    FetchPlayers --> EditableStats
    ActualStats --> PlayerChar
    EditableStats --> PlayerChar
    PlayerChar --> SimulationAttrs
    PlayerChar --> GameStats
    PlayerChar --> DefensiveStats
    PlayerChar --> StatsDisplay
    
    style PlayerChar fill:#fef,stroke:#333,stroke-width:2px
    style FetchPlayers fill:#eff,stroke:#333,stroke-width:2px
```

The `PlayerChar` interface serves dual purposes, containing both actual player statistics from real NBA data and editable simulation parameters. The system maintains separate endpoints for retrieving actual statistics versus simulation-specific characteristics.

Sources: [src/pages/GameSetup.tsx:46-84](), [src/pages/GameSetup.tsx:516-538](), [src/pages/GameSetup.tsx:540-563]()

## Real-Time Game State Management

The simulation system maintains real-time game state through the `ScoreBoard` interface, which tracks comprehensive game information including scores, game clock, player positions, and individual player statistics.

```mermaid
graph TB
    subgraph "Game State Components"
        ScoreBoardInterface["ScoreBoard Interface"]
        GameClock["Game Timing:<br/>quarter, clock"]
        TeamScores["Team Data:<br/>away_score, home_score<br/>away_possessions, home_possessions<br/>away_fouls, home_fouls"]
        PlayerPositions["Player Positions:<br/>away_player1-5<br/>home_player1-5<br/>off_position1-5, def_position1-5"]
        PlayerStats["Individual Stats:<br/>player_pts, player_reb<br/>player_ast, player_pf<br/>player_possfact"]
    end
    
    subgraph "Game Flow Control"
        GameState["handleFetchScoreBoard"]
        PlayAdvance["handlePredictPlay"]
        GameAPI["get_singlegame_stats.php"]
        StepAPI["playsinglegame_step.php"]
    end
    
    subgraph "Display Components"
        ScoreboardComp["Scoreboard Component"]
        GameDisplay["Game Status Display"]
    end
    
    ScoreBoardInterface --> GameClock
    ScoreBoardInterface --> TeamScores
    ScoreBoardInterface --> PlayerPositions
    ScoreBoardInterface --> PlayerStats
    
    GameState --> GameAPI
    PlayAdvance --> StepAPI
    GameAPI --> ScoreBoardInterface
    StepAPI --> ScoreBoardInterface
    
    ScoreBoardInterface --> ScoreboardComp
    ScoreBoardInterface --> GameDisplay
    
    style ScoreBoardInterface fill:#ffd,stroke:#333,stroke-width:2px
    style GameState fill:#dff,stroke:#333,stroke-width:2px
```

The `ScoreBoard` interface contains 184 individual properties tracking every aspect of the game state, from basic scores to detailed player positioning and individual performance metrics. The system updates this state through periodic API calls during game simulation.

Sources: [src/pages/GameSetup.tsx:94-184](), [src/pages/GameSetup.tsx:449-465](), [src/components/Scoreboard.tsx:3-14]()

## Play-by-Play and Box Score Systems

The simulation generates detailed game narratives through the play-by-play system and comprehensive statistical summaries through box scores.

```mermaid
graph LR
    subgraph "Game Events System"
        PlayByPlayInterface["PlayByPlay Interface"]
        EventData["Event Properties:<br/>color (display styling)<br/>pbp_line (event description)"]
        PlayByPlayAPI["get_singlegame_pbp.php"]
    end
    
    subgraph "Statistics System"
        BoxScoreInterface["BoxScore Interface"]
        SingleGameBox["Single Game:<br/>box_line, game_number<br/>line_number"]
        FullSeasonBox["Full Season:<br/>text, game_number<br/>line_number"]
        BoxScoreAPI["get_singlegame_box.php<br/>get_raw_box_scores.php"]
    end
    
    subgraph "Display Integration"
        PlayByPlayDisplay["Play-by-Play Display"]
        BoxScoreDisplay["Box Score Tables"]
        SingleGameUI["SingleGameVersion"]
    end
    
    PlayByPlayInterface --> EventData
    PlayByPlayAPI --> PlayByPlayInterface
    
    BoxScoreInterface --> SingleGameBox
    BoxScoreInterface --> FullSeasonBox
    BoxScoreAPI --> BoxScoreInterface
    
    PlayByPlayInterface --> PlayByPlayDisplay
    BoxScoreInterface --> BoxScoreDisplay
    PlayByPlayDisplay --> SingleGameUI
    BoxScoreDisplay --> SingleGameUI
    
    style PlayByPlayInterface fill:#ffe,stroke:#333,stroke-width:2px
    style BoxScoreInterface fill:#eff,stroke:#333,stroke-width:2px
```

The play-by-play system generates color-coded event descriptions that provide narrative context for game actions. The box score system maintains separate interfaces for single games versus full season statistics, with different data structures optimized for each use case.

Sources: [src/pages/GameSetup.tsx:190-197](), [src/pages/GameSetup.tsx:199-213](), [src/pages/GameSetup.tsx:565-587](), [src/pages/GameSetup.tsx:589-633]()

## API Integration Architecture

The basketball simulation integrates with external APIs through a standardized request pattern that supports multiple simulation endpoints and authentication methods.

```mermaid
graph TB
    subgraph "API Request Pattern"
        fetchWithAuth["fetchWithAuth Function"]
        APIEndpoint["${API_URL}/conversionjs"]
        RequestBody["Request Body:<br/>endpoint (PHP file)<br/>method (POST)<br/>...simulation parameters"]
    end
    
    subgraph "Simulation Endpoints"
        LeagueAPI["get_leagues.php"]
        TeamsAPI["get_teams.php"]
        PlayerAPI["get_actual_player_stats.php"]
        GameInitAPI["playsinglegame_initial.php"]
        GameStatsAPI["get_singlegame_stats.php"]
        PredictAPI["play_predict.php"]
        BoxScoreAPI["get_raw_box_scores.php"]
    end
    
    subgraph "Response Processing"
        BodyResponse["BodyResponse Interface"]
        JSONParsing["JSON.parse(data.body)"]
        StateUpdate["React State Updates"]
    end
    
    fetchWithAuth --> APIEndpoint
    APIEndpoint --> RequestBody
    RequestBody --> LeagueAPI
    RequestBody --> TeamsAPI
    RequestBody --> PlayerAPI
    RequestBody --> GameInitAPI
    RequestBody --> GameStatsAPI
    RequestBody --> PredictAPI
    RequestBody --> BoxScoreAPI
    
    LeagueAPI --> BodyResponse
    TeamsAPI --> BodyResponse
    PlayerAPI --> BodyResponse
    BodyResponse --> JSONParsing
    JSONParsing --> StateUpdate
    
    style fetchWithAuth fill:#fef,stroke:#333,stroke-width:2px
    style APIEndpoint fill:#eff,stroke:#333,stroke-width:2px
```

All simulation API calls follow a consistent pattern where requests are sent to `/conversionjs` with a body containing the target PHP endpoint and simulation parameters. Responses are wrapped in a `BodyResponse` interface that requires JSON parsing to extract the actual data.

Sources: [src/pages/GameSetup.tsx:369-389](), [src/pages/GameSetup.tsx:17-19](), [src/pages/GameSetup.tsx:414-426](), [src/pages/GameSetup.tsx:467-494]()