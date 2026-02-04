import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';
import { HealthController } from './modules/health/health.controller';
import { HelloController } from './modules/hello/hello.controller';

describe('AppModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide ConfigService', () => {
        const configService = module.get<ConfigService>(ConfigService);
        expect(configService).toBeDefined();
    });

    it('should provide HealthController', () => {
        const healthController = module.get<HealthController>(HealthController);
        expect(healthController).toBeDefined();
    });

    it('should provide HelloController', () => {
        const helloController = module.get<HelloController>(HelloController);
        expect(helloController).toBeDefined();
    });
});
