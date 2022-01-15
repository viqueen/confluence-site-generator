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
    assets: { avatars: string };
}

const targetOutput = path.resolve(__dirname, '../../dist');
const siteOutput = path.resolve(targetOutput, 'site');
const outputDirectories: OutputDirectories = {
    articles: path.resolve(siteOutput, 'articles'),
    assets: {
        avatars: path.resolve(siteOutput, 'assets', 'avatars')
    },
    attachments: path.resolve(siteOutput, 'attachments'),
    home: siteOutput,
    notes: path.resolve(siteOutput, 'notes'),
    objectResolver: path.resolve(siteOutput, 'object-resolver'),
    templates: path.resolve(targetOutput, 'templates')
};

Object.values(outputDirectories)
    .filter((item) => typeof item === 'string')
    .forEach((directory) => fs.mkdirSync(directory, { recursive: true }));
fs.mkdirSync(outputDirectories.assets.avatars, { recursive: true });

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
