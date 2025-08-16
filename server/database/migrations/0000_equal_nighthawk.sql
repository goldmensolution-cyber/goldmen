CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`tags` text DEFAULT '',
	`cover` text DEFAULT '',
	`author_id` integer NOT NULL,
	`excerpt` text DEFAULT '',
	`content` text NOT NULL,
	`html` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`initiator_phone` text NOT NULL,
	`recipient_phone` text NOT NULL,
	`amount` integer NOT NULL,
	`reference` text NOT NULL,
	`description` text NOT NULL,
	`status` text NOT NULL,
	`merchant_request_id` text,
	`checkout_request_id` text,
	`mpesa_receipt_number` text,
	`result_code` integer,
	`result_desc` text,
	`transaction_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`avatar` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);