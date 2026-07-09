<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-8 p-4 lg:p-6">
    <NewAirtime />
  </div>
</template>
