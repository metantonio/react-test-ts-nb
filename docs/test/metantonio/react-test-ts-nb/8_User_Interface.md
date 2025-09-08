# User Interface

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [src/components/AppSidebar.tsx](/src/components/AppSidebar.tsx)
- [src/components/PlayerStatsTable.tsx](/src/components/PlayerStatsTable.tsx)
- [src/components/ProfileDropdown.tsx](/src/components/ProfileDropdown.tsx)
- [src/components/Scoreboard.tsx](/src/components/Scoreboard.tsx)
- [src/components/searchbox.tsx](/src/components/searchbox.tsx)
- [src/components/ui/calendar.tsx](/src/components/ui/calendar.tsx)
- [src/index.css](/src/index.css)
- [src/styles/index.css](/src/styles/index.css)

</details>



This document covers the user interface architecture, components, and styling systems of the NBA basketball simulation application. It includes the core UI component library, theming system, layout structures, and interactive game elements.

For authentication-specific UI components, see [Authentication UI](./13_Authentication_UI.md). For game simulation interface details, see [Game Features](./14_Game_Features.md). For build system and styling configurations, see [Build System](./7_Build_System.md) and [Styling and Theming](./19_Styling_and_Theming.md).

## UI Architecture Overview

The application employs a component-based UI architecture built on React with TypeScript, utilizing Tailwind CSS for styling and a custom theme system supporting light/dark modes. The UI system integrates multiple component libraries including Shadcn/ui and Radix UI primitives.

```mermaid
graph TB
    subgraph "Styling Layer"
        A["index.css<br/>Tailwind + Custom Themes"] --> B["CSS Custom Properties<br/>Light/Dark Variables"]
        A --> C["Component-Specific Styles<br/>Basketball Animations"]
    end
    
    subgraph "Component Library"
        D["Shadcn/ui Components<br/>table, calendar, dropdown"] --> E["Custom Components<br/>PlayerStatsTable, Scoreboard"]
        F["Layout Components<br/>AppSidebar, ProfileDropdown"] --> E
    end
    
    subgraph "Application UI"
        G["Game Interfaces<br/>GameSetup, Simulation"] --> H["Layout System<br/>DashboardLayout, AuthLayout"]
        I["Navigation<br/>AppSidebar, Routing"] --> H
    end
    
    B --> D
    C --> E
    E --> G
    F --> I
    
    style A fill:#f9f9f9,stroke:#333,stroke-width:2px
    style E fill:#f0f8ff,stroke:#333,stroke-width:2px
    style H fill:#fff5ee,stroke:#333,stroke-width:2px
```

**Sources:** [src/index.css:1-439](/src/index.css), [src/styles/index.css:1-203](/src/styles/index.css), [src/components/ui/calendar.tsx:1-64](/src/components/ui/calendar.tsx)

## Theme and Styling System

The application implements a comprehensive theming system using CSS custom properties with automatic light/dark mode switching. The styling architecture combines Tailwind utility classes with custom CSS for specialized components.

### CSS Custom Properties Architecture

```mermaid
graph LR
    subgraph "Root Variables"
        A[":root<br/>Light Theme"] --> B["--background, --foreground<br/>--primary, --secondary"]
        C[".dark<br/>Dark Theme"] --> D["Dark Mode Overrides<br/>Same Property Names"]
    end
    
    subgraph "Component Categories"
        E["Sidebar Variables<br/>--sidebar-background"] --> F["Component Styling<br/>AppSidebar"]
        G["Game Elements<br/>casino-gradient, basketball"] --> H["Game Components<br/>Animations, Scoreboard"]
        I["Utility Classes<br/>bg-primary, text-foreground"] --> J["General Components<br/>Tables, Buttons"]
    end
    
    B --> E
    B --> I
    D --> E
    D --> I
    
    style A fill:#f0f8ff,stroke:#333,stroke-width:2px
    style C fill:#2d3748,stroke:#333,stroke-width:2px,color:#fff
```

The theme system defines comprehensive color schemes in [src/index.css:6-83]() with CSS custom properties for:

| Property Category | Light Theme | Dark Theme | Usage |
|------------------|-------------|------------|--------|
| Background | `--background: 0 0% 100%` | `--background: 222.2 84% 4.9%` | Main app background |
| Primary | `--primary: 210 72% 22%` | `--primary: 210 40% 98%` | Primary UI elements |
| Sidebar | `--sidebar-background: 210 72% 22%` | `--sidebar-background: 240 5.9% 10%` | Navigation sidebar |
| Destructive | `--destructive: 0 84.2% 60.2%` | `--destructive: 0 62.8% 30.6%` | Error states |

