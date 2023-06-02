<script>
// IMPORTS
import {INDEX, composeSearchRequest, getSearchClient} from '~/utils/searchKit';

// VARS
const searchClient = getSearchClient();

// FUNCS
/**
 * Convert facets (filters) object to array of {key,value}
 * @param {Object} data
 * @return {[{value: string, key: string}]}
 */
function getFacets(data) {
  if (data) {
    const res = [];
    for (const key of Object.keys(data))
      res.push({key, value: data[key]});
    return res;
  } else return [];
}

// MAIN
export default {
  data() {
    return {
      INDEX,
      search: null, // search results
    };
  },
  computed: {
    facetsActors() {
      return getFacets(this.search?.facets?.actors);
    },
    facetsType() {
      return getFacets(this.search?.facets?.type);
    },
    hits() {

    },
  },
  /**
   * Async function to be resolved before the component instance is to be rendered on the server.
   * https://vuejs.org/api/options-lifecycle.html#serverprefetch
   */
  async serverPrefetch() {
    // analyze URL and get search params
    const searchParams = {};
    // extract search keys from URL
    const urlParams = this.$route.params;
    if (urlParams?.type) searchParams.type = urlParams.type;
    if (urlParams?.actors) searchParams.actors = decodeKey(urlParams.actors);
    // compose search request and load data from ElasticSearch
    const req = composeSearchRequest(searchParams);
    const res = await searchClient.search([req]);
    this.search = res?.results[0];
  },
};
</script>

<template>
  <div class="t-container" v-if="search">
    <div class="search-panel">
      <div class="search-panel__filters">
        <div class="ais-Panel">
          <div class="ais-Panel-header">type</div>
          <div class="ais-Panel-body">
            <div class="ais-RefinementList">
              <ul class="ais-RefinementList-list">
                <li class="ais-RefinementList-item" v-for="one of facetsType">
                  <label class="ais-RefinementList-label">
                    <input class="ais-RefinementList-checkbox" type="checkbox" value="{{ one.key }}">
                    <span class="ais-RefinementList-labelText">{{ one.key }}</span>
                    <span class="ais-RefinementList-count">{{ one.value }}</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="ais-Panel">
          <div class="ais-Panel-header">actors</div>
          <div class="ais-Panel-body">
            <div class="ais-RefinementList">
              <div class="searchbox">TODO: do we need it in SSR mode?</div>
              <ul class="ais-RefinementList-list">
                <li class="ais-RefinementList-item" v-for="one of facetsActors">
                  <label class="ais-RefinementList-label">
                    <input class="ais-RefinementList-checkbox" type="checkbox" value="{{ one.key }}">
                    <span class="ais-RefinementList-labelText">{{ one.key }}</span>
                    <span class="ais-RefinementList-count">{{ one.value }}</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="search-panel__results">
        <div class="searchbox">TODO: do we need it in SSR mode?</div>
        <div class="ais-Hits">
          <ol class="ais-Hits-list">
            <li class="ais-Hits-item" v-for="one of search?.hits">
              <article class="fixQuasarDefaults">
                <h1>
                  <span class="ais-Highlight">{{ one?._highlightResult?.title?.value }}</span>
                </h1>
                <p>
                  <span class="ais-Snippet">{{ one?._snippetResult?.plot?.value }}</span>
                </p>
              </article>
            </li>
          </ol>
        </div>
        <div class="pagination">TODO: do we need it in SSR mode?</div>
      </div>
    </div>
  </div>
</template>
