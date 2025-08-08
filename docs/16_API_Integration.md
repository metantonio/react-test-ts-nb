# API Integration

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/components/ui/sheet.tsx](/src/components/ui/sheet.tsx)
- [src/contexts/ApiContext.tsx](/src/contexts/ApiContext.tsx)
- [src/contexts/AppStateContext.tsx](/src/contexts/AppStateContext.tsx)
- [src/contexts/NotificationContext.tsx](/src/contexts/NotificationContext.tsx)
- [src/hooks/useFetch.tsx](/src/hooks/useFetch.tsx)
- [src/pages/GameSetup.tsx](/src/pages/GameSetup.tsx)

</details>



This document covers the API integration system used throughout the NBA simulation application. It explains how the application communicates with external basketball simulation APIs, manages authentication, handles data fetching, and processes API responses.

For information about the broader state management patterns, see [State Management](./5_State_Management.md). For details about specific game simulation features that consume this API data, see [Game Features](./13_Game_Features.md).

## API Architecture Overview

The application uses a centralized API integration pattern with a dedicated context provider that manages authentication and provides standardized data fetching capabilities. The system primarily integrates with an external basketball simulation API hosted at `api.bballsports.com`.

### API Integration Flow

```mermaid
graph TD
    subgraph "Application Layer"
        GameSetup["GameSetup"]
        FullSeason["FullSeasonVersion"] 
        SingleGame["SingleGameVersion"]
    end
    
    subgraph "API Layer"
        ApiContext["ApiContext"]
        fetchWithAuth["fetchWithAuth()"]
        ApiCredentials["ApiCredentials"]
    end
    
    subgraph "External API"
        BballAPI["api.bballsports.com"]
        GetLeagues["get_leagues.php"]
        GetTeams["get_teams.php"] 
        PlayGame["playsinglegame_initial.php"]
        GetStats["get_singlegame_stats.php"]
        GetPBP["get_singlegame_pbp.php"]
        GetBox["get_singlegame_box.php"]
    end
    
    GameSetup --> ApiContext
    FullSeason --> ApiContext
    SingleGame --> ApiContext
    
    ApiContext --> fetchWithAuth
    fetchWithAuth --> ApiCredentials
    
    fetchWithAuth --> BballAPI
    BballAPI --> GetLeagues
    BballAPI --> GetTeams
    BballAPI --> PlayGame
    BballAPI --> GetStats
    BballAPI --> GetPBP
    BballAPI --> GetBox
```

**Sources:** [src/contexts/ApiContext.tsx:1-97](), [src/pages/GameSetup.tsx:226-597]()

## Authentication System

The API integration uses an API key-based authentication system managed through the `ApiContext`. Authentication credentials consist of two components: an API key and an authorization header.

### Authentication Data Structure

The authentication system uses the `ApiCredentials` interface to manage API access:

```mermaid
classDiagram
    class ApiCredentials {
        +string apiKey
        +string authorization
    }
    
    class ApiContext {
        +ApiCredentials api
        +boolean isAuthenticated
        +boolean isLoading
        +login(apiData: ApiCredentials)
        +logout()
        +fetchWithAuth(url, method, body)
    }
    
    ApiContext --> ApiCredentials : contains
```

**Sources:** [src/contexts/ApiContext.tsx:5-8](), [src/contexts/ApiContext.tsx:12-21]()

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginAPI
    participant ApiContext
    participant ExternalAPI
    
    User->>LoginAPI: "Enter API credentials"
    LoginAPI->>ApiContext: "login(apiKey, authorization)"
    ApiContext->>ApiContext: "setApi(credentials)"
    ApiContext->>ApiContext: "setIsAuthenticated(true)"
    
    Note over ApiContext: "Credentials stored for subsequent requests"
    
    User->>GameSetup: "Make API request"
    GameSetup->>ApiContext: "fetchWithAuth(url, method, body)"
    ApiContext->>ApiContext: "Add apikey to request body"
    ApiContext->>ApiContext: "Add Authorization header"
    ApiContext->>ExternalAPI: "HTTP request with auth"
    ExternalAPI-->>ApiContext: "API response"
    ApiContext-->>GameSetup: "Response data"
```

**Sources:** [src/contexts/ApiContext.tsx:33-43](), [src/contexts/ApiContext.tsx:45-70]()

## External API Endpoints

The application integrates with multiple endpoints of the basketball simulation API. Each endpoint serves a specific purpose in the game simulation workflow.

### Core API Endpoints

| Endpoint | Purpose | Method | Key Parameters |
|----------|---------|--------|----------------|
| `get_leagues.php` | Fetch available leagues | POST | `apikey` |
| `get_teams.php` | Get teams for selected league | POST | `apikey`, `league_name` |
| `playsinglegame_initial.php` | Initialize single game | POST | `homeaway`, `hometeam`, `awayteam`, `homeleague_name`, `awayleague_name` |
| `get_singlegame_stats.php` | Retrieve game scoreboard | POST | `apikey` |
| `get_actual_player_stats.php` | Get player statistics | POST | `apikey`, `league_name`, `team_name` |
| `get_singlegame_pbp.php` | Fetch play-by-play data | POST | `apikey` |
| `get_singlegame_box.php` | Get box score data | POST | `apikey` |
| `play_predict.php` | Initialize prediction mode | POST | `league_name`, `gamearray`, `gamemode` |
| `playsinglegame_step.php` | Step through game simulation | POST | `options` |

**Sources:** [src/pages/GameSetup.tsx:318-485]()

### API Request Authentication Pattern

The `fetchWithAuth` function automatically handles authentication by injecting credentials into requests:

```mermaid
flowchart LR
    Request["API Request"] --> CheckAuth["Check Authentication"]
    CheckAuth --> AddHeaders["Add Authorization Header"]
    AddHeaders --> AddApiKey["Add apikey to Body"]
    AddApiKey --> SendRequest["Send HTTP Request"]
    SendRequest --> HandleResponse["Process Response"]
    
    CheckAuth -->|"Not authenticated"| ThrowError["Throw Authentication Error"]
