import { Test, TestingModule } from '@nestjs/testing';

import { HelloController } from './hello.controller';
import { HelloModule } from './hello.module';
import { HelloService } from './hello.service';

describe('HelloModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [HelloModule],
        }).compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide HelloController', () => {
        const helloController = module.get<HelloController>(HelloController);
        expect(helloController).toBeDefined();
        expect(helloController).toBeInstanceOf(HelloController);
    });

    it('should provide HelloService', () => {
        const helloService = module.get<HelloService>(HelloService);
        expect(helloService).toBeDefined();
        expect(helloService).toBeInstanceOf(HelloService);
    });
});
