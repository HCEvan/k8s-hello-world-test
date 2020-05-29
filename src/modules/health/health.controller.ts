import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DNSHealthIndicator, HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
@ApiOkResponse()
export class HealthController {
    public constructor(
        private readonly dns: DNSHealthIndicator,
        private readonly health: HealthCheckService,
    ) {}

    @ApiOperation({ summary: 'Checks to see if the API is running correctly.' })
    @ApiTags('Health')
    @Get(['/', '/check'])
    @HealthCheck()
    public async check(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.dns.pingCheck('google', 'https://www.google.com'),
        ]);
    }
}
