<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// UI
const pageSize = 9
const page = computed(() => Math.max(1, Number(route.query.page || 1)))
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const category = computed(() => (typeof route.query.category === 'string' ? route.query.category : ''))

// Build count query (for pagination)
const { data: total } = await useAsyncData(
  () => `blog-count-${category.value}-${q.value}`,
  () => {
    let qb = queryCollection('blog')
    if (category.value) qb = qb.where('category', '=', category.value)
    if (q.value) {
      qb = qb.andWhere((g) =>
        g.where('title', 'LIKE', `%${q.value}%`)
         .orWhere((g2) => g2.where('excerpt', 'LIKE', `%${q.value}%`))
      )
    }
    return qb.count()
  },
  { watch: [category, q] }
)

// Fetch paginated posts
type BlogCard = {
  title: string
  path: string
  date?: string
  excerpt?: string
  tags?: string[]
  cover?: string
  author?: string
  category?: string
}

const { data: posts } = await useAsyncData(
  () => `blog-page-${category.value}-${q.value}-${page.value}`,
  () => {
    let qb = queryCollection('blog')
      .select('title', 'path', 'date', 'excerpt', 'tags', 'cover', 'author', 'category')
      .order('date', 'DESC')

    if (category.value) qb = qb.where('category', '=', category.value)
    if (q.value) {
      qb = qb.andWhere((g) =>
        g.where('title', 'LIKE', `%${q.value}%`)
         .orWhere((g2) => g2.where('excerpt', 'LIKE', `%${q.value}%`))
      )
    }

    return qb.skip((page.value - 1) * pageSize).limit(pageSize).all() as Promise<BlogCard[]>
  },
  { watch: [category, q, page] }
)

// Build category options dynamically from all posts having category
const { data: categories } = await useAsyncData('blog-categories', async () => {
  const rows = await queryCollection('blog').select('category').all()
  const set = new Set((rows as any[]).map(r => r.category).filter(Boolean))
  return Array.from(set).sort() as string[]
})

// Update query helper
function updateQuery(next: Record<string, any>) {
  router.replace({ query: { ...route.query, ...next, page: next.page ?? 1 } })
}

const totalPages = computed(() => Math.max(1, Math.ceil((total.value || 0) / pageSize)))

// Basic SEO for the index
useSeoMeta({
  title: 'Blog — Goldmen (Airtime, M‑Pesa & Tech Guides)',
  description: 'Discover practical guides about airtime purchases, Safaricom M‑Pesa tips, AI, and Kenyan mobile topics.',
  ogTitle: 'Blog — Goldmen',
  ogDescription: 'Practical guides for airtime, M‑Pesa, AI & Kenyan mobile.',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UPage>
    <!-- Hero like 30secondsofcode -->
    <UPageHeader
      title="Discover helpful guides to level up your mobile life"
      description="Tech, AI, Safaricom, and airtime tutorials "
    >
      <div class="mt-4 grid gap-3 sm:flex">
        <UInput
          :model-value="q"
          icon="i-lucide-search"
          placeholder="Search articles (e.g. M‑Pesa, airtime, Safaricom)..."
          @update:model-value="val => updateQuery({ q: val })"
        />
        <USelectMenu
          :model-value="category || undefined"
          :items="[ 'All', ...(categories || []) ]"
          placeholder="All categories"
          class="sm:w-60"
          @update:model-value="val => updateQuery({ category: val === 'All' ? undefined : val })"
        />
      </div>
    </UPageHeader>

    <UPageSection :ui="{ container: 'px-0 sm:px-6' }" class="pt-0">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="post in posts || []" :key="post.path" :to="post.path">
          <div class="h-full transition hover:translate-y-[-2px] hover:shadow-lg p-0">
            <div class="flex flex-col gap-2">
              <div v-if="post.cover" class="aspect-[16/9] overflow-hidden rounded-lg">
                <NuxtImg :src="post.cover" alt="" class="h-full w-full object-cover" />
              </div>
              <div class="flex items-center gap-2">
                <UBadge v-if="post.category" color="primary" variant="subtle" class="capitalize">
                  {{ post.category }}
                </UBadge>
                <span class="text-xs text-muted flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" />
                  {{ new Date(post.date || '').toLocaleDateString() }}
                </span>
              </div>
              <h3 class="text-base font-semibold leading-6">
                {{ post.title }}
              </h3>
              <p class="text-sm text-muted line-clamp-3">{{ post.excerpt }}</p>

              <div class="mt-2 flex flex-wrap gap-2">
                <UBadge
                  v-for="t in (post.tags || []).slice(0, 3)"
                  :key="t"
                  color="neutral"
                  variant="subtle"
                  class="text-xs"
                >
                  #{{ t }}
                </UBadge>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-8 flex justify-center">
        <UPagination
          v-model:page="(page as any)"
          :total="total || 0 || totalPages"
          :items-per-page="pageSize"
          :to="(p: number) => ({ query: { ...route.query, page: p } })"
          show-edges
        />
      </div>
    </UPageSection>
  </UPage>
</template>