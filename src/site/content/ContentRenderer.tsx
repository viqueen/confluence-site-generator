import React from 'react';
import { Content } from '../../generator/confluence/api';
import { Provider } from '@atlaskit/smart-card';
import { ReactRenderer } from '@atlaskit/renderer';
import SimpleCardClient from './SimpleCardClient';
import { extensionHandlers } from './extensions';
import { IntlProvider } from 'react-intl';

interface ContentRendererProps {
    content: Content;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
    return (
        <Provider client={new SimpleCardClient()}>
            <IntlProvider locale="en">
                <ReactRenderer
                    document={content.adfBody}
                    allowDynamicTextSizing={true}
                    allowCopyToClipboard={false}
                    extensionHandlers={extensionHandlers(content)}
                />
            </IntlProvider>
        </Provider>
    );
}
