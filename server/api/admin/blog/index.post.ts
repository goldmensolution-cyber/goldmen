// server/api/admin/blog/index.post.ts
import { readBody } from 'h3'
import { assertAdmin, getServiceSupabase, slugify } from '~~/server/utils/adminBlog'

export default defineEventHandler(async (event) => {
  const user = await assertAdmin(event)
  const body = await readBody(event)

  const title = String(body?.title ?? '').trim()
  const content = String(body?.content ?? '').trim()

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and content are required'
    })
  }

  const supabase = getServiceSupabase()
  const slugInput = String(body?.slug ?? '').trim()
  const slug = slugify(slugInput || title)

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      author_id: user.id,
      slug,
      title,
      excerpt: String(body?.excerpt ?? '').trim() || null,
      content,
      cover: String(body?.cover ?? '').trim() || null,
      category: String(body?.category ?? '').trim() || null,
      tags: Array.isArray(body?.tags) ? body.tags : [],
      published: Boolean(body?.published),
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
})