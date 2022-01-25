import { OutputDirectories } from './extract';
import api from './confluence/api';
import extractPageTree from './extract-page-tree';
import extractBlogs from './extract-blogs';

const extractSpace = async (
    spaceKey: string,
    outputDirectories: OutputDirectories
) => {
    console.info(`🎬 action : extract confluence ${spaceKey} space content`);

    const homePageIdentifier = await api.getSpaceHomepage(spaceKey);
    console.info(`🏠 processing space home: `, homePageIdentifier);

    await extractPageTree(homePageIdentifier, outputDirectories, true);
    await extractBlogs(outputDirectories);
};

export default extractSpace;
