import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HelloResponseDto } from './dtos';
import { HelloService } from './hello.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../package.json');

@Controller()
export class HelloController {
    public constructor(private readonly helloService: HelloService) {}

    @ApiOkResponse({ description: 'Returns with the current configuration.', type: HelloResponseDto })
    @ApiOperation({ summary: 'Get the current running configuration of the API instance.' })
    @ApiTags('Hello')
    @Get()
    public getHello(): HelloResponseDto {
        return {
            appVersion: packageJson.version,
            hostname: this.helloService.getHostname(),
            swagger: {
                enabled: this.helloService.getSwaggerEnabled(),
                prefix: this.helloService.getSwaggerPrefix(),
            },
        };
    }
}
