import axios, { AxiosInstance } from 'axios';
import { environment } from '../config';

export interface Identifier {
    id: string;
    title: string;
}

export interface Content {
    identifier: Identifier;
    type: 'page' | 'blogpost';
    excerpt: string;
    author: Identifier;
    createdDate: number;
    children: Array<Identifier>;
    ancestors: Array<Identifier>;
    adfBody: any;
    asHomepage: boolean;
}

const identifier = (item: any): Identifier => ({
    id: item.id,
    title: item.title
});

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

    getContent(contentId: string, asHomepage = false): Promise<Content> {
        const contentExpansions = [
            'content.body.atlas_doc_format',
            'content.children.page',
            'content.children.attachment',
            'content.ancestors',
            'content.history'
        ];
        const query = new URLSearchParams({
            cql: `id=${contentId}`,
            expand: contentExpansions.join(',')
        });
        return this.client
            .get(`/wiki/rest/api/search?${query.toString()}`)
            .then((response) => response.data)
            .then((data) => {
                const item = data.results[0];
                const { content, excerpt } = item;
                const { children, ancestors, id, title, history, body, type } =
                    content;
                const childPages = children.page?.results || [];
                const parentPages = ancestors || [];

                return {
                    identifier: { id, title },
                    asHomepage,
                    type,
                    excerpt,
                    author: {
                        id: history.createdBy.publicName,
                        title: history.createdBy.displayName
                    },
                    createdDate: new Date(history.createdDate).getTime(),
                    children: childPages.map(identifier),
                    ancestors: parentPages.map(identifier),
                    adfBody: JSON.parse(body.atlas_doc_format.value)
                };
            });
    }
}

const api = new Api();

export default api;
