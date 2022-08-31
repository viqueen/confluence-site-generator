import { setup } from 'confluence-content-extractor/dist/output';
import * as path from 'path';
import * as fs from 'fs';
import { Identifier } from 'confluence-content-extractor/dist/confluence/api';
import { titleToPath } from 'confluence-content-extractor/dist/confluence/util';

const outputDirectory = path.join(process.cwd(), 'output');
const output = setup(outputDirectory);

const homeDataFile = path.join(output.home, 'data.json');
const homeData = JSON.parse(fs.readFileSync(homeDataFile).toString());

const navLinks = homeData.children.map(({ id, title }: Identifier) => ({
    href: `/notes/${titleToPath(title)}/`,
    title,
    id
}));

fs.writeFileSync(
    path.join(output.home, 'navlinks.json'),
    JSON.stringify(navLinks)
);
