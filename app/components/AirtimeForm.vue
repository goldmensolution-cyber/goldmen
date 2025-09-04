<script setup lang="ts">
import { ref, reactive, computed, } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useToast } from '#imports'
import { vMaska } from 'maska/vue'

const providers = [
  '/images/airtel.jpg',
  '/images/equitel.jpg',
  '/images/faiba.png',
  '/images/safaricom.png',
  '/images/telkom.png'
]
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

type BadgeColor = "error" | "info" | "primary" | "warning" | "neutral" | "success" | "secondary" | undefined

// --- Utilities ---
const generatePrefixRange = (start: string, end: string): string[] => {
  const startNum = parseInt(start, 10);
  const endNum = parseInt(end, 10);
  const length = start.length;

  return Array.from({ length: endNum - startNum + 1 }, (_, i) => {
    const num = startNum + i;
    return String(num).padStart(length, '0');
  });
};
function onlyDigits(s: string) {
  return s.replace(/[^0-9]/g, '')
}
function toLocal(msisdn: string) {
  let d = onlyDigits(msisdn.trim())
  if (d.startsWith('254')) d = '0' + d.slice(3)
  if (d.startsWith('7') && d.length === 9) d = '0' + d
  return d
}
function detectProvider(input: string): { key: string, label: string, color: BadgeColor, icon: string } {
  const local = toLocal(input)
  const p4 = local.slice(0, 4)
  // Prefixes
  const safaricom = [
  ...generatePrefixRange('0110', '0115'),
  ...generatePrefixRange('0700', '0729'),
  ...generatePrefixRange('0745', '0746'),
  '0748',
  ...generatePrefixRange('0757', '0759'),
  ...generatePrefixRange('0768', '0769'),
  ...generatePrefixRange('0790', '0799'),
];
  const airtel = [
  ...generatePrefixRange('0100', '0106'),
  ...generatePrefixRange('0740', '0743'),
  ...generatePrefixRange('0750', '0756'),
  '0762',
  '0767', // Corrected from your inaccurate array
  ...generatePrefixRange('0780', '0789'),
];
const telkom = generatePrefixRange('0770', '0779');

const faiba = ['0747'];

const equitel = generatePrefixRange('0763', '0766');


  if (safaricom.includes(p4)) return { key: 'safaricom', label: 'Safaricom', color: 'success', icon: 'custom:safaricom' }
  if (airtel.includes(p4)) return { key: 'airtel', label: 'Airtel', color: 'primary', icon: 'custom:airtel' }
  if (telkom.includes(p4)) return { key: 'telkom', label: 'Telkom', color: 'warning', icon: 'custom:telkom' }
  if (faiba.includes(p4)) return { key: 'faiba', label: 'Faiba', color: 'info', icon: 'custom:faiba' }
  if (equitel.includes(p4)) return { key: 'equitel', label: 'Equitel', color: 'secondary', icon: 'custom:equitel' }
  return { key: '', label: 'Unknown', color: 'neutral', icon: 'i-heroicons-question-mark-circle' }
}
function isLikelyKenyanMobile(input: string) {
  const d = onlyDigits(input)
  return /^0[17]\d{8}$/.test(d) || /^254[17]\d{8}$/.test(d)
}

// --- Zod Schema ---
const schema = z.object({
  initiatorPhone: z.string().min(10, 'Enter your Safaricom number'),
  accountPhone: z.string().min(10, 'Enter recipient number'),
  amount: z.number().min(10, 'Minimum KES 10').max(10000, 'Max KES 10,000'),
})

type FormState = z.infer<typeof schema>

// --- State ---
const state = reactive<FormState>({
  initiatorPhone: '',
  accountPhone: '',
  amount: 10,
})

const submitting = ref(false)
const waiting = ref(false)
const lastTransactionId = ref<number | null>(null)

// --- Provider Meta ---
const initiatorMeta = computed(() => detectProvider(state.initiatorPhone))
const accountMeta = computed(() => detectProvider(state.accountPhone))

// --- Feedback ---
const feedback = reactive<{
  kind: string
  message?: string
  receipt?: string
  status?: string
}>({
  kind: 'idle'
})