**Sources:** [src/index.css:5-84](/src/index.css), [src/styles/index.css:8-11](/src/styles/index.css)

### Custom Animation System

The application includes specialized animations for basketball-themed elements:

```mermaid
graph TB
    subgraph "Basketball Animations"
        A["@keyframes bounce<br/>Basketball Physics"] --> B["translateY, scaleX, scaleY<br/>rotate transformations"]
        C[".ball<br/>Basketball Element"] --> A
        D[".pulse-attention<br/>CTA Animation"] --> E["@keyframes pulse-press<br/>Scale 1.0 to 1.07"]
    end
    
    subgraph "Animation Properties"
        F["cubic-bezier(.25,.65,.5,1)<br/>Easing Function"] --> A
        G["2.5s infinite<br/>Duration"] --> A
        H["prefers-reduced-motion<br/>Accessibility"] --> I["animation: none<br/>Disabled State"]
    end
    
    style A fill:#fff5ee,stroke:#333,stroke-width:2px
    style D fill:#ffebee,stroke:#333,stroke-width:2px
```

Key animation implementations in [src/index.css:367-439](/src/index.css):
- Basketball bounce animation with physics-based scaling and rotation
- Pulse attention animation for call-to-action buttons
- Accessibility support with `prefers-reduced-motion` media query

**Sources:** [src/index.css:367-439](/src/index.css), [src/index.css:216-282](/src/index.css)

## Core UI Components

### Data Display Components

The application provides specialized components for displaying basketball statistics and game information.

#### PlayerStatsTable Component

```mermaid
graph TB
    subgraph "PlayerStatsTable"
        A["PlayerStatsTableProps<br/>teamName, players[]"] --> B["Table Structure<br/>TableHeader, TableBody"]
        B --> C["PlayerStats Interface<br/>name, pts, reb, ast, pf"]
        D["Scrollable Container<br/>h-[250px] overflow-y-auto"] --> B
    end
    
    subgraph "Table Implementation"
        E["Shadcn Table Components<br/>Table, TableHead, TableRow"] --> F["Responsive Design<br/>dark:bg-gray-800, hover states"]
        G["Statistical Columns<br/>PTS, REB, AST, PF"] --> F
    end
    
    C --> E
    F --> H["Rendered Player Statistics<br/>Formatted Data Display"]
    
    style A fill:#f0f8ff,stroke:#333,stroke-width:2px
    style E fill:#fff5ee,stroke:#333,stroke-width:2px
```

The `PlayerStatsTable` component in [src/components/PlayerStatsTable.tsx:24-56](/src/components/PlayerStatsTable.tsx) implements:
- Fixed-height scrollable container for large datasets
- Responsive design with dark theme support
- Structured data display for basketball statistics
- TypeScript interfaces for type safety

**Sources:** [src/components/PlayerStatsTable.tsx:1-57](/src/components/PlayerStatsTable.tsx)

#### Scoreboard Component

```mermaid
graph TB
    subgraph "Scoreboard Architecture"
        A["ScoreBoard Interface<br/>away_score, home_score, quarter"] --> B["ScoreboardProps<br/>scoreboardData, team names/logos"]
        C["TeamLogo Component<br/>Image or Fallback"] --> D["Main Scoreboard Layout<br/>Team Info + Scores + Game Clock"]
    end
    
    subgraph "Display Elements"
        E["Team Sections<br/>Logo + Name + Score"] --> F["Center Game Info<br/>Clock + Quarter"]
        G["Bottom Status Bar<br/>Fouls + Possession Indicator"] --> H["Visual Indicators<br/>Animated Possession Dots"]
    end
    
    B --> E
    F --> I["Responsive Grid Layout<br/>flex items-center justify-between"]
    H --> I
    
    style A fill:#f0f8ff,stroke:#333,stroke-width:2px
    style I fill:#fff5ee,stroke:#333,stroke-width:2px
```

The `Scoreboard` component in [src/components/Scoreboard.tsx:24-99](/src/components/Scoreboard.tsx) features:
- Real-time game state display with animated possession indicators
- Conditional logo rendering with fallback team initials
- Responsive layout with basketball-themed styling
- Team offense/defense state visualization

**Sources:** [src/components/Scoreboard.tsx:1-101](/src/components/Scoreboard.tsx)

### Navigation Components

#### AppSidebar Implementation

