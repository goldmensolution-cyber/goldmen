// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/ngrok',
    '@nuxthub/core'
  ]
  , runtimeConfig: {
    // Server-only config
    mpesa: {
      env: process.env.MPESA_ENV || 'sandbox',
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      shortcode: process.env.MPESA_SHORTCODE || '',
      passkey: process.env.MPESA_PASSKEY || '',
      callbackUrl: process.env.MPESA_CALLBACK_URL || 'knowing-husky-reliably.ngrok-free.app',
    },},
    hub: {
    database: true
  },
  ngrok: {
      authtoken: process.env.NGROK_AUTHTOKEN,
      domain: 'knowing-husky-reliably.ngrok-free.app'
      
    },
    vite: {
    server: {
      allowedHosts: ['knowing-husky-reliably.ngrok-free.app']
    }
  },
  icon: {
      customCollections: [{
        prefix: 'custom',
        dir: './app/assets/icons'
      }]
    },
ui: {
    colorMode: false
  },
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-16'
})