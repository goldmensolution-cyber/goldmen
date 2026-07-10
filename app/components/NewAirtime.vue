<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { vMaska } from 'maska/vue'
import { useToast } from '#imports'

// definePageMeta({
//   layout: 'app',
//   middleware: 'auth'
// })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

type BadgeColor =
  | 'error'
  | 'info'
  | 'primary'
  | 'warning'
  | 'neutral'
  | 'success'
  | 'secondary'
  | undefined

function generatePrefixRange(start: string, end: string): string[] {
  const startNum = Number.parseInt(start, 10)
  const endNum = Number.parseInt(end, 10)

  return Array.from(
    { length: endNum - startNum + 1 },
    (_, i) => String(startNum + i).padStart(start.length, '0')
  )
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function toLocal(msisdn: string) {
  let digits = onlyDigits(msisdn)

  if (digits.startsWith('254')) {
    digits = `0${digits.slice(3)}`
  }

  if (digits.startsWith('7') && digits.length === 9) {
    digits = `0${digits}`
  }

  if (digits.startsWith('1') && digits.length === 9) {
    digits = `0${digits}`
  }

  return digits
}

function normalizePhone(msisdn: string) {
  const digits = onlyDigits(msisdn)

  if (digits.startsWith('254')) {
    return digits
  }

  if (digits.startsWith('0')) {
    return `254${digits.slice(1)}`
  }

  if (digits.length === 9) {
    return `254${digits}`
  }

  return digits
}

function detectProvider(input: string): {
  key: string
  label: string
  color: BadgeColor
  icon: string
} {
  const local = toLocal(input)
  const prefix = local.slice(0, 4)

  const safaricom = [
    ...generatePrefixRange('0110', '0119'),
    ...generatePrefixRange('0700', '0729'),
    ...generatePrefixRange('0745', '0746'),
    '0748',
    ...generatePrefixRange('0757', '0759'),
    ...generatePrefixRange('0768', '0769'),
    ...generatePrefixRange('0790', '0799')
  ]

  const airtel = [
    ...generatePrefixRange('0100', '0109'),
    ...generatePrefixRange('0740', '0743'),
    ...generatePrefixRange('0750', '0756'),
    '0762',
    '0767',
    ...generatePrefixRange('0780', '0789')
  ]

  const telkom = generatePrefixRange('0770', '0779')

  const faiba = ['0747']

  const equitel = generatePrefixRange('0763', '0766')

  if (safaricom.includes(prefix)) {
    return {
      key: 'safaricom',
      label: 'Safaricom',
      color: 'success',
      icon: 'custom:safaricom'
    }
  }

  if (airtel.includes(prefix)) {
    return {
      key: 'airtel',
      label: 'Airtel',
      color: 'primary',
      icon: 'custom:airtel'
    }
  }

  if (telkom.includes(prefix)) {
    return {
      key: 'telkom',
      label: 'Telkom',
      color: 'warning',
      icon: 'custom:telkom'
    }
  }

  if (faiba.includes(prefix)) {
    return {
      key: 'faiba',
      label: 'Faiba',
      color: 'info',
      icon: 'custom:faiba'
    }
  }

  if (equitel.includes(prefix)) {
    return {
      key: 'equitel',
      label: 'Equitel',
      color: 'secondary',
      icon: 'custom:equitel'
    }
  }

  return {
    key: '',
    label: 'Unknown',
    color: 'neutral',
    icon: 'i-lucide-circle-help'
  }
}

function isLikelyKenyanMobile(value: string) {
  const digits = onlyDigits(value)

  return (
    /^0[17]\d{8}$/.test(digits) ||
    /^254[17]\d{8}$/.test(digits)
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Profile                                   */
/* -------------------------------------------------------------------------- */

const payerNumber = ref('')
const loadingProfile = ref(true)
const phoneModalOpen = ref(false)
const isSavingPhone = ref(false)
const phoneModalInitialValue = ref('')

const profile = reactive({
  phone_number: null as string | null,
  additional_numbers: [] as string[],
  full_name: null as string | null,
  email: null as string | null
})

const isAuthenticated = computed(() => Boolean(user.value))
const needsPhoneNumber = computed(
  () => isAuthenticated.value && !loadingProfile.value && payerNumber.value.length === 0
)

async function resolveActiveUser() {
  if (user.value?.id) {
    return user.value
  }

  if (!supabase) {
    return null
  }

  const { data: { user: authUser }, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return authUser
}

async function loadProfileFromSupabase() {
  const activeUser = await resolveActiveUser()

  if (!activeUser?.id) {
    loadingProfile.value = false
    profile.phone_number = null
    profile.additional_numbers = []
    profile.full_name = null
    profile.email = null
    payerNumber.value = ''
    return
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('phone_number,full_name,email,additional_numbers')
      .eq('id', activeUser.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (data) {
      profile.phone_number = data.phone_number ?? activeUser.user_metadata?.phone ?? null
      profile.full_name = data.full_name ?? activeUser.user_metadata?.name ?? null
      profile.email = data.email ?? activeUser.email ?? null
      profile.additional_numbers = Array.isArray(data.additional_numbers)
        ? data.additional_numbers.filter(Boolean).map(String)
        : []
      payerNumber.value = data.phone_number ?? activeUser.user_metadata?.phone ?? ''
    } else {
      profile.phone_number = activeUser.user_metadata?.phone ?? null
      profile.additional_numbers = []
      profile.full_name = activeUser.user_metadata?.name ?? null
      profile.email = activeUser.email ?? null
      payerNumber.value = activeUser.user_metadata?.phone ?? ''
    }
  } catch (error) {
    toast.add({
      title: 'Unable to load profile',
      description:
        error instanceof Error
          ? error.message
          : 'There was a problem loading your profile data.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  } finally {
    loadingProfile.value = false
  }
}

function openPhoneModal() {
  phoneModalInitialValue.value = payerNumber.value
    ? toLocal(payerNumber.value)
    : toLocal(profile.phone_number ?? '')
  phoneModalOpen.value = true
}

watch(needsPhoneNumber, (needsValue) => {
  if (needsValue) {
    openPhoneModal()
  }
}, { flush: 'post' })

await useAsyncData('airtime-profile', async () => {
  await loadProfileFromSupabase()
})

/* -------------------------------------------------------------------------- */
/*                                  Schema                                    */
/* -------------------------------------------------------------------------- */

const schema = z.object({
  recipient: z
    .string()
    .refine(isLikelyKenyanMobile, {
      message: 'Enter a valid Kenyan mobile number.'
    }),

  amount: z
    .number()
    .int('Amount must be a whole number.')
    .min(10, 'Minimum amount is KES 10.')
    .max(10000, 'Maximum amount is KES 10,000.')
})

type FormState = z.infer<typeof schema>

const state = reactive<FormState>({
  recipient: '',
  amount: 20
})

/* -------------------------------------------------------------------------- */
/*                                Computed                                    */
/* -------------------------------------------------------------------------- */

const provider = computed(() =>
  detectProvider(state.recipient)
)

const quickAmounts = [
  20,
  50,
  100,
  200,
  500,
  1000
]

const canSubmit = computed(() => {
  return (
    !loadingProfile.value &&
    isLikelyKenyanMobile(state.recipient) &&
    Number.isInteger(state.amount) &&
    state.amount >= 10 &&
    payerNumber.value.length > 0
  )
})

/* -------------------------------------------------------------------------- */
/*                              Submission                                    */
/* -------------------------------------------------------------------------- */

const submitting = ref(false)
const confirmOpen = ref(false)
const lastEvent = ref<FormSubmitEvent<FormState>>()

function onFormSubmit(
  event: FormSubmitEvent<FormState>,
  nativeEvent?: Event
) {
  nativeEvent?.preventDefault()

  lastEvent.value = event
  confirmOpen.value = true
}

function chooseQuickAmount(amount: number) {
  state.amount = amount
}

function closeConfirmation() {
  confirmOpen.value = false
}

async function handlePhoneNumberSaved(payload: { phoneNumber: string; additionalNumbers: string[] }) {
  profile.phone_number = payload.phoneNumber
  profile.additional_numbers = payload.additionalNumbers
  payerNumber.value = payload.phoneNumber
  phoneModalOpen.value = false
  await loadProfileFromSupabase()
}

async function purchase() {
  if (!lastEvent.value) {
    return
  }

  submitting.value = true
  confirmOpen.value = false

  try {
    const session = await supabase.auth.getSession()

    const accessToken =
      session.data.session?.access_token

    if (!accessToken) {
      throw new Error('You are not signed in.')
    }

    const { data, error } =
      await supabase.functions.invoke(
        'web-airtime',
        {
          body: {
            recipient: normalizePhone(
              lastEvent.value.data.recipient
            ),
            amount: lastEvent.value.data.amount
          }
        }
      )

    if (error) {
      throw error
    }

    toast.add({
      title: 'STK Push Sent',
      description:
        'Check your phone and enter your M-Pesa PIN.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    await navigateTo(
      `/transactions/${data.transaction_id}`
    )
  } catch (error) {
    toast.add({
      title: 'Purchase Failed',
      description:
        error instanceof Error
          ? error.message
          : 'Unable to initiate airtime purchase.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <UPage>
    <UPageHero
      title="Buy Airtime"
      description="Purchase airtime for any supported Kenyan mobile number. The M-Pesa STK Push will be sent to your verified phone number."
      icon="i-lucide-smartphone"
    />

    <UContainer class="max-w-2xl py-8">
      <div class="space-y-6">

        <UCard
          v-if="!isAuthenticated"
          variant="subtle"
          class="border border-primary-200 dark:border-primary-800"
        >
          <div class="flex items-start gap-4">
            <div class="flex size-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
              <UIcon name="i-lucide-lock" class="size-6 text-primary-600" />
            </div>

            <div class="flex-1 space-y-4">
              <div>
                <p class="font-semibold">Sign in to buy airtime</p>
                <p class="mt-1 text-sm text-muted">
                  You need an account before you can purchase airtime and verify the payer number.
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <UButton to="/login" color="error" size="lg">Sign in</UButton>
                <UButton to="/register" color="neutral" variant="outline" size="lg">Create account</UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Verified Payer Number -->
        <UCard
          v-else
          variant="subtle"
          class="border border-error-200 dark:border-error-800"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex size-12 items-center justify-center rounded-xl bg-error-100 dark:bg-error-900"
            >
              <UIcon
                name="i-lucide-smartphone"
                class="size-6 text-error-600"
              />
            </div>

            <div class="flex-1">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2">
                  <p class="font-semibold">
                    Paying With
                  </p>

                  <UBadge
                    :color="payerNumber ? 'success' : 'warning'"
                    variant="soft"
                    :label="payerNumber ? 'Verified' : 'Required'"
                  />
                </div>

                <UButton
                  v-if="isAuthenticated"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-pencil"
                  type="button"
                  @click="openPhoneModal"
                >
                  Edit
                </UButton>
              </div>

              <p
                v-if="!loadingProfile"
                class="mt-2 text-2xl font-bold tracking-wide"
              >
                {{ payerNumber ? toLocal(payerNumber) : 'Add your phone number' }}
              </p>

              <USkeleton
                v-else
                class="mt-2 h-8 w-48"
              />

              <p class="mt-2 text-sm text-muted">
                <span v-if="payerNumber">
                  Your M-Pesa STK Push will be sent to this number.
                </span>
                <span v-else>
                  Add your phone number to continue with airtime purchases.
                </span>
              </p>
            </div>
          </div>
        </UCard>

        <!-- Purchase Form -->
        <UCard v-if="isAuthenticated">

          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-banknote"
                class="text-warning-500"
              />

              <span class="font-semibold">
                Airtime Purchase
              </span>
            </div>
          </template>

          <UForm
            :schema="schema"
            :state="state"
            class="space-y-6"
            @submit="onFormSubmit($event, $event?.event)"
          >

            <!-- Recipient -->
            <UFormField
              name="recipient"
              label="Recipient Number"
              description="The mobile number receiving the airtime."
              required
            >
              <UInput
                v-model="state.recipient"
                v-maska="'#### ### ###'"
                class="w-full"
                size="xl"
                icon="i-lucide-phone"
                autocomplete="tel"
                inputmode="tel"
                placeholder="0712 345 678"
              >
                <template
                  v-if="state.recipient.length >= 10"
                  #trailing
                >
                  <UBadge
                    :label="provider.label"
                    :icon="provider.icon"
                    :color="provider.color"
                    variant="soft"
                  />
                </template>
              </UInput>
            </UFormField>

            <!-- Provider Card -->
            <Transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
            >
              <UAlert
                v-if="provider.key"
                variant="soft"
                :color="provider.color"
                :icon="provider.icon"
                :title="provider.label"
                :description="`Airtime will be sent through ${provider.label}.`"
              />
            </Transition>

            <!-- Amount -->
            <UFormField
              name="amount"
              label="Amount"
              description="Whole numbers only."
              required
            >
              <UInputNumber
                v-model="state.amount"
                class="w-full"
                orientation="vertical"
                size="xl"
                :step="1"
                :min="10"
                :max="10000"
              />
            </UFormField>

            <!-- Quick Amounts -->
            <div class="space-y-2">
              <p class="text-sm font-medium">
                Quick Amounts
              </p>

              <div class="flex flex-wrap gap-2">

                <UButton
                  v-for="amount in quickAmounts"
                  :key="amount"
                  :label="`KES ${amount}`"
                  :variant="state.amount === amount ? 'solid' : 'soft'"
                  :color="state.amount === amount ? 'warning' : 'neutral'"
                  type="button"
                  @click="() => chooseQuickAmount(amount)"
                />

              </div>
            </div>

            <USeparator />

            <UButton
              type="submit"
              block
              size="xl"
              color="error"
              icon="i-lucide-banknote-arrow-up"
              :loading="submitting"
              :disabled="!canSubmit"
            >
              Purchase Airtime
            </UButton>

          </UForm>

        </UCard>

        <!-- Help -->
        <UAlert
          color="warning"
          variant="soft"
          icon="i-lucide-circle-help"
          title="How it works"
        >
          <template #description>

            <ol class="list-decimal space-y-2 pl-5 text-sm">

              <li>
                Enter the recipient number.
              </li>

              <li>
                Select or enter the airtime amount.
              </li>

              <li>
                Tap
                <strong>Purchase Airtime</strong>.
              </li>

              <li>
                An M-Pesa STK Push will be sent to your
                verified phone number.
              </li>

              <li>
                Enter your PIN to complete the purchase.
              </li>

            </ol>

          </template>
        </UAlert>

      </div>
    </UContainer>

    <!-- Confirmation -->

    <PhoneNumberModal
      v-model="phoneModalOpen"
      :title="payerNumber ? 'Update payer number' : 'Add your phone number'"
      description="We’ll save this to your profile for airtime purchases."
      :initial-value="phoneModalInitialValue"
      :loading="isSavingPhone"
      @saved="handlePhoneNumberSaved"
    />

    <UModal
      v-model:open="confirmOpen"
      title="Confirm Airtime Purchase"
    >
      <template #body>

        <div class="space-y-5">

          <div class="rounded-lg border p-4">

            <dl class="space-y-3">

              <div class="flex justify-between">
                <dt class="text-muted">
                  Recipient
                </dt>

                <dd class="font-semibold">
                  {{ toLocal(state.recipient) }}
                </dd>
              </div>

              <div class="flex justify-between">
                <dt class="text-muted">
                  Provider
                </dt>

                <dd>

                  <UBadge
                    :label="provider.label"
                    :icon="provider.icon"
                    :color="provider.color"
                    variant="soft"
                  />

                </dd>
              </div>

              <div class="flex justify-between">
                <dt class="text-muted">
                  Amount
                </dt>

                <dd class="font-semibold">
                  KES {{ state.amount }}
                </dd>
              </div>

              <div class="flex justify-between">
                <dt class="text-muted">
                  Paid From
                </dt>

                <dd class="font-semibold">
                  {{ toLocal(payerNumber) }}
                </dd>
              </div>

            </dl>

          </div>

          <UAlert
            color="warning"
            variant="soft"
            icon="i-lucide-triangle-alert"
            title="Confirm before continuing"
            description="An M-Pesa STK Push will immediately be sent to your verified phone number."
          />

        </div>

      </template>

      <template #footer>

        <div class="flex w-full justify-end gap-3">

          <UButton
            color="neutral"
            variant="ghost"
            type="button"
            @click="closeConfirmation"
          >
            Cancel
          </UButton>

          <UButton
            color="error"
            :loading="submitting"
            @click="purchase"
          >
            Confirm Purchase
          </UButton>

        </div>

      </template>
    </UModal>

  </UPage>
</template>
