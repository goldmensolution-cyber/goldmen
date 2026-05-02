<script setup lang="ts">
</script>
<template>
  <main class="prose mx-auto py-10">
    <h1 class="text-4xl font-bold text-center">Airtime Purchase via Paybill</h1>
    <p class="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
      The website no longer processes airtime purchases directly. Use the Paybill instructions below to complete your airtime top-up through M-Pesa.
    </p>

    <section class="mt-10 grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold">Paybill Details</h2>
        </template>
        <div class="p-4 space-y-4">
          <p>Use the following details when paying through M-Pesa:</p>
          <div class="grid gap-3">
            <div class="flex justify-between rounded-lg bg-gray-50 p-4">
              <span class="font-semibold">Paybill Number</span>
              <span class="font-mono">4166283</span>
            </div>
            <div class="flex justify-between rounded-lg bg-gray-50 p-4">
              <span class="font-semibold">Reference</span>
              <span>Your mobile number</span>
            </div>
            <div class="flex justify-between rounded-lg bg-gray-50 p-4">
              <span class="font-semibold">Service</span>
              <span>Airtime top-up</span>
            </div>
          </div>
        </div>
      </UCard>

      <UCard variant="outline">
        <template #header>
          <h2 class="text-2xl font-semibold">M-Pesa USSD Steps</h2>
        </template>
        <div class="p-4 space-y-4">
          <ol class="list-decimal pl-5 space-y-3 text-sm text-muted-foreground">
            <li>Open your M-Pesa menu or dial <strong>*234#</strong>.</li>
            <li>Select <strong>Lipa na M-Pesa</strong> or <strong>Paybill</strong>.</li>
            <li>Enter <strong>4166283</strong> as the business number.</li>
            <li>Enter your phone number as the reference.</li>
            <li>Enter the airtime amount and confirm with your M-Pesa PIN.</li>
          </ol>
          <p class="text-sm text-muted-foreground">
            Airtime should be delivered instantly after payment. Always confirm the details before submitting.
          </p>
        </div>
      </UCard>
    </section>

    <UAlert variant="soft" color="info" icon="i-heroicons-information-circle" class="mt-8">
      <template #title>Important</template>
      <p class="text-sm">
        The website no longer allows direct airtime checkout. Follow the Paybill instructions above to complete your airtime purchase.
      </p>
    </UAlert>
  </main>
</template>