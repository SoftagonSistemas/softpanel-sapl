export default defineNuxtConfig({
    nitro: {
        preset: 'cloudflare-pages',
    },
    runtimeConfig: {
        public: {
            SAPL_URL: process.env.SAPL_URL,
            SAPL_TOKEN: process.env.SAPL_TOKEN,
        },
    },
    css: ['vuetify/styles/main.sass'],
    build: {
        transpile: ['vuetify'],
    },
})
