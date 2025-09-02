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
  ],[
    {
      slot: 'signup'
    },
    
  {
    slot: 'burger',
    class: 'visible'
  }]
])
const user = useSupabaseUser()
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
    <template #right>
      <GoogleOneTap v-if="!user" />
      <div v-else class="flex md:flex-row gap-3" >
        <UButton label="My Dashboard" to="/dashboard" />
        <UButton label="My Admin" to="/admin" />
      </div>
      
    </template>
  </UHeader>
</template>
