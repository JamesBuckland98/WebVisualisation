# Scrumble Front End

This is the front end client for Scrumble, an Agile tool to be used in conjunction with various issue ticketing systems. This project aims to follow BT's ideal views for managing multiple GitLab projects from a simplified and joined user interface.

The front end for this project uses Preact, a library used to for building user interfaces. Every component and helper file was written using TypeScript, and this project utilizes the Tailwind CSS framework.

This Preact client will be updated in conjunction with the Spring Boot API server.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install:

```
Node v12+
NPM (or Yarn, but slight changes may need to be made to the package.json file)
Docker (optional)
```

### Running

Firstly, you will need to install the project dependencies. From the project root, run:

```
npm run install
```

Once the dependencies are installed, to start a dev server, run:

```
npm run serve:dev
```

...or for a production-like local server:

```
npm run serve:prod
```

See [running.md](../../running.md) for instructions relating to a real production deployment.

## Code Style

The code is formatted to the linting rules found in [.eslintrc.js](.eslintrc.js) and [.prettierrc.js](.prettierrc.js). Both of these utilize rather standard styles.

### Run Linter (For JS/TS)

```
npm run lint
```

### Run Prettier (For everything else)

```
npm run prettier
```

## Built With

-   [Preact](https://reactjs.org/) - Library Used to Build Interface
    -   [Typescript](https://www.typescriptlang.org/) - A Typed Superset of JavaScript
    -   [MobX](https://mobx.js.org/README.html) - Global State Management Tool
    -   [NPM](https://www.npmjs.com/) - Dependency Management Tool
