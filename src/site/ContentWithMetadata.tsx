import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import React from 'react';
import { titleToPath } from './index';

import './ContentWithMetadata.css';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Blog24Icon from '@atlaskit/icon-object/glyph/blog/24';
import Page24Icon from '@atlaskit/icon-object/glyph/page/24';
import Heading from '@atlaskit/heading';
import ContentRenderer from './content/ContentRenderer';
import Avatar from '@atlaskit/avatar';
import { colorPalette } from '@atlaskit/theme/color-palettes';
import { Date } from '@atlaskit/date';
import {
    Content,
    Identifier
} from 'confluence-content-extractor/dist/confluence/api';
import ContentCover from './content/ContentCover';

interface ContentWithMetadataProps {
    content: Content;
}

type ContentType = 'page' | 'blogpost';
const ContentTypeLogo = (props: { type: ContentType }) => {
    switch (props.type) {
        case 'blogpost':
            return <Blog24Icon label="blog" />;
        case 'page':
        default:
            return <Page24Icon label="page" />;
    }
};

const Ancestors = ({ content }: ContentWithMetadataProps) => {
    if (content.type === 'blogpost') return <></>;
    return (
        <div className="content-ancestors">
            <Breadcrumbs>
                {content.ancestors?.map((item: Identifier, index: number) => {
                    return (
                        <BreadcrumbsItem
                            href={
                                index === 0
                                    ? '/'
                                    : `/notes/${titleToPath(item.title)}/`
                            }
                            text={item.title}
                            key={index}
                        />
                    );
                })}
            </Breadcrumbs>
        </div>
    );
};

interface BylineProps {
    displayName: string;
    user: string;
    date: number;
}
const Byline = (props: BylineProps) => {
    return (
        <div style={{ marginTop: 20, marginBottom: 60 }}>
            <div style={{ float: 'left', marginRight: 10 }}>
                <Avatar
                    appearance="square"
                    src={`/assets/avatars/${props.user}-avatar`}
                    size="large"
                    name={props.displayName}
                    presence="online"
                />
            </div>
            <div style={{ color: colorPalette('24')[16].background }}>
                <div>by {props.displayName}</div>
                <div style={{ marginTop: '5px', display: 'inline-block' }}>
                    on{' '}
                    <Date value={props.date} color="blue" format="MMMM do y" />
                </div>
            </div>
        </div>
    );
};

export default function ContentWithMetadata({
    content
}: ContentWithMetadataProps) {
    return (
        <div className="main-content">
            <Ancestors content={content} />
            <Page>
                <Grid layout="fixed">
                    {content.cover && <ContentCover {...content.cover} />}
                    <GridColumn medium={12}>
                        <div className="content-header">
                            <ContentTypeLogo type={content.type} />
                            <Heading level="h800">
                                {content.identifier.title}
                            </Heading>
                        </div>
                    </GridColumn>
                    <GridColumn medium={12}>
                        <Byline
                            displayName={content.author.title}
                            user={content.author.id}
                            date={content.createdDate}
                        />
                        <ContentRenderer content={content} />
                    </GridColumn>
                </Grid>
            </Page>
        </div>
    );
}
