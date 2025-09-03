// // src/db/schema.ts
// import { pgTable, serial, text, integer, timestamp, boolean, jsonb, uuid } from 'drizzle-orm/pg-core';
// import { sql } from 'drizzle-orm';

// export const profiles = pgTable('profiles', {
//   userId: uuid('user_id').primaryKey(),
//   fullName: text('full_name'),
//   email: text('email'),
//   phone: text('phone'),
//   phoneVerifiedAt: timestamp('phone_verified_at'),
//   role: text('role').default('user'),
//   avatarUrl: text('avatar_url'),
//   metadata: jsonb('metadata').$default(sql`'{}'::jsonb`),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

// export const transactions = pgTable('transactions', {
//   id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
//   userId: uuid('user_id').references(() => profiles.userId),
//   initiatorPhone: text('initiator_phone').notNull(),
//   recipientPhone: text('recipient_phone').notNull(),
//   amount: integer('amount_integer').notNull(),
//   currency: text('currency').notNull().default('KES'),
//   network: text('network').notNull(),
//   provider: text('provider').notNull(),
//   reference: text('reference'),
//   description: text('description'),
//   status: text('status').notNull().default('pending'),
//   merchantRequestId: text('merchant_request_id'),
//   checkoutRequestId: text('checkout_request_id').unique(),
//   mpesaReceipt: text('mpesa_receipt'),
//   resultCode: integer('result_code'),
//   resultDesc: text('result_desc'),
//   transactionDate: timestamp('transaction_date'),
//   kyandaTransactionRef: text('kyanda_transaction_ref'),
//   kyandaStatusCode: text('kyanda_status_code'),
//   kyandaMessage: text('kyanda_message'),
//   telcoReference: text('telco_reference'),
//   billerReceipt: text('biller_receipt'),
//   meta: jsonb('meta').$default(sql`'{}'::jsonb`),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

// export const rawCallbacks = pgTable('raw_callbacks', {
//   id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
//   provider: text('provider').notNull(),
//   receivedAt: timestamp('received_at').defaultNow(),
//   httpHeaders: jsonb('http_headers'),
//   body: jsonb('body'),
//   idempotencyKey: text('idempotency_key'),
//   transactionId: uuid('transaction_id').references(() => transactions.id),
//   processed: boolean('processed').default(false),
// });

// export const providers = pgTable('providers', {
//   id: text('id').primaryKey(),
//   kind: text('kind').notNull(),
//   enabled: boolean('enabled').default(true),
//   config: jsonb('config').$default(sql`'{}'::jsonb`),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

// export const auditLog = pgTable('audit_log', {
//   id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
//   actor: uuid('actor').references(() => profiles.userId),
//   action: text('action').notNull(),
//   meta: jsonb('meta').$default(sql`'{}'::jsonb`),
//   createdAt: timestamp('created_at').defaultNow(),
// });

// export const jobs = pgTable('jobs', {
//   id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
//   jobType: text('job_type').notNull(),
//   payload: jsonb('payload').notNull(),
//   attempts: integer('attempts').default(0),
//   nextRun: timestamp('next_run').defaultNow(),
//   createdAt: timestamp('created_at').defaultNow(),
// });
