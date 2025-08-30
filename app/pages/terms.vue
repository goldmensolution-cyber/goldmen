<!-- pages/terms.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Service — Goldmen Solution',
  ogTitle: 'Terms of Service — Goldmen Solution',
  description: 'Terms and Conditions for using Goldmen Solution airtime services.',
  ogDescription: 'Terms and Conditions for using Goldmen Solution airtime services.',
  ogSiteName: 'Goldmen Solution',
  ogType: 'website'
})

const sections = [
  {
    title: 'Definitions',
    content: `“You” (Buyer): A customer using the Service to make payment transactions. Customer: A person that registers with the Service as a Buyer or a Seller. Seller: A customer that uses the Service to process payment transactions from Buyers. Payment Instrument: A mobile payment option registered by a customer (or credit/debit card) to process payment transactions. Payment Transaction: A payment processed through the Service. Product: Any merchandise, good or service listed for sale. Purchase Amount: Amount of a payment transaction including related fees, taxes or shipping. Service: The Goldmen Solution service that facilitates payment processing on behalf of a Seller. “We” or “us”: Goldmen Solution.`
  },
  {
    title: 'Requirements for Registration',
    content: `Provide complete and accurate information and keep it updated. You must register a valid mobile payment option or card. We may request additional information and may approve/terminate registrations at our discretion. By using the Service, you confirm you are 18+ and capable of entering a binding agreement.`
  },
  {
    title: 'Payment Transaction Processing',
    content: `We facilitate processing between Buyer and Seller and may delay processing of suspicious or potentially fraudulent transactions. Authorize debits/charges to your Payment Instrument and credits for reversals/refunds as needed. Purchases are between you and the Seller; Goldmen Solution is not a party to such sales unless explicitly stated. Payments to requests from other Buyers are also not with Goldmen Solution. Withdrawals from Goldmen Solution Credit are not available.`
  },
  {
    title: 'Limitations on the Use of Service',
    content: `We may change, suspend, or discontinue any aspect of the Service and may impose limits or restrict access without liability. We do not warrant uninterrupted or error-free operation and are not responsible for outages or failures. We may limit or suspend your use at any time and attempt to notify you via email/SMS.`
  },
  {
    title: 'Username and Password',
    content: `You are responsible for maintaining confidentiality of credentials and all activity under your account. Notify us immediately of any unauthorized use.`
  },
  {
    title: 'Privacy',
    content: `Personal information provided in connection with the Service is subject to our Privacy Policy.`
  },
  {
    title: 'Service Fees',
    content: `No fee to purchase goods/services as a Buyer. Other services (e.g., receiving payments against requests you issue) may incur fees.`
  },
  {
    title: 'Disputes',
    content: `We provide tools to help Buyers and Sellers resolve disputes. If unresolved, we can mediate when either party requests assistance through support or local offices.`
  },
  {
    title: 'Not a Banking Institution',
    content: `Goldmen Solution processes payments on behalf of Sellers and is not a bank or depository institution.`
  },
  {
    title: 'Termination',
    content: `We may terminate your use for any reason. Upon termination, you remain liable for all transactions/obligations. We may prohibit future access.`
  },
  {
    title: 'No Endorsement of Products',
    content: `We do not endorse or warrant the safety, quality, accuracy, reliability, integrity, or legality of Products or related content, nor Buyers’/Sellers’ abilities to transact.`
  },
  {
    title: 'Limitations of Liability; Force Majeure',
    content: `We are not liable for disruptions due to force majeure (e.g., natural disasters, government actions, telecom failures, strikes).`
  },
  {
    title: 'Jurisdiction; Governing Law',
    content: `This Terms of Service is governed by the Laws of Kenya. Courts in Kenya have jurisdiction over disputes.`
  },
  {
    title: 'Modifications',
    content: `We may modify these Terms by posting notice on our website or otherwise notifying you. Continued use after posting constitutes acceptance.`
  }
]
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold">Terms and Conditions</h1>
            <p class="text-sm text-muted-foreground">Goldmen Solution — Airtime, Bundles & SMS</p>
          </div>
          <UButton
            color="primary"
            variant="solid"
            :to="'/contact'"
          >
            Contact Support
          </UButton>
        </div>
      </template>

      <div class="space-y-8">
        <p>
          This Terms of Service governs your access to and use of Goldmen Solution as a purchaser of merchandise, goods, or services.
          Review the entire Terms before continuing.
        </p>

        <div class="space-y-6">
          <div v-for="(s, i) in sections" :key="i" class="space-y-2">
            <h2 class="text-xl font-medium">{{ s.title }}</h2>
            <p class="leading-relaxed text-sm text-foreground/80">
              {{ s.content }}
            </p>
          </div>
        </div>

        <UDivider />

        <div class="flex flex-wrap items-center gap-2">
          <UButton to="/" variant="outline">Home</UButton>
          <UButton to="/privacy" variant="ghost">Privacy Policy</UButton>
          <UButton to="/about" variant="ghost">About</UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>