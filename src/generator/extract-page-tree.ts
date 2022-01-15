import { OutputDirectories } from './extract';
import api from './confluence/api';
import extractContent from './extract-content';

const extractPageTree = async (
    id: string,
    outputDirectories: OutputDirectories,
    asHomepage = false
) => {
    console.info('▶️  extract page tree: ', id);
    const content = await api.getContent(id, asHomepage);
    await extractContent(content, outputDirectories);
    for (const child of content.children) {
        await extractPageTree(child.id, outputDirectories);
    }
};

export default extractPageTree;
