<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useToast } from '#imports'
import { vMaska } from 'maska/vue'
// --- Types ---
type ApiResponse = {
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'ALREADY_PAID' | 'CANCELLED'
  message: string
  transactionId: string | number
  merchantRequestId?: string
  checkoutRequestId?: string
  mpesaReceiptNumber?: string
  resultCode?: number
  resultDesc?: string
}

// Store the last transactionId after submit
const lastTransactionId = ref<number | null>(null)

// --- Utilities ---
function onlyDigits(s: string) {
  return s.replace(/[^0-9]/g, '')
}
function toLocal(msisdn: string) {
  let d = onlyDigits(msisdn.trim())
  if (d.startsWith('254')) d = '0' + d.slice(3)
  if (d.startsWith('7') && d.length === 9) d = '0' + d
  return d
}
type BadgeColor = "error" | "info" | "primary" | "warning" | "neutral" | "success" | "secondary" | undefined

// ...existing code...
function detectProvider(input: string): { key: string, label: string, color: BadgeColor, icon: string } {
  const local = toLocal(input)
  const p4 = local.slice(0, 4)
  // const p3 = local.slice(0, 3)

  // Safaricom prefixes
  const safaricom = [
    // 0110-0115
    ...Array.from({length: 6}, (_, i) => `011${i}`),
    // 0700-0729
    ...Array.from({length: 30}, (_, i) => `07${(i<10?'0':'')}${i}`),
    // 0745-0746, 0748
    '0745', '0746', '0748',
    // 0757-0759
    '0757', '0758', '0759',
    // 0768-0769
    '0768', '0769',
    // 0790-0799
    ...Array.from({length: 10}, (_, i) => `079${i}`)
  ]
  // Airtel prefixes
  const airtel = [
    // 0100-0106
    ...Array.from({length: 7}, (_, i) => `010${i}`),
    // 0740-0743
    ...Array.from({length: 4}, (_, i) => `074${i}`),
    // 0750-0756
    ...Array.from({length: 7}, (_, i) => `075${i}`),
    // 0762, 0767
    '0762', '0767',
    // 0780-0789
    ...Array.from({length: 10}, (_, i) => `078${i}`)
  ]
  // Telkom prefixes
  const telkom = [
    ...Array.from({length: 10}, (_, i) => `077${i}`)
  ]
  // Faiba (Jamii Telecom)
  const faiba = ['0747']
  // Equitel (Finserve)
  const equitel = ['0763', '0764', '0765', '0766']

  if (safaricom.includes(p4)) {
    return { key: 'safaricom', label: 'Safaricom', color: 'primary', icon: 'i-custom-safaricom' }
  }
  if (airtel.includes(p4)) {
    return { key: 'airtel', label: 'Airtel', color: 'error', icon: 'i-custom-airtel' }
  }
  if (telkom.includes(p4)) {
    return { key: 'telkom', label: 'Telkom', color: 'warning', icon: 'i-custom-telkom' }
  }
  if (faiba.includes(p4)) {
    return { key: 'faiba', label: 'Faiba 4G', color: 'info', icon: 'i-custom-faiba' }
  }
  if (equitel.includes(p4)) {
    return { key: 'equitel', label: 'Equitel', color: 'secondary', icon: 'i-custom-equitel' }
  }
  // Other known but less common prefixes (optional)
  if (['0120', '0124', '0126', '0128', '0130', '0744', '0760', '0761'].includes(p4)) {
    return { key: 'other', label: 'Other', color: 'neutral', icon: 'i-heroicons-question-mark-circle' }
  }
  return { key: 'unknown', label: 'Unknown', color: 'neutral', icon: 'i-heroicons-question-mark-circle' }
}
// ...existing code...
function isLikelyKenyanMobile(input: string) {
  const d = onlyDigits(input)
  if (d.startsWith('0')) return /^0(7|1)\d{8}$/.test(d)
  if (d.startsWith('254')) return /^254(7|1)\d{8}$/.test(d)
  if (d.startsWith('7') || d.startsWith('1')) return /^(7|1)\d{8}$/.test(d)
  return false
}
function isSafaricom(input: string) {
  return detectProvider(input).key === 'safaricom'
}

