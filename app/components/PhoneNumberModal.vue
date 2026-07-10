<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { vMaska } from 'maska/vue'
import {
  isLikelyKenyanMobile,
  normalizeKenyaPhone
} from '~/composables/useProfileBootstrap'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  description?: string
  initialValue?: string
  loading?: boolean
  submitLabel?: string
  cancelLabel?: string
}>(), {
  description: 'We’ll save this to your profile for airtime purchases.',
  initialValue: '',
  loading: false,
  submitLabel: 'Save number',
  cancelLabel: 'Cancel'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', payload: { phoneNumber: string; additionalNumbers: string[] }): void
}>()

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

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

const phoneSchema = z.object({
  phoneNumber: z.string().trim().refine(isLikelyKenyanMobile, {
    message: 'Enter a valid Kenyan mobile number.'
  })
})

type PhoneFormState = z.infer<typeof phoneSchema>

const phoneFormState = reactive<PhoneFormState>({
  phoneNumber: ''
})
const isSubmitting = ref(false)

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      phoneFormState.phoneNumber = props.initialValue ?? ''
    }
  },
  { immediate: true }
)

watch(
  () => props.initialValue,
  (value) => {
    if (props.modelValue) {
      phoneFormState.phoneNumber = value ?? ''
    }
  }
)

function closeModal() {
  emit('update:modelValue', false)
}

async function onSubmit(event: FormSubmitEvent<PhoneFormState>) {
  isSubmitting.value = true

  try {
    const activeUser = await resolveActiveUser()

    if (!activeUser?.id || !supabase) {
      toast.add({
        title: 'Unable to save phone number',
        description: 'Your signed-in session is not ready yet. Please wait a moment and try again.',
        color: 'error',
        icon: 'i-lucide-circle-x'
      })
      return
    }

    const normalizedPhoneNumber = normalizeKenyaPhone(event.data.phoneNumber)
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, phone_number, full_name, email, additional_numbers')
      .eq('id', activeUser.id)
      .maybeSingle()

    if (fetchError) {
      throw fetchError
    }

    const existingAdditionalNumbers = Array.isArray(currentProfile?.additional_numbers)
      ? currentProfile.additional_numbers.filter(Boolean).map(String)
      : []

    const additionalNumbers = new Set<string>(existingAdditionalNumbers)

    if (currentProfile?.phone_number && currentProfile.phone_number !== normalizedPhoneNumber) {
      additionalNumbers.add(currentProfile.phone_number)
    }

    additionalNumbers.delete(normalizedPhoneNumber)

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: activeUser.id,
        phone_number: normalizedPhoneNumber,
        full_name: currentProfile?.full_name ?? activeUser.user_metadata?.name ?? activeUser.user_metadata?.full_name ?? null,
        email: currentProfile?.email ?? activeUser.email ?? null,
        additional_numbers: Array.from(additionalNumbers)
      }, { onConflict: 'id' })

    if (upsertError) {
      throw upsertError
    }

    emit('saved', {
      phoneNumber: normalizedPhoneNumber,
      additionalNumbers: Array.from(additionalNumbers)
    })

    closeModal()

    toast.add({
      title: 'Phone number saved',
      description: 'Your payer number has been updated.',
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
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="description"
  >
    <template #body>
      <UForm
        :schema="phoneSchema"
        :state="phoneFormState"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          name="phoneNumber"
          label="Phone number"
          :description="description"
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

        <div class="flex justify-end gap-3 pt-2">
          <UButton
            color="neutral"
            variant="ghost"
            type="button"
            @click="closeModal"
          >
            {{ cancelLabel }}
          </UButton>

          <UButton
            color="primary"
            type="submit"
            :loading="isSubmitting || loading"
          >
            {{ submitLabel }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
