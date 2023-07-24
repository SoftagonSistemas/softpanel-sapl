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
    modules: ['vuetify-nuxt-module'],
    vuetify: {
        vuetifyOptions: {
            theme: {
                defaultTheme: 'softaPanelDark',
                themes: {
                    softPanel: {
                        dark: false,
                        colors: {
                            background: '#FFFFFF',
                            surface: '#FFFFFF',
                            primary: '#4f46e5',
                            secondary: '#9333ea',
                            error: '#ef4444',
                            info: '#3b82f6',
                            success: '#22c55e',
                            warning: '#f59e0b',
                        },
                    },
                    softaPanelDark: {
                        dark: true,
                        colors: {
                            background: '#0C111B',
                            surface: '#111827',
                            primary: '#6366f1',
                            secondary: '#9333ea',
                            error: '#ef4444',
                            info: '#3b82f6',
                            success: '#22c55e',
                            warning: '#f59e0b',
                        },
                    },
                },
            },
        },
    },
    app: {
        pageTransition: {
            name: 'rotate',
        },
        layoutTransition: {
            name: 'slide-in',
        },
        head: {
            htmlAttrs: {
                lang: 'pt-BR',
            },
            bodyAttrs: {
                class: 'ma-2',
            },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            link: [{ rel: 'icon', type: 'image/png', href: '/softagon.png' }],
        },
    },
})
