import { Module } from '@nestjs/common';

import { ConfigModule } from './modules/config/config.module';
import { HealthModule } from './modules/health/health.module';
import { HelloModule } from './modules/hello/hello.module';

@Module({
    imports: [
        ConfigModule,
        HealthModule,
        HelloModule,
    ],
})
export class AppModule {}
