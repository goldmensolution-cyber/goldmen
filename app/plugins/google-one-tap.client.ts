declare global {
  interface Window {
    handleSignInWithGoogle: (response: { credential: string }) => void
  }
}

// No filepath: Place in a Nuxt plugin (e.g., plugins/google-one-tap.client.ts)
export default defineNuxtPlugin(() => {
  window.handleSignInWithGoogle = function(response) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    // If user is already logged in, do nothing
    if (user.value) return
    // If we have a credential, sign in with it
    if (response.credential) {
      supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      }).then(({ error }) => {
        if (!error) window.location.reload()
      })
    }
  }
})