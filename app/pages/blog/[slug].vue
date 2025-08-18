<template>
  <UContainer class="py-12">
    <article v-if="post" class="prose prose-gray max-w-3xl mx-auto">
      <h1>{{ post.title }}</h1>

      <div class="flex items-center justify-between text-sm text-gray-500 mt-2">
        <div v-if="post.tags?.length" class="space-x-2">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            size="xs"
            variant="subtle"
            class="capitalize"
          >
            {{ tag }}
          </UBadge>
        </div>
      </div>

      <img
        v-if="post.cover"
        :src="post.cover"
        :alt="post.title"
        class="my-6 rounded-xl shadow"
      />

      <ContentRenderer :value="post" />
    </article>

    <div v-else class="text-center py-24 text-gray-400">
      <p>Post not found.</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const slug = useRoute().params.slug
const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection('blog').path(`/blog/${slug}`).first()
})

// const formatDate = (date: string) =>
//   new Date(date).toLocaleDateString(undefined, {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   })
</script>