function resetFeedback() {
  feedback.kind = 'idle'
  feedback.message = ''
  feedback.receipt = ''
  feedback.status = ''
}

const toast = useToast()
function setToastByStatus(res: ApiResponse, _contextPhone: string) {
  if (res.status === 'SUCCESS') {
    toast.add({ title: 'Payment Success', description: res.message, color: 'success' })
  } else if (res.status === 'FAILED') {
    toast.add({ title: 'Payment Failed', description: res.message, color: 'error' })
  } else if (res.status === 'TIMEOUT') {
    toast.add({ title: 'Timeout', description: 'No confirmation received. You can retry.', color: 'info' })
  } else if (res.status === 'ALREADY_PAID') {
    toast.add({ title: 'Already Paid', description: res.message, color: 'secondary' })
  }
}
function setInlineFeedback(res: ApiResponse) {
  feedback.kind = res.status.toLowerCase()
  feedback.message = res.message
  feedback.status = res.status
  if (res.mpesaReceiptNumber) feedback.receipt = res.mpesaReceiptNumber
}

// --- Polling Logic ---
const POLL_TIMEOUT = 60000 // 60s
const POLL_INTERVAL = 4000 // 4s

let pollTimer: ReturnType<typeof setTimeout> | null = null
let pollStartTime: number = 0

function stopPollingStatus() {
  if (pollTimer) clearTimeout(pollTimer)
  pollTimer = null
}

async function pollStatus(transactionId: number) {
  pollStartTime = Date.now()
  waiting.value = true

  async function poll() {
    try {
      const res = await $fetch<ApiResponse>(`/api/mpesa/transaction-status?id=${transactionId}`)
      if (['SUCCESS', 'FAILED', 'CANCELLED'].includes(res.status)) {
        waiting.value = false
        setToastByStatus(res, state.initiatorPhone)
        setInlineFeedback(res)
        stopPollingStatus()
        return
      }
      if (Date.now() - pollStartTime < POLL_TIMEOUT) {
        pollTimer = setTimeout(poll, POLL_INTERVAL)
      } else {
        waiting.value = false
        setInlineFeedback({ status: 'TIMEOUT', message: 'No confirmation received yet. You can retry.', transactionId })
        stopPollingStatus()
      }
    } catch (err) {
      waiting.value = false
      console.error(err)
      setInlineFeedback({ status: 'FAILED', message: 'Error checking status.', transactionId })
      stopPollingStatus()
    }
  }
  poll()
}

// --- Submit Logic ---
function resetAll() {
  resetFeedback()
  stopPollingStatus()
  waiting.value = false
  submitting.value = false
  lastTransactionId.value = null
}

async function onSubmit(e: FormSubmitEvent<FormState>) {
  resetAll()
  submitting.value = true
  try {
    const res = await $fetch<ApiResponse>('/api/mpesa/stkpush', {
      method: 'POST',
      body: {
        initiatorPhone: e.data.initiatorPhone,
        accountPhone: e.data.accountPhone,
        amount: e.data.amount,
      }
    })
    lastTransactionId.value = Number(res.transactionId)
    setToastByStatus(res, e.data.initiatorPhone)
    setInlineFeedback(res)
    if (!['SUCCESS', 'FAILED', 'CANCELLED'].includes(res.status) && lastTransactionId.value) {
      pollStatus(lastTransactionId.value)
    }
  } catch (err: unknown) {
    let message = 'Request failed'
    if (err && typeof err === 'object') {
      // Try to narrow err type
      const errorObj = err as { data?: { message?: string }, message?: string }
      if (errorObj.data?.message) {
        message = errorObj.data.message
      } else if (errorObj.message) {
        message = errorObj.message
      }
    }
    setInlineFeedback({ status: 'FAILED', message, transactionId: 0 })
  } finally {
    submitting.value = false
  }
}

// --- Modal Logic (if you use a modal for confirmation) ---
const open = ref(false)
const lastFormEvent = ref<FormSubmitEvent<FormState> | null>(null)
function onFormSubmit(e: FormSubmitEvent<FormState>, nativeEvent?: Event) {
  lastFormEvent.value = e
  open.value = true
  if (nativeEvent) nativeEvent.preventDefault()
}
function cancelModal() {
  open.value = false
}
function confirmAndSubmit() {
  open.value = false
  if (lastFormEvent.value) onSubmit(lastFormEvent.value)
}

