<script setup>
import Client from '@searchkit/instantsearch-client';
import Searchkit from 'searchkit';

const INDEX = 'imdb_movies'; // name of the index used in the search
const config = {
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
const searchkitClient = new Searchkit(config);
const searchClient = Client(searchkitClient);
const {results} = await searchClient.search([{
  indexName: INDEX,
  query: {
    query: '',
    filters: [
      'composition:*',
    ]
  }
}]);
const [first] = results;
const hits = first?.nbHits
</script>

<template>
  <q-btn color="primary">Search</q-btn>

  <div class="container">
    <div>Total '{{ hits }}' items found.</div>
  </div>

</template>