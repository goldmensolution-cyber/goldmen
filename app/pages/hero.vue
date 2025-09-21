<template>
  <!-- How to Pay section — place this below your hero section -->
  <section id="how-to-pay" class="py-16 w-full">
    <UContainer>
      <div class="mb-8 text-center sm:text-left">
        <h2 class="text-3xl sm:text-4xl font-extrabold">How to Buy Airtime</h2>
        <p class="mt-2 text-muted max-w-2xl">
          Use MPESA Paybill or our simple Airtime form. Fast, secure and available for Safaricom, Airtel, Telkom,
          Equitel and Faiba.
        </p>
      </div>

      <div class="gap-8  items-start">
        <!-- Left: Paybill steps -->
        <div class="lg:col-span-1">
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
        </div>

        <!-- Right: Airtime form CTA + animated phone mockup -->
        <div class="lg:col-span-1">
          <UCard variant="soft" class="h-full flex flex-col items-stretch">
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-semibold">Buy via Online Form</h3>
                  <p class="text-sm text-muted">Prefer not to use MPESA? Fill the form and we'll guide you.</p>
                </div>
                <UIcon name="i-lucide-file-text" class="size-5" />
              </div>
            </template>

            <div class="p-4 sm:p-6 grow flex flex-col sm:flex-row items-center gap-6">
              <!-- Animated phone mockup -->
              <div class="phone-mockup flex-shrink-0">
                <div class="phone-screen">
                  <div class="msg msg-1">Open MPESA</div>
                  <div class="msg msg-2">Select Paybill</div>
                  <div class="msg msg-3">Enter 4166283</div>
                </div>
              </div>

              <!-- text + CTA -->
              <div class="flex-1">
                <p class="mb-4 text-muted">Quick form — enter network, phone and amount. We handle the rest.</p>
                <ul class="list-inside space-y-2 text-muted mb-4">
                  <li class="flex items-start gap-3">
                    <UIcon name="i-lucide-check-circle" class="size-5 text-warning" />
                    <span>Supports Safaricom, Airtel, Telkom, Equitel & Faiba</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <UIcon name="i-lucide-clock" class="size-5 text-muted" />
                    <span>Instant delivery on successful payment</span>
                  </li>
                </ul>

                <div class="flex gap-3">
                  <UButton color="error" size="md" to="/airtime">Go to Airtime Form</UButton>
                  <UButton variant="outline" color="error" size="md" :to="{ hash: '#how-to-pay' }">How Paybill Works</UButton>
                </div>
              </div>
            </div>

            <template #footer>
              <div class="p-4 sm:px-6 text-sm text-muted">Have questions? <a class="underline text-error" href="/contact">Contact us</a></div>
            </template>
          </UCard>
        </div>
    </div>

      <!-- Optional: compact FAQ / quick tips -->
      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UCard variant="subtle" class="p-4">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-lock" class="size-5 text-muted" />
            <div>
              <h4 class="font-medium">Secure Payments</h4>
              <p class="text-sm text-muted">We never store your M-PESA PIN. All transactions are processed through trusted providers.</p>
            </div>
          </div>
        </UCard>

        <UCard variant="subtle" class="p-4">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-info" class="size-5 text-muted" />
            <div>
              <h4 class="font-medium">Need Help?</h4>
              <p class="text-sm text-muted">If airtime doesn't arrive, check your MPESA confirmation and contact support with the transaction ID.</p>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
</script>

<style scoped>
.phone-mockup{
  width: 220px;
  height: 440px;
  border-radius: 26px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02));
  border: 6px solid var(--ui-border);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.phone-screen{
  width: calc(100% - 28px);
  height: calc(100% - 40px);
  background: linear-gradient(180deg, var(--ui-bg-elevated), var(--ui-bg));
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}
.msg{
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  background-color: rgba(0,0,0,0.12);
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  animation: bubbleIn 1s ease forwards;
}
.msg-1{ animation-delay: 0.2s; background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); color: var(--ui-text); }
.msg-2{ animation-delay: 0.6s; background: linear-gradient(90deg, var(--ui-error), rgba(0,0,0,0.06)); }
.msg-3{ animation-delay: 1s; background: linear-gradient(90deg, rgba(0,0,0,0.06), rgba(255,255,255,0.02)); }

@keyframes bubbleIn{
  to{
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* small utility to ensure buttons in header/footer play nice with theme */
#how-to-pay a, #how-to-pay .link{ color: inherit }

/* Responsive tweaks */
@media (max-width: 640px){
  .phone-mockup{ width: 160px; height: 320px }
}
</style>
