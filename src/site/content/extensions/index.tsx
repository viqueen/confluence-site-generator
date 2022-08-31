import React from 'react';
import { ExtensionParams } from '@atlaskit/editor-common/dist/types/extensions/types/extension-handler';
import ChildrenMacro from './ChildrenMacro';
import BlogPostsMacro from './BlogPostsMacro';
import MediaFile from './MediaFile';
import ProfilePicture from './ProfilePicture';
import { Content } from 'confluence-content-extractor/dist/confluence/api';
import WidgetConnectorMacro from './WidgetConnectorMacro';

const extensionHandlers = (content: Content) => {
    return {
        'com.atlassian.confluence.macro.core': (ext: ExtensionParams<any>) => {
            switch (ext.extensionKey) {
                case 'children':
                    const parent = ext.parameters.macroParams.page?.value;
                    return (
                        <ChildrenMacro
                            parent={parent}
                            children={content.children || []}
                        />
                    );
                case 'blog-posts':
                    return <BlogPostsMacro />;
                case 'profile-picture':
                    return (
                        <ProfilePicture
                            accountId={ext.parameters.macroParams.User.value}
                            size={ext.parameters.macroParams.Size.value}
                        />
                    );
                case 'widget':
                    return (
                        <WidgetConnectorMacro
                            url={ext.parameters.macroParams.url.value}
                        />
                    );
                default:
                    console.warn(
                        '** missing extension handler: ',
                        ext.extensionKey,
                        ext
                    );
                    return null;
            }
        },
        'org.viqueen.media': (ext: ExtensionParams<any>, doc: object) => {
            if (ext.extensionKey !== 'file') {
                console.warn(
                    '** missing media extension handler',
                    ext.extensionKey
                );
                return null;
            }
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
    };
};

export { extensionHandlers };
