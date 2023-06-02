<script>
// IMPORTS
import Client from '@searchkit/instantsearch-client';
import Searchkit from 'searchkit';
import {history as historyRouter} from 'instantsearch.js/es/lib/routers';
import {singleIndex as singleIndexMapping} from 'instantsearch.js/es/lib/stateMappings';
import {INDEX, CONFIG} from '~/utils/searchKit';

// VARS
const searchkitClient = new Searchkit(CONFIG);
const searchClient = Client(searchkitClient);

// MAIN
export default {
  components: {},
  /**
   * @param {Object} inst current instance of this Vue Component
   * @return {Object}
   */
  data(inst) {
    return {
      INDEX,
      ifDisplay: false,
      routing: {
        router: historyRouter(),
        // this object must contain two props: stateToRoute & routeToState
        stateMapping: (() => {
          // get 'singleIndexMapping' as a base for stateMapping object
          const res = singleIndexMapping('instant_search');
          // I've replaced `routeToState` with own code
          res.routeToState = () => {
            const res = {[INDEX]: {'refinementList': {}}};
            const params = inst.$route.params;
            if (params?.page)
              res[INDEX].page = Number.parseInt(params.page);
            if (params?.type)
              res[INDEX].refinementList.type = [params.type];
            if (params?.actors) {
              const actor = decodeKey(params.actors);
              res[INDEX].refinementList.actors = [actor];
            }
            return res;
          };
          return res;
        })()
      },
      searchClient,
      searchKey: null, // decoded search key from URL to use within this component
    };
  },
  mounted() {
    this.ifDisplay = true;
  },
  setup() {
    // `useHead` is not available in SSR mode (at least with InstantSearch)
  },
};
</script>

<template>
  <div class="container" v-if="ifDisplay">
    <ais-instant-search
        :search-client="searchClient"
        :index-name="INDEX"
        :routing="routing"
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
            <template v-slot:item="{ item }">
              <article class="fixQuasarDefaults">
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
