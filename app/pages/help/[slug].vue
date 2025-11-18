<script setup lang="ts">
import { format } from 'date-fns'

const route = useRoute()

// Fetch the current page by path
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('help').path(route.path).first()
)

// 404 if not found
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

// Prev/next surroundings
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('help', route.path, { fields: ['title', 'path'] })
)

// SEO
useSeoMeta({
  title: `${page.value.title} — Goldmen Blog`,
  description: page.value.excerpt || undefined,
  ogTitle: page.value.title,
  ogDescription: page.value.excerpt || undefined,
  ogImage: page.value.image || undefined,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UPage v-if="page" >
    <UPageHeader
      :title="page.title"
      :description="page.excerpt"
    >
      <template #bottom>
        <div class="flex flex-wrap items-center gap-3 text-sm text-muted">
          <UBadge v-if="page.category" color="primary" variant="subtle" class="capitalize">
            {{ page.category }}
          </UBadge>

          <span class="inline-flex items-center gap-1">
            <UIcon name="i-lucide-calendar" />
            {{ page.date ? format(new Date(page.date), 'PPP') : '' }}
          </span>

          <span  class="inline-flex items-center gap-1">
            <UIcon name="i-lucide-user" />
            by staff
          </span>

          <!-- <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="t in page.badge || []"
              :key="t"
              color="neutral"
              variant="outline"
              class="text-xs"
            >
              #{{ t }}
            </UBadge>
          </div> -->
        </div>
      </template>
    </UPageHeader>

    <UPageBody>
      <!-- Main content -->
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator v-if="(surround || []).filter(Boolean).length" class="my-8" />
      <UContentSurround :surround="(surround as any)" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links" />
      
    </template>
    <template v-else #right>
      <p>.</p>
    </template>
    <template #left>
      <p>.</p>
    </template>
  </UPage>
</template>