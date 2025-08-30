<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const items = ref<NavigationMenuItem[]>([
  [
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
    <template #title>
      <UButton 
        label="Goldmen Solutions" 
        variant="ghost" 
        icon="i-lucide-signal" 
        color="error"
        size="xl"
         />
    </template>
    <UNavigationMenu :ui="{linkLabel: 'text-error'}" :items="items" />
  </UHeader>
</template>
