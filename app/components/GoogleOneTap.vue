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
    />

    <!-- The Google "Continue with" button -->
    <div
      class="g_id_signin"
      data-type="icon"
      data-shape="square"
      data-theme="outline"
      data-text="continue_with"
      data-size="large"
    />
  </div>
</template>

<script setup>
const googleClientId = '759998284492-quuurm5jmht6j2d9j8g8va7jbmnuhif2.apps.googleusercontent.com';
</script>
