<template>
  <div class="w-full">
    <UPageHero 
    title="Buy Airtime for All Networks"
    description="Get airtime for Safaricom, Airtel, Telkom, Equitel and Faiba using our M-Pesa Paybill. Fast, reliable and secure."
    :links="links"
    :style="{ backgroundImage: `url('pic.jpeg')` }"
    :ui="{root: 'text-white', title: 'text-white text-4xl',description: 'text-elevated' ,headline: 'text-error'}"
    headline="Fast and easy"
    class="bg-cover bg-center px-6 rounded-md  text-white backdrop:blur"
  />
   
<!-- Provider Logos Marquee -->
    <section class="bg-gray-50 py-8 overflow-hidden">
      <UMarquee>
    <NuxtImg v-for="provider in providers" :key="provider" :src="provider" class="size-20 rounded-md hover:grayscale shrink-0" />
  </UMarquee>
    </section>
    <!-- Stylized Paybill Number -->
    <section class="py-10 bg-white text-center">
       <UCard variant="outline" class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-semibold">Pay via Paybill</h3>
                  <p class="text-sm text-muted">Business number: <strong class="text-error">4166283</strong></p>
                </div>
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-signal" class="size-5" />
                  <UIcon name="i-lucide-phone" class="size-5" />
                </div>
              </div>
            </template>

            <div class="p-4 sm:p-6 grow">
              <!-- Vertical stepper (red) -->
              <UStepper
                :items="paybillSteps"
                color="error"
                orientation="vertical"
                size="md"
                class="w-full"
              />

              <UAlert variant="subtle" class="mt-6" icon="i-lucide-info">Use your mobile number as the account/reference for instant top-up.</UAlert>
            </div>

            <template #footer>
              <div class="flex gap-3 justify-end p-4 sm:px-6">
                <UButton color="error" size="md" :to="{ hash: '#how-to-pay' }">
                  Pay via Paybill
                </UButton>
                <UButton variant="outline" color="error" size="md" to="/airtime">
                  Use Airtime Form
                </UButton>
              </div>
            </template>
          </UCard>
        <UCard class="mx-auto max-w-md ring-primary divide-y-0 hidden">
          <template #header>
            <NuxtImg src="/images/lipa.png" class="object-cover  w-full h-20" />
     </template>
           <h2 class="text-2xl font-semibold text-gray-800">Paybill Number</h2>
  <UPinInput v-model="value" type="number" disabled :length="7" highlight size="xl" /> 
        <h2 class="text-2xl font-semibold text-gray-800">Account Number</h2>
                <h2 class="text-2xl font-extrabold text-gray-800">Your number</h2>
                <USeparator label="or" />
                 <UButton label="Buy Online" to="/airtime" />
        <template #footer>
        <p class="text-gray-600 mt-2">Instant delivery to your phone number.No hidden charges.</p>
        </template>
      </UCard>
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
    <section class="flex mx-auto justify-center p-4">
<iframe width="560" height="315" src="https://youtube.com/embed/KHnEVzDsb1A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</section> 
<UHeader title="Help Articles" />   
    <BlogSection />
  </div>
</template>
<script setup lang="ts">



const value = ref([4,1,6,6,2,8,3])
const links = [
  {
    label: 'Buy Airtime',
    icon: 'i-lucide-banknote',
    to: '/airtime',
    color: 'error' as const
  }
]
const paybillSteps = ref([
  {
    title: 'Open M-PESA on your phone',
    description: 'Tap Lipa na M-PESA',
    icon: 'i-lucide-smartphone'
  },
  {
    title: 'Select Paybill',
    description: 'Choose "Paybill" from the menu',
    icon: 'i-lucide-list' 
  },
  {
    title: 'Enter Business Number',
    description: 'Use <strong>4166283</strong> as the business number',
    icon: 'i-lucide-hash'
  },
  {
    title: 'Enter Reference',
    description: 'Use your phone number as the reference',
    icon: 'i-lucide-user'
  },
  {
    title: 'Enter Amount & Confirm',
    description: 'Confirm the details and complete the payment',
    icon: 'i-lucide-check'
  }
])
const providers = [
  '/images/airtel.jpg',
  '/images/equitel.jpg',
  '/images/faiba.png',
  '/images/safaricom.png',
  '/images/telkom.png'
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



</script>

