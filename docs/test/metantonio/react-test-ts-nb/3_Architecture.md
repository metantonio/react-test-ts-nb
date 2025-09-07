# Architecture

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [docs/1_Overview.md](docs/1_Overview.md)
- [docs/3_Architecture.md](docs/3_Architecture.md)
- [docs/4_Application_Structure.md](docs/4_Application_Structure.md)
- [docs/5_State_Management.md](docs/5_State_Management.md)
- [package.json](package.json)
- [src/layout.tsx](src/layout.tsx)

</details>



This document explains the core architectural patterns and design decisions of the NBA simulation application. It covers the React application structure, context-based state management system, conditional layout patterns, and dual-target build configuration that enables both web and desktop deployment from a single codebase.

For specific implementation details about individual contexts, see [State Management](#3.2). For authentication flow specifics, see [Authentication System](#3.3). For build configuration details, see [Build System](#3.4).

## System Architecture Overview

The application implements a layered React architecture with centralized state management through React Context. The system is designed around a provider composition pattern where multiple specialized contexts are aggregated into a unified interface.

### Core System Layers

```mermaid
graph TB
    subgraph "Application Layer"
        AppLayout["AppLayout"]
        AppContent["AppContent"]
        Routes["Routes"]
    end
    
    subgraph "Context Management Layer"
        QueryClientProvider["QueryClientProvider"]
        UserProvider["UserProvider"]
        ApiProvider["ApiProvider"]
        TooltipProvider["TooltipProvider"]
        SidebarProvider["SidebarProvider"]
    end
    
    subgraph "Layout System"
        AuthLayout["AuthLayout"]
        DashboardLayout["DashboardLayout"]
    end
    
    subgraph "Page Components"
        LoginAPI["LoginAPI"]
        GameSetup["GameSetup"]
        FullSeasonVersion["FullSeasonVersion"]
        SingleGameVersion["SingleGameVersion"]
    end
    
    subgraph "Build Configuration"
        ViteConfig["vite.config.ts"]
        PackageJson["package.json"]
        EnvTarget["VITE_APP_TARGET"]
    end
    
    AppLayout --> QueryClientProvider
    QueryClientProvider --> UserProvider
    UserProvider --> ApiProvider
    ApiProvider --> TooltipProvider
    TooltipProvider --> SidebarProvider
    SidebarProvider --> AppContent
    
    AppContent --> AuthLayout
    AppContent --> DashboardLayout
    AppContent --> Routes
    
    Routes --> LoginAPI
    Routes --> GameSetup
    Routes --> FullSeasonVersion
    Routes --> SingleGameVersion
    
    AuthLayout --> LoginAPI
    DashboardLayout --> GameSetup
    
    ViteConfig --> EnvTarget
    EnvTarget --> PackageJson
```

Sources: [src/layout.tsx:87-103](), [src/main.tsx:8-12](), [vite.config.ts:8-11]()

### Provider Composition Architecture

The application uses a sophisticated provider hierarchy where each context wraps the next, creating cascading availability of services. The `ApiProvider` serves as the primary aggregator, combining multiple context slices into a unified interface.

```mermaid
graph LR
    subgraph "Individual Contexts"
        useAppState["useAppState"]
        useNotificationState["useNotificationState"]
        ApiLogic["API Authentication Logic"]
    end
    
    subgraph "Aggregated Context"
        ApiContext["ApiContext"]
        CombinedContextType["CombinedContextType"]
    end
    
    subgraph "Consumer Components"
        GameSetup["GameSetup"]
        LoginAPI["LoginAPI"]
        FullSeasonVersion["FullSeasonVersion"]
    end
    
    useAppState --> ApiContext
    useNotificationState --> ApiContext
    ApiLogic --> ApiContext
    
    ApiContext --> CombinedContextType
    CombinedContextType --> GameSetup
    CombinedContextType --> LoginAPI
    CombinedContextType --> FullSeasonVersion
```

Sources: [src/contexts/ApiContext.tsx:13-21](), [src/contexts/ApiContext.tsx:72-82]()

## Routing and Layout Selection System

The application implements a conditional layout system that dynamically selects between `AuthLayout` and `DashboardLayout` based on the current route pattern. This enables different UI structures for authentication and main application flows.

### Route-Based Layout Logic

```mermaid
graph TD
    AppContent["AppContent"]
    useLocation["useLocation()"]
    isAuthRoute["isAuthRoute = pathname === '/' || pathname.startsWith('/login')"]
    LayoutSelection{"Layout Selection"}
    AuthLayout["AuthLayout"]
    DashboardLayout["DashboardLayout"]
    
    subgraph "Route Configuration"
        RootRoute["/ → LoginAPI"]
        LoginRoute["/login → Navigate to /"]
        LeagueRoute["/league → GameSetup"]
        CatchAll["* → LoginAPI"]
    end
    
    subgraph "Components"
        LoginAPI["LoginAPI"]
        GameSetup["GameSetup"]
        ProtectedRoute["ProtectedRoute"]
    end
    
    AppContent --> useLocation
    useLocation --> isAuthRoute
    isAuthRoute --> LayoutSelection
    LayoutSelection -->|true| AuthLayout
    LayoutSelection -->|false| DashboardLayout
    
    AuthLayout --> RootRoute
    AuthLayout --> LoginRoute
    AuthLayout --> CatchAll
    DashboardLayout --> LeagueRoute
    
    RootRoute --> LoginAPI
    LeagueRoute --> ProtectedRoute
    ProtectedRoute --> GameSetup
    CatchAll --> LoginAPI
```

Sources: [src/layout.tsx:51-56](), [src/layout.tsx:68-82]()

## Context Aggregation Pattern

The application implements a unique context aggregation pattern where the `ApiProvider` combines multiple specialized contexts into a single unified interface. This reduces complexity for consuming components while maintaining separation of concerns.

### Context Integration Flow

```mermaid
graph TB
    subgraph "Specialized Contexts"
        AppStateContext["AppStateContext"]
        NotificationContext["NotificationContext"]
        UserContext["UserContext"]
    end
    
    subgraph "Context Hooks"
        useAppState["useAppState()"]
        useNotificationState["useNotificationState()"]
        useUser["useUser()"]
    end
    
    subgraph "ApiProvider Implementation"
        ApiProvider["ApiProvider"]
        CombinedValue["Combined Context Value"]
        ApiContextProvider["ApiContext.Provider"]
    end
    
    subgraph "Consumer Interface"
        useApi["useApi()"]
        Components["React Components"]
    end
    
    AppStateContext --> useAppState
    NotificationContext --> useNotificationState
    UserContext --> useUser
    
    useAppState --> ApiProvider
    useNotificationState --> ApiProvider
    ApiProvider --> CombinedValue
    CombinedValue --> ApiContextProvider
    
    ApiContextProvider --> useApi
    useApi --> Components
```

Sources: [src/contexts/ApiContext.tsx:24-88](), [src/contexts/ApiContext.tsx:91-97]()

## Dual-Target Build Architecture

The build system enables deployment to both web browsers and Electron desktop applications through environment-driven configuration. The `VITE_APP_TARGET` environment variable controls build behavior without requiring code changes.

### Build Configuration Flow

```mermaid
graph TD
    subgraph "Environment Configuration"
        EnvFile[".env"]
        ViteAppTarget["VITE_APP_TARGET"]
        LoadEnv["loadEnv()"]
    end
    
    subgraph "Vite Configuration"
        ViteConfig["vite.config.ts"]
        DefineConfig["defineConfig()"]
        IsElectron["isElectron = env.VITE_APP_TARGET === 'electron'"]
        PluginArray["plugins: []"]
    end
    
    subgraph "Plugin Selection"
        ReactPlugin["@vitejs/plugin-react"]
        ElectronPlugin["vite-plugin-electron"]
        ElectronRenderer["vite-plugin-electron-renderer"]
    end
    
    subgraph "Build Outputs"
        WebBuild["npm run buildweb → dist/"]
        ElectronBuild["npm run build → dist-electron/ + release/"]
        DevWeb["npm run web → localhost:5173"]
        DevElectron["npm run dev → Electron Window"]
    end
    
    EnvFile --> ViteAppTarget
    ViteAppTarget --> LoadEnv
    LoadEnv --> ViteConfig
    ViteConfig --> DefineConfig
    DefineConfig --> IsElectron
    IsElectron --> PluginArray
    
    PluginArray --> ReactPlugin
    IsElectron -->|true| ElectronPlugin
    IsElectron -->|true| ElectronRenderer
    
    ReactPlugin --> WebBuild
    ReactPlugin --> DevWeb
    ElectronPlugin --> ElectronBuild
    ElectronPlugin --> DevElectron
```

Sources: [vite.config.ts:8-11](), [vite.config.ts:16-34](), [package.json:13-20]()

## Authentication System Integration

The application implements a dual authentication system: API key-based authentication for the basketball simulation service and AWS Amplify integration for user management. The `ApiContext` manages API authentication while `UserContext` handles user session management.

### Authentication Architecture

```mermaid
graph LR
    subgraph "Authentication Components"
        LoginAPI["LoginAPI"]
        LoginCognito["LoginCognito"]
        ProtectedRoute["ProtectedRoute"]
    end
    
    subgraph "Context Layer"
        ApiContext["ApiContext"]
        UserContext["UserContext"]
        AmplifyConfig["Amplify.configure()"]
    end
    
    subgraph "External Services"
        BasketballAPI["Basketball Simulation API"]
        AWSCognito["AWS Cognito"]
    end
    
    subgraph "Authentication Flow"
        fetchWithAuth["fetchWithAuth()"]
        hasPermission["hasPermission()"]
        isAuthenticated["isAuthenticated"]
    end
    
    LoginAPI --> ApiContext
    LoginCognito --> UserContext
    ProtectedRoute --> UserContext
    
    ApiContext --> fetchWithAuth
    ApiContext --> isAuthenticated
    UserContext --> hasPermission
    UserContext --> AmplifyConfig
    
    fetchWithAuth --> BasketballAPI
    AmplifyConfig --> AWSCognito
```

Sources: [src/layout.tsx:31-49](), [src/layout.tsx:73-77](), [src/contexts/ApiContext.tsx:45-70]()

## Application Initialization Sequence

The application follows a specific initialization flow that establishes the provider hierarchy, configures routing, and sets up the authentication system before rendering any user interface components.

### Initialization Flow

```mermaid
sequenceDiagram
    participant main["main.tsx"]
    participant AppLayout["AppLayout"]
    participant QueryClient["QueryClientProvider"]
    participant UserProvider["UserProvider"]
    participant ApiProvider["ApiProvider"]
    participant HashRouter["HashRouter"]
    participant AppContent["AppContent"]
    participant Routes["Routes"]
    
    main->>AppLayout: "ReactDOM.createRoot().render()"
    AppLayout->>QueryClient: "Wrap with QueryClientProvider"
    QueryClient->>UserProvider: "Initialize UserProvider"
    UserProvider->>ApiProvider: "Initialize ApiProvider"
    ApiProvider->>HashRouter: "Setup routing"
    HashRouter->>AppContent: "Render AppContent"
    AppContent->>AppContent: "Determine layout based on route"
    AppContent->>Routes: "Render routes with selected layout"
    Routes->>Routes: "Mount LoginAPI or GameSetup"
```

Sources: [src/main.tsx:8-12](), [src/layout.tsx:87-103](), [src/layout.tsx:51-84]()