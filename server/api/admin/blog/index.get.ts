// server/api/admin/blog/index.get.ts
import { assertAdmin, getServiceSupabase } from '~/server/utils/adminBlog'

export default defineEventHandler(async (event) => {
  await assertAdmin(event)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
})
