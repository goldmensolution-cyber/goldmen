declare global {
  interface Window {
    handleSignInWithGoogle: (response: { credential: string }) => void
  }
}

// No filepath: Place in a Nuxt plugin (e.g., plugins/google-one-tap.client.ts)
export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  window.handleSignInWithGoogle = async function (response) {
    if (user.value) return // already signed in

    if (response.credential) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      })

      if (error) {
        console.error('Google One Tap login failed:', error)
      } else {
        console.log('Google One Tap login success')
        // ✅ no reload needed, user state will update
      }
    }
  }
})
