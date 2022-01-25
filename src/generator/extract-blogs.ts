import { OutputDirectories } from './extract';
import api from './confluence/api';
import fs from 'fs';
import path from 'path';
import extractContent from './extract-content';

const extractBlogs = async (outputDirectories: OutputDirectories) => {
    console.info('📙  extract blogs');
    const articles = await api.getSpaceBlogs();
    fs.writeFileSync(
        path.resolve(outputDirectories.home, 'articles.json'),
        JSON.stringify(articles)
    );

    for (const article of articles) {
        const content = await api.getContentById(article.identifier);
        await extractContent(content, outputDirectories);
    }
};

export default extractBlogs;
