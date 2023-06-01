<script>
// IMPORTS
import {renderToString} from 'vue/server-renderer';
import {INDEX, getSearchClient, getServerRootMixin} from '~/utils/searchKit';
import {
  AisConfigure,
  AisHighlight,
  AisHits,
  AisInstantSearchSsr,
  AisPagination,
  AisPanel,
  AisRefinementList,
  AisSearchBox,
  AisSnippet,
  AisStats,
} from 'vue-instantsearch/vue3/es';
// VARS
const REF_SK = 'sk'; // reference for the SearchKit component
const searchClient = getSearchClient();

// searchKit.handleInstantSearchRequests();
// const search = instantsearch({
//   indexName: INDEX,
//   searchClient: searchClient
// });
// const myHits = await searchClient.search([
//   {
//     indexName: INDEX,
//     'params': {
//       'facetFilters': [
//         [
//           'type:movie'
//         ],
//         [
//           'actors:Robert De Niro'
//         ]
//       ],
//       'facets': [
//         'type',
//         'actors'
//       ],
//       'highlightPostTag': '__/ais-highlight__',
//       'highlightPreTag': '__ais-highlight__',
//       'hitsPerPage': 8,
//       'maxValuesPerFacet': 10,
//       'page': 0,
//       'query': '',
//       'tagFilters': ''
//     }
//   }
// ]);

// FUNCS

// MAIN
export default {
  components: {
    AisConfigure,
    AisHighlight,
    AisHits,
    AisInstantSearchSsr,
    AisPagination,
    AisPanel,
    AisRefinementList,
    AisSearchBox,
    AisSnippet,
    AisStats,
  },
  /**
   * @param {Object} inst current instance of this Vue Component
   * @return {Object}
   */
  data(inst) {
    return {
      INDEX,
      REF_SK,
      searchKey: null, // decoded search key from URL to use within this component
    };
  },
  async created() {
    // extract search key from URL and set component property
    const route = this.$route;
    const keyEncoded = route.params?.key;
    this.searchKey = decodeKey(keyEncoded);
  },
  mounted() {
  },
  mixins: [
    // add the instance of InstantSearch to the component
    getServerRootMixin()
  ],
  /**
   * Async function to be resolved before the component instance is to be rendered on the server.
   * https://vuejs.org/api/options-lifecycle.html#serverprefetch
   */
  async serverPrefetch() {
    console.log(`serverPrefetch in the Component.`);
    if (this.instantsearch?.findResultsState) {
      console.log(`findResultsState property is available in the Component.`);
      // if app contains InstantSearch client - render it.
      return this.instantsearch?.findResultsState({
        component: this,
        renderToString,
      });
    } else {
      console.log(`findResultsState property is NOT available in the Component.`);
    }
  },
  async beforeMount() {
    console.log(`beforeMount in the Component.`);
    if (this.instantsearch?.hydrate) {
      console.log(`hydrate property is available in the Component.`);
      const results =
          (this.$nuxt.context && this.$nuxt.context.nuxtState.algoliaState) ||
          window.__NUXT__.algoliaState;

      this.instantsearch.hydrate(results);

      // Remove the SSR state, so it can't be applied again by mistake
      delete this.$nuxt?.context?.nuxtState?.algoliaState;
      delete window.__NUXT__?.algoliaState;
    } else {
      console.log(`hydrate property is NOT available in the Component.`);
    }
  },
  setup() {
    // `useHead` is not available in SSR mode (at least with InstantSearch)
  },
};
</script>

<template>
  <div class="container">
    <ais-instant-search-ssr>
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
    </ais-instant-search-ssr>
  </div>
</template>

<style>
/* useHead & nuxt.config.ts don't work with with InstantSearch SSR */
@import "https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/satellite-min.css";

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