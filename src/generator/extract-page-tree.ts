import { OutputDirectories } from './extract';
import api, { Identifier } from './confluence/api';
import extractContent from './extract-content';

const extractPageTree = async (
    id: Identifier,
    outputDirectories: OutputDirectories,
    asHomepage = false
) => {
    const content = await api.getContentById(id, asHomepage);
    await extractContent(content, outputDirectories);
    for (const childId of content.children) {
        await extractPageTree(childId, outputDirectories);
    }
};

export default extractPageTree;
