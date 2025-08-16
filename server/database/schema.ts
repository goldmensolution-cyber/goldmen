import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
// Optimized M-Pesa transaction table
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  initiatorPhone: text('initiator_phone').notNull(), // phone to receive STK push
  recipientPhone: text('recipient_phone').notNull(), // phone to receive airtime
  amount: integer('amount').notNull(),
  reference: text('reference').notNull(), // AccountReference
  description: text('description').notNull(), // TransactionDesc
  status: text('status').notNull(), // PENDING, SUCCESS, FAILED
  merchantRequestId: text('merchant_request_id'),
  checkoutRequestId: text('checkout_request_id'),
  mpesaReceiptNumber: text('mpesa_receipt_number'),
  resultCode: integer('result_code'),
  resultDesc: text('result_desc'),
  transactionDate: integer('transaction_date', { mode: 'timestamp' }), // from callback
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  tags: text('tags').default(''), // comma-separated tags
  cover: text('cover').default(''), // optional cover image URL
  authorId: integer('author_id').notNull(), // foreign key to users table
  excerpt: text('excerpt').default(''),
  content: text('content').notNull(), // markdown source
  html: text('html').default('').notNull(), // optional rendered html snapshot
  published: integer('published').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})
