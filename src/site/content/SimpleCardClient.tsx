import { Client, ResolveResponse } from '@atlaskit/smart-card';
import { JsonLd } from 'json-ld-types';
import * as crypto from 'crypto';
import axios from 'axios';

export default class SimpleCardClient extends Client {
    fetchData(url: string): Promise<JsonLd.Response> {
        const cardHash = crypto
            .createHash('md5')
            .update(url)
            .digest('hex')
            .toString();
        return axios
            .get(`/object-resolver/${cardHash}.json`)
            .then((response) => {
                return {
                    meta: {
                        access: 'granted',
                        visibility: 'public'
                    },
                    data: response.data
                } as ResolveResponse;
            });
    }
    prefetchData(url: string): Promise<JsonLd.Response | undefined> {
        return Promise.resolve(undefined);
    }
}
