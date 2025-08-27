<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useToast } from '#imports'

// --- Types ---
type ApiResponse = {
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'ALREADY_PAID'
  message: string
  transactionId: string | number
  merchantRequestId?: string
  checkoutRequestId?: string
  mpesaReceiptNumber?: string
  resultCode?: number
  resultDesc?: string
}

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

function detectProvider(input: string): { key: string, label: string, color: BadgeColor, icon: string } {
  const local = toLocal(input)
  const p3 = local.slice(0, 3)
  const p4 = local.slice(0, 4)
  if (p4 === '0747' || p4 === '0748') {
    return { key: 'faiba', label: 'Faiba', color: 'info', icon: 'i-heroicons-signal-20-solid' }
  }
  if (['070', '071', '072', '074', '079'].includes(p3) || local.startsWith('011')) {
    return { key: 'safaricom', label: 'Safaricom', color: 'primary', icon: 'i-heroicons-sparkles-20-solid' }
  }
  if (p3 === '073' || p3 === '075' || local.startsWith('010')) {
    return { key: 'airtel', label: 'Airtel', color: 'error', icon: 'i-heroicons-bolt-20-solid' }
  }
  if (p3 === '077') {
    return { key: 'telkom', label: 'Telkom', color: 'warning', icon: 'i-heroicons-signal-20-solid' }
  }
  if (p3 === '076') {
    // Changed 'violet' to 'secondary' to match allowed BadgeColor types
    return { key: 'equitel', label: 'Equitel', color: 'secondary', icon: 'i-heroicons-banknotes-20-solid' }
  }
  return { key: 'unknown', label: 'Unknown', color: 'neutral', icon: 'i-heroicons-question-mark-circle' }
}
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
  reference: z.string().optional(),
  description: z.string().optional()
})

type FormState = z.infer<typeof schema>

// --- State ---
const state = reactive<FormState>({
  accountPhone: '',
  initiatorPhone: '',
  amount: 100,
  reference: '',
  description: ''
})

const submitting = ref(false)
const waiting = ref(false)
const countdown = ref(60)
let countdownTimer: ReturnType<typeof setInterval> | undefined

const initiatorMeta = computed(() => detectProvider(state.initiatorPhone))
const accountMeta = computed(() => detectProvider(state.accountPhone))

// --- Reference autofill ---
const referenceDirty = ref(false)
watch(() => state.accountPhone, (v) => {
  if (!referenceDirty.value) {
    state.reference = toLocal(v) || ''
  }
})
watch(() => state.reference, () => {
  referenceDirty.value = true
})

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
        reference: data.reference,
        description: data.description
      }
    })

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

const canSubmit = computed(() => initiatorMeta.value.key === 'safaricom')
</script>

<template>
  <UCard class="max-w-2xl mx-auto">
    <div class="space-y-6">
      <!-- Info panel with steps -->
      <UCard variant="soft" color="primary" icon="i-heroicons-information-circle">
        <div class="space-y-2">
          <p class="font-medium">How to pay with M-Pesa (STK Push)</p>
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
      </UCard>

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
      >
        <div class="space-y-1">
          <p class="font-medium">{{ feedback.title }}</p>
          <p class="text-sm text-muted-foreground">{{ feedback.message }}</p>
          <p v-if="feedback.receipt" class="text-sm"><span class="font-medium">Receipt:</span> {{ feedback.receipt }}</p>
          <p v-if="feedback.details" class="text-xs text-muted-foreground">{{ feedback.details }}</p>
        </div>
      </UAlert>

      <USeparator />

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
        <!-- Recipient -->
        <UFormField name="accountPhone" label="Recipient phone">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div class="sm:col-span-2">
              <UInput
                v-model="state.accountPhone"
                placeholder="07XX XXX XXX"
                icon="i-heroicons-user-circle"
                autocomplete="tel"
                inputmode="tel"
              />
              <p class="mt-1 text-xs text-muted-foreground">
                The phone number for the account to credit.
              </p>
            </div>
            <div class="sm:col-span-1 flex items-center gap-2">
              <UBadge :color="accountMeta.color" variant="subtle">
                <UIcon :name="accountMeta.icon" class="mr-1" />
                {{ accountMeta.label }}
              </UBadge>
              <span class="text-xs text-muted-foreground ml-auto">{{ toLocal(state.accountPhone) || '—' }}</span>
            </div>
          </div>
        </UFormField>

        <!-- Amount -->
        <UFormField name="amount" label="Amount (KES)">
          <div class="max-w-xs">
            <UInputNumber v-model="state.amount" :min="1" :max="150000" :step="1" />
            <p class="mt-1 text-xs text-muted-foreground">Maximum KES 150,000 per transaction.</p>
          </div>
        </UFormField>

        <USeparator />

        <!-- Payer -->
        <UFormField name="initiatorPhone" label="Your M-Pesa number (payer)">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div class="sm:col-span-2">
              <UInput
                v-model="state.initiatorPhone"
                placeholder="07XX XXX XXX (Safaricom)"
                icon="i-heroicons-device-phone-mobile"
                autocomplete="tel"
                inputmode="tel"
              />
              <p class="mt-1 text-xs text-muted-foreground">
                STK Push works only on Safaricom lines.
              </p>
            </div>
            <div class="sm:col-span-1 flex items-center gap-2">
              <UBadge :color="initiatorMeta.color" variant="subtle">
                <UIcon :name="initiatorMeta.icon" class="mr-1" />
                {{ initiatorMeta.label }}
              </UBadge>
              <span class="text-xs text-muted-foreground ml-auto">{{ toLocal(state.initiatorPhone) || '—' }}</span>
            </div>
          </div>
        </UFormField>

        <!-- Optional details -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormField name="reference" label="Reference (optional)">
            <UInput v-model="state.reference" placeholder="e.g. Account or phone" />
            <p class="mt-1 text-xs text-muted-foreground">Defaults to the recipient phone if left empty.</p>
          </UFormField>
          <UFormField name="description" label="Description (optional)">
            <UInput v-model="state.description" placeholder="e.g. Airtime purchase" />
          </UFormField>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <UButton type="submit" :disabled="!canSubmit || submitting" :loading="submitting">
            Pay with M-Pesa
          </UButton>
          <UTooltip v-if="!canSubmit">
            <template #trigger>
              <UBadge color="warning" variant="subtle">Safaricom required for STK</UBadge>
            </template>
            <template #content>
              Enter a Safaricom number in the payer field to enable payment.
            </template>
          </UTooltip>
          <UButton variant="ghost" color="neutral" @click="resetFeedback()" :disabled="submitting || waiting">
            Clear status
          </UButton>
        </div>
      </UForm>

      <USeparator />

      <p class="text-xs text-muted-foreground">
        By proceeding you agree to the processing of the provided data to complete your payment securely.
      </p>
    </div>
  </UCard>
</template>

<style scoped>
/* Minimal tweaks for spacing; Nuxt UI handles most styles */
</style>