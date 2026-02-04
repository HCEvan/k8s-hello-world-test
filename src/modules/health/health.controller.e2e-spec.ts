import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app.module';

describe('HealthController (e2e)', () => {
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

    it(`GET /health should return health status`, async () => {
        const response = await request(app.getHttpServer())
            .get('/health')
            .send();

        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('info');
        expect(response.body).toHaveProperty('details');
        expect(response.body).toHaveProperty('error');
        
        expect(['ok', 'error']).toContain(response.body.status);
        expect(typeof response.body.info).toBe('object');
        expect(typeof response.body.details).toBe('object');
        expect(typeof response.body.error).toBe('object');
    });

    it(`GET /health/check should return health status`, async () => {
        const response = await request(app.getHttpServer())
            .get('/health/check')
            .send();

        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('info');
        expect(response.body).toHaveProperty('details');
        expect(response.body).toHaveProperty('error');
        
        expect(['ok', 'error']).toContain(response.body.status);
    });

    it(`GET /health should include google health check`, async () => {
        const response = await request(app.getHttpServer())
            .get('/health')
            .send();

        expect(response.status).toEqual(200);
        
        if (response.body.info.google) {
            expect(response.body.info.google).toHaveProperty('status');
            expect(['up', 'down']).toContain(response.body.info.google.status);
        }
        
        if (response.body.details.google) {
            expect(response.body.details.google).toHaveProperty('status');
            expect(['up', 'down']).toContain(response.body.details.google.status);
        }
    });

    it(`GET /health should return consistent responses`, async () => {
        const response1 = await request(app.getHttpServer())
            .get('/health')
            .send();
        
        const response2 = await request(app.getHttpServer())
            .get('/health')
            .send();

        expect(response1.status).toEqual(200);
        expect(response2.status).toEqual(200);
        
        expect(response1.body.status).toEqual(response2.body.status);
        expect(typeof response1.body.info).toBe('object');
        expect(typeof response2.body.info).toBe('object');
    });

    it(`GET /health should handle concurrent requests`, async () => {
        const requests = Array(10).fill(null).map(() => 
            request(app.getHttpServer()).get('/health').send()
        );

        const responses = await Promise.all(requests);

        responses.forEach(response => {
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty('status');
            expect(['ok', 'error']).toContain(response.body.status);
        });
    });

    it(`GET /health/nonexistent should return 404`, async () => {
        const response = await request(app.getHttpServer())
            .get('/health/nonexistent')
            .send();

        expect(response.status).toEqual(404);
    });

    it(`POST /health should return 404 (method not allowed)`, async () => {
        const response = await request(app.getHttpServer())
            .post('/health')
            .send();

        expect(response.status).toEqual(404);
    });

    afterAll(async () => {
        await app.close();
    });
});
