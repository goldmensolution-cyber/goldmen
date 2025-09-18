<script setup lang="ts">
</script>
<template>
    <div>
        <AppHeader  />
        <slot />
            <USeparator icon="i-lucide-signal" type="solid" size="sm" color="warning" />
        <AppFooter  />
</div>
</template>