import React from 'react';
import { ExtensionParams } from '@atlaskit/editor-common/dist/types/extensions/types/extension-handler';
import { Content } from '../../../generator/confluence/api';
import ChildrenMacro from './ChildrenMacro';
import BlogPostsMacro from './BlogPostsMacro';
import MediaFile from './MediaFile';

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
        },
        'org.viqueen.media': (ext: ExtensionParams<any>, doc: object) => {
            if (ext.extensionKey === 'file') {
                console.log(ext);
                const layout = ext.parameters.layout;
                const attrs = ext.parameters.data[0].attrs;
                return (
                    <MediaFile
                        fileId={attrs.id}
                        width={attrs.width}
                        height={attrs.height}
                        layout={layout}
                    />
                );
            }
            console.log('** missing extension handler: ', ext.extensionKey);
            return null;
        }
    };
};

export { extensionHandlers };
