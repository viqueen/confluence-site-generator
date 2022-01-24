import api, { Content } from './confluence/api';
import { OutputDirectories } from './extract';
import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { titleToPath } from './confluence/util';
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
                    const filePath = path.resolve(
                        outputDirectories.attachments,
                        attachment.fileId
                    );
                    const file = fs.createWriteStream(filePath);
                    return stream.pipe(file);
                });
        })
    );
};

const extractAssets = async (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    const { author } = content;
    const avatarFile = path.resolve(
        outputDirectories.assets.avatars,
        `${author.id}-avatar`
    );
    if (fs.existsSync(avatarFile)) {
        return;
    }
    await api.getAttachmentData(author.avatar, '').then(({ stream }) => {
        const file = fs.createWriteStream(avatarFile);
        return stream.pipe(file);
    });

    const symlink = path.resolve(
        outputDirectories.assets.avatars,
        author.accountId
    );
    if (fs.existsSync(symlink)) return;
    fs.symlinkSync(avatarFile, symlink);
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

const symlinkForInternals = (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    if (content.asHomepage) return;
    const directory =
        content.type === 'page'
            ? outputDirectories.notes
            : outputDirectories.articles;
    const symlink = path.resolve(directory, content.identifier.id);
    if (fs.existsSync(symlink)) return;
    fs.symlinkSync(
        path.resolve(directory, titleToPath(content.identifier.title)),
        symlink
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
    symlinkForInternals(content, outputDirectories);
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

const shouldSkip = (
    content: Content,
    outputDirectories: OutputDirectories
): boolean => {
    const targetDirectory =
        content.type === 'page'
            ? outputDirectories.notes
            : outputDirectories.articles;
    const dataFile = path.resolve(
        targetDirectory,
        titleToPath(content.identifier.title),
        'data.json'
    );
    if (!fs.existsSync(dataFile)) return false;
    const fileStats = fs.statSync(dataFile);
    const lastTouched = fileStats.mtime.getTime();
    return lastTouched >= content.lastModifiedDate;
};

const extractContent = async (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    if (shouldSkip(content, outputDirectories)) {
        console.log('⚡️  skipped', content.identifier);
        return;
    }
    console.info('▶️  extract content', content.identifier);
    await extractObjects(content, outputDirectories);
    await extractAttachments(content, outputDirectories);
    await extractAssets(content, outputDirectories);
    await saveContent(content, outputDirectories);
};

export default extractContent;
