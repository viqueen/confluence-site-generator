import { fontFamily } from '@atlaskit/theme';
import React from 'react';
import { render, hydrate } from 'react-dom';
import Navigation from './Navigation';

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
        </div>
    );
};

const rootElm = document.querySelector('#root')!;
if (rootElm.hasChildNodes()) {
    hydrate(<Main />, rootElm);
} else {
    render(<Main />, rootElm);
}
