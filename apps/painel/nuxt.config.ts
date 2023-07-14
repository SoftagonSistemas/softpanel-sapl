export default defineNuxtConfig({
  modules: ['@myturborepo/ui'],
  nitro: {
    preset: 'netlify',
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
