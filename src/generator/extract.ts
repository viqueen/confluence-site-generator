import { environment } from './config';
import api from './confluence/api';
import path from 'path';
import fs from 'fs';
import extractPageTree from './extract-page-tree';
import extractBlogs from './extract-blogs';

export interface OutputDirectories {
    notes: string;
    articles: string;
    attachments: string;
    objectResolver: string;
    templates: string;
    home: string;
}

const targetOutput = path.resolve(__dirname, '../../dist');
const siteOutput = path.resolve(targetOutput, 'site');
const outputDirectories: OutputDirectories = {
    home: siteOutput,
    articles: path.resolve(siteOutput, 'articles'),
    notes: path.resolve(siteOutput, 'notes'),
    attachments: path.resolve(siteOutput, 'attachments'),
    objectResolver: path.resolve(siteOutput, 'object-resolver'),
    templates: path.resolve(targetOutput, 'templates')
};

Object.values(outputDirectories).forEach((directory) =>
    fs.mkdirSync(directory, { recursive: true })
);

const extract = async () => {
    console.info(
        `🎬 action : extract confluence ${environment.CONFLUENCE_SPACE} space content`
    );
    const homePage = await api.getSpaceHomepage();
    console.info(`🏠 processing space home: `, homePage);
    await extractPageTree(homePage.id, outputDirectories, true);
    await extractBlogs(outputDirectories);
};

extract()
    .then(() => {
        console.info('✅ done : extract');
    })
    .catch((error) => {
        console.error(error);
    });
