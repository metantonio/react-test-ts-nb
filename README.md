# React + TypeScript + Vite + Electron [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/metantonio/react-test-ts-nb)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules, with Electron support.

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
