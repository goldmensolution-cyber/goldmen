<script setup lang="ts">
const user = process.client ? useSupabaseUser() : ref(null)
const toast = useToast()
const redirect = process.client ? useSupabaseCookieRedirect() : { pluck: () => null }
const { ensureProfile } = useProfileBootstrap()

const handled = ref(false)

watch(
  user,
  async (value) => {
    if (!value || handled.value) {
      return
    }

    handled.value = true

    try {
      await ensureProfile()
      toast.add({
        title: 'Signed in',
        description: 'Your profile has been prepared.',
        color: 'success'
      })
    } catch (error) {
      toast.add({
        title: 'Signed in',
        description:
          error instanceof Error
            ? error.message
            : 'Profile setup will finish in the background.',
        color: 'warning'
      })
    } finally {
      navigateTo(redirect.pluck() || '/profile')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-100">
    <UPageCard class="w-full max-w-sm text-center">
      <p class="text-lg">Finalizing login...</p>
    </UPageCard>
    <UToast position="top-right" />
  </div>
</template>
