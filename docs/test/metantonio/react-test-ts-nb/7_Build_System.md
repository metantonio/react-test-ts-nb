# Build System

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [.env.example](/.env.example)
- [README.md](/README.md)
- [electron/main.ts](/electron/main.ts)
- [license.txt](/license.txt)
- [package-lock.json](/package-lock.json)
- [package.json](/package.json)
- [src/main.tsx](/src/main.tsx)
- [vite.config.ts](/vite.config.ts)

</details>



This document covers the Vite-based build system that enables dual-target deployment to both web browsers and Electron desktop applications from a single codebase. The build system uses environment variables and conditional configuration to support multiple development and production workflows.

For information about the overall application architecture, see [Architecture](./3_Architecture.md). For development workflows and setup instructions, see [Getting Started](./2_Getting_Started.md).

## Overview

The build system is built on Vite and supports four primary build targets through npm scripts defined in `package.json`. The system uses the `VITE_APP_TARGET` environment variable to conditionally enable Electron-specific plugins and configurations.

### Build Target Architecture

```mermaid
graph TB
    subgraph "Environment Configuration"
        ENV["VITE_APP_TARGET"]
        DEV_ENV["Development Environment"]
        PROD_ENV["Production Environment"]
    end
    
    subgraph "Build Scripts"
        WEB_DEV["web: vite"]
        ELECTRON_DEV["dev: vite"]
        WEB_BUILD["buildweb: tsc && vite build"]
        ELECTRON_BUILD["build: tsc && vite build && electron-builder"]
    end
    
    subgraph "Configuration Files"
        VITE_CONFIG["vite.config.ts"]
        PACKAGE_JSON["package.json"]
        TSCONFIG["tsconfig.json"]
    end
    
    subgraph "Output Artifacts"
        DIST_WEB["dist/"]
        DIST_ELECTRON["dist-electron/"]
        RELEASE["release/"]
    end
    
    ENV --> VITE_CONFIG
    PACKAGE_JSON --> WEB_DEV
    PACKAGE_JSON --> ELECTRON_DEV
    PACKAGE_JSON --> WEB_BUILD
    PACKAGE_JSON --> ELECTRON_BUILD
    
    VITE_CONFIG --> WEB_DEV
    VITE_CONFIG --> ELECTRON_DEV
    VITE_CONFIG --> WEB_BUILD
    VITE_CONFIG --> ELECTRON_BUILD
    
    WEB_DEV --> DEV_ENV
    ELECTRON_DEV --> DEV_ENV
    WEB_BUILD --> DIST_WEB
    ELECTRON_BUILD --> DIST_ELECTRON
    ELECTRON_BUILD --> RELEASE
```

Sources: [package.json:13-21](/package.json), [vite.config.ts:8-37](/vite.config.ts), [README.md:38-86](/README.md)

## Build Configuration

The core build configuration is defined in `vite.config.ts`, which uses conditional logic to enable Electron-specific features based on the `VITE_APP_TARGET` environment variable.

### Vite Configuration Structure

```mermaid
graph TD
    subgraph "vite.config.ts"
        DEFINE_CONFIG["defineConfig()"]
        LOAD_ENV["loadEnv()"]
        IS_ELECTRON["isElectron = env.VITE_APP_TARGET === 'electron'"]
    end
    
    subgraph "Plugins Array"
        REACT_PLUGIN["@vitejs/plugin-react"]
        TS_PATHS["vite-tsconfig-paths"]
        ELECTRON_PLUGIN["vite-plugin-electron/simple"]
    end
    
    subgraph "Electron Configuration"
        MAIN_ENTRY["main: electron/main.ts"]
        PRELOAD_ENTRY["preload: electron/preload.ts"]
        RENDERER_CONFIG["renderer: {}"]
    end
    
    DEFINE_CONFIG --> LOAD_ENV
    LOAD_ENV --> IS_ELECTRON
    IS_ELECTRON --> REACT_PLUGIN
    IS_ELECTRON --> TS_PATHS
    IS_ELECTRON --> ELECTRON_PLUGIN
    
    ELECTRON_PLUGIN --> MAIN_ENTRY
    ELECTRON_PLUGIN --> PRELOAD_ENTRY
    ELECTRON_PLUGIN --> RENDERER_CONFIG
```

Sources: [vite.config.ts:1-37](/vite.config.ts)

The configuration file loads environment variables and conditionally includes the Electron plugin only when `VITE_APP_TARGET=electron`. The `isElectron` boolean controls plugin inclusion through array filtering.

## Build Scripts

The `package.json` defines four primary build scripts that handle different development and production scenarios:

| Script | Command | Purpose | Output |
|--------|---------|---------|---------|
| `web` | `vite` | Web development server | `localhost:5173` |
| `dev` | `vite` | Electron development mode | Electron app window |
| `buildweb` | `tsc && vite build` | Web production build | `dist/` directory |
| `build` | `tsc && vite build && electron-builder` | Electron production build | `dist-electron/` and `release/` |

Sources: [package.json:13-21](/package.json)

### Build Script Flow

