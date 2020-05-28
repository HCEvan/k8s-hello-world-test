import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as os from 'os';
import * as request from 'supertest';

import { HelloModule } from './hello.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: appVersion } = require('../../../package.json');

describe('HelloController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                HelloModule,
            ],
        }).compile();

        app = module.createNestApplication();

        await app.init();
    });

    it(`GET /`, () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect({
                appVersion,
                hostname: os.hostname(),
                swagger: {
                    enabled: true,
                    prefix: '/docs',
                },
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
