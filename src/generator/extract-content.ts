import api, { Content } from './confluence/api';
import { OutputDirectories } from './extract';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { filter } from '@atlaskit/adf-utils';
import ReactDOMServer from 'react-dom/server';
import { rewriteUrl, titleToPath } from './confluence/util';
import { scrubContent } from './confluence/adf-processor';
import { StaticWrapper } from './wrapper';
import extractObjects from './extract-objects';

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

const resolveContentPath = (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    if (content.asHomepage) {
        return outputDirectories.home;
    }
    if (content.type === 'page') {
        return path.resolve(
            outputDirectories.notes,
            titleToPath(content.identifier.title)
        );
    }
    return path.resolve(
        outputDirectories.articles,
        titleToPath(content.identifier.title)
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
    const contentPath = resolveContentPath(content, outputDirectories);
    fs.mkdirSync(contentPath, { recursive: true });
    fs.writeFileSync(
        path.resolve(contentPath, 'data.json'),
        JSON.stringify(data)
    );

    const indexHtml = ReactDOMServer.renderToStaticMarkup(
        StaticWrapper(content)
    );
    const subPath = content.type === 'page' ? 'notes' : 'articles';
    const templatePath = content.asHomepage
        ? outputDirectories.templates
        : path.resolve(
              outputDirectories.templates,
              subPath,
              titleToPath(content.identifier.title)
          );
    fs.mkdirSync(templatePath, { recursive: true });
    fs.writeFileSync(
        path.resolve(templatePath, 'index.html'),
        `<!DOCTYPE html>\n${indexHtml}`
    );
};

const extractContent = async (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    console.info('▶️  extract content', content.identifier);
    await extractObjects(content, outputDirectories);
    await extractAttachments(content, outputDirectories);
    await saveContent(content, outputDirectories);
};

export default extractContent;
