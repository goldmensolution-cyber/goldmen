declare global {
  interface Window {
    handleSignInWithGoogle: (response: { credential: string }) => void
  }
}

// No filepath: Place in a Nuxt plugin (e.g., plugins/google-one-tap.client.ts)
export default defineNuxtPlugin(() => {
  window.handleSignInWithGoogle = function(response) {
    const supabase = useSupabaseClient()
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