import { ADFEntity } from '@atlaskit/adf-utils/dist/types/types';
import { scrubAdf } from '@atlaskit/adf-utils';
import { rewriteUrl } from './util';

const inlineCardProcessor = (node: ADFEntity) => {
    const url = rewriteUrl(node.attrs?.url);
    return {
        type: node.type,
        attrs: {
            url
        }
    };
};

const identityProcessor = (node: ADFEntity) => {
    return node;
};

const scrubContent = (doc: any) => {
    return scrubAdf(doc, {
        nodeReplacements: {
            paragraph: identityProcessor,
            text: identityProcessor,
            expand: identityProcessor,
            heading: identityProcessor,
            extension: identityProcessor,
            bulletList: identityProcessor,
            codeBlock: identityProcessor,
            panel: identityProcessor,
            emoji: identityProcessor,
            table: identityProcessor,
            tableHeader: identityProcessor,
            tableRow: identityProcessor,
            tableCell: identityProcessor,
            inlineCard: inlineCardProcessor,
            media: identityProcessor
        }
    });
};

export { scrubContent };
