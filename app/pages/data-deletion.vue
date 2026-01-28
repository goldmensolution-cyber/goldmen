<template>
  <div class="container">
    <h1>Delete Personal Data (Keep Account)</h1>
    <p class="desc">This page explains how to remove or anonymize your personal data while keeping your Goldmen account. For Play Store compliance this page only contains instructions — data deletion must be completed in the mobile app or via support.</p>

    <div class="card">
      <h2>In-app steps (recommended)</h2>
      <ol>
        <li>Open the Goldmen mobile app on your device.</li>
        <li>Go to <strong>Account &gt; Privacy</strong> (or <strong>Settings &gt; Privacy</strong>).</li>
        <li>Select <strong>Delete Personal Data</strong> or <strong>Anonymize My Data</strong>.</li>
        <li>Follow the in-app confirmation prompts. Some data will be removed immediately; other data may be scheduled for deletion and you will be notified by email.</li>
        <li>Your account credentials will be retained so you can continue using the app without the deleted personal data (if the app supports retaining accounts after data removal).</li>
      </ol>
    </div>

    <div class="card">
      <h2>If you can’t access the app</h2>
      <p class="small">If you cannot complete the in-app flow, request data deletion through our support team. This is a request-only path — we will verify your identity before deleting or anonymizing data.</p>
      <p class="small"><strong>To request deletion via email:</strong></p>
      <ol>
        <li>Email <a :href="`mailto:${supportEmail}`">{{ supportEmail }}</a> from the email address tied to your account.</li>
        <li>Include your username or account ID and state you request deletion of personal data while retaining the account.</li>
        <li>We will respond with identity verification steps and a timeline for deletion.</li>
      </ol>
    </div>

    <div class="card">
      <h2>What will be removed</h2>
      <ul>
        <li>Profile information (name, address, phone) — if requested.</li>
        <li>Transaction and activity data may be anonymized or retained for legal/financial record-keeping where required.</li>
        <li>Attachments and uploaded files linked to your account will be removed if requested and not required to be kept for compliance.</li>
      </ul>
      <p class="small">Exact behavior depends on the mobile app options and applicable law; the app will show what is removed during the flow.</p>
    </div>

    <p class="note">Note: This web page does not perform deletion. Use the mobile app or contact support to complete the process.</p>

    <div class="nav-actions">
      <button @click="goBack">Back</button>
      <a class="link" :href="`mailto:${supportEmail}`">Contact Support</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const supportEmail = 'support@goldmen.co.ke'

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.container { max-width: 760px; margin: 40px auto; padding: 22px; border: 1px solid #eee; border-radius: 8px; background: #fff; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
h1 { margin: 0 0 8px; font-size: 22px; }
.desc { margin: 0 0 16px; color: #555; }
.card { padding: 14px; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 12px; }
.small { color: #666; font-size: 13px; }
.note { color: #333; font-weight: 600; margin-top: 8px; }
.nav-actions { display:flex; justify-content: flex-end; gap: 12px; margin-top: 12px; }
button { padding: 8px 12px; border-radius: 6px; border: 1px solid #bbb; background: #f5f5f5; cursor: pointer; }
.link { display: inline-block; padding: 8px 12px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: #0b66ff; text-decoration: none; }
@media (max-width: 700px) { .nav-actions { flex-direction: column-reverse; align-items: stretch; } }
</style>
