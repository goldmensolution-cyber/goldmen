export default defineNuxtRouteMiddleware(() => {
  const  user  = useSupabaseUser()

  // redirect the user to the login screen if they're not authenticated
  if (!user) {
    return navigateTo('/login')
  }
})