```mermaid
graph TB
    subgraph "Sidebar Architecture"
        A["AppSidebar Component<br/>Collapsible Navigation"] --> B["Sidebar Context<br/>useSidebar hook"]
        C["menuItems Array<br/>Dashboard, Casinos, Users"] --> D["Permission-Based Rendering<br/>Role Access Control"]
    end
    
    subgraph "Sidebar Structure"
        E["SidebarHeader<br/>Logo + Brand Info"] --> F["SidebarContent<br/>Navigation Menu"]
        G["SidebarFooter<br/>Collapse Toggle"] --> F
        H["SidebarMenuItem<br/>Icon + Label + Link"] --> F
    end
    
    B --> I["Collapsed State Management<br/>data-collapsed attribute"]
    D --> H
    I --> J["Responsive Icon/Text Display<br/>group-data-[collapsible=icon]:hidden"]
    
    style A fill:#f0f8ff,stroke:#333,stroke-width:2px
    style F fill:#fff5ee,stroke:#333,stroke-width:2px
```

The sidebar system in [src/components/AppSidebar.tsx:35-116](/src/components/AppSidebar.tsx) implements:
- Collapsible navigation with icon-only and expanded states
- Role-based menu item visibility using `UserContext`
- Responsive design with conditional content display
- Integration with React Router for navigation state

Navigation menu structure defined in [src/components/AppSidebar.tsx:27-33](/src/components/AppSidebar.tsx):

| Menu Item | Route | Icon | Required Permission |
|-----------|-------|------|-------------------|
| Dashboard | `/adminpanel` | `Home` | `view_all` |
| Casinos | `/adminpanel/casinos` | `Building2` | `view_all` |
| Users | `/adminpanel/users` | `Users` | `add_edit_delete_users` |
| Analytics | `/adminpanel/analytics` | `BarChart3` | `view_all` |
| Settings | `/adminpanel/settings` | `Settings` | `view_all` |

**Sources:** [src/components/AppSidebar.tsx:1-117](/src/components/AppSidebar.tsx)

#### ProfileDropdown Component

```mermaid
graph TB
    subgraph "Profile Dropdown"
        A["ProfileDropdown<br/>User Account Management"] --> B["DropdownMenu<br/>Radix UI Primitive"]
        C["Avatar Component<br/>User Initials Fallback"] --> D["User Information<br/>Username, Email, Role Badge"]
    end
    
    subgraph "Dropdown Actions"
        E["Role Switching<br/>Admin/Developer/Guest"] --> F["Account Actions<br/>Reset Password, Logout"]
        G["Role Badge Styling<br/>getRoleBadgeColor function"] --> H["Conditional Menu Items<br/>Role-Based Visibility"]
    end
    
    B --> I["Authentication Actions<br/>logout(), navigate()"]
    D --> G
    F --> I
    H --> J["Context Integration<br/>UserContext, Navigation"]
    
    style A fill:#f0f8ff,stroke:#333,stroke-width:2px
    style I fill:#fff5ee,stroke:#333,stroke-width:2px
```

The profile dropdown in [src/components/ProfileDropdown.tsx:17-120](/src/components/ProfileDropdown.tsx) provides:
- User role visualization with color-coded badges
- Administrative role switching functionality
- Account management actions (password reset, logout)
- Integration with authentication context and routing

Role badge color mapping in [src/components/ProfileDropdown.tsx:35-42](/src/components/ProfileDropdown.tsx):

```typescript
getRoleBadgeColor = (role: UserRole) => {
  admin: 'bg-red-100 text-red-800'
  developer: 'bg-blue-100 text-blue-800'  
  guest: 'bg-gray-100 text-gray-800'
}
```

**Sources:** [src/components/ProfileDropdown.tsx:1-121](/src/components/ProfileDropdown.tsx)

## Advanced UI Components

### SearchBox Component

```mermaid
graph TB
    subgraph "SearchBox Architecture"
        A["SearchBar Component<br/>Advanced Filtering"] --> B["FilterTag System<br/>Dynamic Tag Creation"]
        C["filterOptions Array<br/>Predefined Filter Types"] --> D["Search State Management<br/>useState hooks"]
    end
    
    subgraph "Filter Functionality"
        E["Dynamic Search<br/>Real-time Filtering"] --> F["Tag Creation<br/>Semicolon Delimiter"]
        G["Available Filters<br/>Exclude Used Filters"] --> H["Dropdown Selection<br/>Filter Type Picker"]
    end
    
    subgraph "User Interactions"
        I["Keyboard Events<br/>handleKeyDown"] --> J["Filter Management<br/>Add/Remove Tags"]
        K["Outside Click Handler<br/>Close Dropdown"] --> L["Clear All Filters<br/>Reset State"]
    end
    
    B --> E
    D --> G
    F --> I
    H --> I
    J --> M["onFiltersChange Callback<br/>Parent Component Integration"]
    
    style A fill:#f0f8ff,stroke:#333,stroke-width:2px
    style M fill:#fff5ee,stroke:#333,stroke-width:2px
```

