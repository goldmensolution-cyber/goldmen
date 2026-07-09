<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

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

const user = useSupabaseUser()
const { profile, ensureProfile, toLocalKenyaPhone } = useProfileBootstrap()

const phoneNumber = computed(() => profile.value?.phone_number ?? '')

const { data, pending, error, refresh } = await useFetch<TransactionRow[]>(
  '/api/mpesa/transactions.list',
  {
    query: computed(() =>
      phoneNumber.value ? { phone_number: phoneNumber.value } : {}
    ),
    default: () => []
  }
)

watch(
  user,
  async (current) => {
    if (!current) {
      return
    }

    try {
      await ensureProfile()
      await refresh()
    } catch (err) {
      console.error(err)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-6 p-4 lg:p-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold">Transactions</h1>
      <p class="text-sm text-muted">
        Showing records for
        <span class="font-medium">
          {{ toLocalKenyaPhone(phoneNumber) || 'your saved number' }}
        </span>
      </p>
    </div>

    <UAlert
      v-if="error"
      title="Unable to load transactions"
      :description="error.message"
      color="error"
      variant="soft"
    />

    <UCard v-else-if="pending">
      <div class="p-4 text-sm text-muted">Loading transactions...</div>
    </UCard>

    <UCard v-else-if="!data?.length">
      <div class="p-4 text-sm text-muted">
        No transactions found for this phone number.
      </div>
    </UCard>

    <div v-else class="grid gap-4">
      <UCard v-for="tx in data" :key="tx.id">
        <div class="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="text-xs text-muted">Date</p>
            <p class="font-medium">{{ tx.created_at }}</p>
          </div>
          <div>
            <p class="text-xs text-muted">Amount</p>
            <p class="font-medium">KES {{ tx.amount ?? 0 }}</p>
          </div>
          <div>
            <p class="text-xs text-muted">Phone</p>
            <p class="font-medium">
              {{ toLocalKenyaPhone(tx.phone_number) || '—' }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted">Status</p>
            <UBadge :label="tx.status" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
