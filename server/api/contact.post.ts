import { z } from 'zod'
import type { H3Event } from 'h3'

// filepath: server/api/contact.post.ts


const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(9).max(15).optional().or(z.literal('')),
    subject: z.string().min(3),
    message: z.string().min(10),
    consent: z.boolean().refine(v => v === true)
})

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody(event)
    const result = schema.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation failed',
            data: result.error.flatten()
        })
    }

    // Example: log or send email (replace with your logic)
    // await sendEmail(result.data) // implement this as needed

    return {
        success: true,
        message: 'Your message has been received. We will contact you soon.'
    }
})