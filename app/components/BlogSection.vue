<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () => queryCollection('help').all())
</script>

<template>
<UBlogPosts>
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            v-bind="post"
            :to="post.path"
          />
  </UBlogPosts>
</template>
