<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const user = import.meta.client ? useSupabaseUser() : ref(null)
const supabase = useSupabaseClient()
const toast = useToast()

const loadingProfile = ref(true)
const phoneModalOpen = ref(false)
const isSavingPhone = ref(false)
const phoneFormState = reactive({ phoneNumber: '' })

const profile = reactive({
  phone_number: null as string | null,
  additional_numbers: [] as string[],
  full_name: null as string | null,
  email: null as string | null
})

const isAuthenticated = computed(() => Boolean(user.value))
const profileName = computed(() => {
  return (
    profile.full_name ||
    user.value?.user_metadata?.name ||
    user.value?.email ||
    'Your profile'
  )
})

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

function isLikelyKenyanMobile(value: string) {
  const digits = onlyDigits(value)

  return /^0[17]\d{8}$/.test(digits) || /^254[17]\d{8}$/.test(digits)
}

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .refine(isLikelyKenyanMobile, {
      message: 'Enter a valid Kenyan mobile number.'
    })
})

type PhoneFormState = z.infer<typeof phoneSchema>

async function loadProfile() {
  if (!user.value) {
    loadingProfile.value = false
    return
  }

  loadingProfile.value = true

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('phone_number,full_name,email,additional_numbers')
      .eq('id', user.value.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (data) {
      profile.phone_number =
        data.phone_number ?? user.value.user_metadata?.phone ?? null
      profile.full_name = data.full_name ?? user.value.user_metadata?.name ?? null
      profile.email = data.email ?? user.value.email ?? null
      profile.additional_numbers = Array.isArray(data.additional_numbers)
        ? data.additional_numbers.filter(Boolean).map(String)
        : []
    } else {
      profile.phone_number = user.value.user_metadata?.phone ?? null
      profile.full_name = user.value.user_metadata?.name ?? null
      profile.email = user.value.email ?? null
      profile.additional_numbers = []
    }
  } catch (error) {
    toast.add({
      title: 'Unable to load profile',
      description:
        error instanceof Error
          ? error.message
          : 'Unable to load your profile data.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  } finally {
    loadingProfile.value = false
  }
}

function openPhoneModal() {
  phoneFormState.phoneNumber = profile.phone_number
    ? toLocal(profile.phone_number)
    : ''
  phoneModalOpen.value = true
}

watch(
  () => user.value,
  (value) => {
    if (value) {
      loadProfile()
    }
  },
  { immediate: true }
)

async function savePhoneNumber(event: FormSubmitEvent<PhoneFormState>) {
  if (!user.value) {
    return
  }

  isSavingPhone.value = true

  try {
    const normalizedPhone = normalizePhone(event.data.phoneNumber)
    const currentPhone = profile.phone_number ?? ''
    const numbers = Array.isArray(profile.additional_numbers)
      ? [...profile.additional_numbers]
      : []

    const previousNumbers = new Set(
      numbers.filter(Boolean).map((entry) => String(entry))
    )

    if (currentPhone && currentPhone !== normalizedPhone) {
      previousNumbers.add(currentPhone)
    }

    previousNumbers.delete(normalizedPhone)

    const additionalNumbers = Array.from(previousNumbers)

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.value.id,
          phone_number: normalizedPhone,
          full_name: profile.full_name ?? user.value.user_metadata?.name ?? null,
          email: profile.email ?? user.value.email ?? null,
          additional_numbers: additionalNumbers
        },
        { onConflict: 'id' }
      )

    if (error) {
      throw error
    }

    profile.phone_number = normalizedPhone
    profile.additional_numbers = additionalNumbers
    phoneModalOpen.value = false

    toast.add({
      title: 'Phone number saved',
      description: 'Your profile number has been updated.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (error) {
    toast.add({
      title: 'Unable to save phone number',
      description: error instanceof Error ? error.message : 'Please try again.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  } finally {
    isSavingPhone.value = false
  }
}
</script>

<template>
  <UPage>
    <UPageHero
      title="Profile"
      description="Review and update the phone number used for airtime purchases."
      icon="i-lucide-user"
    />

    <UContainer class="max-w-3xl py-8">
      <div class="space-y-6">
        <UCard v-if="!isAuthenticated" variant="subtle" class="border border-primary-200 dark:border-primary-800">
          <div class="flex items-start gap-4">
            <div class="flex size-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
              <UIcon name="i-lucide-lock" class="size-6 text-primary-600" />
            </div>
            <div class="flex-1 space-y-4">
              <p class="font-semibold">Sign in to view your profile</p>
              <p class="text-sm text-muted">You must be authenticated to manage your airtime payer number and saved contact numbers.</p>
              <div class="flex flex-wrap gap-2">
                <UButton to="/login" color="error" size="lg">Sign in</UButton>
                <UButton to="/register" color="neutral" variant="outline" size="lg">Create account</UButton>
              </div>
            </div>
          </div>
        </UCard>

        <UCard v-else>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-info" class="text-warning-500" />
              <span class="font-semibold">Account details</span>
            </div>
          </template>

          <div class="space-y-4 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-sm text-muted">Name</p>
                <p class="font-semibold">{{ profileName }}</p>
              </div>
              <div>
                <p class="text-sm text-muted">Email</p>
                <p class="font-semibold">{{ profile.email || user?.email || 'Not available' }}</p>
              </div>
            </div>

            <div>
              <p class="text-sm text-muted">Current payer number</p>
              <div class="mt-2 flex flex-wrap items-center gap-3">
                <p class="font-semibold">{{ profile.phone_number ? toLocal(profile.phone_number) : 'Not set' }}</p>
                <UButton color="error" variant="outline" size="sm" type="button" @click="openPhoneModal">
                  {{ profile.phone_number ? 'Update' : 'Add' }} number
                </UButton>
              </div>
            </div>

            <div>
              <p class="text-sm text-muted">Previous payer numbers</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <UBadge v-for="number in profile.additional_numbers" :key="number" :label="toLocal(number)" />
                <span v-if="!profile.additional_numbers.length" class="text-sm text-muted">No additional numbers saved yet.</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>

    <UModal v-model:open="phoneModalOpen" title="Save your payer phone number">
      <template #body>
        <UForm id="profile-phone-form" :schema="phoneSchema" :state="phoneFormState" class="space-y-4" @submit="savePhoneNumber">
          <UFormField name="phoneNumber" label="Phone number" description="This number will be used for airtime purchases and saved to your profile." required>
            <UInput
              v-model="phoneFormState.phoneNumber"
              v-maska="'#### ### ###'"
              class="w-full"
              size="xl"
              icon="i-lucide-phone"
              autocomplete="tel"
              inputmode="tel"
              placeholder="0712 345 678"
            />
          </UFormField>
        </UForm>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton color="neutral" variant="ghost" type="button" @click="phoneModalOpen = false">
            Cancel
          </UButton>
          <UButton color="error" type="submit" form="profile-phone-form" :loading="isSavingPhone">
            Save number
          </UButton>
        </div>
      </template>
    </UModal>
  </UPage>
</template>