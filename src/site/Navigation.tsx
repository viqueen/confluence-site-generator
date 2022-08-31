import {
    AtlassianNavigation,
    CustomProductHome,
    PrimaryButton,
    generateTheme
} from '@atlaskit/atlassian-navigation';
import React from 'react';
import { siteProperties } from './properties';
import { Identifier } from 'confluence-content-extractor/dist/confluence/api';

const theme = generateTheme({
    name: 'high-contrast',
    backgroundColor: 'rgb(0, 102, 68)',
    highlightColor: '#FFFFFF'
});

const ConfluenceSiteHome = () => {
    return (
        <CustomProductHome
            iconAlt={siteProperties.title}
            iconUrl={siteProperties.iconUrl}
            logoAlt={siteProperties.title}
            logoUrl={siteProperties.iconUrl}
        />
    );
};

const HomeLink = ({ homePage }: { homePage: boolean }) => {
    return (
        <a href="/" style={{ textDecoration: 'none' }}>
            <PrimaryButton isHighlighted={homePage}>
                {siteProperties.title}
            </PrimaryButton>
        </a>
    );
};

const SiteLink = ({
    title,
    href,
    id,
    set
}: Identifier & { href: string; set: Set<string> }) => {
    return (
        <a href={href} style={{ textDecoration: 'none' }}>
            <PrimaryButton isHighlighted={set.has(id)}>{title}</PrimaryButton>
        </a>
    );
};

type NavigationProps = {
    siteLinks: (Identifier & { href: string })[];
    homePage: boolean;
    ancestors: Identifier[];
    currentContent: Identifier | undefined;
};

export default function Navigation({
    siteLinks,
    homePage,
    ancestors,
    currentContent
}: NavigationProps) {
    const set = ancestors.reduce(
        (prev, current) => prev.add(current.id),
        currentContent
            ? new Set<string>([currentContent.id])
            : new Set<string>()
    );
    const links = siteLinks.map((link) => (
        <SiteLink title={link.title} href={link.href} id={link.id} set={set} />
    ));
    return (
        <AtlassianNavigation
            label={siteProperties.title}
            primaryItems={[<HomeLink homePage={homePage} />, ...links]}
            renderProductHome={ConfluenceSiteHome}
            theme={theme}
        />
    );
}
