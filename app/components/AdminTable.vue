<script setup lang="ts">
interface TransactionRow {
  id: string | number
  created_at: string
  updated_at: string
  status: string
  phone_number: string | null
  account_reference: string | null
  amount: number | null
  transaction_desc: string | null
}

const searchPhone = ref('')
const query = computed(() =>
  searchPhone.value.trim()
    ? { phone_number: searchPhone.value.trim() }
    : {}
)

const { data, pending, refresh } = await useFetch<TransactionRow[]>(
  '/api/mpesa/transactions.list',
  {
    query,
    default: () => []
  }
)
</script>

<template>
  <UCard class="w-full">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold">Transactions</h2>
          <p class="text-sm text-muted">Loaded from Supabase</p>
        </div>

        <div class="flex items-center gap-2">
          <UInput
            v-model="searchPhone"
            placeholder="Filter by phone number"
            icon="i-lucide-search"
            class="w-64"
          />
          <UButton color="error" variant="outline" @click="refresh">
            Refresh
          </UButton>
        </div>
      </div>
    </template>

    <div v-if="pending" class="p-4 text-sm text-muted">
      Loading...
    </div>

    <div v-else class="divide-y divide-border">
      <div
        v-for="row in data"
        :key="row.id"
        class="grid gap-2 p-4 md:grid-cols-5"
      >
        <div>
          <p class="text-xs text-muted">Created</p>
          <p class="text-sm font-medium">{{ row.created_at }}</p>
        </div>
        <div>
          <p class="text-xs text-muted">Phone</p>
          <p class="text-sm font-medium">{{ row.phone_number || '—' }}</p>
        </div>
        <div>
          <p class="text-xs text-muted">Reference</p>
          <p class="text-sm font-medium">{{ row.account_reference || '—' }}</p>
        </div>
        <div>
          <p class="text-xs text-muted">Amount</p>
          <p class="text-sm font-medium">KES {{ row.amount ?? 0 }}</p>
        </div>
        <div>
          <p class="text-xs text-muted">Status</p>
          <UBadge :label="row.status" />
        </div>
      </div>
    </div>
  </UCard>
</template>
