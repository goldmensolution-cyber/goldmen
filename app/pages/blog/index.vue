<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () => queryCollection('blog').all())
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <lazyUBlogPosts>
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            v-bind="post"
            :to="post.path"
            :image="post.cover"
          />
        </lazyUBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
