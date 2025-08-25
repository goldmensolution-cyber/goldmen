<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () => queryCollection('blog').all())
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <UBlogPosts>
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            v-bind="post"
            :to="post.path"
            :image="post.cover"
          />
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
