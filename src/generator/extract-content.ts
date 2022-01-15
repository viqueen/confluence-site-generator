import api, { Content } from './confluence/api';
import { OutputDirectories } from './extract';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { filter } from '@atlaskit/adf-utils';
import { rewriteUrl, titleToPath } from './confluence/util';
import { scrubContent } from './confluence/adf-processor';

const extractObjects = async (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    const inlineCards = filter(
        content.adfBody,
        (node) => node.type === 'inlineCard'
    ).map((item) => {
        return {
            resourceUrl: item.attrs?.url
        };
    });
    if (inlineCards.length < 1) return;

    const resolvedObjects = await api.getObjects(inlineCards);
    resolvedObjects.forEach((item) => {
        const data = item.body.data;
        const { url, name, generator } = data;
        const definition = {
            name,
            generator,
            url: rewriteUrl(url),
            '@type': data['@type']
        };
        const urlHash = crypto
            .createHash('md5')
            .update(definition.url)
            .digest('hex');
        fs.writeFileSync(
            path.resolve(outputDirectories.objectResolver, `${urlHash}.json`),
            JSON.stringify(definition)
        );
    });
};

const extractAttachments = async (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    const attachments = content.attachments;
    return Promise.all(
        attachments.map((attachment) => {
            return api
                .getAttachmentData(attachment.downloadUrl)
                .then(({ stream }) => {
                    const ext = attachment.mediaType.split('/')[1];
                    const file = fs.createWriteStream(
                        path.resolve(
                            outputDirectories.attachments,
                            `${attachment.fileId}.${ext}`
                        )
                    );
                    return stream.pipe(file);
                });
        })
    );
};

const saveContent = async (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    const scrubbed = scrubContent(content.adfBody);
    const data: Content = {
        ...content,
        adfBody: scrubbed,
        attachments: []
    };
    const contentPath = content.asHomepage
        ? outputDirectories.home
        : path.resolve(
              outputDirectories.notes,
              titleToPath(content.identifier.title)
          );
    fs.mkdirSync(contentPath, { recursive: true });
    fs.writeFileSync(
        path.resolve(contentPath, 'data.json'),
        JSON.stringify(data)
    );
};

const extractContent = async (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    await extractObjects(content, outputDirectories);
    await extractAttachments(content, outputDirectories);
    await saveContent(content, outputDirectories);
};

export default extractContent;
