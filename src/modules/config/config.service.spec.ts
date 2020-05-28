import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfigService,
            ],
        }).compile();

        service = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('get', () => {
        it('should return a value for a defined configuration option', () => {
            expect(service.get('server.host')).toEqual('0.0.0.0');
        });

        it('should throw an error for an undefined configuration option', async () => {
            const variable = 'undefinedConfig.option';

            await expect(() => service.get(variable)).toThrow(`cannot find configuration param '${variable}'`);
        });
    });

    describe('default', () => {
        it('should return a value for a defined configuration option', () => {
            expect(service.default('server.swagger.prefix')).toEqual('/swagger');
        });

        it('should throw an error for an undefined configuration option', async () => {
            const variable = 'undefinedConfig.option';

            await expect(() => service.default(variable)).toThrow();
        });

        it('should return a value for a defined configuration option', () => {
            const currentValue = service.get('server.swagger.prefix');
            const defaultValue = service.default('server.swagger.prefix');

            expect(defaultValue).toEqual('/swagger');
            expect(currentValue).toEqual('/docs');
            expect(currentValue).not.toEqual(defaultValue);
        })
    });
});
