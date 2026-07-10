// server/api/admin/blog/[id].patch.ts
import { readBody } from 'h3'
import { assertAdmin, getServiceSupabase, slugify } from '~~/server/utils/adminBlog'

export default defineEventHandler(async (event) => {
  await assertAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing post id' })
  }

  const supabase = getServiceSupabase()
  const title = String(body?.title ?? '').trim()
  const content = String(body?.content ?? '').trim()

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and content are required'
    })
  }

  const slugInput = String(body?.slug ?? '').trim()
  const slug = slugify(slugInput || title)

  const { data, error } = await supabase
    .from('blog_posts')
    .update({
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
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
})