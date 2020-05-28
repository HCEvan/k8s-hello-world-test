import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { mockPartial } from 'sneer';

import { ConfigService } from '../config/config.service';

import { HelloService } from './hello.service';

describe('HelloService', () => {
    let configService: ConfigService;
    let service: HelloService;

    let config;

    beforeEach(async () => {
        config = {};

        configService = mockPartial<ConfigService>({
            get: jest.fn(key => get(config, key)),
            default: jest.fn(),
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: configService,
                },
                HelloService,
            ],
        }).compile();

        service = module.get<HelloService>(HelloService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getSwaggerEnabled', () => {
        it('should return the configured boolean status', () => {
            config = {
                server: {
                    swagger: {
                        enabled: false,
                    },
                },
            };

            expect(service.getSwaggerEnabled()).toEqual(false);
        });
    });

    describe('getSwaggerPrefix', () => {
        it('should return the configured prefix', () => {
            config = {
                server: {
                    swagger: {
                        prefix: '/docs',
                    },
                },
            };

            expect(service.getSwaggerPrefix()).toEqual('/docs');
        });
    });

    describe('getHostname', () => {
        it('should return the current host', () => {
            const hostname = service.getHostname();

            expect(hostname).toBeDefined();
            expect(hostname).not.toEqual('');
        });
    });
});
