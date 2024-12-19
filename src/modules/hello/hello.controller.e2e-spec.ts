import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as os from 'os';
import * as request from 'supertest';

import { HelloModule } from './hello.module';

// Need to import the package.json file to get the package version.
// eslint-disable-next-line @typescript-eslint/no-require-imports
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
