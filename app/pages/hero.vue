<template>
  <main class="min-h-screen px-6 py-12 md:py-24 max-w-6xl mx-auto">
    <!-- HERO -->
    <section class="flex flex-col-reverse md:flex-row items-center gap-10">
      <div class="w-full md:w-1/2">
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-4" v-bind:class="{'animate-entrance': true}">
          Buy airtime in seconds — simple, secure, reliable
        </h1>
        <p class="text-lg md:text-xl leading-relaxed text-muted-foreground mb-6">
          Use your preferred network, keep your current tables and data model — we connect to your edge function for instant STK push payments.
        </p>

        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/buy" class="btn-primary inline-flex items-center gap-2 py-3 px-5 rounded-lg shadow-sm">
            Buy Airtime
            <span aria-hidden>→</span>
          </NuxtLink>

          <a href="#steps" class="btn-outline inline-flex items-center gap-2 py-3 px-5 rounded-lg">
            How it works
          </a>
        </div>

        <!-- Provider logos grid (keeps existing color scheme) -->
        <div class="mt-8">
          <p class="text-sm text-muted-foreground mb-2">Supported networks</p>
          <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 items-center">
            <img src="/images/safaricom.png" alt="Safaricom" class="logo opacity-90" />
            <img src="/images/airtel.jpg" alt="Airtel" class="logo opacity-90" />
            <img src="/images/telkom.png" alt="Telkom" class="logo opacity-90" />
            <img src="/images/equitel.jpg" alt="Easy" class="logo opacity-90" />
            <!-- add more logos as you like (don't change colors) -->
          </div>
        </div>
      </div>

      <div class="w-full md:w-1/2 flex justify-center">
        <div
          class="w-full max-w-lg rounded-2xl p-1 shadow-lg transform transition-all duration-600 hover:scale-[1.02]"
          role="img"
          aria-label="App preview"
        >
          <div class="bg-card rounded-2xl overflow-hidden">
            <!-- A responsive showreel / demo video thumbnail - plays in modal -->
            <button
              class="w-full h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-transparent to-transparent"
              @click="openModal('https://www.youtube.com/embed/dQw4w9WgXcQ')"
              aria-haspopup="dialog"
            >
              <div class="relative w-full h-full">
                <img src="/pic.jpeg" alt="app preview" class="object-cover w-full h-full" />
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="play-button" aria-hidden>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M5 3v18l15-9L5 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- STEPS -->
    <section id="steps" class="mt-16">
      <h2 class="text-2xl font-semibold mb-6">How it works</h2>

      <div class="grid gap-6 md:grid-cols-3">
        <article v-for="(step, i) in steps" :key="i" class="step-card p-6 rounded-xl shadow-sm" :data-index="i" ref="stepCards">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 flex items-center justify-center rounded-full border" :aria-hidden="true">
              <strong class="text-lg">{{ i + 1 }}</strong>
            </div>
            <h3 class="text-lg font-medium">{{ step.title }}</h3>
          </div>
          <p class="text-sm text-muted-foreground">{{ step.body }}</p>
        </article>
      </div>
    </section>

    <!-- VIDEOS -->
    <section class="mt-16">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold">Short demos</h2>
        <p class="text-sm text-muted-foreground">Click a card to watch. Videos open in a focused modal.</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div
          v-for="(video, ) in videos"
          :key="video.id"
          class="video-card rounded-lg overflow-hidden cursor-pointer shadow hover:shadow-md transform transition-all duration-300"
          @click="openModal(video.src)"
          role="button"
          :aria-label="`Open video ${video.title}`"
        >
          <div class="relative h-44">
            <img :src="video.thumb" :alt="video.title" class="object-cover w-full h-full" />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="play-overlay" aria-hidden>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M5 3v18l15-9L5 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="p-3">
            <h4 class="text-sm font-medium">{{ video.title }}</h4>
            <p class="text-xs text-muted-foreground truncate">{{ video.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL -->
    <transition name="modal-fade">
      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60" @click="closeModal" aria-hidden></div>

        <div class="relative w-full max-w-4xl rounded-lg overflow-hidden bg-background shadow-xl">
          <button class="absolute top-3 right-3 z-10 p-2 rounded-md focus:outline-none" @click="closeModal" aria-label="Close video">
            ✕
          </button>

          <div class="aspect-video">
            <iframe
              v-if="modalSrc"
              :src="modalSrc"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              class="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const modalOpen = ref(false);
const modalSrc = ref(null);

function openModal(url) {
  // If youtube link, ensure embed format
  if (url.includes('youtube.com') && !url.includes('embed')) {
    const idMatch = url.match(/v=([a-zA-Z0-9_-]+)/);
    if (idMatch) url = `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1`;
  } else if (url.includes('youtu.be')) {
    const id = url.split('/').pop();
    url = `https://www.youtube.com/embed/${id}?autoplay=1`;
  }

  modalSrc.value = url;
  modalOpen.value = true;
  // lock scrolling
  document.documentElement.style.overflow = 'hidden';
}

function closeModal() {
  modalOpen.value = false;
  modalSrc.value = null;
  document.documentElement.style.overflow = '';
}

// Step cards content (easy to override from markdown / Nuxt Content later)
const steps = [
  {
    title: 'Enter number & amount',
    body: 'A simple single form accepts any valid number. We auto-normalize numbers starting with 07 or 01 to your country format.',
  },
  {
    title: 'Confirm & pay (STK Push)',
    body: "We trigger an STK Push via your edge function and record the transaction in your existing tables — no schema changes needed.",
  },
  {
    title: 'Immediate delivery',
    body: 'The recipient gets airtime instantly. You can view full transaction metadata in the dashboard logs.',
  },
];

const videos = [
  {
    id: 'demo-1',
    title: 'Quick demo: Buy airtime',
    desc: 'A short walkthrough of purchasing airtime using the short form.',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    thumb: '/assets/video-thumb-1.jpg',
  },
  {
    id: 'demo-2',
    title: 'Managing transactions',
    desc: 'How to inspect logs and reconcile payments in the dashboard.',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    thumb: '/assets/video-thumb-2.jpg',
  },
  {
    id: 'demo-3',
    title: 'Integrate edge functions',
    desc: 'Connect your existing STK push edge function (example with Supabase / Cloudflare Workers).',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    thumb: '/assets/video-thumb-3.jpg',
  },
];

// Simple scroll animation using IntersectionObserver
let observer;
const stepCards = ref([]);

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.18 });

  // gather cards
  stepCards.value = Array.from(document.querySelectorAll('.step-card'));
  stepCards.value.forEach((el, i) => {
    // staggered animation delay
    el.style.setProperty('--delay', `${i * 80}ms`);
    observer.observe(el);
  });
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* Keep the project's color tokens — avoid hard-coded color changes */

.logo { max-height: 40px; object-fit: contain; }

.play-button {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  border-radius: 9999px;
  background: rgba(255,255,255,0.9);
  box-shadow: 0 6px 18px rgba(0,0,0,0.14);
}

.play-overlay {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 9999px;
  background: rgba(255,255,255,0.95);
}

/* Step card animation */
.step-card {
  opacity: 0;
  transform: translateY(18px) scale(0.995);
  transition: opacity 420ms var(--easing, cubic-bezier(.2,.9,.2,1)), transform 420ms var(--easing);
  transition-delay: var(--delay, 0ms);
}
.step-card.in-view {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 240ms ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Hero entrance */
@keyframes entrance {
  from { opacity: 0; transform: translateY(8px) scale(.998); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-entrance { animation: entrance 560ms cubic-bezier(.2,.9,.2,1) both; }

/* small responsive tweaks */
@media (max-width: 640px) {
  .play-button { width: 56px; height: 56px; }
}
</style>
