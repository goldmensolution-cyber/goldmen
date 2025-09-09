<!-- pages/privacy.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy — Goldmen Solution',
  description: 'How Goldmen Solution collects, uses, retains, and shares your personal data.',
  ogTitle: 'Privacy Policy — Goldmen Solution',
  ogDescription: 'How Goldmen Solution collects, uses, retains, and shares your personal data.',
  ogSiteName: 'Goldmen Solution'
})

const email = 'goldmen.solution@gmail.com'
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold">Privacy Policy</h1>
            <p class="text-sm text-muted-foreground">We respect your privacy.</p>
          </div>
          <UButton :to="'/contact'" variant="solid">Contact DPO</UButton>
        </div>
      </template>

      <div class="space-y-8">
        <section class="space-y-2">
          <p>
            Goldmen Solution respects your privacy and explains here how we collect, retain, process, share, and transfer your personal data when you use our sites and services.
            This Policy applies when our sites/services display or link to it.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">1. What Personal Data We Collect</h2>
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li>Registration info: name, email, phone, and other data needed to create and maintain an account.</li>
            <li>Transaction & experience info: amounts, merchant info, payment method details, device and technical usage data.</li>
            <li>Optional features: additional info for enhanced or specific services.</li>
            <li>Unbranded services: data from payments without logging in; may be associated with an account later.</li>
            <li>Other interactions: support messages, surveys, and communications.</li>
          </ul>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">2. Why We Retain Personal Data</h2>
          <p class="text-sm">
            We retain data as required by law, contracts, or for managing our relationship with you, and for a reasonable period thereafter. If your account is closed, we may mask data but retain it as needed to comply with laws.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">3. How We Process Personal Data</h2>
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li>Provide and improve services; authenticate access; communicate about your account.</li>
            <li>Manage risk and prevent fraud using device, technical, and geolocation data.</li>
            <li>Marketing (with preferences); personalization using cookies/trackers.</li>
            <li>Provide location-specific features when enabled.</li>
            <li>Comply with laws and respond to requests; handle support queries.</li>
          </ul>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">4. Cookies & Tracking</h2>
          <p class="text-sm">
            We use cookies and similar technologies to recognize users, personalize experiences, measure performance, and mitigate risk. Manage cookies via your browser settings. See our Cookie Policy for details.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">5. Disclosing Personal Data</h2>
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li>Service providers operating at our direction.</li>
            <li>Partner financial institutions and transaction participants (e.g., merchants).</li>
            <li>Other third parties as permitted/required by law (regulators, law enforcement, audits, risk, corporate changes).</li>
          </ul>
          <p class="text-sm">We do not share your data with third parties for their marketing without your consent.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">6. Access & Control</h2>
          <p class="text-sm">
            Subject to Kenya Data Protection and Privacy Law, you may request access, rectification, portability, restriction/objection, or deletion. Contact us at
            <UButton variant="link" :to="`mailto:${email}`">{{ email }}</UButton>.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">7. Security</h2>
          <p class="text-sm">
            We apply administrative, technical, and physical measures (e.g., ISO 27001/PCI DSS practices, encryption, SSL, firewalls, monitoring). You are responsible for keeping your password/account secure.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">8. Children</h2>
          <p class="text-sm">Our services target adults; we do not knowingly collect data from persons under 18.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">9. International Transfers</h2>
          <p class="text-sm">Data may be processed in other countries where we operate or use cloud services, with safeguards to meet this Policy and applicable laws.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">10. Updates</h2>
          <p class="text-sm">We may update this Policy and will publish changes on our website; for major changes, we may provide additional notice.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-medium">11. Contact</h2>
          <p class="text-sm">
            Data Protection Officer: <UButton variant="link" :to="`mailto:${email}`">{{ email }}</UButton>
          </p>
        </section>

        <USeparator />
        <div class="flex flex-wrap gap-2">
          <UButton to="/" variant="outline">Home</UButton>
          <UButton to="/terms" variant="ghost">Terms of Service</UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>