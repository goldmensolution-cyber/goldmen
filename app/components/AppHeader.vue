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
    label: 'Buy Bundles',
    to: '/bundles',
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
  <UNavigationMenu :items="items" :ui="{linkLabel: 'not-sm:hidden'}" variant="link" class="w-full text-black  bg-neutral justify-between backdrop-blur-3xl z-50" >
  <template #signup>
    
  </template>
    <template #burger>
      <UPopover>
        <UButton 
        variant="outline"
        color="neutral" 
        class="md:hidden"
        icon="i-lucide-menu" />
        <template #content>
          <UNavigationMenu 
            orientation="vertical"
            :items="items"
            />
        </template>
      </UPopover>
    </template>
  </UNavigationMenu>
</template>
