import { OutputDirectories } from './extract';
import api from './confluence/api';

const extractPageTree = async (
    id: string,
    outputDirectories: OutputDirectories,
    asHomepage = false
) => {
    console.info('▶️ extract page tree: ', id);
    const content = await api.getContent(id, asHomepage);
};

export default extractPageTree;
