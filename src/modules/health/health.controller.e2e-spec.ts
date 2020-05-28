import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { HealthModule } from './health.module';

describe('HealthController (e2e)', () => {
    let app: INestApplication;

    const expectedResult = {
        details: {
            google: {
                status: 'up',
            }
        },
        error: {},
        info: {
            google: {
                status: 'up',
            },
        },
        status: 'ok',
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                HealthModule,
            ],
        }).compile();

        app = module.createNestApplication();

        await app.init();
    });

    it(`GET /health`, async () => {
        const response = await request(app.getHttpServer())
            .get('/health')
            .send();

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expectedResult);
    });

    it(`GET /health/check`, async () => {
        const response = await request(app.getHttpServer())
            .get('/health/check')
            .send();

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expectedResult);
    });

    afterAll(async () => {
        await app.close();
    });
});
