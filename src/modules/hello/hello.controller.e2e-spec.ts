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

    it(`GET /`, async () => {
        const response = await request(app.getHttpServer())
            .get('/')
            .send();

        expect(response.status).toEqual(200);

        // Partial match due to other configurations possibly being loaded which can change the Swagger results.
        expect(response.body).toEqual(expect.objectContaining({
            appVersion,
            hostname: os.hostname(),
        }));
    });

    afterAll(async () => {
        await app.close();
    });
});
