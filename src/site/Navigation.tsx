import {
    AtlassianNavigation,
    CustomProductHome,
    PrimaryButton
} from '@atlaskit/atlassian-navigation';
import React from 'react';

const ConfluenceSiteHome = () => {
    return (
        <CustomProductHome
            iconAlt="confluence-site-generator"
            iconUrl=""
            logoAlt="confluence-site-generator"
            logoUrl=""
        />
    );
};

const HomeLink = () => {
    return (
        <a href="/" style={{ textDecoration: 'none' }}>
            <PrimaryButton isHighlighted={true}>
                confluence-site-generator
            </PrimaryButton>
        </a>
    );
};

export default function Navigation() {
    return (
        <AtlassianNavigation
            label="viqueen.org"
            primaryItems={[<HomeLink />]}
            renderProductHome={ConfluenceSiteHome}
        />
    );
}
