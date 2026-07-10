// server/api/admin/blog/[id].delete.ts
import { assertAdmin, getServiceSupabase } from '~~/server/utils/adminBlog'

export default defineEventHandler(async (event) => {
  await assertAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing post id' })
  }

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return { ok: true }
})