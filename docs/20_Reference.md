# Reference

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [package-lock.json](package-lock.json)
- [postcss.config.cjs](postcss.config.cjs)
- [src/App.tsx](src/App.tsx)
- [src/assets/nba-logo-free-vector.jpg](src/assets/nba-logo-free-vector.jpg)
- [src/img/nba-bg.jpg](src/img/nba-bg.jpg)

</details>



This page provides comprehensive reference documentation for the NBA simulation application codebase structure, configuration files, dependencies, and assets. It serves as a quick lookup guide for developers working with the project's technical infrastructure and build system.

For information about the application's UI components and styling system, see [Styling and Theming](#7.1). For details about the build and deployment processes, see [Build System](#3.4).

## Project Structure Overview

The application follows a standard React TypeScript project structure with dual-target builds for web and Electron desktop deployment.

### Core Directory Structure

```mermaid
graph TD
    ROOT["react-test-ts-nb/"]
    ROOT --> SRC["src/"]
    ROOT --> PUBLIC["public/"]
    ROOT --> DIST["dist/"]
    ROOT --> DIST_ELECTRON["dist-electron/"]
    ROOT --> RELEASE["release/"]
    ROOT --> NODE["node_modules/"]
    
    SRC --> COMPONENTS["src/components/"]
    SRC --> ASSETS["src/assets/"]
    SRC --> IMG["src/img/"]
    SRC --> APP_TSX["src/App.tsx"]
    SRC --> MAIN_TSX["src/main.tsx"]
    
    ROOT --> PACKAGE_JSON["package.json"]
    ROOT --> VITE_CONFIG["vite.config.ts"]
    ROOT --> ELECTRON_BUILDER["electron-builder.json5"]
    ROOT --> POSTCSS_CONFIG["postcss.config.cjs"]
    ROOT --> TAILWIND_CONFIG["tailwind.config.js"]
    
    DIST --> WEB_BUILD["Web Build Output"]
    DIST_ELECTRON --> ELECTRON_BUILD["Electron Build Output"]
    RELEASE --> INSTALLERS["Desktop Installers"]
```

Sources: [package-lock.json:1-10]()

### File Structure Mapping

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `src/` | Source code | `App.tsx`, `main.tsx` |
| `src/components/` | React components | UI component library |
| `src/assets/` | Static assets | Images, icons, media files |
| `src/img/` | Image resources | `nba-bg.jpg`, logos |
| `dist/` | Web build output | Production web assets |
| `dist-electron/` | Electron build output | Desktop application files |
| `release/` | Packaged installers | Platform-specific installers |

Sources: [src/App.tsx:1-5](), [src/assets/nba-logo-free-vector.jpg:1](), [src/img/nba-bg.jpg:1]()

## Dependencies and External Libraries

### Core Framework Dependencies

The application uses the following major framework dependencies defined in `package.json`:

```mermaid
graph LR
    subgraph "Frontend Framework"
        REACT["react@18.3.1"]
        REACT_DOM["react-dom@18.3.1"]
        TYPESCRIPT["typescript@5.8.3"]
    end
    
    subgraph "Build Tools"
        VITE["vite@5.1.6"]
        VITE_PLUGIN_ELECTRON["vite-plugin-electron@0.28.6"]
        VITE_PLUGIN_REACT["@vitejs/plugin-react@4.2.1"]
    end
    
    subgraph "Desktop Platform"
        ELECTRON["electron@30.0.1"]
        ELECTRON_BUILDER["electron-builder@24.13.3"]
        ELECTRON_UPDATER["electron-updater@6.1.7"]
    end
    
    subgraph "Backend Services"
        AWS_AMPLIFY["aws-amplify@6.15.3"]
        AWS_AMPLIFY_AUTH["@aws-amplify/auth@6.14.0"]
        AWS_AMPLIFY_BACKEND["@aws-amplify/backend@1.16.1"]
    end
```

Sources: [package-lock.json:54-66](), [package-lock.json:115-143]()

### UI Component Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/*` | Various | Accessible UI primitives |
| `lucide-react` | 0.462.0 | Icon library |
| `primereact` | 10.9.6 | React UI components |
| `primeicons` | 7.0.0 | Icon set for PrimeReact |
| `tailwindcss` | 3.4.17 | Utility-first CSS framework |
| `tailwind-merge` | 2.5.2 | Tailwind class merging utility |

Sources: [package-lock.json:14-40](), [package-lock.json:50-64]()

### Data Management and Utilities

```mermaid
graph TD
    subgraph "State Management"
        REACT_QUERY["@tanstack/react-query@5.56.2"]
        REACT_HOOK_FORM["react-hook-form@7.53.0"]
        ZOD["zod@3.23.8"]
    end
    
    subgraph "Routing & Navigation"
        REACT_ROUTER["react-router-dom@6.26.2"]
    end
    
    subgraph "Utilities"
        DATE_FNS["date-fns@3.6.0"]
        CLSX["clsx@2.1.1"]
        CLASS_VARIANCE_AUTHORITY["class-variance-authority@0.7.1"]
    end
    
    subgraph "Charts & Visualization"
        RECHARTS["recharts@2.12.7"]
        EMBLA_CAROUSEL["embla-carousel-react@8.3.0"]
    end
```

Sources: [package-lock.json:41-66]()

## Configuration Files

### Build Configuration

The project uses multiple configuration files for different aspects of the build process:

