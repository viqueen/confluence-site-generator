import api, { Content } from './confluence/api';
import { OutputDirectories } from './extract';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { filter } from '@atlaskit/adf-utils';
import { rewriteUrl } from './confluence/util';

const extractObjects = async (
    adf: any,
    outputDirectories: OutputDirectories
) => {
    const inlineCards = filter(adf, (node) => node.type === 'inlineCard').map(
        (item) => {
            return {
                resourceUrl: item.attrs?.url
            };
        }
    );
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

const extractContent = async (
    content: Content,
    outputDirectories: OutputDirectories
) => {
    await extractObjects(content.adfBody, outputDirectories);
};

export default extractContent;
