<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { vMaska } from 'maska/vue'
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

const phoneSchema = z.object({
  phoneNumber: z.string().trim().refine(isLikelyKenyanMobile, {
    message: 'Enter a valid Kenyan mobile number.'
  })
})

type PhoneFormState = z.infer<typeof phoneSchema>

const phoneFormState = reactive<PhoneFormState>({
  phoneNumber: ''
})

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

function onSubmit(event: FormSubmitEvent<PhoneFormState>) {
  emit('save', event.data.phoneNumber)
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
            :loading="loading"
          >
            {{ submitLabel }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
