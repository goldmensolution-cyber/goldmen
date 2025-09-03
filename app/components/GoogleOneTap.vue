<!-- components/GoogleOneTap.vue -->
<template>
  <div>
    <!-- The Google One Tap prompt will be rendered into this div -->
    <div
      id="g_id_onload"
      :data-client_id="googleClientId"
      data-context="signin"
      data-ux_mode="popup"
      data-callback="handleSignInWithGoogle"
      data-auto_select="true"
      data-itp_support="true"
    ></div>

    <!-- The Google "Continue with" button -->
    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="rectangular"
      data-theme="outline"
      data-text="continue_with"
      data-size="large"
      data-logo_alignment="left"
    ></div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const googleClientId = '759998284492-quuurm5jmht6j2d9j8g8va7jbmnuhif2.apps.googleusercontent.com';

// This function must be exposed globally for the Google script to find it.
function handleSignInWithGoogle(response) {
  if (response.credential) {
    supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    }).then(({ error }) => {
      if (!error) {
        window.location.reload(); // Ensures Nuxt sees the new session
      } else {
        console.error(error);
      }
    });
  }
}

// Attach the function to the global window object.
onMounted(() => {
  window.handleSignInWithGoogle = handleSignInWithGoogle;
});

onUnmounted(() => {
  delete window.handleSignInWithGoogle;
});
</script>
