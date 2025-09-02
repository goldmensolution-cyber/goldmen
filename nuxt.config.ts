// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/ngrok',
    '@nuxthub/core',
    '@nuxtjs/supabase',
    'nuxt-vue3-google-signin'
  ]
  , runtimeConfig: {
    // Server-only config
    mpesa: {
      env: process.env.MPESA_ENV || 'sandbox',
      baseUrl: process.env.SAFARICOM_BASE_URL || 'sandbox.safaricom.co.ke',
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      shortcode: process.env.MPESA_SHORTCODE || '',
      passkey: process.env.MPESA_PASSKEY || '',
      callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://knowing-husky-reliably.ngrok-free.app/api/mpesa/callback',
    },},
    hub: {
    database: true
  },
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  },
  supabase:{
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/signup', '/confirm', '/blog/*','/'],
      include: ['/dashboard','/admin/*'],
    }
  },
  googleSignIn: {
    clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID || '',
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