<!-- pages/about.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'About — Goldmen Solution',
  description: 'Learn about Goldmen Solution and our vision to simplify airtime purchases across Kenya.',
  ogTitle: 'About — Goldmen Solution',
  ogDescription: 'Simplifying airtime purchases across Kenya.',
  ogSiteName: 'Goldmen Solution'
})

const mpesaPaybill = '4166283'
const networks = ['Safaricom', 'Airtel', 'Telkom', 'Equitel', 'Faiba']
</script>

<template>
  <UContainer class="py-8">
    <div class="grid gap-6 lg:grid-cols-3">
      <UCard class="lg:col-span-2">
        <template #header>
          <h1 class="text-2xl font-semibold">About Goldmen Solution</h1>
        </template>

        <div class="prose max-w-none">
          <p><strong>Goldmen Solution</strong></p>

          <p>
            Goldmen Solution, convenience is at your fingertips—buy airtime instantly, anytime, anywhere.
            All you need is money in your M-Pesa account, and even with FULIZA, you’re covered!
            Whether it’s Safaricom, Airtel, or Telkom. Goldmen Solution ensures seamless transactions,
            eliminating the need for physical scratch cards.
          </p>

          <p>
            Enjoy reliable service and the freedom to recharge without limitations. Experience the ease of staying
            connected with Goldmen Solution, where simplicity meets efficiency for all your airtime needs.
          </p>

          <p>
            Our vision is to empower individuals and businesses by providing accessible and reliable digital services
            that contribute to sustainable growth. By leveraging technology, we strive to create a positive impact on
            the lives of our customers, enabling them to stay connected effortlessly, whether for personal or professional use.
          </p>

          <p>
            At Goldmen Solution, we are driven by innovation, customer satisfaction, and a desire to deliver solutions
            that enhance the mobile experience for all Kenyans. With a user-friendly platform, instant transactions, and
            a secure payment process, goldmen is your trusted partner for hassle-free airtime purchases. Join us in redefining
            convenience and staying connected anytime, anywhere.
          </p>
        </div>

        <UDivider class="my-4" />

        <div class="flex flex-wrap items-center gap-2">
          <UButton color="primary" to="/buy-airtime" :disabled="true">Buy Airtime (Coming from main app)</UButton>
          <UButton variant="outline" to="/contact">Contact Us</UButton>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-medium">Quick Facts</h2>
          </div>
        </template>

        <ul class="space-y-2">
          <li class="flex items-center justify-between">
            <span>Official Paybill</span>
            <UBadge color="primary" variant="soft">{{ mpesaPaybill }}</UBadge>
          </li>
          <li>
            <span class="block mb-1">Supported Networks</span>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="n in networks" :key="n" variant="subtle">{{ n }}</UBadge>
            </div>
          </li>
          
        </ul>

        <USeparator class="my-4" />

        <div class="space-y-2">
          <h3 class="font-medium">Nationwide Service</h3>
          <p class="text-sm text-foreground/80">
            We serve customers across all Kenyan counties with instant airtime delivery.
          </p>
          <!-- The illustrative Kenya map image would typically be added via <img>, but we avoid external assets here. -->
          <UAlert icon="i-lucide-map" color="neutral" variant="soft" title="Kenya-wide coverage" description="All counties supported."  />
          <NuxtImg src="/kenya.JPG" />
        </div>
      </UCard>
    </div>
  </UContainer>
</template>