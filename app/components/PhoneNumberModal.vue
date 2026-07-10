<script setup lang="ts">
import { reactive, watch, useTemplateRef } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { vMaska } from 'maska/vue'
import { isLikelyKenyanMobile } from '~/composables/useProfileBootstrap'

const props = defineProps<{
  modelValue: boolean
  title: string
  description?: string
  initialValue?: string
  loading?: boolean
  submitLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: string): void
}>()

const form = useTemplateRef('form')

const phoneFormState = reactive({ phoneNumber: '' })

const phoneSchema = z.object({
  phoneNumber: z.string().refine(isLikelyKenyanMobile, {
    message: 'Enter a valid Kenyan mobile number.'
  })
})

type PhoneFormState = z.infer<typeof phoneSchema>

function closeModal() {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      phoneFormState.phoneNumber = props.initialValue ?? ''
    }
  },
  { flush: 'post' }
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
</script>

<template>
  <UModal
    :open="modelValue"
    :title="title"
    @update:open="emit('update:modelValue', $event)"
  >
    <template #body>
      <UForm
        ref="form"
        :schema="phoneSchema"
        :state="phoneFormState"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          name="phoneNumber"
          label="Phone number"
          :description="description || 'We’ll save this to your profile for airtime purchases.'"
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
          @click="closeModal"
        >
          {{ cancelLabel || 'Cancel' }}
        </UButton>

        <UButton
          color="error"
          type="button"
          :loading="loading"
          @click="form?.submit()"
        >
          {{ submitLabel || 'Save number' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
