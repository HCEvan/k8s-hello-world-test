import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as os from 'os';
import request from 'supertest';

import { AppModule } from '../../app.module';

// Need to import the package.json file to get the package version.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version: appVersion } = require('../../../package.json');

describe('HelloController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                AppModule,
            ],
        }).compile();

        app = module.createNestApplication();

        await app.init();
    });

    it(`GET / should return application info`, async () => {
        const response = await request(app.getHttpServer())
            .get('/')
            .send();

        expect(response.status).toEqual(200);
        
        expect(response.body).toHaveProperty('appVersion');
        expect(response.body).toHaveProperty('hostname');
        expect(response.body).toHaveProperty('swagger');
        
        expect(response.body.appVersion).toEqual(appVersion);
        expect(response.body.hostname).toEqual(os.hostname());
        expect(typeof response.body.swagger.enabled).toBe('boolean');
        expect(typeof response.body.swagger.prefix).toBe('string');
    });

    it(`GET / should return consistent response structure`, async () => {
        const response1 = await request(app.getHttpServer())
            .get('/')
            .send();
        
        const response2 = await request(app.getHttpServer())
            .get('/')
            .send();

        expect(response1.status).toEqual(200);
        expect(response2.status).toEqual(200);
        
        expect(response1.body.appVersion).toEqual(response2.body.appVersion);
        expect(response1.body.hostname).toEqual(response2.body.hostname);
        expect(response1.body.swagger).toEqual(response2.body.swagger);
    });

    it(`GET / should return swagger configuration`, async () => {
        const response = await request(app.getHttpServer())
            .get('/')
            .send();

        expect(response.status).toEqual(200);
        expect(response.body.swagger).toBeDefined();
        expect(response.body.swagger.enabled).toBeDefined();
        expect(response.body.swagger.prefix).toBeDefined();
    });

    it(`GET / should handle concurrent requests`, async () => {
        const responses = [];
        
        for (let i = 0; i < 3; i++) {
            const response = await request(app.getHttpServer()).get('/').send();
            responses.push(response);
        }

        responses.forEach(response => {
            expect(response.status).toEqual(200);
            expect(response.body.appVersion).toEqual(appVersion);
            expect(response.body.hostname).toEqual(os.hostname());
        });
    });

    it(`GET /nonexistent should return 404`, async () => {
        const response = await request(app.getHttpServer())
            .get('/nonexistent')
            .send();

        expect(response.status).toEqual(404);
    });

    afterAll(async () => {
        await app.close();
    });
});
