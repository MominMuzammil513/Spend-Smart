// @/drizzle/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, real, index } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  email: text("email").notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'), // Soft delete field
},
//  (table) => {
//   return {
//     emailIndex: index("email_idx").on(table.email),
//     usernameIndex: index("username_idx").on(table.username),
//   };
// }
);

export const accountTypes = pgTable('account_types', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(), // e.g., 'card', 'UPI', 'account'
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'), // Soft delete field
}, (table) => {
  return {
    nameIndex: index("account_type_name_idx").on(table.name),
  };
});

export const categories = pgTable('categories', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(), // 'income' or 'expense'
  type: text('type').notNull(), // 'income' or 'expense'
  userId: text('user_id').notNull().references(() => users.id), // Foreign key to users table
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'), // Soft delete field
}, (table) => {
  return {
    userIdIndex: index("categories_user_id_idx").on(table.userId),
  };
});

export const transactions = pgTable('transactions', {
  id: text('id').notNull().primaryKey(),
  type: text('type').notNull(), // 'income' or 'expense'
  date: text('date').notNull(),
  amount: real('amount').notNull(),
  account: text('account').notNull(), // Add account field
  category: text('category').notNull(),  // Direct reference to category name
  note: text('note').notNull(),
  description: text('description').notNull(), // New field for transaction description
  bookmarked: text('bookmarked').notNull().default('false'), // New field for bookmarking
  userId: text('user_id').notNull().references(() => users.id), // Foreign key to users table
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'), // Soft delete field
}, (table) => {
  return {
    userIdIndex: index("transactions_user_id_idx").on(table.userId),
    categoryIndex: index("category_idx").on(table.category),
    accountIndex: index("account_idx").on(table.account), // Index for account field
  };
});

export const budgets = pgTable('budgets', {
  id: text('id').notNull().primaryKey(),
  category: text('category').notNull(), // Name of the budget (e.g., 'Monthly Budget')
  amount: real('amount').notNull(), // Total budget amount
  userId: text('user_id').notNull().references(() => users.id), // Foreign key to users table
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'), // Soft delete field
}, (table) => {
  return {
    userIdIndex: index("budgets_user_id_idx").on(table.userId),
  };
});

export const notes = pgTable('notes', {
  id: text('id').notNull().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  color: text('color').notNull(),
  category: text('category').notNull(),
  tags: text('tags').notNull(), // Store tags as a comma-separated string
  liked: text('liked').notNull().default('false'), // Store as 'true' or 'false'
  pinned: text('pinned').notNull().default('false'), // Store as 'true' or 'false'
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  userId: text('user_id').notNull().references(() => users.id), // Foreign key to users table
}, (table) => {
  return {
    userIdIndex: index("notes_user_id_idx").on(table.userId),
  };
});