// --- Zod Schema ---
const schema = z.object({
  accountPhone: z.string()
    .min(9, 'Enter a valid Kenyan mobile number')
    .refine(isLikelyKenyanMobile, 'Enter a valid Kenyan mobile number'),
  initiatorPhone: z.string()
    .min(9, 'Enter a valid Safaricom number for STK Push')
    .refine(isLikelyKenyanMobile, 'Enter a valid Safaricom number for STK Push')
    .refine(isSafaricom, 'STK Push works only on Safaricom numbers'),
  amount: z.number({ error: 'Enter a valid amount' })
    .int('Amount must be a whole number')
    .positive('Amount must be greater than 0')
    .max(150000, 'Amount cannot exceed KES 150,000'),
})

type FormState = z.infer<typeof schema>

// --- State ---
const state = reactive<FormState>({
  accountPhone: '',
  initiatorPhone: '',
  amount: 10,
})

const submitting = ref(false)
const waiting = ref(false)
const countdown = ref(60)
let countdownTimer: ReturnType<typeof setInterval> | undefined

const initiatorMeta = computed(() => detectProvider(state.initiatorPhone))
const accountMeta = computed(() => detectProvider(state.accountPhone))

// --- Reference autofill ---


// --- Persist last used values ---
if (import.meta.client) {
  const last = localStorage.getItem('airrime:last')
  if (last) {
    try {
      const parsed = JSON.parse(last)
      Object.assign(state, parsed)
    } catch {
      // Ignore JSON parse errors and use default state
    }
  }
}
watch(state, (v) => {
  if (import.meta.client) {
    localStorage.setItem('airrime:last', JSON.stringify(v))
  }
}, { deep: true })

// --- Feedback ---
const feedback = reactive<{
  kind: 'idle' | 'info' | 'success' | 'warning' | 'error'
  title?: string
  message?: string
  details?: string
  receipt?: string
}>({
  kind: 'idle'
})

function resetFeedback() {
  feedback.kind = 'idle'
  feedback.title = undefined
  feedback.message = undefined
  feedback.details = undefined
  feedback.receipt = undefined
}

function startCountdown(sec = 60) {
  countdown.value = sec
  clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
    }
  }, 1000)
}
function stopCountdown() {
  clearInterval(countdownTimer)
}

const toast = useToast()
function setToastByStatus(res: ApiResponse, contextPhone: string) {
  if (res.status === 'SUCCESS') {
    toast.add({ title: 'Payment successful', description: `KES ${state.amount.toLocaleString()} paid. Receipt: ${res.mpesaReceiptNumber || '—'}`, color: 'success' })
  } else if (res.status === 'ALREADY_PAID') {
    toast.add({ title: 'Already paid', description: 'A matching successful payment already exists.', color: 'primary' })
  } else if (res.status === 'TIMEOUT') {
    toast.add({ title: 'Still pending', description: `No confirmation yet. You may approve on your phone (${toLocal(contextPhone)}) or retry.`, color: 'warning' })
  } else {
    const cancelled = res.resultCode === 1032
    toast.add({ title: cancelled ? 'Payment cancelled' : 'Payment failed', description: res.message || res.resultDesc || 'Please try again.', color: 'error' })
  }
}
function setInlineFeedback(res: ApiResponse) {
  if (res.status === 'SUCCESS') {
    feedback.kind = 'success'
    feedback.title = 'Payment successful'
    feedback.message = `KES ${state.amount.toLocaleString()} paid successfully.`
    feedback.details = res.resultDesc
    feedback.receipt = res.mpesaReceiptNumber
  } else if (res.status === 'ALREADY_PAID') {
    feedback.kind = 'info'
    feedback.title = 'Already paid'
    feedback.message = 'A previous transaction with the same details was completed.'
    feedback.details = res.resultDesc
  } else if (res.status === 'TIMEOUT') {
    feedback.kind = 'warning'
    feedback.title = 'Awaiting confirmation'
    feedback.message = 'No confirmation received yet. You can retry after a moment.'
    feedback.details = res.resultDesc
  } else {
    feedback.kind = 'error'
    const cancelled = res.resultCode === 1032
    feedback.title = cancelled ? 'Payment cancelled by user' : 'Payment failed'
    feedback.message = res.message || res.resultDesc || 'Please try again.'
    feedback.details = res.resultDesc
  }
}