// --- Computed for submit button ---
const canSubmit = computed(() =>  isLikelyKenyanMobile(state.initiatorPhone) && isLikelyKenyanMobile(state.accountPhone) && state.amount >= 10)
// Countdown for polling status
const countdown = computed(() => {
  if (!waiting.value || !pollStartTime) return POLL_TIMEOUT / 1000
  const elapsed = Math.floor((Date.now() - pollStartTime) / 1000)
  const remaining = Math.max(0, Math.ceil(POLL_TIMEOUT / 1000 - elapsed))
  return remaining
})
</script>

<template>
  <UCard class="max-w-2xl mx-auto mt-8">
    <template #header>
      <h1 class="text-center font-extrabold text-6xl">Buy Airtime</h1>
      <!-- Provider Logos Marquee -->
    <section class=" py-8 overflow-hidden">
      <UMarquee>
    <NuxtImg v-for="provider in providers" :key="provider" :src="provider" class="size-20 rounded-md hover:grayscale shrink-0" />
  </UMarquee>
    </section>
    </template>
    
    <div class="space-y-6">
      

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
      :title="feedback.status"
        >
          <template #description>
          <p class="text-sm text-muted-foreground">{{ feedback.message }}</p>
          <p v-if="feedback.receipt" class="text-sm"><span class="font-medium">Receipt:</span> {{ feedback.receipt }}</p>
          </template>
      </UAlert>

      <UCard variant="subtle" class="bg-primary-50">
      <UForm :schema="schema" :state="state" class="" @submit="onFormSubmit($event, $event?.event)">
         <!-- Payer -->
        <UFormField 
        name="initiatorPhone" 
        help="You will receive mpesa PIN prompt here" 
        label="Your M-Pesa number (payer)" 
        class="w-full"
        required>
              <UInput
                v-model="state.initiatorPhone"
                v-maska="'#### ### ###'" 
                placeholder="0723 456 789"       
                 icon="i-heroicons-device-phone-mobile"
                autocomplete="tel"
                inputmode="tel"
                size="xl"
                class="w-full"
              >
            <template v-if="state.initiatorPhone.length > 9" #trailing>
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
        <UFormField class="w-full" name="accountPhone"  help="The phone number receiving the airtime(could be same as above)" label="Recipient phone" required>
              <UInput
                v-model="state.accountPhone"
                v-maska="'#### ### ###'" 
                placeholder="0723 456 789"   
                icon="i-heroicons-user-circle"
                autocomplete="tel"
                inputmode="tel"
                 size="xl"
                 block
             class="w-full"
              >
              <template v-if="state.accountPhone.length > 9 " #trailing>
              <UBadge 
              :color="accountMeta.color" variant="subtle"
               :icon="accountMeta.icon" size="xs" :label="accountMeta.label" 
              />
              </template>
              </UInput>
        </UFormField>

        <!-- Amount -->
        <UFormField name="amount" block help="Specify a whole number" label="Amount (KES)" required >
          <UFieldGroup
                size="xl"
                 class="w-full"
>
            <UButton label="KSH" variant="subtle" color="neutral" />
            <UInputNumber v-model="state.amount" orientation="vertical" :min="10" block  class="w-full" :max="150000" :step="1" />
          </UFieldGroup>
        </UFormField>
       
        <!-- Actions -->
          <UButton 
            type="submit" 
            leading-icon="i-lucide-banknote"  
            :disabled="!canSubmit || submitting" 
            :loading="submitting"
            variant="solid"
            size="xl"
            color="success"
            block
            label="Buy Airtime"/>
           
          <!-- <UButton variant="ghost" color="neutral" :disabled="submitting || waiting" @click="resetFeedback()">
            Clear status
          </UButton> -->
      </UForm>
</UCard>
      <USeparator />
      <!-- Info panel with steps -->
      <UAlert 
      variant="soft" 
      color="info" 
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
  <UModal 
  v-model:open="open"
  title="Confirm Payment">
    
  <template #body>
    <div class="space-y-2">
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
