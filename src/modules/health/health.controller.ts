import { Controller, Get } from '@nestjs/common';
import { DNSHealthIndicator, HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    public constructor(
        private readonly dns: DNSHealthIndicator,
        private readonly health: HealthCheckService,
    ) {}

    @Get(['/', '/check'])
    @HealthCheck()
    public check() {
        return this.health.check([
            () => this.dns.pingCheck('google', 'https://www.google.com'),
        ]);
    }
}
