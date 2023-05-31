<script>
// IMPORTS
import Client from '@searchkit/instantsearch-client';
import Searchkit from 'searchkit';

// VARS
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

// MAIN
export default {
  /**
   * @param {Object} inst current instance of this Vue Component
   * @return {Object}
   */
  data(inst) {
    return {
      INDEX,
      searchClient,
    };
  },
  setup() {
    useHead({
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/satellite-min.css'
        }
      ]
    });
  },
};
</script>

<template>
  <q-btn color="primary">Search</q-btn>
  <div class="container">
    <ais-instant-search
        :search-client="searchClient"
        :index-name="INDEX"
    >
      <ais-configure :hits-per-page.camel="8"/>
      <div class="search-panel">
        <div class="search-panel__filters">
          <ais-panel>
            <template v-slot:header>type</template>
            <ais-refinement-list attribute="type"/>
          </ais-panel>

          <ais-panel>
            <template v-slot:header>actors</template>
            <ais-refinement-list searchable attribute="actors"/>
          </ais-panel>
        </div>

        <div class="search-panel__results">
          <div class="searchbox">
            <ais-search-box placeholder=""/>
          </div>
          <ais-hits>
            <template v-slot:item="{ item, index }">
              <article>
                <h1>
                  <ais-highlight attribute="title" :hit="item"/>
                </h1>
                <p>
                  <ais-snippet :hit="item" attribute="plot"/>
                </p>
              </article>
            </template>
          </ais-hits>

          <div class="pagination">
            <ais-pagination/>
          </div>
        </div>
      </div>
    </ais-instant-search>
  </div>
</template>

<style>
body,
h1 {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
  Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

em {
  background: cyan;
  font-style: normal;
}

.header {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.5rem 1rem;
  background-image: linear-gradient(to right, #4dba87, #2f9088);
  color: #fff;
  margin-bottom: 1rem;
}

.header a {
  color: #fff;
  text-decoration: none;
}

.header-title {
  font-size: 1.2rem;
  font-weight: normal;
}

.header-title::after {
  content: ' ▸ ';
  padding: 0 0.5rem;
}

.header-subtitle {
  font-size: 1.2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.search-panel {
  display: flex;
}

.search-panel__filters {
  flex: 1;
}

.search-panel__results {
  flex: 3;
}

.searchbox {
  margin-bottom: 2rem;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>