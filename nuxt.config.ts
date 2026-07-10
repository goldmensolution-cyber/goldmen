// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
  ]
  , 
  app: {
        head: {
          script: [
            { src: 'https://accounts.google.com/gsi/client' }
          ]
        },
      },
    runtimeConfig: {
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
  
 
  routeRules: {
  '/': { prerender: true },
  '/blog': { prerender: true },
  '/blog/**': { prerender: true },
  '/help': { prerender: true },

  '/dashboard/**': {
    prerender: false,
    ssr: false
  },

  '/admin/**': {
    prerender: false,
    ssr: false
  },

  '/profile/**': {
    prerender: false,
    ssr: false
  },

  '/login': { prerender: false },
  '/signup': { prerender: false },
  '/confirm': { prerender: false }
},
  supabase:{
    // Disable automatic redirects from the Supabase auth module
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/signup', '/confirm', '/blog/*','/'],
      include: ['/dashboard','/admin/*'],
      saveRedirectToCookie: true,
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
  nitro: {
    prerender: {
      crawlLinks: false
    }
  },
  compatibilityDate: '2026-05-03',

})