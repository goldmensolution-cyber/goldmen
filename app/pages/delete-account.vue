<template>
    <div class="container">
        <h1>Account Deletion — Request Only</h1>
        <p class="desc">You cannot delete your account directly from this page. To comply with platform policies, this page lets you request deletion or export your data. Actual deletion is handled via the app or by our support team.</p>

        <div class="card">
            <h2>How to delete in the mobile app</h2>
            <ol>
                <li>Open the Goldmen mobile app on your device.</li>
                <li>Go to <strong>Account &gt; Settings</strong>.</li>
                <li>Choose <strong>Delete My Account</strong> and follow the in-app confirmation steps.</li>
                <li>You will receive an email confirming the deletion request and the scheduled deletion date.</li>
            </ol>
        </div>

        <div class="card actions-grid">
            <div>
                <h3>Request account deletion</h3>
                <p class="small">This sends a non-destructive request to our team to start the deletion process. We will follow up by email with next steps — no deletion is performed instantly from this page.</p>
                <button class="danger" :disabled="loadingRequest" @click="requestDeletion">
                    <span v-if="loadingRequest">Requesting…</span>
                    <span v-else>Request Deletion</span>
                </button>
            </div>

            <div>
                <h3>Export my data</h3>
                <p class="small">Request a copy of your personal data. We will prepare an export and notify you by email with download instructions.</p>
                <button :disabled="loadingExport" @click="exportData">
                    <span v-if="loadingExport">Preparing…</span>
                    <span v-else>Request Data Export</span>
                </button>
            </div>

            <div class="support">
                <h3>Contact support</h3>
                <p class="small">If you need immediate help, contact our support team.</p>
                <a class="link" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>
            </div>
        </div>

        <p v-if="message" class="message">{{ message }}</p>
        <p v-if="error" class="error">{{ error }}</p>

        <div class="nav-actions">
            <button @click="goBack">Back</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loadingRequest = ref(false)
const loadingExport = ref(false)
const message = ref('')
const error = ref('')
const supportEmail = 'support@goldmen.co.ke'

function goBack() {
    router.push('/')
}

async function requestDeletion() {
    loadingRequest.value = true
    message.value = ''
    error.value = ''
    try {
        const res = await fetch('/api/request-account-deletion', { method: 'POST' })
        if (!res.ok) {
            const d = await res.json().catch(() => ({ message: res.statusText }))
            throw new Error(d?.message || 'Request failed')
        }
        message.value = 'Request received. We will contact you by email with next steps.'
    } catch (e) {
        error.value = e.message || 'Unable to submit request'
    } finally {
        loadingRequest.value = false
    }
}

async function exportData() {
    loadingExport.value = true
    message.value = ''
    error.value = ''
    try {
        const res = await fetch('/api/export-data', { method: 'POST' })
        if (!res.ok) {
            const d = await res.json().catch(() => ({ message: res.statusText }))
            throw new Error(d?.message || 'Export request failed')
        }
        message.value = 'Export request submitted. You will receive an email when your data is ready.'
    } catch (e) {
        error.value = e.message || 'Unable to request export'
    } finally {
        loadingExport.value = false
    }
}
</script>

<!-- <style scoped>
.container {
    max-width: 760px;
    margin: 40px auto;
    padding: 22px;
    border: 1px solid #eee;
    border-radius: 8px;
    background: #fff;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}
h1 { margin: 0 0 8px; font-size: 22px; }
.desc { margin: 0 0 16px; color: #555; }
.card { padding: 14px; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 12px; }
.actions-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: start; }
.small { color: #666; font-size: 13px; }
button { padding: 8px 12px; border-radius: 6px; border: 1px solid #bbb; background: #f5f5f5; cursor: pointer; }
button.danger { background: #e74c3c; color: #fff; border-color: #e74c3c; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.link { display: inline-block; margin-top: 8px; color: #0b66ff; }
.message { color: #2b7a0b; margin-top: 12px; }
.error { color: #c0392b; margin-top: 12px; }
.nav-actions { display:flex; justify-content: flex-end; margin-top: 14px; }
@media (max-width: 800px) { .actions-grid { grid-template-columns: 1fr; } }
</style> -->