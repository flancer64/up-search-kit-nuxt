// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            // does not work with InstantSearch SSR
            // link: [
            //     {
            //         rel: 'stylesheet',
            //         href: '"https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/satellite-min.css"'
            //     }
            // ],
        }
    },
    modules: [
        ['nuxt-quasar-ui', {}]
    ]
});
