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
    'nuxt-auth-utils',
    '@vite-pwa/nuxt',
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
  pwa: {
    registerType: 'autoUpdate', // auto updates service worker
    manifest: {
      name: 'Mentel Airtime',
      short_name: 'Mentel',
      description: 'A brave new way of buying airtime to any network.',
      theme_color: '#0f172a',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      cleanupOutdatedCaches: true
    },
    devOptions: {
      enabled: true, // allows testing in dev
      type: 'module'
    }
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