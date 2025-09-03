<template>
  <UApp>
    <NuxtLayout>
    <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script setup lang="ts">
const supabase = useSupabaseClient()
const toast = useToast()
supabase.auth.onAuthStateChange((event, session) => {
  // Custom logic, e.g.:
  if (event === 'SIGNED_IN') navigateTo('/dashboard')
  console.log(session)
  toast.add({
    title: 'Login successfull',
    description: 'You can now access your Dashboard'
}
)
})
</script>