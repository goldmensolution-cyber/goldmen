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
      label: 'Business Administration',
      to: '/business-administration',
      slot: 'main',
    },
    {
      label: 'Paybill Guide',
      to: '/help',
      slot: 'main',
    },
    {
      label: 'Convert to Mpesa',
      to: '/convert',
      slot: 'main',
    },
    {
      label: 'Knowledge Blog',
      to: '/blog',
      slot: 'main',
    },
  ], [
    {
      slot: 'signup',
    },
    {
      label: 'Download App',
      icon: 'i-logos-android-icon',
      to: 'https://play.google.com/store/apps/details?id=ke.co.goldmen.goldmen',
      target: '_blank',
      rel: 'noopener noreferrer',
      class: 'rounded-full bg-error px-3 py-2 text-white hover:bg-error/90',
    },
    {
      slot: 'burger',
      class: 'visible',
    },
  ],
])
const user = useSupabaseUser()
const supabase = useSupabaseClient()

function handleLogout() {
  supabase.auth.signOut()
  //reload page
  navigateTo('/')
}
</script>

<template>
  <UHeader
  :ui="{ root: 'font-open-sans'}"
  :toggle="{
    size: 'xl'
      
    }">
    <template #title>
     <!-- <NuxtImg
      src="/brand.png"
      class="h-6 w-auto" 
      /> -->
      <ULink to="/">
      <UUser :avatar="{src: '/brandicon.png', class: 'rounded-none bg-transparent'}" name="Goldmen" class="font-medium text-error" :ui="{description: 'font-medium text-error',name: 'text-error' }" description="Solutions" />
      </ULink>
    </template>
    <UNavigationMenu color="error" highlight highlight-color="error" :items="items" />
    <div v-if="user" class="flex md:flex-row gap-3" >
        <UButton v-if="user.role=='admin'" label="My Dashboard" to="/dashboard" color="error" variant="link" />
        <UButton label="My Profile" to="/profile"  color="error" variant="link" />
        <UButton label="Logout" color="error" variant="outline" @click="handleLogout" />
      </div>
    <template #body>
    <UNavigationMenu :ui="{linkLabel: 'text-error'}" orientation="vertical" :items="items" />
    <div v-if="user" class="flex md:flex-col gap-3" >
        <UButton v-if="user.role=='admin'" label="My Dashboard" to="/dashboard" color="error" variant="link" />
        <UButton label="My Profile" to="/profile"  color="error" variant="link" />
        <UButton label="Logout" color="error" variant="outline" @click="handleLogout" />
      </div>
    </template>
    <template #right>
      <div v-if="!user" class="flex md:flex-row gap-3" >
      <UButton label="Login" color="error" to="/login" />
      </div>  
    </template>
  </UHeader>
</template>
