<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const items = ref<NavigationMenuItem[]>([
  [{
    label: 'Goldmen Solutions',
    icon: 'i-lucide-signal',
    to: '/',
    class: 'text-error text-xl font-playfair not-md:visible w-full shrink-0'
    
  }],[
  {
    label: 'Home',
    to: '/',
    slot: 'main',
  },
  {
    label: 'Buy Airtime',
    to: '/airtime',
    slot: 'main'
  
  },
  {
    label: 'About Us',
    to: '/about',
    slot: 'main'

  },
  {
    label: 'Blog',
    to: '/blog',
    slot: 'main'

  },
  {
    label: 'Admin',
    to: '/admin',
    slot: 'main'

  }],[
    {
      slot: 'signup'
    },
    
  {
    slot: 'burger',
    class: 'visible'
  }]
])
</script>

<template>
  <UHeader>
    <UNavigationMenu :ui="{linkLabel: 'text-error'}" :items="items" />
  </UHeader>
</template>
