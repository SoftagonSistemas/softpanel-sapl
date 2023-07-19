export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages',
  },
  runtimeConfig: {
    public: {
      saplUrl: process.env.saplUrl,
      saplToken: process.env.saplToken,
    },
  },
  css: ['vuetify/styles/main.sass'],
  build: {
    transpile: ['vuetify'],
  },
})
