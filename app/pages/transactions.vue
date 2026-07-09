<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

interface TransactionRow {
  id: number
  initiatorPhone: string
  recipientPhone: string
  amount: number
  reference: string
  description: string
  status: string
  merchantRequestId: string | null
  checkoutRequestId: string | null
  mpesaReceiptNumber: string | null
  resultCode: number | null
  resultDesc: string | null
  transactionDate: string | null
  createdAt: string
  updatedAt: string
}

const user = useSupabaseUser()
const toast = useToast()

const { profile, ensureProfile, loadProfile, toLocalKenyaPhone } =
  useProfileBootstrap()

const queryPhone = computed(() => profile.value?.phone_number ?? '')

const query = computed(() => {
  return queryPhone.value
    ? { phone_number: queryPhone.value }
    : {}
})

const {
  data,
  pending,
  error,
  refresh
} = await useFetch<TransactionRow[]>('/api/mpesa/transactions.list', {
  query,
  default: () => []
})

const transactions = computed(() => {
  return [...(data.value ?? [])].sort((a, b) => {
    const left = new Date(b.createdAt).getTime()
    const right = new Date(a.createdAt).getTime()
    return left - right
  })
})

watch(
  user,
  async (current) => {
    if (!current) {
      return
    }

    try {
      await ensureProfile()
      await loadProfile()
      await refresh()
    } catch (err) {
      toast.add({
        title: 'Unable to load transactions',
        description:
          err instanceof Error ? err.message : 'Please refresh and try again.',
        color: 'error'
      })
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
        Showing transactions for
        <span class="font-medium">{{ toLocalKenyaPhone(queryPhone || profile?.phone_number) || 'your saved number' }}</span>
      </p>
    </div>

    <UCard v-if="pending">
      <div class="p-4 text-sm text-muted">Loading transactions...</div>
    </UCard>

    <UAlert
      v-else-if="error"
      title="Unable to load transactions"
      :description="error.message"
      color="error"
      variant="soft"
    />

    <UCard v-else-if="!transactions.length">
      <div class="p-4 text-sm text-muted">
        No transactions found for this phone number.
      </div>
    </UCard>

    <div v-else class="grid gap-4">
      <UCard
        v-for="tx in transactions"
        :key="tx.id"
        class="overflow-hidden"
      >
        <div class="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="text-xs text-muted">Date</p>
            <p class="font-medium">{{ tx.createdAt }}</p>
          </div>
          <div>
            <p class="text-xs text-muted">Amount</p>
            <p class="font-medium">KES {{ tx.amount }}</p>
          </div>
          <div>
            <p class="text-xs text-muted">Recipient</p>
            <p class="font-medium">{{ toLocalKenyaPhone(tx.recipientPhone) }}</p>
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
