<!-- app/pages/admin/blog/index.vue -->
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

const toast = useToast()
const saving = ref(false)
const deletingId = ref<string | null>(null)
const editingId = ref<string | null>(null)

const editor = reactive({
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover: '',
  category: '',
  tags: '',
  published: false
})

const { data: posts, refresh, pending } = await useFetch<BlogPost[]>(
  '/api/admin/blog',
  {
    default: () => []
  }
)

function resetEditor() {
  editingId.value = null
  editor.slug = ''
  editor.title = ''
  editor.excerpt = ''
  editor.content = ''
  editor.cover = ''
  editor.category = ''
  editor.tags = ''
  editor.published = false
}

function startNew() {
  resetEditor()
}

function startEdit(post: BlogPost) {
  editingId.value = post.id
  editor.slug = post.slug
  editor.title = post.title
  editor.excerpt = post.excerpt ?? ''
  editor.content = post.content
  editor.cover = post.cover ?? ''
  editor.category = post.category ?? ''
  editor.tags = Array.isArray(post.tags) ? post.tags.join(', ') : ''
  editor.published = post.published
}

function normalizeTags(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

async function savePost() {
  saving.value = true

  try {
    const body = {
      slug: editor.slug.trim(),
      title: editor.title.trim(),
      excerpt: editor.excerpt.trim(),
      content: editor.content,
      cover: editor.cover.trim(),
      category: editor.category.trim(),
      tags: normalizeTags(editor.tags),
      published: editor.published
    }

    if (editingId.value) {
      await $fetch(`/api/admin/blog/${editingId.value}`, {
        method: 'PATCH',
        body
      })

      toast.add({
        title: 'Post updated',
        color: 'success',
        icon: 'i-lucide-check'
      })
    } else {
      await $fetch('/api/admin/blog', {
        method: 'POST',
        body
      })

      toast.add({
        title: 'Post created',
        color: 'success',
        icon: 'i-lucide-check'
      })
    }

    resetEditor()
    await refresh()
  } catch (error) {
    toast.add({
      title: 'Unable to save post',
      description: error instanceof Error ? error.message : 'Please try again.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  } finally {
    saving.value = false
  }
}

async function deletePost(post: BlogPost) {
  const confirmed = window.confirm(`Delete "${post.title}"?`)
  if (!confirmed) {
    return
  }

  deletingId.value = post.id

  try {
    await $fetch(`/api/admin/blog/${post.id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Post deleted',
      color: 'success',
      icon: 'i-lucide-trash-2'
    })

    if (editingId.value === post.id) {
      resetEditor()
    }

    await refresh()
  } catch (error) {
    toast.add({
      title: 'Unable to delete post',
      description: error instanceof Error ? error.message : 'Please try again.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="space-y-6 p-4 lg:p-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Blog admin</h1>
        <p class="text-sm text-muted">Create, update, and remove posts.</p>
      </div>

      <UButton color="error" variant="soft" @click="startNew">
        New post
      </UButton>
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold">
          {{ editingId ? 'Edit post' : 'New post' }}
        </h2>
      </template>

      <div class="grid gap-4 md:grid-cols-2">
        <UInput v-model="editor.slug" label="Slug" placeholder="my-post" />
        <UInput v-model="editor.title" label="Title" placeholder="Post title" />
        <UInput v-model="editor.category" label="Category" placeholder="guides" />
        <UInput v-model="editor.cover" label="Cover URL" placeholder="https://..." />
        <UInput v-model="editor.tags" label="Tags" placeholder="tag1, tag2" />
        <UCheckbox v-model="editor.published" label="Published" />
        <UTextarea
          v-model="editor.excerpt"
          label="Excerpt"
          placeholder="Short summary"
          class="md:col-span-2"
        />
        <UTextarea
          v-model="editor.content"
          label="Content"
          placeholder="Write the full post here"
          :rows="12"
          class="md:col-span-2"
        />
      </div>

      <div class="mt-4 flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          type="button"
          @click="resetEditor"
        >
          Clear
        </UButton>

        <UButton
          color="error"
          :loading="saving"
          @click="savePost"
        >
          {{ editingId ? 'Update post' : 'Save post' }}
        </UButton>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Existing posts</h2>
      </template>

      <div v-if="pending" class="py-10 text-center text-sm text-muted">
        Loading posts...
      </div>

      <div v-else class="grid gap-4">
        <UCard v-for="post in posts" :key="post.id">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-semibold">{{ post.title }}</h3>
                <UBadge :label="post.published ? 'Published' : 'Draft'" />
              </div>

              <p class="text-sm text-muted">{{ post.slug }}</p>

              <p v-if="post.excerpt" class="text-sm text-muted">
                {{ post.excerpt }}
              </p>
            </div>

            <div class="flex gap-2">
              <UButton
                color="neutral"
                variant="soft"
                size="sm"
                @click="startEdit(post)"
              >
                Edit
              </UButton>

              <UButton
                color="error"
                variant="soft"
                size="sm"
                :loading="deletingId === post.id"
                @click="deletePost(post)"
              >
                Delete
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>
