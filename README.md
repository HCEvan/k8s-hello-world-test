# Kubernetes Hello World Test API

This project contains a TypeScript-based example API utilising the [NestJS](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ yarn install
```

## Configuration

The configuration of the API is handled using the [Mozilla Convict](https://github.com/mozilla/node-convict) library.

When the API starts up it uses default values as specified in the `src/config.schema.ts` file, these can be overridden using either environmental variables or from values within the following configuration files:
* config/`<environment>`.json (environment = production, development, test)
* config/local.json
* config/local.yaml
* `${APP_CONFIG_FILES}` (comma separated list of additional files to load)

### Configuration Matrix

| Argument | Environmental Variable | Description | Type | Default Value(s) |
| --- | --- | --- | --- | --- |
| environment | NODE_ENV | The application environment. | string | production |
| server.globalPrefix | APP_SERVER_GLOBAL_PREFIX | The server base prefix for all endpoints. | string | / |
| server.host | HOST | The server listening address. | string | 0.0.0.0 |
| server.port | PORT | The server listening port. | port | 3000 |
| server.swagger.enabled | APP_SERVER_SWAGGER_ENABLED | Whether or not to enable the Swagger API documentation or not. | boolean | false |
| server.swagger.prefix | APP_SERVER_SWAGGER_PREFIX | The Swagger prefix to use. | string | /swagger |

## Swagger / OpenAPI

This API includes and example implementation of [Swagger/OpenAPI](https://swagger.io/resources/open-api/), normally configured at the `/swagger` route when the `server.swagger.enabled` flag is set to `true`.

## CircleCI

The CircleCI configuration is located within [.circleci/config.yml](.circleci/config.yml) and defines the entire CI/CD pipeline workflow.

In addition to that, the build pipelines can be viewed using either of the following:
- [https://app.circleci.com/pipelines/github/HCEvan/k8s-hello-world-test](https://app.circleci.com/pipelines/github/HCEvan/k8s-hello-world-test) 
- by viewing the status of a commit via the GitHub build status API.

> **NOTE:** You will need to login via your GitHub / Bitbucket account in order to gain access to CircleCI, but once that is complete you should have access to the build logs.

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Testing

### Linting

In order to check and fix any lint-related errors you can use the following:

```bash
# fix errors
$ yarn lint

# CI verification
$ yarn lint:ci
```

> **NOTE:** If using the CI version, there will also be a JUnit formatted report outputted at `reports/eslint.xml`.

### Unit Tests

In order to execute the unit tests you can use the following:

```bash
# no code coverage
$ yarn test

# with code coverage
$ yarn test:coverage
```

> **NOTE:** The code coverage can be found within the `coverage` directory located alongside the `src` directory. In addition to this there will be a JUnit formatted report also located at `reports/junit/unit/junit.xml`.

### End-to-End (E2E) Tests

In order to execute the end-to-end tests you can use the following:

```bash
# no code coverage
$ yarn test:e2e

# with code coverage
$ yarn test:e2e:coverage
```

> **NOTE:** The code coverage can be found within the `coverage-e2e` directory located alongside the `src` directory. In addition to this there will be a JUnit formatted report also located at `reports/junit/e2e/junit.xml`.

## Building

In order to build the distribution assets you can use the following:

```bash
$ yarn build
```

This will produce the distribution assets in the `dist` directory alongside the `src` directory.

## License

This software has been released under the MIT license, with the accompanying [LICENSE](LICENSE) file containing further details.
