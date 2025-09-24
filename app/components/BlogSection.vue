<script setup lang="ts">

const { data: posts } = await useAsyncData('posts', () => queryCollection('help').all())
</script>

<template>
<UPageSection :ui="{ container: 'px-0 sm:px-6 text-error' }" class="pt-0">
  <UPageHeader class="p-0 px-0 text-error m-0 " title="Help and Tutorials" description="How to use our services"/>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="post in posts || []" :key="post.path" :to="post.path">
          <div class="h-full transition hover:translate-y-[-2px] hover:shadow-lg p-0">
            <div class="flex flex-col gap-2">
              <div v-if="post.image" class="aspect-[16/9] overflow-hidden rounded-lg">
                <NuxtImg :src="post.image" alt="" class="h-full w-full object-cover" />
              </div>
              <div class="flex items-center gap-2">
                <UBadge v-if="post.category" color="primary" variant="subtle" class="capitalize">
                  {{ post.category || 'help' }}
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

              
            </div>
          </div>
        </NuxtLink>
      </div>
    </UPageSection>
</template>