```mermaid
graph LR
    subgraph "Build Configuration"
        VITE_CONFIG["vite.config.ts"]
        ELECTRON_BUILDER_CONFIG["electron-builder.json5"]
        PACKAGE_JSON["package.json"]
    end
    
    subgraph "Styling Configuration"
        TAILWIND_CONFIG["tailwind.config.js"]
        POSTCSS_CONFIG["postcss.config.cjs"]
    end
    
    subgraph "TypeScript Configuration"
        TSCONFIG["tsconfig.json"]
        TSCONFIG_NODE["tsconfig.node.json"]
    end
    
    VITE_CONFIG --> BUILD_TARGET["VITE_APP_TARGET env var"]
    ELECTRON_BUILDER_CONFIG --> PACKAGING["Desktop App Packaging"]
    TAILWIND_CONFIG --> STYLING["CSS Processing"]
    POSTCSS_CONFIG --> CSS_PLUGINS["PostCSS Plugins"]
```

Sources: [postcss.config.cjs:1-7]()

### PostCSS Configuration

The PostCSS configuration is minimal and focused on Tailwind CSS integration:

```javascript
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Sources: [postcss.config.cjs:1-7]()

### Package Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `web` | Development server for web | `npm run web` |
| `dev` | Development server for Electron | `npm run dev` |
| `buildweb` | Production web build | `npm run buildweb` |
| `build` | Production Electron build | `npm run build` |

Sources: [package-lock.json:1-10]()

## Assets and Resources

### Image Assets

The application includes several image assets for branding and background:

```mermaid
graph TD
    subgraph "Image Assets"
        NBA_BG["src/img/nba-bg.jpg"]
        NBA_LOGO["src/assets/nba-logo-free-vector.jpg"]
    end
    
    subgraph "Usage Context"
        LOGIN_BG["Login Background"]
        BRANDING["Application Branding"]
    end
    
    NBA_BG --> LOGIN_BG
    NBA_LOGO --> BRANDING
    
    subgraph "Import Patterns"
        STATIC_IMPORT["import bgImage from './img/nba-bg.jpg'"]
    end
    
    NBA_BG --> STATIC_IMPORT
```

Sources: [src/App.tsx:4](), [src/img/nba-bg.jpg:1](), [src/assets/nba-logo-free-vector.jpg:1]()

### Asset Import Example

The main application component demonstrates proper asset importing:

```typescript
// src/App.tsx
import bgImage from './img/nba-bg.jpg'

// Usage in component
<div
  className="min-h-screen bg-cover bg-center flex items-center justify-center"
  style={{ backgroundImage: `url(${bgImage})` }}
>
```

Sources: [src/App.tsx:4](), [src/App.tsx:55-58]()

## Build Artifacts and Output

### Development vs Production Builds

```mermaid
graph TD
    subgraph "Development Mode"
        DEV_WEB["npm run web"]
        DEV_ELECTRON["npm run dev"]
        VITE_DEV_SERVER["Vite Dev Server"]
        ELECTRON_DEV["Electron Development"]
    end
    
    subgraph "Production Builds"
        BUILD_WEB["npm run buildweb"]
        BUILD_ELECTRON["npm run build"]
        DIST_WEB["dist/"]
        DIST_ELECTRON_DIR["dist-electron/"]
        RELEASE_DIR["release/"]
    end
    
    DEV_WEB --> VITE_DEV_SERVER
    DEV_ELECTRON --> ELECTRON_DEV
    
    BUILD_WEB --> DIST_WEB
    BUILD_ELECTRON --> DIST_ELECTRON_DIR
    BUILD_ELECTRON --> RELEASE_DIR
    
    subgraph "Environment Variables"
        VITE_APP_TARGET["VITE_APP_TARGET"]
        TARGET_WEB["web"]
        TARGET_ELECTRON["electron"]
    end
    
    VITE_APP_TARGET --> TARGET_WEB
    VITE_APP_TARGET --> TARGET_ELECTRON
```

Sources: [package-lock.json:1-10]()

## Environment Variables and Configuration

### Build Target Configuration

The application uses environment variables to control build behavior:

| Variable | Values | Purpose |
|----------|--------|---------|
| `VITE_APP_TARGET` | `web` \| `electron` | Controls build target |
| `NODE_ENV` | `development` \| `production` | Environment mode |

### Vite Configuration Integration

The build system uses the `VITE_APP_TARGET` environment variable to customize builds for different deployment targets, enabling the same codebase to produce both web and desktop applications.

Sources: [package-lock.json:1-10]()

## External Service Dependencies

### AWS Amplify Integration

The application integrates with AWS Amplify for backend services:

```mermaid
graph LR
    subgraph "AWS Amplify Services"
        AMPLIFY_CORE["aws-amplify@6.15.3"]
        AMPLIFY_AUTH["@aws-amplify/auth@6.14.0"]
        AMPLIFY_BACKEND["@aws-amplify/backend@1.16.1"]
        AMPLIFY_CLI["@aws-amplify/backend-cli@1.8.0"]
    end
    
    subgraph "Authentication"
        AUTH_PROVIDERS["Credential Providers"]
        USER_MANAGEMENT["User Management"]
    end
    
    subgraph "Backend Infrastructure"
        BACKEND_DEPLOYMENT["Backend Deployment"]
        API_ENDPOINTS["API Endpoints"]
    end
    
    AMPLIFY_AUTH --> AUTH_PROVIDERS
    AMPLIFY_AUTH --> USER_MANAGEMENT
    AMPLIFY_BACKEND --> BACKEND_DEPLOYMENT
    AMPLIFY_BACKEND --> API_ENDPOINTS
```

Sources: [package-lock.json:473-485](), [package-lock.json:502-525]()

### Basketball Simulation API

The application integrates with external basketball simulation services for game data and statistics, as referenced in the system architecture diagrams.

Sources: [package-lock.json:1-10]()