<!-- app/pages/profile.vue -->
<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const user = useSupabaseUser()
const toast = useToast()
const profilePhoneForm = useTemplateRef('profilePhoneForm')

const {
  profile,
  loading,
  ensureProfile,
  loadProfile,
  savePhoneNumber,
  toLocalKenyaPhone,
  isLikelyKenyanMobile
} = useProfileBootstrap()

const phoneModalOpen = ref(false)
const isSavingPhone = ref(false)
const phoneFormState = reactive({ phoneNumber: '' })

const phoneSchema = z.object({
  phoneNumber: z.string().refine(isLikelyKenyanMobile, {
    message: 'Enter a valid Kenyan mobile number.'
  })
})

type PhoneFormState = z.infer<typeof phoneSchema>

const profileName = computed(() => {
  return (
    profile.value?.full_name ||
    user.value?.user_metadata?.name ||
    user.value?.email ||
    'Your profile'
  )
})

const profileEmail = computed(() => {
  return profile.value?.email || user.value?.email || 'Not available'
})

const payerNumber = computed(() => {
  return profile.value?.phone_number
    ? toLocalKenyaPhone(profile.value.phone_number)
    : 'Not set'
})

const additionalNumbers = computed(() => {
  return Array.isArray(profile.value?.additional_numbers)
    ? profile.value.additional_numbers.filter(Boolean)
    : []
})

async function refreshProfile() {
  if (!user.value?.id || !import.meta.client) {
    return
  }

  try {
    await ensureProfile()
    await loadProfile()
  } catch (error) {
    toast.add({
      title: 'Unable to load profile',
      description:
        error instanceof Error
          ? error.message
          : 'Please refresh and try again.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
}

onMounted(refreshProfile)

watch(
  () => user.value?.id,
  async (id) => {
    if (!id || !import.meta.client) {
      return
    }

    await refreshProfile()
  },
  { immediate: true }
)

function openPhoneModal() {
  phoneFormState.phoneNumber = profile.value?.phone_number
    ? toLocalKenyaPhone(profile.value.phone_number)
    : toLocalKenyaPhone(user.value?.user_metadata?.phone ?? '')
  phoneModalOpen.value = true
}
async function onSavePhoneNumber(event: FormSubmitEvent<PhoneFormState>) {
  if (!user.value?.id) {
    return
  }

  isSavingPhone.value = true

  try {
    await savePhoneNumber(event.data.phoneNumber)
    await loadProfile()
    phoneModalOpen.value = false

    toast.add({
      title: 'Phone number saved',
      description: 'Your payer number has been updated.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (error) {
    toast.add({
      title: 'Unable to save phone number',
      description:
        error instanceof Error ? error.message : 'Please try again.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  } finally {
    isSavingPhone.value = false
  }
}
</script>

<template>
  <div class="space-y-6 p-4 pb-16 lg:p-6">
    <UPageHero
      title="Profile"
      description="Review and update the phone number used for airtime purchases."
      icon="i-lucide-user"
    />

    <UContainer class="max-w-3xl pb-16">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-id-card" class="text-warning-500" />
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
              <p class="font-semibold">{{ profileEmail }}</p>
            </div>
          </div>

          <div>
            <p class="text-sm text-muted">Current payer number</p>
            <div class="mt-2 flex flex-wrap items-center gap-3">
              <p class="font-semibold">{{ payerNumber }}</p>
              <UButton
                color="error"
                variant="outline"
                size="sm"
                type="button"
                :loading="loading"
                @click="openPhoneModal"
              >
                {{ profile?.phone_number ? 'Update' : 'Add' }} number
              </UButton>
            </div>
          </div>

          <div>
            <p class="text-sm text-muted">Previous payer numbers</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <UBadge
                v-for="number in additionalNumbers"
                :key="number"
                :label="toLocalKenyaPhone(number)"
              />
              <span
                v-if="!additionalNumbers.length"
                class="text-sm text-muted"
              >
                No additional numbers saved yet.
              </span>
            </div>
          </div>
        </div>
      </UCard>
    </UContainer>

    <!-- app/pages/profile.vue: replace the phone modal with this -->
<UModal
  v-model:open="phoneModalOpen"
  title="Save your payer phone number"
>
  <template #body>
    <UForm
      ref="profilePhoneForm"
      :schema="phoneSchema"
      :state="phoneFormState"
      class="space-y-4"
      @submit="onSavePhoneNumber"
    >
      <UFormField
        name="phoneNumber"
        label="Phone number"
        description="This number will be used for airtime purchases."
        required
      >
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
      <UButton
        color="neutral"
        variant="ghost"
        type="button"
        @click="phoneModalOpen = false"
      >
        Cancel
      </UButton>

      <UButton
        color="error"
        type="button"
        :loading="isSavingPhone"
        @click="profilePhoneForm?.submit()"
      >
        Save number
      </UButton>
    </div>
  </template>
</UModal>

  </div>
</template>
