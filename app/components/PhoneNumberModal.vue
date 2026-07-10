<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { vMaska } from 'maska/vue'
import { useToast } from '#imports'
import { isLikelyKenyanMobile } from '~/composables/useProfileBootstrap'

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
  loading: false,
  submitLabel: 'Save number',
  cancelLabel: 'Cancel'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: string): void
}>()

const toast = useToast()

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const formId = 'phone-number-form'

const phoneSchema = z.object({
  phoneNumber: z.string().trim().refine(isLikelyKenyanMobile, {
    message: 'Enter a valid Kenyan mobile number.'
  })
})

type PhoneFormState = z.infer<typeof phoneSchema>

const phoneFormState = reactive<PhoneFormState>({
  phoneNumber: ''
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

function onSubmit(event: FormSubmitEvent<PhoneFormState>) {
  emit('save', event.data.phoneNumber)
}

function onError() {
  toast.add({
    title: 'Check the phone number',
    description: 'Enter a valid Kenyan mobile number before saving.',
    color: 'warning',
    icon: 'i-lucide-triangle-alert'
  })
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
        :id="formId"
        :schema="phoneSchema"
        :state="phoneFormState"
        class="space-y-4"
        @submit="onSubmit"
        @error="onError"
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
      </UForm>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          type="button"
          @click="open = false"
        >
          {{ cancelLabel }}
        </UButton>

        <UButton
          :form="formId"
          type="submit"
          color="error"
          :loading="loading"
        >
          {{ submitLabel }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
