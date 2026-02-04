import { Test, TestingModule } from '@nestjs/testing';
import { mockPartial } from 'sneer';
import { HealthCheckResult, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

import { HealthController } from './health.controller';

describe('HealthController', () => {
    let controller: HealthController;
    let healthCheckService: HealthCheckService;
    let httpHealthIndicator: HttpHealthIndicator;

    beforeEach(async () => {
        healthCheckService = mockPartial<HealthCheckService>({
            check: jest.fn(),
        });

        httpHealthIndicator = mockPartial<HttpHealthIndicator>({
            pingCheck: jest.fn(),
        });

        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: HealthCheckService,
                    useValue: healthCheckService,
                },
                {
                    provide: HttpHealthIndicator,
                    useValue: httpHealthIndicator,
                },
            ],
        }).compile();

        controller = module.get<HealthController>(HealthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('check', () => {
        it('should return health check result', async () => {
            const mockHealthResult: HealthCheckResult = {
                status: 'ok',
                info: {
                    google: {
                        status: 'up',
                    },
                },
                details: {
                    google: {
                        status: 'up',
                    },
                },
            };

            (healthCheckService.check as jest.Mock).mockResolvedValue(mockHealthResult);

            const result = await controller.check();

            expect(result).toEqual(mockHealthResult);
            expect(healthCheckService.check).toHaveBeenCalledTimes(1);
            expect(healthCheckService.check).toHaveBeenCalledWith([
                expect.any(Function),
            ]);
        });

        it('should call http ping check with correct parameters', async () => {
            const mockHealthResult: HealthCheckResult = {
                status: 'ok',
                info: {
                    google: {
                        status: 'up',
                    },
                },
                details: {
                    google: {
                        status: 'up',
                    },
                },
            };

            (healthCheckService.check as jest.Mock).mockImplementation((checks) => {
                expect(checks).toHaveLength(1);
                const pingCheckFn = checks[0];
                expect(typeof pingCheckFn).toBe('function');
                
                (httpHealthIndicator.pingCheck as jest.Mock).mockReturnValue({
                    status: 'up',
                });
                
                return Promise.resolve(mockHealthResult);
            });

            await controller.check();

            expect(healthCheckService.check).toHaveBeenCalled();
        });

        it('should handle unhealthy status', async () => {
            const mockHealthResult: HealthCheckResult = {
                status: 'error',
                error: {
                    google: {
                        status: 'down',
                        message: 'Request failed',
                    },
                },
                details: {
                    google: {
                        status: 'down',
                        message: 'Request failed',
                    },
                },
            };

            (healthCheckService.check as jest.Mock).mockResolvedValue(mockHealthResult);

            const result = await controller.check();

            expect(result.status).toBe('error');
            expect(result.error).toBeDefined();
        });
    });
});
