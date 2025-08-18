<script setup >

const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())


</script>

<template>
  <UCard class=" mx-auto p-4">

    <template #header>
      <h1 class="text-3xl font-bold">Blog</h1>
      <p class="text-gray-600">Latest posts and updates</p>
    </template>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="post in posts" :key="post.id" :ui="{header:'p-0 md:p-0'}" class="shadow-lg">
        <template #header>
          <img :src="post.image_url" alt="Post Image" class="w-full h-48 object-cover rounded-t-lg ">
          <h2 class="text-xl bg-transparent font-semibold">{{ post.title }}</h2>
          <!-- tags -->
          <div class="flex flex-wrap gap-2 mt-2">
            <UBadge
              v-for="tag in post.tags"
              :key="tag"
              :label="tag"
              color="secondary"
              variant="subtle"
              class="text-xs px-2 py-1 rounded"
            />
          </div>
        </template>
        <p class="text-gray-700">{{ post.description }}</p>
        <UButton
          variant="ghost"
          trailing-icon="i-heroicons-arrow-right-solid"
          color="secondary"
          :href="`/blog/${post.slug}`"
          class="mt-2"
          label="Read More"
        />
      </UCard>
    </div>
    
  </UCard>

</template>