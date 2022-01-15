import { environment } from '../config';

const blogUrl =
    /https:\/\/[a-z.]+\/wiki\/spaces\/[a-z]+\/blog\/\d+\/\d+\/\d+\/(?<id>\d+)/;

const pageUrl = /https:\/\/[a-z.]+\/wiki\/spaces\/[a-z]+\/pages\/(?<id>\d+)/;

const isInternalUrl = (url: string): boolean => {
    return url.startsWith(`https://${environment.CONFLUENCE_SITE}`);
};

const rewriteUrl = (url: string): string => {
    if (!isInternalUrl(url)) {
        return url;
    }
    const isBlog = url.match(blogUrl);
    if (isBlog) {
        return `${environment.TARGET_SITE}/articles/${isBlog.groups?.id}`;
    }
    const isPage = url.match(pageUrl);
    if (isPage) {
        return `${environment.TARGET_SITE}/notes/${isPage.groups?.id}`;
    }
    return url;
};

export { rewriteUrl };
