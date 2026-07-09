<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover: string | null
  category: string | null
  tags: string[] | null
  published: boolean
  created_at: string
  updated_at: string
}

const supabase = useSupabaseClient()
const toast = useToast()

const form = reactive({
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover: '',
  category: '',
  tags: '',
  published: false
})

const { data: posts, refresh } = await useFetch<BlogPost[]>('/api/admin/blog', {
  default: () => []
})

async function createPost() {
  const { error } = await supabase.from('blog_posts').insert({
    slug: form.slug.trim(),
    title: form.title.trim(),
    excerpt: form.excerpt.trim() || null,
    content: form.content,
    cover: form.cover.trim() || null,
    category: form.category.trim() || null,
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    published: form.published
  })

  if (error) {
    toast.add({ title: 'Unable to save post', description: error.message, color: 'error' })
    return
  }

  toast.add({ title: 'Post saved', color: 'success' })
  await refresh()
}
</script>

<template>
  <div class="space-y-6 p-4 lg:p-6">
    <div>
      <h1 class="text-2xl font-semibold">Blog admin</h1>
      <p class="text-sm text-muted">Admin-only post management.</p>
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold">New post</h2>
      </template>

      <div class="grid gap-4 md:grid-cols-2">
        <UInput v-model="form.slug" placeholder="slug" label="Slug" />
        <UInput v-model="form.title" placeholder="Title" label="Title" />
        <UInput v-model="form.category" placeholder="Category" label="Category" />
        <UInput v-model="form.cover" placeholder="Cover URL" label="Cover" />
        <UInput v-model="form.tags" placeholder="tag1, tag2" label="Tags" />
        <UCheckbox v-model="form.published" label="Published" />
        <UTextarea v-model="form.excerpt" placeholder="Excerpt" class="md:col-span-2" />
        <UTextarea v-model="form.content" placeholder="Content" class="md:col-span-2" />
      </div>

      <div class="mt-4 flex justify-end">
        <UButton color="error" @click="createPost">Save post</UButton>
      </div>
    </UCard>

    <div class="grid gap-4">
      <UCard v-for="post in posts" :key="post.id">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold">{{ post.title }}</h3>
            <p class="text-sm text-muted">{{ post.slug }}</p>
          </div>
          <UBadge :label="post.published ? 'Published' : 'Draft'" />
        </div>
      </UCard>
    </div>
  </div>
</template>
