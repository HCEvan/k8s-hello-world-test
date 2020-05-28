import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Global()
@Module({
    imports: [
        ConfigModule,
    ],
    controllers: [
        HelloController,
    ],
    providers: [
        HelloController,
        HelloService,
    ],
})
export class HelloModule {}
