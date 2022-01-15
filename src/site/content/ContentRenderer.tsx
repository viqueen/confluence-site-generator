import React from 'react';
import { Content } from '../../generator/confluence/api';
import { Provider } from '@atlaskit/smart-card';
import { ReactRenderer } from '@atlaskit/renderer';
import SimpleCardClient from './SimpleCardClient';
import { extensionHandlers } from './extensions';

interface ContentRendererProps {
    content: Content;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
    return (
        <Provider client={new SimpleCardClient()}>
            <ReactRenderer
                document={content.adfBody}
                allowDynamicTextSizing={true}
                allowCopyToClipboard={false}
                extensionHandlers={extensionHandlers(content)}
            />
        </Provider>
    );
}
