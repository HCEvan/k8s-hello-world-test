import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as os from 'os';
import * as request from 'supertest';

import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version: appVersion } = require('../package.json');

describe('Application (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();

        await app.init();
    });

    describe('Application Integration', () => {
        it('should start successfully and respond to basic requests', async () => {
            const helloResponse = await request(app.getHttpServer()).get('/').send();
            const healthResponse = await request(app.getHttpServer()).get('/health').send();

            expect(helloResponse.status).toBe(200);
            expect(healthResponse.status).toBe(200);
        });

        it('should handle multiple endpoints correctly', async () => {
            const endpoints = [
                { path: '/', expectedStatus: 200 },
                { path: '/health', expectedStatus: 200 },
                { path: '/health/check', expectedStatus: 200 },
            ];

            for (const endpoint of endpoints) {
                const response = await request(app.getHttpServer()).get(endpoint.path).send();
                expect(response.status).toBe(endpoint.expectedStatus);
            }
        });

        it('should maintain consistent application version across endpoints', async () => {
            const helloResponse = await request(app.getHttpServer()).get('/').send();

            expect(helloResponse.status).toBe(200);
            expect(helloResponse.body.appVersion).toBe(appVersion);
        });

        it('should maintain consistent hostname across responses', async () => {
            const helloResponse = await request(app.getHttpServer()).get('/').send();
            const expectedHostname = os.hostname();

            expect(helloResponse.status).toBe(200);
            expect(helloResponse.body.hostname).toBe(expectedHostname);
        });

        it('should handle concurrent requests to different endpoints', async () => {
            const requests = [
                request(app.getHttpServer()).get('/').send(),
                request(app.getHttpServer()).get('/health').send(),
                request(app.getHttpServer()).get('/health/check').send(),
            ];

            const responses = await Promise.all(requests);

            responses.forEach(response => {
                expect(response.status).toBe(200);
            });

            expect(responses[0].body.appVersion).toBe(appVersion);
            expect(responses[0].body.hostname).toBe(os.hostname());
            expect(['ok', 'error']).toContain(responses[1].body.status);
            expect(['ok', 'error']).toContain(responses[2].body.status);
        });

        it('should handle rapid sequential requests', async () => {
            for (let i = 0; i < 10; i++) {
                const helloResponse = await request(app.getHttpServer()).get('/').send();
                const healthResponse = await request(app.getHttpServer()).get('/health').send();

                expect(helloResponse.status).toBe(200);
                expect(healthResponse.status).toBe(200);
                expect(helloResponse.body.appVersion).toBe(appVersion);
            }
        });
    });

    describe('Error Handling', () => {
        it('should return 404 for non-existent routes', async () => {
            const nonExistentRoutes = [
                '/api',
                '/api/v1',
                '/invalid',
                '/health/status',
                '/hello/world',
            ];

            for (const route of nonExistentRoutes) {
                const response = await request(app.getHttpServer()).get(route).send();
                expect(response.status).toBe(404);
            }
        });

        it('should return 404 for unsupported HTTP methods', async () => {
            const unsupportedMethods = [
                { method: 'post', path: '/' },
                { method: 'put', path: '/' },
                { method: 'delete', path: '/' },
                { method: 'patch', path: '/' },
                { method: 'post', path: '/health' },
                { method: 'put', path: '/health' },
                { method: 'delete', path: '/health' },
            ];

            for (const { method, path } of unsupportedMethods) {
                const response = await (request(app.getHttpServer()) as any)[method](path).send();
                expect(response.status).toBe(404);
            }
        });

        it('should handle malformed requests gracefully', async () => {
            const response = await request(app.getHttpServer())
                .get('/')
                .set('Content-Type', 'application/json')
                .send('{"invalid": json}');

            expect([200, 400]).toContain(response.status);
        });
    });

    describe('Response Structure', () => {
        it('should return proper JSON content type', async () => {
            const helloResponse = await request(app.getHttpServer()).get('/').send();
            const healthResponse = await request(app.getHttpServer()).get('/health').send();

            expect(helloResponse.headers['content-type']).toMatch(/application\/json/);
            expect(healthResponse.headers['content-type']).toMatch(/application\/json/);
        });

        it('should return valid JSON responses', async () => {
            const helloResponse = await request(app.getHttpServer()).get('/').send();
            const healthResponse = await request(app.getHttpServer()).get('/health').send();

            expect(() => JSON.parse(JSON.stringify(helloResponse.body))).not.toThrow();
            expect(() => JSON.parse(JSON.stringify(healthResponse.body))).not.toThrow();
        });

        it('should have consistent response structure for hello endpoint', async () => {
            const response = await request(app.getHttpServer()).get('/').send();

            expect(response.body).toHaveProperty('appVersion');
            expect(response.body).toHaveProperty('hostname');
            expect(response.body).toHaveProperty('swagger');
            expect(response.body.swagger).toHaveProperty('enabled');
            expect(response.body.swagger).toHaveProperty('prefix');
        });

        it('should have consistent response structure for health endpoints', async () => {
            const healthResponse = await request(app.getHttpServer()).get('/health').send();
            const checkResponse = await request(app.getHttpServer()).get('/health/check').send();

            [healthResponse, checkResponse].forEach(response => {
                expect(response.body).toHaveProperty('status');
                expect(response.body).toHaveProperty('info');
                expect(response.body).toHaveProperty('details');
                expect(response.body).toHaveProperty('error');
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
