import dotenv from 'dotenv';

export interface Environment {
    CONFLUENCE_SITE: string;
    CONFLUENCE_USERNAME: string;
    CONFLUENCE_API_TOKEN: string;
    CONFLUENCE_SPACE: string;
    CONFLUENCE_CLOUD_TOKEN: string;
    TARGET_SITE: string;
}

const parsedConfig: unknown = dotenv.config().parsed!;
const environment = parsedConfig as Environment;

export { environment };
