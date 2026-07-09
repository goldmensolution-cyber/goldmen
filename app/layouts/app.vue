<!-- app/layouts/app.vue -->
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const open = ref(false)

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Airtime',
    icon: 'i-lucide-badge-dollar-sign',
    to: '/airtime',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Transactions',
    icon: 'i-lucide-receipt',
    to: '/transactions',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    to: '/profile',
    onSelect: () => {
      open.value = false
    }
  }
])

async function logout() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <UDashboardGroup class="min-h-screen">
    <UDashboardSidebar
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
    >
      <template #header>
        <ULink to="/" class="flex items-center gap-3 px-2 py-1">
          <UAvatar src="/brandicon.png" class="rounded-none bg-transparent" />
          <div>
            <p class="font-semibold text-error">Goldmen</p>
            <p class="text-xs text-muted">Solutions</p>
          </div>
        </ULink>
      </template>

      <template #default>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          tooltip
          class="px-2"
        />
      </template>

      <template #footer>
        <div class="space-y-3 p-2">
          <div class="text-sm">
            <p class="font-medium">{{ user?.email || 'Signed in user' }}</p>
          </div>
          <UButton
            block
            color="error"
            variant="outline"
            icon="i-lucide-log-out"
            label="Logout"
            @click="logout"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </div>
    </div>
  </UDashboardGroup>
</template>
