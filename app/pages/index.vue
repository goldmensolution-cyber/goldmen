<!-- app/pages/pay.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { InitiateStkPushResponse } from '~~/shared/types/mpesa'

const initiatorPhone = ref('')
const accountPhone = ref('')
const amount = ref<number | null>(null)

const loading = ref(false)
const result = ref<InitiateStkPushResponse | null>(null)
const errorMessage = ref<string | null>(null)

function reset() {
  result.value = null
  errorMessage.value = null
}

async function submitForm() {
  reset()
  if (!initiatorPhone.value || !accountPhone.value || !amount.value || amount.value <= 0) {
    errorMessage.value = 'Please provide valid phone numbers and a positive amount.'
    return
  }
  loading.value = true
  try {
    const res = await $fetch<InitiateStkPushResponse>('/api/mpesa/stkpush', {
      method: 'POST',
      body: {
        initiatorPhone: initiatorPhone.value,
        accountPhone: accountPhone.value,
        amount: Math.floor(Number(amount.value)),
      },
    })
    result.value = res
  } catch (err: any) {
    errorMessage.value = err?.data?.message || err?.message  || 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <h1>M-Pesa PayBill</h1>

    <form class="card" @submit.prevent="submitForm">
      <label>
        Your Phone (STK will pop here)
        <input
          v-model.trim="initiatorPhone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="0712345678 or +254712345678"
          required
        >
      </label>

      <label>
        Account Number (Phone)
        <input
          v-model.trim="accountPhone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="0712345678"
          required
        >
      </label>

      <label>
        Amount (KES)
        <input
          v-model.number="amount"
          type="number"
          inputmode="numeric"
          min="1"
          step="1"
          placeholder="100"
          required
        >
      </label>

      <button :disabled="loading" type="submit">
        {{ loading ? 'Waiting for STK confirmation…' : 'Pay Now' }}
      </button>
    </form>

    <div v-if="errorMessage" class="alert error">
      {{ errorMessage }}
    </div>

    <div v-if="result" class="card">
      <h2>Result: {{ result.status }}</h2>
      <p>{{ result.message }}</p>
      <ul>
        <li v-if="result.transactionId">Transaction ID: {{ result.transactionId }}</li>
        <li v-if="result.checkoutRequestId">CheckoutRequestID: {{ result.checkoutRequestId }}</li>
        <li v-if="result.merchantRequestId">MerchantRequestID: {{ result.merchantRequestId }}</li>
        <li v-if="result.mpesaReceiptNumber">Receipt: {{ result.mpesaReceiptNumber }}</li>
        <li v-if="result.resultCode !== undefined">ResultCode: {{ result.resultCode }}</li>
        <li v-if="result.resultDesc">ResultDesc: {{ result.resultDesc }}</li>
      </ul>

      <div v-if="result.status === 'TIMEOUT'">
        If you accepted the prompt but the server timed out, you can refresh later
        or contact support with your CheckoutRequestID.
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  background: white;
}
label {
  display: grid;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}
input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}
button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: #10b981;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
button[disabled] {
  opacity: 0.7;
  cursor: wait;
}
.alert.error {
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.75rem;
}
</style>