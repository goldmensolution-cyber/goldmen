<script setup lang="ts">

const transactions  = await useFetch('/api/mpesa/transactions.list' )
    
</script>

<template>
<UCard class="w-full">
    <template #header>
        MPesa Transactions
    </template>
  <UTable :data="transactions.data.value"  class="flex-1" />
  </UCard>
</template>
