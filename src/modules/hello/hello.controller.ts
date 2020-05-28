import { Controller, Get } from '@nestjs/common';

import { HelloService } from './hello.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../package.json');

@Controller()
export class HelloController {
    public constructor(private readonly helloService: HelloService) {}

    @Get()
    public getHello() {
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
