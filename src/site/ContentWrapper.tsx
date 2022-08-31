import React from 'react';
import Spinner from '@atlaskit/spinner';
import ContentRenderer from './content/ContentRenderer';
import ContentWithMetadata from './ContentWithMetadata';
import { Content } from 'confluence-content-extractor/dist/confluence/api';

type ContentWrapperProps = {
    loading: boolean;
    content: Content | undefined;
};

export default function ContentWrapper({
    loading,
    content
}: ContentWrapperProps) {
    return (
        <>
            {loading && (
                <div style={{ margin: 60 }}>
                    <Spinner size="large" />
                </div>
            )}
            {!loading && content && content.asHomepage && (
                <div
                    style={{
                        overflowY: 'auto',
                        height: '90vh',
                        padding: '2em'
                    }}
                >
                    <ContentRenderer content={content} />
                </div>
            )}
            {!loading && content && !content.asHomepage && (
                <ContentWithMetadata content={content} />
            )}
        </>
    );
}
