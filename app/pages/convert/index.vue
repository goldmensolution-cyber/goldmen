<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-5xl">
      <h1 class="text-3xl font-semibold text-center mb-8">Convert to M-PESA</h1>

      <!-- <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> -->
        <div class="flex gap-6 flex-row"
>        <NuxtLink
          v-motion-fade
          :to="`/convert/safaricom`"
          class="card group block p-6 rounded-xl shadow-sm bg-white hover:shadow-lg transition"
        >
          <div class="flex items-center gap-4">
            <div :style="{ background: providers.safaricom.color + '22' }" class="w-16  h-16 top-5 rounded-md flex items-center justify-center">
              <img src="/images/safaricom.png" alt="Safaricom" class="w-16 h-16 object-contain" />
            </div>
            <div>
              <div class="text-lg font-medium">Convert Safaricom airtime to M-PESA</div>
              <div class="text-sm text-gray-500 mt-1">Fast safaricom airtime conversion</div>
            </div>
          </div>

          <button :style="{ background: providers.safaricom.color }" class="mt-6 w-full py-2 text-white rounded-md">
            Convert Safaricom
          </button>
        </NuxtLink>

        <NuxtLink
          v-motion-fade
          :to="`/convert/airtel`"
          class="card group block p-6 rounded-xl shadow-sm bg-white hover:shadow-lg transition"
        >
          <div class="flex items-center gap-4">
            <div :style="{ background: providers.airtel.color + '22' }" class="w-16 h-16 rounded-md flex items-center justify-center">
              <img src="/images/airtel.jpg" alt="Airtel" class="w-10 h-10 object-contain" />
            </div>
            <div>
              <div class="text-lg font-medium">Convert Airtel airtime to M-PESA</div>
              <div class="text-sm text-gray-500 mt-1">Airtel conversions made easy</div>
            </div>
          </div>

          <button :style="{ background: providers.airtel.color }" class="mt-6 w-full py-2 text-white rounded-md">
            Convert Airtel
          </button>
        </NuxtLink>

        <NuxtLink
          v-motion-fade
          :to="`/convert/bonga`"
          class="card group block p-6 rounded-xl shadow-sm bg-white hover:shadow-lg transition"
        >
          <div class="flex items-center gap-4">
            <div :style="{ background: providers.bonga.color + '22' }" class="w-16 h-16 rounded-md flex items-center justify-center">
              <img src="/images/bonga.jpeg" alt="Bonga" class="w-10 h-10 object-contain" />
            </div>
            <div>
              <div class="text-lg font-medium">Convert Bonga points to M-PESA</div>
              <div class="text-sm text-gray-500 mt-1">Redeem your Bonga points</div>
            </div>
          </div>

          <button :style="{ background: providers.bonga.color }" class="mt-6 w-full py-2 text-white rounded-md">
            Convert Bonga
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const providers = reactive({
  safaricom: { color: '#27ae60' },
  airtel: { color: '#d93025' },
  bonga: { color: '#1e90ff' }
})

// v-motion preset objects for slide in with small stagger
// const safariMotion = {
//   initial: { y: 30, opacity: 0, scale: 0.98 },
//   enter: { y: 0, opacity: 1, scale: 1, transition: { duration: 400, delay: 80 } }
// }
// const airtelMotion = {
//   initial: { y: 30, opacity: 0, scale: 0.98 },
//   enter: { y: 0, opacity: 1, scale: 1, transition: { duration: 400, delay: 160 } }
// }
// const bongaMotion = {
//   initial: { y: 30, opacity: 0, scale: 0.98 },
//   enter: { y: 0, opacity: 1, scale: 1, transition: { duration: 400, delay: 240 } }
// }
</script>

<style scoped>
.container { max-width: 1100px; }
.card { border-top: 4px solid transparent; }
</style>