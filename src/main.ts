import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { trim } from 'lodash';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    const configService: ConfigService = app.get('ConfigService');
    const globalPrefix = trim(configService.get('server.globalPrefix'), '/');
    const logger = new Logger('Main', true);
    const swaggerPrefix = configService.get('server.swagger.prefix');

    app.enableCors();
    app.enableShutdownHooks();
    app.setGlobalPrefix(globalPrefix);
    app.use(helmet());

    app.use(morgan('combined', {
        stream: {
            write: message => logger.log(message),
        },
    }));

    if (configService.get('server.swagger.enabled')) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const packageJson = require('../package.json');

        const swaggerOptions = new DocumentBuilder()
            .setDescription(packageJson.description)
            .setTitle('Kubernetes Hello World Test API')
            .setVersion(packageJson.version)
            .build();

        const document = SwaggerModule.createDocument(app, swaggerOptions);
        SwaggerModule.setup(`${globalPrefix}${swaggerPrefix}`, app, document);
    }

    const { host, port } = configService.get('server');
    const url = `${host}:${port}`;

    await app.listen(port, host);

    logger.log(`Kubernetes Hello World Test API listening on ${url}`);

    if (configService.get('server.swagger.enabled')) {
        logger.log(`Swagger documentation enabled, serving on ${url}${globalPrefix}${swaggerPrefix}`);
    }
}

bootstrap();
