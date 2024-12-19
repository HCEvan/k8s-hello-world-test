import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
@ApiOkResponse()
export class HealthController {
    public constructor(
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
    ) {}

    @ApiOperation({ summary: 'Checks to see if the API is running correctly.' })
    @ApiTags('Health')
    @Get(['/', '/check'])
    @HealthCheck()
    public async check(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.http.pingCheck('google', 'https://www.google.com'),
        ]);
    }
}
