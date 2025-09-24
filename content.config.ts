// content.config.ts
import { defineCollection,  defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
 // collection key -> 'blog'
  blog: defineCollection({
    type: 'page', // use 'page' so each item is a markdown file in content/blog/*.md
    source: 'blog/*.md', // source directory for this collection
    schema: z.object({
      title: z.string(),
      slug: z.string().min(1).max(100), // slug must be a string between 1 and 100 characters
      date: z.string().datetime(), // date must be a valid datetime string
      excerpt: z.string().optional(),
      author: z.string().default('Bonface Muthoni'), // default to main author
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      cover: z.string().optional()
    })
  }), 
  help: defineCollection({
    type: 'page',
    source: 'help/*.md',
    schema: z.object({
      title: z.string(),
      slug: z.string().min(1).max(100),
      image: z.string(),
      date: z.string().datetime(),
      excerpt: z.string().optional(),
      category: z.string().optional(),

  })
  }),
}
})