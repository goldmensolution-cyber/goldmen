<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex items-center gap-4 mb-4">
          <div :style="{ background: provider.color + '22' }" class="w-14 h-14 rounded-lg flex items-center justify-center">
            <img :src="provider.logo" :alt="provider.title" class="w-10 h-10 object-contain" >
          </div>
          <div>
            <h2 class="text-xl font-semibold">{{ provider.title }}</h2>
            <p class="text-sm text-gray-500">Fill in the details to convert to M-PESA</p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium mb-1">Phone number</label>
            <input v-model="form.phone" type="tel" placeholder="2547XXXXXXXX" class="w-full rounded-lg border px-3 py-2" required >
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Amount</label>
            <input v-model.number="form.amount" type="number" min="1" placeholder="Amount" class="w-full rounded-lg border px-3 py-2" required >
          </div>

          <div class="text-sm text-gray-600">
            <p>Please double-check your phone number before submitting.</p>
            <p class="mt-1 font-medium text-red-600">Reminder: you will only receive 70% of your airtime's worth.</p>
          </div>

          <div class="pt-2">
            <button :disabled="submitting" :style="{ background: provider.color }" class="w-full py-2 text-white rounded-lg">
              {{ submitting ? 'Processing...' : 'Submit' }}
            </button>
          </div>

          <div v-if="message" class="mt-3 p-3 rounded" :style="{ background: messageType === 'success' ? '#e6ffed' : '#fff0f0' }">
            <div :class="messageType === 'success' ? 'text-green-700' : 'text-red-700'">{{ message }}</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const slug = (route.params.slug || '').toString().toLowerCase()

// map includes logo paths in public/images
const map = {
  safaricom: { title: 'Safaricom airtime → M-PESA', color: '#27ae60', letter: 'S', logo: '/images/safaricom.png' },
  airtel: { title: 'Airtel airtime → M-PESA', color: '#d93025', letter: 'A', logo: '/images/airtel.jpg' },
  bonga: { title: 'Bonga points → M-PESA', color: '#1e90ff', letter: 'B', logo: '/images/bonga.jpeg' }
}

const provider = computed(() => map[slug] || { title: 'Conversion', color: '#333', letter: '?', logo: '/images/brandicon.png' })

const form = ref({ phone: '', amount: null })
const submitting = ref(false)
const message = ref('')
const messageType = ref('')

function validatePhone(p) {
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

    setTimeout(() => router.push('/convert'), 1600)
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