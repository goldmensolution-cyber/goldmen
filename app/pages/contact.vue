<!-- pages/contact.vue -->
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

useSeoMeta({
  title: 'Contact — Goldmen Solution',
  description: 'Get in touch with Goldmen Solution support.',
  ogTitle: 'Contact — Goldmen Solution',
  ogDescription: 'Get in touch with Goldmen Solution support.',
  ogSiteName: 'Goldmen Solution'
})

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(9, 'Enter a valid phone').max(15, 'Too long').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
  consent: z.boolean().refine(v => v === true, { message: 'Please agree to be contacted' })
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  phone: '',
  subject: undefined,
  message: undefined,
  consent: false
})

const socials = [
  { label: 'WhatsApp', icon: 'i-lucide-message-circle', to: 'https://wa.me/254700000000' },
  { label: 'Facebook', icon: 'i-lucide-facebook', to: 'https://facebook.com' },
  { label: 'Twitter', icon: 'i-lucide-twitter', to: 'https://twitter.com' },
  { label: 'Telegram', icon: 'i-lucide-send', to: 'https://t.me' },
  { label: 'Email', icon: 'i-lucide-mail', to: 'mailto:goldmen.solution@gmail.com' }
]

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Here you would call your API endpoint
  await $fetch('/api/contact', { method: 'POST', body: event.data })
  toast.add({ title: 'Message sent', description: 'We will get back to you shortly.', color: 'success' })
  // Example: clear message only
  state.subject = undefined
  state.message = undefined
}
</script>

<template>
  <UContainer class="py-8">
    <div class="grid gap-6 lg:grid-cols-3">
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold">Contact Us</h1>
            <UBadge variant="soft" color="primary">Support</UBadge>
          </div>
        </template>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Full name" name="name">
              <UInput v-model="state.name" placeholder="Jane Doe" />
            </UFormField>
            <UFormField label="Email" name="email">
              <UInput v-model="state.email" type="email" placeholder="jane@example.com" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Phone (optional)" name="phone">
              <UInput v-model="state.phone" inputmode="tel" placeholder="+2547..." />
            </UFormField>
            <UFormField label="Subject" name="subject">
              <UInput v-model="state.subject" placeholder="e.g. Payment inquiry" />
            </UFormField>
          </div>

          <UFormField label="Message" name="message">
            <UTextarea v-model="state.message" :rows="6" placeholder="How can we help you?" />
          </UFormField>

          <UFormField name="consent">
            <UCheckbox v-model="state.consent" label="I agree to be contacted about my request" />
          </UFormField>

          <div class="flex flex-wrap gap-2">
            <UButton type="submit" color="primary">Send message</UButton>
            <UButton variant="outline" color="neutral" @click="state.name = state.email = state.phone = state.subject = state.message = undefined; state.consent = false">
              Clear
            </UButton>
          </div>
        </UForm>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-medium">Reach us directly</h2>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-2">
            <UButton v-for="s in socials" :key="s.label" :to="s.to" target="_blank" color="neutral" variant="subtle"  :leading-icon="s.icon">
              {{ s.label }}
            </UButton>
          </div>

          <UDivider />

          <div class="space-y-1 text-sm">
            <p>
              Official Website:
              <UButton variant="link" to="https://goldmen.co.ke" target="_blank">goldmen.co.ke</UButton>
              
            </p>
            <p>Paybill: <UBadge color="primary" variant="soft">4166283</UBadge></p>
            <p>Networks: Safaricom, Airtel, Telkom, Equitel, Faiba</p>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>