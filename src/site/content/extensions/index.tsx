import React from 'react';
import { ExtensionParams } from '@atlaskit/editor-common/dist/types/extensions/types/extension-handler';
import { Content } from '../../../generator/confluence/api';
import ChildrenMacro from './ChildrenMacro';
import BlogPostsMacro from './BlogPostsMacro';

const extensionHandlers = (content: Content) => {
    return {
        'com.atlassian.confluence.macro.core': (
            ext: ExtensionParams<any>,
            doc: object
        ) => {
            switch (ext.extensionKey) {
                case 'children':
                    const parent = ext.parameters.macroParams.page?.value;
                    return (
                        <ChildrenMacro
                            parent={parent}
                            children={content.children}
                        />
                    );
                case 'blog-posts':
                    return <BlogPostsMacro />;
                default:
                    console.log(
                        '** missing extension handler: ',
                        ext.extensionKey
                    );
                    return null;
            }
        }
    };
};

export { extensionHandlers };
