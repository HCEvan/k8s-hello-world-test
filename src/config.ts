import * as convict from 'convict';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { schema } from './config.schema';

convict.addParser([
    { extension: ['yml', 'yaml'], parse: yaml.safeLoad },
    { extension: 'js', parse: require },
]);

export const config: convict.Config<any> = convict(schema);

const env = config.get('environment');

const configFiles = [
    `${__dirname}/../config/${env}.json`,
    `${__dirname}/../config/${env}.yaml`,
    `${__dirname}/../config/local.json`,
    `${__dirname}/../config/local.yaml`,
    ...(process.env.APP_CONFIG_FILES !== undefined ? process.env.APP_CONFIG_FILES.split(',') : []),
].reduce((sum, configFile) => {
    if (configFile === undefined || !fs.existsSync(configFile)) {
        return sum;
    }

    sum.push(configFile);

    if (env !== 'test') {
        console.log(`[CONFIG] Loading with configuration file: ${configFile}`);
    }

    return sum;
}, []);

config.loadFile(configFiles);

config.validate();