```mermaid
graph LR
    subgraph "Development Scripts"
        WEB_SCRIPT["npm run web"]
        DEV_SCRIPT["npm run dev"]
    end
    
    subgraph "Production Scripts"
        BUILDWEB_SCRIPT["npm run buildweb"]
        BUILD_SCRIPT["npm run build"]
    end
    
    subgraph "Build Steps"
        TSC["tsc"]
        VITE_BUILD["vite build"]
        ELECTRON_BUILDER["electron-builder"]
    end
    
    WEB_SCRIPT --> VITE_DEV["vite (dev server)"]
    DEV_SCRIPT --> VITE_DEV_ELECTRON["vite (electron mode)"]
    
    BUILDWEB_SCRIPT --> TSC
    BUILD_SCRIPT --> TSC
    TSC --> VITE_BUILD
    VITE_BUILD --> ELECTRON_BUILDER
```

Sources: [package.json:13-21](/package.json)

## Development Workflow

The development workflow varies based on the target platform:

### Web Development Mode
- Runs `vite` development server on port 5173
- Hot module replacement (HMR) enabled
- Uses standard browser environment
- Requires `VITE_APP_TARGET` to be unset or not equal to `"electron"`

### Electron Development Mode  
- Runs Vite with Electron plugin enabled
- Spawns Electron application window
- Requires `VITE_APP_TARGET=electron` environment variable
- Supports main process and renderer process development

Sources: [README.md:40-60](/README.md), [vite.config.ts:10-16](/vite.config.ts)

## Production Builds

Production builds involve TypeScript compilation followed by Vite bundling, with optional Electron packaging.

### Web Production Build Process

```mermaid
sequenceDiagram
    participant CMD as "npm run buildweb"
    participant TSC as "TypeScript Compiler"
    participant VITE as "Vite Build"
    participant DIST as "dist/ directory"
    
    CMD->>TSC: "tsc"
    TSC->>TSC: "Type checking & compilation"
    TSC->>VITE: "vite build"
    VITE->>VITE: "Bundle & optimize"
    VITE->>DIST: "Output static assets"
```

### Electron Production Build Process

```mermaid
sequenceDiagram
    participant CMD as "npm run build"
    participant TSC as "TypeScript Compiler" 
    participant VITE as "Vite Build"
    participant BUILDER as "electron-builder"
    participant OUTPUTS as "Output Directories"
    
    CMD->>TSC: "tsc"
    TSC->>TSC: "Type checking & compilation"
    TSC->>VITE: "vite build"
    VITE->>VITE: "Bundle with Electron plugins"
    VITE->>BUILDER: "electron-builder"
    BUILDER->>OUTPUTS: "dist-electron/ & release/"
```

Sources: [package.json:16-17](/package.json), [README.md:62-86](/README.md)

## Output Artifacts

The build system generates different artifacts based on the build target:

### File Structure Output

```mermaid
graph TD
    subgraph "Build Outputs"
        DIST_WEB["dist/"]
        DIST_ELECTRON["dist-electron/"]
        RELEASE_DIR["release/"]
    end
    
    subgraph "Web Build (dist/)"
        HTML_FILE["index.html"]
        JS_BUNDLES["JavaScript bundles"]
        CSS_FILES["CSS files"]
        ASSETS["Static assets"]
    end
    
    subgraph "Electron Build (dist-electron/)"
        MAIN_JS["main.js"]
        PRELOAD_JS["preload.js"]
        RENDERER_FILES["Renderer files"]
    end
    
    subgraph "Release Build (release/)"
        INSTALLERS["Platform installers"]
        EXECUTABLES["Executable files"]
    end
    
    DIST_WEB --> HTML_FILE
    DIST_WEB --> JS_BUNDLES
    DIST_WEB --> CSS_FILES
    DIST_WEB --> ASSETS
    
    DIST_ELECTRON --> MAIN_JS
    DIST_ELECTRON --> PRELOAD_JS
    DIST_ELECTRON --> RENDERER_FILES
    
    RELEASE_DIR --> INSTALLERS
    RELEASE_DIR --> EXECUTABLES
```

Sources: [package.json:158](/package.json), [README.md:74-86](/README.md)

## Configuration Files

Several configuration files support the build system:

### Supporting Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `vite.config.ts` | Main build configuration | Plugin loading, entry points, base path |
| `package.json` | Dependencies and scripts | Build scripts, main entry, electron-builder config |
| `electron/main.ts` | Electron main process | Window creation, app lifecycle |
| `.env` | Environment variables | `VITE_APP_TARGET`, API URLs |

### Configuration Dependencies

```mermaid
graph TD
    VITE_CONFIG["vite.config.ts"]
    PACKAGE_JSON["package.json"]
    ELECTRON_MAIN["electron/main.ts"]
    ENV_FILE[".env"]
    
    ENV_FILE --> VITE_CONFIG
    PACKAGE_JSON --> VITE_CONFIG
    VITE_CONFIG --> ELECTRON_MAIN
    
    PACKAGE_JSON -.-> MAIN_ENTRY["main: dist-electron/main.js"]
    ENV_FILE -.-> VITE_APP_TARGET["VITE_APP_TARGET=electron"]
    VITE_CONFIG -.-> IS_ELECTRON["isElectron conditional"]
```

Sources: [vite.config.ts:9-10](/vite.config.ts), [package.json:158](/package.json), [electron/main.ts:1](/electron/main.ts), [.env.example:1](/.env.example)

The build system provides a flexible, environment-driven approach to supporting both web and desktop deployment targets through conditional configuration and unified tooling.