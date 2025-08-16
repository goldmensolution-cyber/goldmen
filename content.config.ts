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
      date: z.date().default(() => new Date()), // default to current date
      excerpt: z.string().optional(),
      author: z.string().default('Bonface Muthoni'), // default to main author
      tags: z.array(z.string()).optional(),
      cover: z.string().optional()
    })
  }),   
  }
})