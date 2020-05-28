import { config } from '../../config';

export class ConfigService {
    private readonly config;

    // @todo: This should be refactored into an injection token for better testing support.
    public constructor() {
        this.config = config;
    }

    public default(key: string): any {
        return this.config.default(key);
    }

    public get(key?: string): any {
        return this.config.get(key);
    }
}