```

**Sources:** [src/contexts/ApiContext.tsx:45-70]()

## Data Flow Patterns

The API integration follows consistent patterns for data fetching, error handling, and state updates across different game components.

### Typical API Call Pattern

```mermaid
sequenceDiagram
    participant Component
    participant ApiContext
    participant ExternalAPI
    participant LocalState
    
    Component->>Component: "setError(null)"
    Component->>ApiContext: "fetchWithAuth(url, method, body)"
    ApiContext->>ExternalAPI: "HTTP request"
    
    alt Success Response
        ExternalAPI-->>ApiContext: "200 OK + data"
        ApiContext-->>Component: "Response object"
        Component->>Component: "await response.json()"
        Component->>LocalState: "setState(data)"
    else Error Response
        ExternalAPI-->>ApiContext: "Error status"
        ApiContext-->>Component: "Response object"
        Component->>Component: "Handle error response"
        Component->>LocalState: "setError(message)"
    end
```

**Sources:** [src/pages/GameSetup.tsx:318-332](), [src/pages/GameSetup.tsx:334-348]()

### Response Data Processing

API responses follow consistent TypeScript interfaces for type safety:

```mermaid
classDiagram
    class LeagueResponse {
        +League[] data
    }
    
    class TeamsResponse {
        +Teams[] data
    }
    
    class PlayerCharResponse {
        +PlayerChar[] data
    }
    
    class ScoreBoardResponse {
        +ScoreBoard[] scoreboard
    }
    
    class UpdatePlayByPlayResponse {
        +PlayByPlay[] playbyplay
    }
    
    class BoxScoreResponse {
        +BoxScore[] boxscore
    }
```

**Sources:** [src/pages/GameSetup.tsx:14-191]()

## Error Handling

The API integration implements comprehensive error handling at multiple levels to ensure robust operation and user feedback.

### Error Handling Hierarchy

```mermaid
flowchart TD
    APICall["API Call Initiated"] --> TryCatch["Try-Catch Block"]
    TryCatch --> CheckResponse["Check response.ok"]
    
    CheckResponse -->|"response.ok = false"| ParseError["Parse Error Message"]
    CheckResponse -->|"response.ok = true"| ParseData["Parse Response Data"]
    
    ParseError --> SetError["setError(error message)"]
    ParseData --> UpdateState["Update Component State"]
    
    TryCatch -->|"Exception thrown"| CatchBlock["Catch Block"]
    CatchBlock --> SetError
    
    SetError --> DisplayError["Display Error to User"]
```

**Sources:** [src/pages/GameSetup.tsx:318-332](), [src/pages/GameSetup.tsx:322-330]()

### Error Message Structure

The API returns error messages in a consistent format that components handle uniformly:

```typescript
interface Message {
  message: string;
}
```

Error handling follows this pattern across all API functions:
1. Set error state to `null` at request start
2. Check `response.ok` status
3. Parse error message from response if request failed
4. Set error state with descriptive message
5. Catch and handle any network or parsing exceptions

**Sources:** [src/pages/GameSetup.tsx:10-12](), [src/pages/GameSetup.tsx:322-331]()

## Custom Fetch Hook

The application provides a generic `useFetch` hook for components that need custom fetch logic outside the main API context.

### useFetch Implementation

```mermaid
classDiagram
    class UseFetchReturn {
        +T data
        +Error error
        +boolean isLoading
        +fetchData(url, options) Promise~void~
    }
    
    class FetchOptions {
        +HttpMethod method
        +Record~string,string~ headers
        +any body
    }
    
    UseFetchReturn --> FetchOptions : uses
```

The `useFetch` hook provides:
- Generic type support for response data
- Loading state management
- Error state handling
- Configurable HTTP methods and headers
- Automatic JSON parsing and error handling

**Sources:** [src/hooks/useFetch.tsx:1-62]()

## Integration with State Management

The API integration system works closely with the application's React Context-based state management to provide seamless data flow.

### Context Integration

```mermaid
graph LR
    subgraph "Combined Context"
        ApiContext["ApiContext"]
        AppStateContext["AppStateContext"] 
        NotificationContext["NotificationContext"]
    end
    
    subgraph "API Functions"
        fetchWithAuth["fetchWithAuth"]
        login["login"]
        logout["logout"]
    end
    
    subgraph "Components"
        GameSetup["GameSetup"]
        FullSeason["FullSeasonVersion"]
    end
    
    ApiContext --> AppStateContext
    ApiContext --> NotificationContext
    ApiContext --> fetchWithAuth
    ApiContext --> login
    ApiContext --> logout
    
    GameSetup --> ApiContext
    FullSeason --> ApiContext
```

The `ApiContext` aggregates multiple context providers into a unified interface, allowing components to access API functionality alongside application state and notifications through a single hook.

**Sources:** [src/contexts/ApiContext.tsx:12-21](), [src/contexts/ApiContext.tsx:72-88]()