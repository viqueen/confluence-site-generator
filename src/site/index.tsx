import { fontFamily } from '@atlaskit/theme';
import React from 'react';
import { render, hydrate } from 'react-dom';
import ContentWrapper from './ContentWrapper';
import Navigation from './Navigation';

export const titleToPath = (title: string): string => {
    const noSpaces = title.replace(/(\s+)/g, '-');
    return noSpaces.replace(/[,?]/g, '');
};

const Main = () => {
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
            <Navigation />
            <ContentWrapper />
        </div>
    );
};

const rootElm = document.querySelector('#root')!;
if (rootElm.hasChildNodes()) {
    hydrate(<Main />, rootElm);
} else {
    render(<Main />, rootElm);
}
