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
      <UPage>
    <UPageHeader :title="page.title" :description="page.description" />

    <UPageBody>
  <!-- Render the blog post as Prose & Vue components -->
  <ContentRenderer :value="post" />
    </UPageBody>

    <template #right>
      <UContentToc :links="page.body.toc.links" />
    </template>
  </UPage>
</template>
