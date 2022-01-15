import axios, { AxiosInstance } from 'axios';
import { environment } from '../config';

export interface Identifier {
    id: string;
    title: string;
}

class Api {
    readonly client!: AxiosInstance;
    constructor() {
        this.client = axios.create({
            baseURL: `https://${environment.CONFLUENCE_SITE}`,
            auth: {
                username: environment.CONFLUENCE_USERNAME,
                password: environment.CONFLUENCE_API_TOKEN
            }
        });
    }

    getSpaceHomepage(): Promise<Identifier> {
        return this.client
            .get(
                `/wiki/rest/api/space/${environment.CONFLUENCE_SPACE}?expand=homepage`
            )
            .then(({ data }) => ({
                id: data.homepage.id,
                title: data.homepage.title
            }));
    }
}

const api = new Api();

export default api;
