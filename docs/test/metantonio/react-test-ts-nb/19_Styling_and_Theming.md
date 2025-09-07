# Styling and Theming

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [postcss.config.cjs](postcss.config.cjs)
- [src/assets/nba-logo-free-vector.jpg](src/assets/nba-logo-free-vector.jpg)
- [src/img/nba-bg.jpg](src/img/nba-bg.jpg)
- [src/index.css](src/index.css)
- [src/styles/index.css](src/styles/index.css)
- [tailwind.config.cjs](tailwind.config.cjs)

</details>



This document covers the styling and theming system used in the NBA simulation application. It explains how Tailwind CSS is integrated as the primary styling framework, how global styles are managed, and the patterns used for component-specific styling throughout the codebase.

For information about UI component structure and design patterns, see [Core Components](#4.1). For build system configuration that affects styling, see [Build System](#3.4).

## Styling System Architecture

The application uses a layered styling approach that combines Tailwind CSS utilities with custom CSS for specific design requirements and global theming.

### Styling Architecture Overview

```mermaid
graph TB
    subgraph "Styling Layers"
        TAILWIND[tailwind.config.cjs<br/>"Tailwind Configuration"]
        INDEX_CSS[src/index.css<br/>"Global Styles & Base"]
        APP_CSS[src/App.css<br/>"Component Styles"]
        INLINE[Inline Tailwind Classes<br/>"Component Styling"]
    end
    
    subgraph "CSS Processing"
        POSTCSS[PostCSS Processing]
        VITE[Vite Build System]
    end
    
    subgraph "Output"
        BUNDLE[Bundled CSS]
        COMPONENTS[Styled Components]
    end
    
    TAILWIND --> POSTCSS
    INDEX_CSS --> POSTCSS
    APP_CSS --> POSTCSS
    INLINE --> POSTCSS
    
    POSTCSS --> VITE
    VITE --> BUNDLE
    BUNDLE --> COMPONENTS
```

Sources: [tailwind.config.cjs:1-8](), [src/index.css:1-3](), [src/App.css:1-50]()

## Tailwind CSS Integration

The application uses Tailwind CSS as its primary styling framework with a standard configuration setup.

### Tailwind Configuration

The Tailwind configuration is minimal and uses default settings with content scanning configured for the React application structure:

| Configuration | Value | Purpose |
|---------------|--------|---------|
| Content paths | `["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"]` | Scans for Tailwind classes |
| Theme extensions | None | Uses default Tailwind theme |
| Plugins | None | No additional Tailwind plugins |

The configuration at [tailwind.config.cjs:3]() ensures all TypeScript and JSX files are scanned for Tailwind utility classes during the build process.

Sources: [tailwind.config.cjs:1-8]()

### Tailwind Import Structure

```mermaid
graph LR
    BASE["@tailwind base"]
    COMPONENTS["@tailwind components"] 
    UTILITIES["@tailwind utilities"]
    CUSTOM[Custom CSS Rules]
    
    BASE --> COMPONENTS
    COMPONENTS --> UTILITIES
    UTILITIES --> CUSTOM
    
    subgraph "src/index.css Structure"
        BASE
        COMPONENTS
        UTILITIES
        CUSTOM
    end
```

The Tailwind directives are imported in the standard order at [src/index.css:1-3](), followed by custom CSS rules that extend or override default behavior.

Sources: [src/index.css:1-3]()

## Global Styles and Theme System

The application implements a dark-themed design system with global CSS custom properties and base styles.

### Design System and CSS Custom Properties

The application implements a comprehensive design system using CSS custom properties with full light/dark theme support:

#### Light Theme Properties
| Property Category | Key Variables | Values |
|------------------|---------------|---------|
| Background | `--background`, `--card` | `0 0% 100%` (white) |
| Foreground | `--foreground`, `--card-foreground` | `222.2 84% 4.9%` (dark text) |
| Primary | `--primary`, `--primary-foreground` | `210 72% 22%`, `210 40% 98%` |
| Sidebar | `--sidebar-background`, `--sidebar-foreground` | `210 72% 22%`, `0 0% 98%` |

#### Dark Theme Properties  
| Property Category | Key Variables | Values |
|------------------|---------------|---------|
| Background | `--background`, `--card` | `222.2 84% 4.9%` (dark) |
| Foreground | `--foreground`, `--card-foreground` | `210 40% 98%` (light text) |
| Primary | `--primary`, `--primary-foreground` | `210 40% 98%`, `222.2 47.4% 11.2%` |
| Sidebar | `--sidebar-background`, `--sidebar-foreground` | `240 5.9% 10%`, `240 4.8% 95.9%` |

#### Typography System
The global typography at [src/index.css:87-99]() includes:
- Font stack: `Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`
- Color scheme: `light dark` with browser support
- Optimized rendering: `text-rendering: optimizeLegibility`, `-webkit-font-smoothing: antialiased`

Sources: [src/index.css:5-83](), [src/index.css:86-99]()

### Custom Utility Classes

The application defines extensive custom utility classes organized by functionality:

#### Theme-Specific Utilities
```mermaid
graph TB
    subgraph "Background Classes"
        POPOVER[".bg-popover<br/>#242424"]
        BACKGROUND[".bg-background<br/>#252525"]
        PRIMARY[".bg-primary<br/>#605f5f"]
        DESTRUCTIVE[".bg-destructive<br/>#ab1717"]
        GRAY[".bg-gray<br/>#4d4d4d"]
    end
    
    subgraph "Gradient Classes"
        CASINO[".casino-gradient<br/>Blue to white gradient"]
        GOLD[".gold-accent<br/>Red to gold gradient"]
    end
    
    subgraph "Interactive States"
        HOVER_PRIMARY[".bg-primary:hover<br/>#c6c3c3"]
        HOVER_MUTED[".bg-muted:hover<br/>#c6c3c3"]
    end
    
    POPOVER --> MODAL[Modal Components]
    DESTRUCTIVE --> ERROR[Error States]
    CASINO --> HEADERS[Header Components]
    GOLD --> ACCENTS[Accent Elements]
```

#### Attention-Grabbing Components
The application includes a sophisticated `.pulse-attention` class with:
- CSS custom properties for color management
- Keyframe animation with `pulse-press` effect
- Accessibility support via `prefers-reduced-motion`
- Interactive states with hover and focus effects

Sources: [src/index.css:163-266](), [src/index.css:155-161]()

## Component-Specific Styling Patterns

### Layout and Responsive Design

The application uses specific styling patterns for layout management and responsive behavior.

#### Root Container Styling

The main application container uses centered layout with responsive sizing:

| Property | Value | Purpose |
|----------|--------|---------|
| `max-width` | `1280px` | Maximum content width |
| `margin` | `0 auto` | Horizontal centering |
| `padding` | `2rem` | Base container padding |
| `text-align` | `center` | Default text alignment |

Defined at [src/App.css:1-6](), this provides the base layout structure for the application.

Sources: [src/App.css:1-6]()

#### Sidebar Collapse System

The application implements a collapsible sidebar using data attributes:

```mermaid
graph LR
    COLLAPSED["data-collapsed='true'<br/>width: 60px"]
    EXPANDED["data-collapsed='false'<br/>width: 240px"]
    
    TOGGLE[Sidebar Toggle] --> COLLAPSED
    TOGGLE --> EXPANDED
    
    subgraph "Sidebar States"
        COLLAPSED
        EXPANDED
    end
```

The collapse system at [src/App.css:44-50]() uses data attributes to control sidebar width, enabling smooth transitions between collapsed and expanded states.

Sources: [src/App.css:44-50]()

### Interactive Element Styling

#### Button System

Global button styling provides consistent interactive elements:

| State | Properties | Visual Effect |
|-------|------------|---------------|
| Default | `border-radius: 8px`, `padding: 0.6em 1.2em`, `background-color: #1a1a1a` | Dark themed button |
| Hover | `border-color: #646cff` | Blue border highlight |
| Focus | `outline: 4px auto -webkit-focus-ring-color` | Accessibility outline |

The button system at [src/index.css:44-63]() includes transition effects and proper focus management for accessibility.

Sources: [src/index.css:44-63]()

#### Link Styling

Link elements use consistent color theming:

- Default color: `#646cff` (blue)
- Hover color: `#535bf2` (darker blue)
- Font weight: `500` (medium)

Defined at [src/index.css:21-29](), links maintain visual consistency with the overall color scheme.

Sources: [src/index.css:21-29]()

## Animation and Visual Effects

### Basketball-Themed Animations

The application features basketball-specific animations that enhance the sports simulation theme:

#### Basketball Bounce Animation
```mermaid
graph TB
    subgraph "Basketball Animation System"
        BASKETBALL[".basket-ball<br/>Main basketball element"]
        CURVES[".basket-ball::before/::after<br/>Basketball line curves"]
        LINES[".line1/.line2<br/>Vertical/horizontal lines"]
    end
    
    subgraph "Animation Properties"
        BOUNCE["@keyframes bounce<br/>Transform and scale effects"]
        GRADIENT["radial-gradient<br/>Orange basketball color"]
        SHADOW["box-shadow<br/>3D depth effect"]
    end
    
    subgraph "Motion Controls"
        REDUCED_MOTION["@media prefers-reduced-motion"]
        DISABLE["animation: none"]
    end
    
    BASKETBALL --> BOUNCE
    BASKETBALL --> GRADIENT
    BASKETBALL --> SHADOW
    BOUNCE --> CURVES
    BOUNCE --> LINES
    REDUCED_MOTION --> DISABLE
```

#### Animation Keyframes
The basketball animations include multiple keyframe sequences:
- `.basket-ball` bounce with `translateY` and `scale` transformations
- `.ball` rotation with 360-degree transforms
- Accessibility-compliant motion reduction support

#### Logo System
Simple logo effects at [src/index.css:143-153]() provide:
- Hover drop-shadow effects with blue and React-blue variants
- Smooth transitions with `filter: drop-shadow`

Sources: [src/index.css:268-401](), [src/index.css:212-266](), [src/index.css:143-153]()

### Transition Effects

Interactive elements use consistent transition timing:

- Button border transitions: `0.25s` duration
- Logo filter transitions: `300ms` duration

These transitions provide smooth user interactions while maintaining performance.

Sources: [src/index.css:53](), [src/App.css:12]()

## Development Patterns

### CSS Organization Strategy

The styling system follows a hierarchical organization pattern:

#### File Structure Organization
```mermaid
graph TB
    subgraph "CSS Architecture"
        TAILWIND_CONFIG["tailwind.config.cjs<br/>Tailwind configuration"]
        POSTCSS_CONFIG["postcss.config.cjs<br/>PostCSS + Autoprefixer"]
        INDEX_CSS["src/index.css<br/>Global system styles"]
    end
    
    subgraph "Style Layers"
        DIRECTIVES["@tailwind base/components/utilities"]
        PROPERTIES["CSS Custom Properties (:root/.dark)"]
        GLOBALS["Global element styles (body, button, etc.)"]
        UTILITIES["Custom utility classes (.bg-*, .casino-gradient)"]
        ANIMATIONS["Animation keyframes (@keyframes)"]
    end
    
    TAILWIND_CONFIG --> DIRECTIVES
    POSTCSS_CONFIG --> DIRECTIVES
    INDEX_CSS --> PROPERTIES
    INDEX_CSS --> GLOBALS
    INDEX_CSS --> UTILITIES
    INDEX_CSS --> ANIMATIONS
```

#### Layer Responsibilities
1. **Tailwind imports** ([src/index.css:1-3]()) for base framework
2. **Design system properties** ([src/index.css:5-83]()) for theme variables
3. **Global element styles** ([src/index.css:86-141]()) for typography and base elements
4. **Custom utility classes** ([src/index.css:155-210]()) for application-specific needs
5. **Animation systems** ([src/index.css:212-401]()) for interactive effects

Sources: [tailwind.config.cjs:1-8](), [postcss.config.cjs:1-6](), [src/index.css:1-401]()

### Responsive Design Approach

The application uses Tailwind's responsive utilities combined with CSS custom properties for adaptive design. The minimum viewport width is set to `320px` at [src/index.css:35]() to ensure mobile compatibility.

Sources: [src/index.css:35](), [src/App.css:30-34]()