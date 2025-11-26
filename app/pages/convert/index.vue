<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6">Convert to M-PESA</h1>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        class="card p-5 rounded-lg shadow flex flex-col justify-between"
        :style="{ borderTop: '4px solid ' + providers.safaricom.color }"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 flex items-center justify-center rounded-md" :style="{ background: providers.safaricom.color + '22' }">
            <!-- simple provider icon -->
            <div class="text-white font-bold" :style="{ color: providers.safaricom.color }">S</div>
          </div>
          <div>
            <div class="text-lg font-medium">Convert Safaricom airtime to M-PESA</div>
            <div class="text-sm text-gray-500">Fast safaricom airtime conversion</div>
          </div>
        </div>

        <div class="mt-4">
          <NuxtLink :to="`/convert/safaricom`" class="inline-block w-full text-center py-2 rounded bg-green-600 text-white hover:bg-green-700">
            Convert Safaricom
          </NuxtLink>
        </div>
      </div>

      <div
        class="card p-5 rounded-lg shadow flex flex-col justify-between"
        :style="{ borderTop: '4px solid ' + providers.airtel.color }"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 flex items-center justify-center rounded-md" :style="{ background: providers.airtel.color + '22' }">
            <div class="text-white font-bold" :style="{ color: providers.airtel.color }">A</div>
          </div>
          <div>
            <div class="text-lg font-medium">Convert Airtel airtime to M-PESA</div>
            <div class="text-sm text-gray-500">Airtel conversions made easy</div>
          </div>
        </div>

        <div class="mt-4">
          <NuxtLink :to="`/convert/airtel`" class="inline-block w-full text-center py-2 rounded bg-red-600 text-white hover:bg-red-700">
            Convert Airtel
          </NuxtLink>
        </div>
      </div>

      <div
        class="card p-5 rounded-lg shadow flex flex-col justify-between"
        :style="{ borderTop: '4px solid ' + providers.bonga.color }"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 flex items-center justify-center rounded-md" :style="{ background: providers.bonga.color + '22' }">
            <div class="text-white font-bold" :style="{ color: providers.bonga.color }">B</div>
          </div>
          <div>
            <div class="text-lg font-medium">Convert Bonga points to M-PESA</div>
            <div class="text-sm text-gray-500">Redeem your Bonga points</div>
          </div>
        </div>

        <div class="mt-4">
          <NuxtLink :to="`/convert/bonga`" class="inline-block w-full text-center py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Convert Bonga
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const providers = {
  safaricom: { color: '#27ae60' },
  airtel: { color: '#d93025' },
  bonga: { color: '#1e90ff' }
}
</script>

<style scoped>
.container { max-width: 1100px; }
.card { background: white; }
</style>