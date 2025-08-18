<script setup lang="ts">

const { data } = await useFetch('/api/transactions/list.get' )
    
</script>

<template>
<UCard class="w-full">
    <template #header>
        MPesa Transactions
    </template>
  <UTable :data="data"  class="flex-1" />
  </UCard>
</template>
