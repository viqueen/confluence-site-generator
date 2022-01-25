import path from 'path';
import fs from 'fs';

export interface OutputDirectories {
    notes: string;
    articles: string;
    attachments: string;
    objectResolver: string;
    templates: string;
    home: string;
    assets: { avatars: string };
}

const setupOutputDirectories = (destination: string): OutputDirectories => {
    const targetOutput = destination;
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

    return outputDirectories;
};

export default setupOutputDirectories;
