import { Injectable } from '@nestjs/common';
import * as os from 'os';

import { ConfigService } from '../config/config.service';

@Injectable()
export class HelloService {
    public constructor(private readonly configService: ConfigService) {}

    public getSwaggerEnabled(): boolean {
        return this.configService.get('server.swagger.enabled');
    }

    public getSwaggerPrefix(): string {
        return this.configService.get('server.swagger.prefix');
    }

    public getHostname(): string {
        return os.hostname();
    }
}
