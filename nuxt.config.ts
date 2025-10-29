import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  hub: {
    database: true
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxt/image',
    'nuxt-auth-utils',
    '@nuxthub/core',
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: [
      { code: 'es', name: 'Español', file: 'es.json' },
    ],
    defaultLocale: 'es',
  }
})