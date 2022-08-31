import { fontFamily } from '@atlaskit/theme';
import React, { useEffect, useState } from 'react';
import { render, hydrate } from 'react-dom';
import ContentWrapper from './ContentWrapper';
import Navigation from './Navigation';
import {
    Content,
    Identifier
} from 'confluence-content-extractor/dist/confluence/api';
import axios from 'axios';
import { siteProperties } from './properties';

export const titleToPath = (title: string): string => {
    const noSpaces = title.replace(/(\s+)/g, '-');
    return noSpaces.replace(/[,?]/g, '');
};

const Main = () => {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<Content | undefined>(undefined);
    const [navlinks, setNavlinks] = useState<(Identifier & { href: string })[]>(
        []
    );

    useEffect(() => {
        const fetchNavigation = async () => {
            const { data } = await axios.get('/navlinks.json');
            setNavlinks(data);
        };
        // noinspection JSIgnoredPromiseFromCall
        fetchNavigation();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data } = await axios.get('data.json');
            document.title = `${siteProperties.contentTitlePrefix}${data.identifier.title}`;
            setContent(data);
            setLoading(false);
        };
        // noinspection JSIgnoredPromiseFromCall
        fetchData();
    }, []);

    return (
        <div
            style={{
                top: 0,
                position: 'fixed',
                left: 0,
                width: '100%',
                fontFamily: fontFamily()
            }}
        >
            <Navigation
                siteLinks={navlinks}
                key={navlinks.length}
                homePage={!!content?.asHomepage || content?.type === 'blogpost'}
                currentContent={content?.identifier}
                ancestors={content?.ancestors || []}
            />
            <ContentWrapper loading={loading} content={content} />
        </div>
    );
};

const rootElm = document.querySelector('#root')!;
if (rootElm.hasChildNodes()) {
    hydrate(<Main />, rootElm);
} else {
    render(<Main />, rootElm);
}