async function onSubmit(e: FormSubmitEvent<FormState>) {
  const { data } = e

  resetFeedback()
  submitting.value = true
  waiting.value = true
  startCountdown(60)

  toast.add({
    title: 'STK Push sent',
    description: `We sent a prompt to ${toLocal(data.initiatorPhone)}. Approve it to continue.`,
    color: 'primary'
  })

  try {
    const res = await $fetch<ApiResponse>('/api/mpesa/stkpush', {
      method: 'POST',
      body: {
        initiatorPhone: data.initiatorPhone,
        accountPhone: data.accountPhone,
        amount: data.amount,
      }
    })
    // Store transactionId for polling
    lastTransactionId.value = typeof res.transactionId === 'string' ? parseInt(res.transactionId) : res.transactionId


    stopCountdown()
    waiting.value = false
    setToastByStatus(res, data.initiatorPhone)
    setInlineFeedback(res)
  } catch (err: unknown) {
    stopCountdown()
    waiting.value = false
    feedback.kind = 'error'
    feedback.title = 'Request error'
    let message = 'Unable to process request.'
    if (typeof err === 'object' && err !== null) {
      // @ts-expect-error: err may have data/message
      message = err.data?.message || err.message || message
    }
    feedback.message = message
    toast.add({ title: 'Request error', description: feedback.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}
// Watch countdown for timeout and start polling
watch(countdown, (val) => {
  if (val <= 0 && waiting.value && lastTransactionId.value) {
    waiting.value = false
    feedback.kind = 'warning'
    feedback.title = 'Still waiting for confirmation'
    feedback.message = 'No response from M-Pesa yet. Checking status...'
    startPollingStatus(lastTransactionId.value)
  }
})
const open = ref(false)
const canSubmit = computed(() => initiatorMeta.value.key === 'safaricom')
// Add a wrapper for the actual submit logic
async function handleConfirmedSubmit(e: FormSubmitEvent<FormState>) {
  open.value = false
  await onSubmit(e)
}

// Intercept submit to show modal instead of submitting directly
function onFormSubmit(e: FormSubmitEvent<FormState>, nativeEvent?: Event) {
  nativeEvent?.preventDefault?.()
  open.value = true
  // Store event for later use
  lastFormEvent.value = e
}
function cancelModal() {
  open.value = false
}
// Store the last form event for confirmation
const lastFormEvent = ref<FormSubmitEvent<FormState> | null>(null)

function confirmAndSubmit() {
  if (lastFormEvent.value) {
    handleConfirmedSubmit(lastFormEvent.value)
  }
}
const pollInterval = ref<NodeJS.Timeout | null>(null)

function startPollingStatus(transactionId: number) {
  stopPollingStatus()
  pollInterval.value = setInterval(async () => {
    const res = await $fetch<ApiResponse>(`/api/mpesa/transaction-status?id=${transactionId}`)
    if (res.status === 'SUCCESS' || res.status === 'FAILED' || res.status === 'CANCELLED') {
      stopPollingStatus()
      waiting.value = false
      feedback.kind = res.status === 'SUCCESS' ? 'success' : 'error'
      feedback.title = res.status === 'SUCCESS' ? 'Payment successful' : 'Payment failed'
      feedback.message = res.resultDesc || (res.status === 'SUCCESS' ? 'Paid' : 'Failed')
      feedback.receipt = res.mpesaReceiptNumber
    }
  }, 4000)
}
function stopPollingStatus() {
  if (pollInterval.value) clearInterval(pollInterval.value)
  pollInterval.value = null
}
</script>

<template>
  <UCard class="max-w-2xl mx-auto mt-8">
    <template #header>
      <h1>Buy Airtime</h1>
    </template>
    
    <div class="space-y-6">
      <!-- Info panel with steps -->
      <UAlert 
      variant="soft" 
      color="primary" 
      icon="i-heroicons-information-circle"
      title="How to pay with M-Pesa (STK Push)">
        <template #description>
        <div class="space-y-2">
          <ol class="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Enter the recipient phone and amount.</li>
            <li>Enter your Safaricom number (payer) and tap Pay.</li>
            <li>Approve the STK prompt on your phone using your M-Pesa PIN.</li>
            <li>Wait here for confirmation. If you cancel, we’ll let you know.</li>
          </ol>
          <p class="text-xs text-muted-foreground">
            Tips: Phone formats accepted include 07XXXXXXXX, 7XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX.
          </p>
        </div>
        </template>
      </UAlert>

      <!-- Real-time status while waiting -->
      <div v-if="waiting" class="rounded-lg border p-4 space-y-3">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-clock-20-solid" class="text-primary" />
          <span class="font-medium">Waiting for confirmation…</span>
          <UBadge color="primary" variant="subtle">~{{ countdown }}s</UBadge>
        </div>
        <UProgress :model-value="100" :indeterminate="true" />
        <p class="text-sm text-muted-foreground">
          Check your phone and approve the M-Pesa prompt. Do not refresh this page.
        </p>
      </div>

      <!-- Inline feedback after response -->
      <UAlert
        v-if="feedback.kind !== 'idle'"
        :color="feedback.kind === 'success' ? 'success' : feedback.kind === 'warning' ? 'warning' : feedback.kind === 'info' ? 'primary' : 'error'"
        :icon="feedback.kind === 'success' ? 'i-heroicons-check-circle' : feedback.kind === 'warning' ? 'i-heroicons-exclamation-triangle' : feedback.kind === 'info' ? 'i-heroicons-information-circle' : 'i-heroicons-x-circle'"
      :title="feedback.title "
        >
          <template #description>
          <p class="text-sm text-muted-foreground">{{ feedback.message }}</p>
          <p v-if="feedback.receipt" class="text-sm"><span class="font-medium">Receipt:</span> {{ feedback.receipt }}</p>
          <p v-if="feedback.details" class="text-xs text-muted-foreground">{{ feedback.details }}</p>
          </template>
      </UAlert>

      <USeparator />

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onFormSubmit($event, $event?.event)">
         <!-- Payer -->
        <UFormField name="initiatorPhone" help="You will receive mpesa PIN prompt here" label="Your M-Pesa number (payer)" required>
              <UInput
                v-model="state.initiatorPhone"
                v-maska="'#### ### ###'" 
                placeholder="0723 456 789"       
                 icon="i-heroicons-device-phone-mobile"
                autocomplete="tel"
                inputmode="tel"
              >
            <template #trailing>
              <UBadge 
              :color="initiatorMeta.color"
               variant="subtle"
               size="xs"
                 :icon="initiatorMeta.icon" 
                 :label="initiatorMeta.label" 
                 />
               
              </template>
              </UInput>
        </UFormField>
        <!-- Recipient -->
        <UFormField name="accountPhone" help="The phone number receiving the airtime(could be same as above)" label="Recipient phone">
              <UInput
                v-model="state.accountPhone"
                v-maska="'#### ### ###'" 
                placeholder="0723 456 789"   
                icon="i-heroicons-user-circle"
                autocomplete="tel"
                inputmode="tel"
              >
              <template #trailing>
              <UBadge 
              :color="accountMeta.color" variant="subtle"
               :icon="accountMeta.icon" size="xs" :label="accountMeta.label" 
              />
              </template>
              </UInput>
        </UFormField>

        <!-- Amount -->
        <UFormField name="amount" help="Specify a whole number" label="Amount (KES)" required>
            <UInputNumber v-model="state.amount" :min="1" :max="150000" :step="1" />
        </UFormField>
        <USeparator />
       
        <!-- Actions -->
        <div class="flex items-center gap-3">
          <UButton type="submit" :disabled="!canSubmit || submitting" :loading="submitting">
            Pay with M-Pesa
          </UButton>
          <UButton variant="ghost" color="neutral" :disabled="submitting || waiting" @click="resetFeedback()">
            Clear status
          </UButton>
        </div>
      </UForm>

      <USeparator />
  <UModal v-model:open="open">
  <template #body>
    <div class="space-y-2">
      <p class="font-medium">Confirm Payment</p>
      <p>
        Send <span class="font-semibold">KES {{ state.amount }}</span> airtime to
        <span class="font-semibold">{{ toLocal(state.accountPhone) }}</span>
        from <span class="font-semibold">{{ toLocal(state.initiatorPhone) }}</span>?
      </p>
    </div>
  </template>
  <template #footer>
    <UButton color="primary" :loading="submitting" @click="confirmAndSubmit">
      Confirm
    </UButton>
    <UButton variant="ghost" color="neutral" :disabled="submitting" @click="cancelModal">
      Cancel
    </UButton>
  </template>
</UModal>

      <p class="text-xs text-muted-foreground">
        By proceeding you agree to the processing of the provided data to complete your payment securely.
      </p>
    </div>
  </UCard>
</template>
