import * as convict from 'convict';

export const schema: convict.Schema<any> = {
    environment: {
        doc: 'The application environment.',
        format: [
            'production',
            'development',
            'test',
        ],
        default: 'production',
        env: 'NODE_ENV',
    },
    server: {
        globalPrefix: {
            doc: 'The server base prefix for all endpoints.',
            format: '*',
            default: '/',
            env: 'APP_SERVER_GLOBAL_PREFIX',
        },
        host: {
            doc: 'The server listening address.',
            format: '*',
            default: '0.0.0.0',
            env: 'HOST',
        },
        port: {
            doc: 'The server listening port.',
            format: 'port',
            default: 3000,
            env: 'PORT',
        },
        swagger: {
            enabled: {
                doc: 'Whether or not to enable the Swagger API documentation or not.',
                format: Boolean,
                default: false,
                env: 'APP_SERVER_SWAGGER_ENABLED',
            },
            prefix: {
                doc: 'The Swagger prefix to use.',
                format: '*',
                default: '/swagger',
                env: 'APP_SERVER_SWAGGER_PREFIX',
            },
        },
    },
};
