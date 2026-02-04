import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './app.module';

describe('Configuration E2E Tests', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();

        await app.init();
    });

    describe('Default Configuration', () => {
        it('should use default swagger configuration', async () => {
            const response = await request(app.getHttpServer()).get('/').send();

            expect(response.status).toBe(200);
            expect(response.body.swagger).toBeDefined();
            expect(typeof response.body.swagger.enabled).toBe('boolean');
            expect(typeof response.body.swagger.prefix).toBe('string');
        });

        it('should return consistent configuration across requests', async () => {
            const response1 = await request(app.getHttpServer()).get('/').send();
            const response2 = await request(app.getHttpServer()).get('/').send();

            expect(response1.body.swagger).toEqual(response2.body.swagger);
            expect(response1.body.appVersion).toEqual(response2.body.appVersion);
            expect(response1.body.hostname).toEqual(response2.body.hostname);
        });

        it('should have valid application version', async () => {
            const response = await request(app.getHttpServer()).get('/').send();

            expect(response.status).toBe(200);
            expect(response.body.appVersion).toMatch(/^\d+\.\d+\.\d+$/);
        });

        it('should have valid hostname format', async () => {
            const response = await request(app.getHttpServer()).get('/').send();

            expect(response.status).toBe(200);
            expect(response.body.hostname).toBeTruthy();
            expect(typeof response.body.hostname).toBe('string');
            expect(response.body.hostname.length).toBeGreaterThan(0);
        });
    });

    describe('Health Check Configuration', () => {
        it('should be configured to check external services', async () => {
            const response = await request(app.getHttpServer()).get('/health').send();

            expect(response.status).toBe(200);
            expect(response.body.info).toBeDefined();
            expect(response.body.details).toBeDefined();
        });

        it('should handle health check timeouts gracefully', async () => {
            const startTime = Date.now();
            const response = await request(app.getHttpServer()).get('/health').send();
            const endTime = Date.now();

            expect(response.status).toBe(200);
            expect(endTime - startTime).toBeLessThan(10000);
        });

        it('should return consistent health check structure', async () => {
            const response = await request(app.getHttpServer()).get('/health').send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('info');
            expect(response.body).toHaveProperty('details');
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('Environment Configuration', () => {
        it('should work in test environment', async () => {
            const helloResponse = await request(app.getHttpServer()).get('/').send();
            const healthResponse = await request(app.getHttpServer()).get('/health').send();

            expect(helloResponse.status).toBe(200);
            expect(healthResponse.status).toBe(200);
        });

        it('should handle configuration validation', async () => {
            const response = await request(app.getHttpServer()).get('/').send();

            expect(response.status).toBe(200);
            expect(response.body.appVersion).toBeDefined();
            expect(response.body.hostname).toBeDefined();
            expect(response.body.swagger).toBeDefined();
        });
    });

    describe('Service Configuration', () => {
        it('should have properly configured services', async () => {
            const helloResponse = await request(app.getHttpServer()).get('/').send();
            const healthResponse = await request(app.getHttpServer()).get('/health').send();

            expect(helloResponse.status).toBe(200);
            expect(healthResponse.status).toBe(200);

            expect(helloResponse.body.appVersion).toBeTruthy();
            expect(healthResponse.body.status).toBeTruthy();
        });

        it('should maintain service state across requests', async () => {
            const requests = Array(3).fill(null).map(() => 
                request(app.getHttpServer()).get('/').send()
            );

            const responses = await Promise.all(requests);

            responses.forEach(response => {
                expect(response.status).toBe(200);
                expect(response.body.appVersion).toBeTruthy();
                expect(response.body.hostname).toBeTruthy();
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
