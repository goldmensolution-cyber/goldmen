<template>
  <div class="max-w-md mx-auto p-6">
    <div class="flex items-center gap-4 mb-6">
      <div class="w-12 h-12 rounded-md flex items-center justify-center" :style="{ background: provider.color + '22' }">
        <div class="text-lg font-bold" :style="{ color: provider.color }">{{ provider.letter }}</div>
      </div>
      <div>
        <h2 class="text-xl font-semibold">{{ provider.title }}</h2>
        <p class="text-sm text-gray-500">Fill in the details to convert to M-PESA</p>
      </div>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium mb-1">Phone number</label>
        <input v-model="form.phone" type="tel" placeholder="2547XXXXXXXX" class="w-full rounded border px-3 py-2" required >
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Amount</label>
        <input v-model.number="form.amount" type="number" min="1" placeholder="Amount" class="w-full rounded border px-3 py-2" required >
      </div>

      <div class="pt-2">
        <button :disabled="submitting" :style="{ background: provider.color }" class="w-full py-2 text-white rounded">
          {{ submitting ? 'Processing...' : 'Submit' }}
        </button>
      </div>

      <div v-if="message" class="mt-3 p-3 rounded" :style="{ background: messageType === 'success' ? '#e6ffed' : '#fff0f0' }">
        <div :class="messageType === 'success' ? 'text-green-700' : 'text-red-700'">{{ message }}</div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const slug = (route.params.slug || '').toString().toLowerCase()

const map = {
  safaricom: { title: 'Safaricom airtime → M-PESA', color: '#27ae60', letter: 'S' },
  airtel: { title: 'Airtel airtime → M-PESA', color: '#d93025', letter: 'A' },
  bonga: { title: 'Bonga points → M-PESA', color: '#1e90ff', letter: 'B' }
}

const provider = computed(() => map[slug] || { title: 'Conversion', color: '#333', letter: '?' })

const form = ref({ phone: '', amount: null })
const submitting = ref(false)
const message = ref('')
const messageType = ref('')

function validatePhone(p) {
  // light validation: allow E.164 or local starting 07/254
  return /^(\+?2547\d{8}|0?7\d{8})$/.test(p) || /^254\d{9}$/.test(p)
}

async function handleSubmit() {
  message.value = ''
  if (!validatePhone(form.value.phone)) {
    messageType.value = 'error'
    message.value = 'Enter a valid Kenyan phone number (e.g. 2547XXXXXXXX or 07XXXXXXXX).'
    return
  }
  if (!form.value.amount || form.value.amount <= 0) {
    messageType.value = 'error'
    message.value = 'Enter a valid amount.'
    return
  }

  submitting.value = true
  try {
    // mock submission - replace with real API call
    await new Promise((r) => setTimeout(r, 1000))
    messageType.value = 'success'
    message.value = `${provider.value.title} request submitted for ${form.value.phone} amount KES ${form.value.amount}.`

    // optionally redirect back after a short delay
    setTimeout(() => router.push('/convert'), 1800)
  } catch (e) {
    messageType.value = 'error'
    message.value = 'Submission failed. Try again.'
    console.log(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.max-w-md { max-width: 520px; }
</style>