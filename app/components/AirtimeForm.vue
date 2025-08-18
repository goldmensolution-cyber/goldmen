<!-- components/AirtimeForm.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

type TxStatus = 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'
const phone = ref('')
const amount = ref<number | null>(null)

const submitting = ref(false)
const status = ref<TxStatus>('IDLE')
const statusText = ref<string>('')
const checkoutRequestId = ref<string | null>(null)

const canSubmit = computed(() => {
  return !!phone.value && !!amount.value && !submitting.value
})

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  status.value = 'PENDING'
  statusText.value = 'Initiating STK Push...'

  try {
    // 1) Initiate STK Push
    const res = await $fetch<{ checkoutRequestId: string; merchantRequestId?: string; responseDesc?: string }>(
      '/api/mpesa/stk-push',
      {
        method: 'POST',
        body: {
          phone: phone.value,
          amount: Number(amount.value),
        },
      }
    )

    checkoutRequestId.value = res.checkoutRequestId
    statusText.value = 'STK Push sent. Check your phone and enter your M-Pesa PIN...'

    // 2) Poll for status until terminal or timeout
    await pollUntilDone(res.checkoutRequestId, {
      intervalMs: 3000,
      timeoutMs: 90000, // 90s timeout; adjust as needed
    })
  } catch (e: any) {
    console.error(e)
    status.value = 'FAILED'
    statusText.value = e?.data?.message || e?.message || 'Failed to initiate STK Push'
  } finally {
    submitting.value = false
  }
}

async function pollUntilDone(id: string, opts: { intervalMs: number; timeoutMs: number }) {
  const started = Date.now()
  while (true) {
    // Abort on timeout
    if (Date.now() - started > opts.timeoutMs) {
      status.value = 'FAILED'
      statusText.value = 'Timed out waiting for M-Pesa response.'
      break
    }

    try {
      const tx = await $fetch<{
        status: 'PENDING' | 'SUCCESS' | 'FAILED'
        resultCode: number | null
        resultDesc: string | null
      }>(`/api/mpesa/transactions/${id}`, { method: 'GET' })

      if (tx.status === 'SUCCESS') {
        status.value = 'SUCCESS'
        statusText.value = 'Payment successful.'
        break
      } else if (tx.status === 'FAILED') {
        status.value = 'FAILED'
        statusText.value = tx.resultDesc || 'Payment failed.'
        break
      } else {
        status.value = 'PENDING'
        statusText.value = 'Waiting for M-Pesa confirmation...'
      }
    } catch (e) {
      // If the lookup fails transiently, keep trying until timeout
      console.warn('Polling error:', e)
      status.value = 'PENDING'
      statusText.value = 'Waiting for M-Pesa confirmation...'
    }

    await new Promise((r) => setTimeout(r, opts.intervalMs))
  }
}

function resetForm() {
  phone.value = ''
  amount.value = null
  checkoutRequestId.value = null
  status.value = 'IDLE'
  statusText.value = ''
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Buy Airtime</h2>
        <span v-if="checkoutRequestId" class="text-xs text-gray-500">Ref: {{ checkoutRequestId }}</span>
      </div>
    </template>

    <UForm class="space-y-4" @submit.prevent="submit">
      <UFormField label="Phone" required>
        <UInput v-model="phone" placeholder="2547XXXXXXXX" :disabled="submitting" />
      </UFormField>

      <UFormField label="Amount" required>
        <UInput v-model.number="amount" type="number" min="1" :disabled="submitting" />
      </UFormField>

      <div class="flex items-center gap-3">
        <UButton type="submit" :loading="submitting" :disabled="!canSubmit">Pay</UButton>
        <UButton color="neutral" variant="ghost" :disabled="submitting" @click="resetForm">Reset</UButton>
      </div>

      <div v-if="status !== 'IDLE'" class="pt-2">
        <UAlert
          :title="statusText"
          :color="status === 'SUCCESS' ? 'success' : status === 'FAILED' ? 'error' : 'secondary'"
          :icon="status === 'SUCCESS' ? 'i-heroicons-check-circle' : status === 'FAILED' ? 'i-heroicons-x-circle' : 'i-heroicons-information-circle'"
          :closeable="false"
        />
      </div>
    </UForm>
  </UCard>
</template>