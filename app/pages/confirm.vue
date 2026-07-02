<script setup lang="ts">
const user = import.meta.client ? useSupabaseUser() : ref(null);
const toast = useToast();
const redirect = import.meta.client ? useSupabaseCookieRedirect() : { pluck: () => null };

if (import.meta.client) {
  watch(user, () => {
    if (user.value) {
      toast.add({ title: 'Authentication successful', color: 'success' });
      navigateTo(redirect.pluck() || '/profile');
    }
  }, { immediate: true });
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-neutral-100">
    <UPageCard class="w-full max-w-sm text-center">
      <p class="text-lg">Finalizing login...</p>
    </UPageCard>
    <UToast position="top-right" />
  </div>
</template>
