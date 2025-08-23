<template>
  <div class="w-full">
    <!-- Hero Section -->
    <section class="relative h-[90vh] bg-cover bg-center text-white" :style="{ backgroundImage: `url('/images/hero-bg.jpeg')` }">
      <div class="absolute inset-0 bg-black/50"/>
      <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 class="text-4xl sm:text-6xl font-bold leading-tight max-w-3xl">
          Buy Airtime, Data Bundles & SMS for All Networks
        </h1>
        <p class="mt-4 text-lg max-w-xl">
          Get airtime for Safaricom, Airtel, Telkom, Equitel and Faiba using our M-Pesa Paybill. Fast, reliable and secure.
        </p>
        <UButton class="mt-8" size="xl" to="/airtime">
          Buy Airtime
        </UButton>
      </div>
    </section>

    <!-- Stylized Paybill Number -->
    <section class="py-10 bg-white text-center">
      <h2 class="text-2xl font-semibold text-gray-800">Use Paybill</h2>
      <p class="text-4xl font-bold tracking-widest text-blue-600 mt-2">
        4166283
      </p>
      <p class="text-gray-600 mt-2">Instant delivery to your phone number. No hidden charges.</p>
    </section>

    <!-- Provider Logos Marquee -->
    <section class="bg-gray-50 py-8 overflow-hidden">
      <div class="whitespace-nowrap animate-scroll px-4 flex items-center w-full gap-12">
        <NuxtImg v-for="provider in providers" :key="provider" :src="`/images/${provider}`" class="h-12 grayscale hover:grayscale-0 transition" alt="provider logo" />
      </div>
    </section>

    <!-- How to Buy Steps -->
    <section class="bg-white py-16 px-4">
      <h2 class="text-3xl font-bold text-center mb-12">How to Buy Airtime</h2>
      <div class="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        <div v-for="(step, index) in steps" :key="index" class="text-center">
          <div class="w-16 h-16 mx-auto flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full mb-4">
            {{ index + 1 }}
          </div>
          <h3 class="font-semibold text-lg">{{ step.title }}</h3>
          <p class="text-sm text-gray-600 mt-2">{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="bg-gray-100 py-16 px-4">
      <h2 class="text-3xl font-bold text-center mb-12">FAQs</h2>
      <div class="max-w-3xl mx-auto space-y-6">
        <UAccordion :items="faqs" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const providers = [
  'safaricom.png',
  'airtel.jpg',
  'telkom.png',
  'faiba.png',
  'equitel.jpg'
]

const steps = [
  {
    title: 'Go to M-Pesa',
    description: 'Open the M-Pesa menu on your SIM Toolkit or app.'
  },
  {
    title: 'Select Lipa na M-Pesa',
    description: 'Choose Paybill and enter 4166283 as the business number.'
  },
  {
    title: 'Enter Your Number and Amount',
    description: 'Enter the phone number to receive airtime and the amount.'
  }
]

const faqs = [
  {
    label: 'Can I send airtime to any network?',
    content: 'Yes. goldmen supports airtime purchases for all Kenyan networks.'
  },
  {
    label: 'Is there a fee for using goldmen?',
    content: 'No extra fee is charged — standard M-Pesa Paybill rates apply.'
  },
  {
    label: 'What happens if my payment fails?',
    content: 'You will receive a notification. If deducted, your money will be reversed automatically.'
  }
]
</script>

<style scoped>
@keyframes scroll {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-scroll {
  animation: scroll 30s linear infinite;
}
</style>