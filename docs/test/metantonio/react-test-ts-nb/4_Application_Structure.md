# Application Structure

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [.env.example](.env.example)
- [src/components/MainLayout.tsx](src/components/MainLayout.tsx)
- [src/layout.tsx](src/layout.tsx)
- [src/main.tsx](src/main.tsx)
- [vite.config.ts](vite.config.ts)

</details>



This document covers the foundational architecture of the NBA simulation application, including entry points, provider stack configuration, routing system, and layout components. For information about state management patterns within these components, see [State Management](#3.2). For details about the authentication flows that integrate with this structure, see [Authentication System](#3.3).

## Entry Points and Application Initialization

The application has a single entry point that initializes the React application and establishes the foundation for both web and Electron deployment targets.

### Main Entry Point

The application starts at `main.tsx`, which renders the root `AppLayout` component:

```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppLayout />
  </React.StrictMode>,
)
```

**Application Initialization Flow**

```mermaid
graph TD
    A["main.tsx"] --> B["AppLayout"]
    B --> C["QueryClientProvider"]
    C --> D["UserProvider"]
    D --> E["ApiProvider"] 
    E --> F["TooltipProvider"]
    F --> G["HashRouter"]
    G --> H["SidebarProvider"]
    H --> I["AppContent"]
    
    I --> J{"isAuthRoute?"}
    J -->|true| K["AuthLayout"]
    J -->|false| L["DashboardLayout"]
    
    K --> M["Routes"]
    L --> M
    M --> N["Component Rendering"]
```

Sources: [src/main.tsx:8-12](), [src/layout.tsx:87-103]()

## Provider Stack Architecture

The `AppLayout` component establishes a comprehensive provider stack that makes essential services available throughout the application component tree.

### Provider Hierarchy

The providers are wrapped in a specific order to ensure proper dependency resolution:

| Provider | Purpose | Dependencies |
|----------|---------|--------------|
| `QueryClientProvider` | React Query client for data fetching | None |
| `UserProvider` | AWS Cognito authentication state | QueryClient |
| `ApiProvider` | Basketball API communication | UserProvider |
| `TooltipProvider` | UI tooltip functionality | None |
| `HashRouter` | Client-side routing | None |
| `SidebarProvider` | Sidebar state management | None |

**Provider Dependencies and Services**

```mermaid
graph TB
    subgraph "Provider Stack"
        A["QueryClientProvider<br/>queryClient"] --> B["UserProvider<br/>Auth State"]
        B --> C["ApiProvider<br/>API Communication"]
        C --> D["TooltipProvider<br/>UI Components"]
        D --> E["HashRouter<br/>Routing"]
        E --> F["SidebarProvider<br/>Navigation State"]
    end
    
    subgraph "External Services"
        G["AWS Cognito"] --> B
        H["Basketball API"] --> C
    end
    
    subgraph "Consumer Components"
        F --> I["AppContent"]
        I --> J["AuthLayout"]
        I --> K["DashboardLayout"]
    end
```

Sources: [src/layout.tsx:87-103]()

## Routing System

The routing system uses a conditional layout strategy where different layouts are applied based on the current route path.

### Route-Based Layout Selection

The `AppContent` component implements intelligent layout switching:

```typescript
const isAuthRoute = location.pathname.startsWith("/login") || location.pathname === "/";
const Layout = isAuthRoute ? AuthLayout : DashboardLayout;
```

### Route Configuration

| Route Pattern | Component | Layout | Protection |
|---------------|-----------|--------|------------|
| `/` | `LoginCognito` | `AuthLayout` | None |
| `/login` | Redirect to `/` | `AuthLayout` | None |
| `/league` | `GameSetup` | `DashboardLayout` | `ProtectedRoute` |
| `/updatepassword` | `UpdatePassword` | `AuthLayout` | None |
| `/signup` | `Signup` | `AuthLayout` | None |
| `*` (catch-all) | `LoginCognito` | `AuthLayout` | None |

**Routing and Layout Decision Flow**

```mermaid
graph TD
    A["AppContent"] --> B["useLocation()"]
    B --> C{"isAuthRoute?<br/>startsWith('/login') || === '/'"}
    
    C -->|true| D["AuthLayout"]
    C -->|false| E["DashboardLayout"]
    
    D --> F["Routes"]
    E --> F
    
    F --> G["/"]
    F --> H["/league"]
    F --> I["/updatepassword"]
    F --> J["/signup"]
    F --> K["/*"]
    
    G --> L["LoginCognito"]
    H --> M["ProtectedRoute<br/>GameSetup"]
    I --> N["UpdatePassword"]
    J --> O["Signup"]
    K --> P["LoginCognito"]
```

Sources: [src/layout.tsx:51-85]()

## Layout Components

The application uses two primary layout components that provide different structural frameworks for authentication and main application flows.

### DashboardLayout Structure

The `DashboardLayout` provides the main application interface for authenticated users:

```typescript
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
```

**DashboardLayout Component Structure**

```mermaid
graph TB
    A["DashboardLayout"] --> B["min-h-screen flex container"]
    B --> C["AppSidebar"]
    B --> D["flex-col flex-1 container"]
    D --> E["main.flex-1.overflow-auto"]
    E --> F["children<br/>(GameSetup, etc.)"]
    
    G["useUser()"] --> H["logout function"]
    A --> G
```

Sources: [src/components/MainLayout.tsx:6-18]()

### Layout Integration with Authentication

The layout system integrates with the authentication state through the `useUser` hook, which provides loading states and user management functions.

| Layout | Authentication State | Available Components |
|--------|---------------------|---------------------|
| `AuthLayout` | Unauthenticated | Login, Signup, Password Reset |
| `DashboardLayout` | Authenticated | Sidebar, Game Setup, Logout |

## Build Target Considerations

The application structure supports dual deployment through the `VITE_APP_TARGET` environment variable, configured in `vite.config.ts`:

```typescript
const isElectron = env.VITE_APP_TARGET === 'electron';
```

This affects how the application initializes and which features are available:

- **Web Target**: Standard React web application with hash routing
- **Electron Target**: Desktop application with additional native integrations

**Build Target Application Flow**

```mermaid
graph LR
    A["VITE_APP_TARGET"] --> B{"electron?"}
    B -->|true| C["Vite + Electron Build"]
    B -->|false| D["Vite Web Build"]
    
    C --> E["Desktop App<br/>main.tsx + electron/main.ts"]
    D --> F["Web App<br/>main.tsx only"]
    
    E --> G["AppLayout<br/>(with IPC capabilities)"]
    F --> H["AppLayout<br/>(web-only)"]
```

Sources: [vite.config.ts:8-11](), [src/main.tsx:14-19]()

## Component Hierarchy Overview

The complete component hierarchy flows from the entry point through the provider stack to the final rendered components:

**Complete Application Component Tree**

```mermaid
graph TB
    A["ReactDOM.createRoot"] --> B["React.StrictMode"]
    B --> C["AppLayout"]
    
    subgraph "Provider Stack"
        C --> D["QueryClientProvider"]
        D --> E["UserProvider"]
        E --> F["ApiProvider"]
        F --> G["TooltipProvider"]
        G --> H["Toaster + Sonner"]
        H --> I["HashRouter"]
        I --> J["SidebarProvider"]
    end
    
    J --> K["AppContent"]
    K --> L{"Route-based Layout"}
    
    subgraph "Authentication Flow"
        L --> M["AuthLayout"]
        M --> N["LoginCognito"]
        M --> O["Signup"]
        M --> P["UpdatePassword"]
    end
    
    subgraph "Application Flow"
        L --> Q["DashboardLayout"]
        Q --> R["AppSidebar"]
        Q --> S["ProtectedRoute"]
        S --> T["GameSetup"]
    end
```

Sources: [src/main.tsx:8-12](), [src/layout.tsx:87-103](), [src/layout.tsx:51-85](), [src/components/MainLayout.tsx:6-18]()