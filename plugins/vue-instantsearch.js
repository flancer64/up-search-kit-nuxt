/**
 * Register 'vue-instantsearch' components globally.
 * (https://github.com/searchkit/searchkit/blob/main/examples/with-ui-vue/src/main.ts)
 */
// IMPORTS
import InstantSearch from 'vue-instantsearch/vue3/es';

// VARS

// MAIN
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(InstantSearch);
});