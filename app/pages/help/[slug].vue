<script setup>
const slug = useRoute().params.slug
const { data: post } = await useAsyncData(`help-${slug}`, () => {
  return queryCollection('help').path(`/help/${slug}`).first()
})
definePageMeta({
  layout: 'blogpage'
})
</script>

<template>
  <!-- Render the blog post as Prose & Vue components -->
  <ContentRenderer :value="post" />
</template>