The advanced search component in [src/components/searchbox.tsx:27-218](/src/components/searchbox.tsx) implements:
- Dynamic filter tag system with semicolon-triggered creation
- Real-time search with immediate parent callback updates
- Available filter management to prevent duplicate filters
- Comprehensive keyboard and mouse interaction handling

Filter configuration in [src/components/searchbox.tsx:34-41](/src/components/searchbox.tsx):

| Filter Type | Available Values | Source |
|-------------|-----------------|--------|
| `casinoName` | Unique casino names | `data.map(item => item.casinoName)` |
| `location` | Unique locations | `data.map(item => item.location)` |
| `category` | Unique categories | `data.map(item => item.category)` |
| `status` | `['active', 'inactive']` | Static values |

**Sources:** [src/components/searchbox.tsx:1-218](/src/components/searchbox.tsx)

## Component Integration Patterns

### UI Context Integration

```mermaid
graph TB
    subgraph "Context Dependencies"
        A["UserContext<br/>Authentication State"] --> B["AppSidebar<br/>Permission-Based Rendering"]
        A --> C["ProfileDropdown<br/>User Info Display"]
        D["SidebarProvider<br/>Collapse State"] --> E["AppSidebar<br/>Toggle Functionality"]
    end
    
    subgraph "Component Communication"
        F["Parent-Child Props<br/>Data Flow"] --> G["PlayerStatsTable<br/>Scoreboard Components"]
        H["Callback Functions<br/>Event Handling"] --> I["SearchBox<br/>Filter Updates"]
    end
    
    subgraph "Styling Integration"
        J["CSS Custom Properties<br/>Theme Variables"] --> K["Component Styling<br/>Consistent Theming"]
        L["Tailwind Classes<br/>Utility Styling"] --> K
    end
    
    B --> M["Integrated UI System<br/>Cohesive User Experience"]
    C --> M
    G --> M
    I --> M
    K --> M
    
    style A fill:#f0f8ff,stroke:#333,stroke-width:2px
    style M fill:#fff5ee,stroke:#333,stroke-width:2px
```

The UI system demonstrates several key integration patterns:

1. **Context-Driven Components**: Navigation and user interface elements integrate with authentication and application state contexts
2. **Prop-Based Data Flow**: Game-specific components receive data through typed props interfaces
3. **Callback Communication**: Advanced components like `SearchBox` communicate state changes to parent components
4. **Consistent Theming**: All components utilize the centralized CSS custom property system

**Sources:** [src/components/AppSidebar.tsx:24-38](/src/components/AppSidebar.tsx), [src/components/ProfileDropdown.tsx:13-19](/src/components/ProfileDropdown.tsx), [src/components/searchbox.tsx:22-75](/src/components/searchbox.tsx)

## Design System Conventions

### Component Structure Standards

The application follows consistent patterns for component architecture:

```typescript
// Interface-driven props
interface ComponentProps {
  data: TypedData[];
  onCallback: (result: CallbackType) => void;
}

// Functional component with TypeScript
const Component: React.FC<ComponentProps> = ({ data, onCallback }) => {
  // Hooks for state management
  const [localState, setLocalState] = useState();
  const { contextData } = useContext();
  
  // Event handlers
  const handleInteraction = () => { /* ... */ };
  
  // Render with conditional logic
  return (
    <div className="responsive-container">
      {/* Conditional rendering */}
      {/* Event handlers */}
      {/* Data mapping */}
    </div>
  );
};
```

### Styling Conventions

The application employs a hybrid styling approach:

1. **Tailwind Utilities**: Primary styling method for layout, spacing, and common properties
2. **CSS Custom Properties**: Theme-aware color and sizing values
3. **Component-Specific CSS**: Complex animations and specialized styling
4. **Conditional Classes**: Dynamic styling based on state and props

Example from [src/components/Scoreboard.tsx:52-97](/src/components/Scoreboard.tsx):
```typescript
className={`w-4 h-4 rounded-full bg-red-500 transition-opacity duration-300 ${
  isHomeTeamOffense ? 'opacity-100 animate-pulse' : 'opacity-0'
}`}
```

**Sources:** [src/components/PlayerStatsTable.tsx:24-56](/src/components/PlayerStatsTable.tsx), [src/components/Scoreboard.tsx:24-99](/src/components/Scoreboard.tsx), [src/components/AppSidebar.tsx:35-116](/src/components/AppSidebar.tsx), [src/index.css:1-439](/src/index.css)