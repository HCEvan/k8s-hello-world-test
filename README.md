# Kubernetes Hello World Test API

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript-based API.

## Installation

```bash
$ yarn install
```

## Configuration

The configuration of the API is handled using the Mozilla Convict library.

When the API starts up it uses default values as specified in the `src/config.schema.ts` file, these can be overridden using either environmental variables or from values within the following configuration files:
* config/`<environment>`.json (environment = production, development, test)
* config/local.json
* config/local.yaml
* `${APP_CONFIG_FILES}` (comma separated list of additional files to load)

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# 

# e2e tests
$ yarn test:e2e

# unit tests with test coverage
$ yarn test:coverage
```
