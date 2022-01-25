import { environment } from './config';
import path from 'path';
import fs from 'fs';
import extractSpace from './extract-space';
import setupOutputDirectories from './setup-output-directories';

export interface OutputDirectories {
    notes: string;
    articles: string;
    attachments: string;
    objectResolver: string;
    templates: string;
    home: string;
    assets: { avatars: string };
}

// setup output directories

const targetOutput = path.resolve(__dirname, '../../dist');
const outputDirectories: OutputDirectories =
    setupOutputDirectories(targetOutput);

// extract content from confluence

const extract = async () => {
    const sourceSpace = environment.CONFLUENCE_SPACE;
    await extractSpace(sourceSpace, outputDirectories);
};

extract()
    .then(() => console.info('✅ done : extract'))
    .catch((error) => console.error(error));
