import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';

describe('ConfigModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [ConfigModule],
        }).compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide ConfigService', () => {
        const configService = module.get<ConfigService>(ConfigService);
        expect(configService).toBeDefined();
        expect(configService).toBeInstanceOf(ConfigService);
    });

    it('should export ConfigService', () => {
        const configService = module.get<ConfigService>(ConfigService);
        expect(configService).toBeDefined();
    });

    it('should create ConfigService as singleton', () => {
        const configService1 = module.get<ConfigService>(ConfigService);
        const configService2 = module.get<ConfigService>(ConfigService);
        expect(configService1).toBe(configService2);
    });
});
