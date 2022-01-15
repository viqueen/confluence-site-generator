import { environment } from './config';
import api from './confluence/api';

const extract = async () => {
    console.info(
        `🎬 action : extract confluence ${environment.CONFLUENCE_SPACE} space content`
    );
    const homePage = await api.getSpaceHomepage();
    console.info(`🏠 processing space home: `, homePage);
};

extract()
    .then(() => {
        console.info('✅ done : extract');
    })
    .catch((error) => {
        console.error(error);
    });
