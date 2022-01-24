import { ADFEntity } from '@atlaskit/adf-utils/dist/types/types';
import { extension, scrubAdf } from '@atlaskit/adf-utils';
import { rewriteUrl } from './util';

const identityProcessor = (node: ADFEntity) => {
    return node;
};

const inlineCardProcessor = (node: ADFEntity) => {
    const url = rewriteUrl(node.attrs?.url);
    return {
        type: node.type,
        attrs: {
            url
        }
    };
};

const mediaSingleProcessor = (node: ADFEntity) => {
    return extension({
        extensionType: 'org.viqueen.media',
        extensionKey: 'file',
        parameters: {
            ...node.attrs,
            data: node.content
        }
    });
};

const scrubContent = (doc: any) => {
    return scrubAdf(doc, {
        nodeReplacements: {
            bulletList: identityProcessor,
            codeBlock: identityProcessor,
            emoji: identityProcessor,
            expand: identityProcessor,
            extension: identityProcessor,
            heading: identityProcessor,
            inlineCard: inlineCardProcessor,
            inlineExtension: identityProcessor,
            media: identityProcessor,
            mediaSingle: mediaSingleProcessor,
            panel: identityProcessor,
            paragraph: identityProcessor,
            status: identityProcessor,
            table: identityProcessor,
            tableCell: identityProcessor,
            tableHeader: identityProcessor,
            tableRow: identityProcessor,
            text: identityProcessor
        }
    });
};

export { scrubContent };
