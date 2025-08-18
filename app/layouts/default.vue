<script setup lang="ts">
</script>
<template>
    <div class="w-screen max-w-screen  overflow-x-hidden relative flex flex-col">
        <AppHeader class="fixed top-0" />
        <div class="min-h-screen flex items-center align-center w-full" >
        <slot />
        </div>
        <AppFooter class="" />
    </div>
</template>