<template>
<UPageGrid>
<UPageCard title="Transactions" :description="`${transactions.length} total`">
<template #default>
<div class="text-2xl font-semibold">{{ formattedTotal }}</div>
</template>
</UPageCard>


<UPageCard title="Customers" :description="`${uniqueCustomers} active`">
<template #default>
<div class="text-2xl font-semibold">{{ uniqueCustomers }}</div>
</template>
</UPageCard>


<UPageCard title="Account balance" :description="'M-Pesa / Wallet'">
<template #default>
<div class="text-2xl font-semibold">{{ accountBalance }}</div>
</template>
</UPageCard>


<UPageCard title="Traffic (24h)" :description="'Requests & conversions'">
<template #default>
<div class="text-2xl font-semibold">{{ traffic24 }}</div>
</template>
</UPageCard>
</UPageGrid>
</template>


<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ transactions?: any[] }>()
const transactions = props.transactions ?? []


// very simple derived values — replace with real data if you have server-side totals
const formattedTotal = computed(() => {
const total = transactions.reduce((s: number, t: any) => s + Number(t.amount ?? 0), 0)
return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(total)
})


const uniqueCustomers = computed(() => new Set(transactions.map((t: any) => t.msisdn || t.phone)).size)
const accountBalance = '—' // you likely need to fetch from safaricom or your accounting backend
const traffic24 = computed(() => transactions.filter((t: any) => {
const date = new Date(t.createdAt || t.created_at || t.date)
return (Date.now() - date.getTime()) < 1000 * 60 * 60 * 24
}).length)
</script>