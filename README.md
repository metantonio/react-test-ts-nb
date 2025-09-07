# React + TypeScript + Vite + Electron

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules, with Electron support.

## Documentation

- [Overview](./docs/test/metantonio/react-test-ts-nb/1_Overview.md)
- [Getting Started](./docs/test/metantonio/react-test-ts-nb/2_Getting_Started.md)
- [Architecture](./docs/test/metantonio/react-test-ts-nb/3_Architecture.md)
- [Application Structure](./docs/test/metantonio/react-test-ts-nb/4_Application_Structure.md)
- [State Management](./docs/test/metantonio/react-test-ts-nb/5_State_Management.md)
- [Authentication System](./docs/test/metantonio/react-test-ts-nb/6_Authentication_System.md)
- [Build System](./docs/test/metantonio/react-test-ts-nb/7_Build_System.md)
- [User Interface](./docs/test/metantonio/react-test-ts-nb/8_User_Interface.md)
- [Core Components](./docs/test/metantonio/react-test-ts-nb/9_Core_Components.md)
- [Game Setup Interface](./docs/test/metantonio/react-test-ts-nb/10_Game_Setup_Interface.md)
- [Game Simulation Interfaces](./docs/test/metantonio/react-test-ts-nb/11_Game_Simulation_Interfaces.md)
- [Layout and Navigation](./docs/test/metantonio/react-test-ts-nb/12_Layout_and_Navigation.md)
- [Authentication](./docs/test/metantonio/react-test-ts-nb/13_Authentication_UI.md)
- [Game Features](./docs/test/metantonio/react-test-ts-nb/14_Game_Features.md)
- [Basketball Simulation](./docs/test/metantonio/react-test-ts-nb/15_Basketball_Simulation.md)
- [Season Management](./docs/test/metantonio/react-test-ts-nb/16_Season_Management.md)
- [API Integration](./docs/test/metantonio/react-test-ts-nb/17_API_Integration.md)
- [Development Guide](./docs/test/metantonio/react-test-ts-nb/18_Development_Guide.md)
- [Styling and Theming](./docs/test/metantonio/react-test-ts-nb/19_Styling_and_Theming.md)
- [Electron Development](./docs/test/metantonio/react-test-ts-nb/20_Electron_Development.md)
- [Reference](./docs/test/metantonio/react-test-ts-nb/21_Reference.md)

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

## Development

This project can be run in two modes: Web and Electron.

### Web Mode

To run the application in your browser, use the following command:

```bash
npm run web
```

Note: [Check the .env file](#environment-variables)

This will start a development server accessible at `http://localhost:5173`.

### Electron Mode

To run the application as a desktop app with Electron, use the following command:

```bash
npm run dev
```

Note: [Check the .env file](#environment-variables)

## Building the Application

### Web Build

To build the web version of the application, run:

```bash
npm run buildweb
```

Note: [Check the .env file](#environment-variables)

This will create a `dist` folder with the production-ready files.

### Electron Build

To build the Electron application for your current platform, run:

```bash
npm run build
```

Note: [Check the .env file](#environment-variables)

This will create a `dist-electron` folder and an installer in the `release` folder.

## Environment Variables

The `.env` file is used to configure the application's behavior. The `VITE_APP_TARGET` variable determines the build target.

- **For Electron development and builds**, set `VITE_APP_TARGET=electron`.
- **For Web development and builds**, you can remove the `VITE_APP_TARGET` variable or set it to anything other than `electron`.

