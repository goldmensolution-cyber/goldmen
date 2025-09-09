<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () => queryCollection('help').all())
</script>

<template>
  <UBlogPosts :posts="posts" />
</template>
