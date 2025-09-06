<template>
<UDashboardGroup storage="local" storage-key="nuxt-admin-sidebar">
<AdminSidebar />


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

</script>