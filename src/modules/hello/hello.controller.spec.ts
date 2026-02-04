import { Test, TestingModule } from '@nestjs/testing';
import { mockPartial } from 'sneer';

import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

describe('HelloController', () => {
    let controller: HelloController;
    let helloService: HelloService;

    beforeEach(async () => {
        helloService = mockPartial<HelloService>({
            getHostname: jest.fn(),
            getSwaggerEnabled: jest.fn(),
            getSwaggerPrefix: jest.fn(),
        });

        const module: TestingModule = await Test.createTestingModule({
            controllers: [HelloController],
            providers: [
                {
                    provide: HelloService,
                    useValue: helloService,
                },
            ],
        }).compile();

        controller = module.get<HelloController>(HelloController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getHello', () => {
        it('should return hello response with correct structure', () => {
            const mockHostname = 'test-hostname';
            const mockSwaggerEnabled = true;
            const mockSwaggerPrefix = '/docs';

            (helloService.getHostname as jest.Mock).mockReturnValue(mockHostname);
            (helloService.getSwaggerEnabled as jest.Mock).mockReturnValue(mockSwaggerEnabled);
            (helloService.getSwaggerPrefix as jest.Mock).mockReturnValue(mockSwaggerPrefix);

            const result = controller.getHello();

            expect(result).toEqual({
                appVersion: '2.0.0',
                hostname: mockHostname,
                swagger: {
                    enabled: mockSwaggerEnabled,
                    prefix: mockSwaggerPrefix,
                },
            });
            expect(result.appVersion).toBeDefined();
            expect(typeof result.appVersion).toBe('string');
            expect(result.hostname).toBe(mockHostname);
            expect(result.swagger.enabled).toBe(mockSwaggerEnabled);
            expect(result.swagger.prefix).toBe(mockSwaggerPrefix);
        });

        it('should return correct app version from package.json', () => {
            (helloService.getHostname as jest.Mock).mockReturnValue('test-host');
            (helloService.getSwaggerEnabled as jest.Mock).mockReturnValue(false);
            (helloService.getSwaggerPrefix as jest.Mock).mockReturnValue('/swagger');

            const result = controller.getHello();

            expect(result.appVersion).toBe('2.0.0');
        });

        it('should work when swagger is disabled', () => {
            (helloService.getHostname as jest.Mock).mockReturnValue('test-host');
            (helloService.getSwaggerEnabled as jest.Mock).mockReturnValue(false);
            (helloService.getSwaggerPrefix as jest.Mock).mockReturnValue('/swagger');

            const result = controller.getHello();

            expect(result.swagger.enabled).toBe(false);
            expect(result.swagger.prefix).toBe('/swagger');
        });

        it('should work with different swagger prefixes', () => {
            (helloService.getHostname as jest.Mock).mockReturnValue('test-host');
            (helloService.getSwaggerEnabled as jest.Mock).mockReturnValue(true);
            (helloService.getSwaggerPrefix as jest.Mock).mockReturnValue('/api-docs');

            const result = controller.getHello();

            expect(result.swagger.enabled).toBe(true);
            expect(result.swagger.prefix).toBe('/api-docs');
        });
    });
});
