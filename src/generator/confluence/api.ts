import axios, { AxiosInstance } from 'axios';
import { environment } from '../config';

export interface Identifier {
    id: string;
    title: string;
}

export interface Attachment {
    fileId: string;
    downloadUrl: string;
    mediaType: string;
}

export interface AttachmentData {
    stream: any;
}

export interface Content {
    identifier: Identifier;
    type: 'page' | 'blogpost';
    excerpt: string;
    author: Identifier & { avatar: string; accountId: string };
    createdDate: number;
    lastModifiedDate: number;
    children: Array<Identifier>;
    ancestors: Array<Identifier>;
    attachments: Array<Attachment>;
    adfBody: any;
    asHomepage: boolean;
}

export interface ResourceObject {
    resourceUrl: string;
}

export interface ResourceDefinition {
    url: string;
    generator: { icon: { url: string } };
    name: string;
    '@type': string;
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

    getSpaceBlogs(): Promise<Array<Content>> {
        const query = new URLSearchParams({
            cql: `space=${environment.CONFLUENCE_SPACE} and type=blogpost order by created desc`,
            expand: 'content.history'
        });
        return this.client
            .get(`/wiki/rest/api/search?${query.toString()}`)
            .then((response) => response.data.results)
            .then((results) => {
                return results.map((item: any) => {
                    const { content, excerpt } = item;
                    const { history, id, title, type } = content;
                    return {
                        identifier: { id, title },
                        type,
                        excerpt: excerpt,
                        author: {
                            id: history.createdBy.publicName,
                            title: history.createdBy.displayName
                        },
                        createdDate: new Date(history.createdDate).getTime()
                    };
                });
            });
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
                const { content, excerpt, lastModified } = item;
                const { children, ancestors, id, title, history, body, type } =
                    content;
                const childPages = children.page?.results || [];
                const parentPages = ancestors || [];
                const files = children.attachment?.results || [];

                return {
                    identifier: { id, title },
                    asHomepage,
                    type,
                    excerpt,
                    author: {
                        id: history.createdBy.publicName,
                        accountId: history.createdBy.accountId,
                        title: history.createdBy.displayName,
                        avatar: history.createdBy.profilePicture.path
                    },
                    createdDate: new Date(history.createdDate).getTime(),
                    lastModifiedDate: new Date(lastModified).getTime(),
                    children: childPages.map(identifier),
                    ancestors: parentPages.map(identifier),
                    adfBody: JSON.parse(body.atlas_doc_format.value),
                    attachments: files.map(({ extensions, _links }: any) => ({
                        fileId: extensions.fileId,
                        downloadUrl: _links.download,
                        mediaType: extensions.mediaType
                    }))
                };
            });
    }

    getAttachmentData(
        targetUrl: string,
        prefix: string = '/wiki'
    ): Promise<AttachmentData> {
        return this.client
            .get(`${prefix}${targetUrl}`, {
                responseType: 'stream'
            })
            .then((response) => ({ stream: response.data }));
    }

    getObjects(
        resourceUrls: Array<ResourceObject>
    ): Promise<Array<{ body: { data: ResourceDefinition } }>> {
        return this.client
            .post('/gateway/api/object-resolver/resolve/batch', resourceUrls, {
                headers: {
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    cookie: `cloud.session.token=${environment.CONFLUENCE_CLOUD_TOKEN}`
                }
            })
            .then((response) => {
                return response.data;
            });
    }
}

const api = new Api();

export default api;
