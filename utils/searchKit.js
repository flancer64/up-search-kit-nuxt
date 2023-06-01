/**
 * Library to create SearchKit/InstantSearch clients.
 */
// IMPORTS
import Searchkit from 'searchkit';
import Client from '@searchkit/instantsearch-client';
import {createServerRootMixin} from 'vue-instantsearch/vue3/es';

// VARS
export const INDEX = 'imdb_movies';
export const CONFIG = {
    connection: {
        host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
        // if you are authenticating with api key
        // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
        // if you are authenticating with username/password
        // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
        //auth: {
        //  username: "elastic",
        //  password: "changeme"
        //},
    },
    search_settings: {
        highlight_attributes: ['title'],
        search_attributes: [{field: 'title', weight: 3}, 'actors', 'plot'],
        result_attributes: ['title', 'actors', 'poster', 'plot'],
        facet_attributes: [
            'type',
            {attribute: 'actors', field: 'actors.keyword', type: 'string'}
        ],
        sorting: {
            default: {
                field: '_score',
                order: 'desc'
            },
            _rated_desc: {
                field: 'rated',
                order: 'desc'
            }
        },
        snippet_attributes: ['plot'],
        query_rules: []
    }
};

const searchKit = new Searchkit(CONFIG);
const searchClient = Client(searchKit);

// MAIN
const mixin = createServerRootMixin({
    searchClient,
    indexName: INDEX,
});

export function getSearchClient() {
    return searchClient;
}

export function getServerRootMixin() {
    return mixin;
}