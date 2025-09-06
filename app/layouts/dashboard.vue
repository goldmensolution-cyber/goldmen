<template>
<UDashboardGroup storage="local" storage-key="nuxt-admin-sidebar">
<UDashboardSidebar :storage-key="'nuxt-admin-sidebar'">
<template #header>
<div class="px-4 py-3 text-lg font-semibold">Airtime Admin</div>
</template>


<UNavigationMenu :items="sidebar" orientation="vertical" />
</UDashboardSidebar>


<UDashboardPanel>
<template #header>
<UDashboardNavbar title="Admin" :badge="{ text: 'v1', tone: 'neutral' }" />
</template>


<main class="p-4">
<slot />
</main>
</UDashboardPanel>
</UDashboardGroup>
</template>


<script setup lang="ts">
const sidebar = [
{ label: 'Overview', to: '/admin' },
{ label: 'Transactions', to: '/admin' },
{ label: 'Customers', to: '/admin/customers' },
{ label: 'Settings', to: '/admin/settings' }
]
</script>