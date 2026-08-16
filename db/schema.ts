import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const classroomContent = sqliteTable("classroom_content", {
  id: integer("id").primaryKey(),
  contentJson: text("content_json").notNull(),
  updatedAt: text("updated_at").notNull(),
  updatedBy: text("updated_by").notNull(),
});

export const adminAccounts = sqliteTable("admin_accounts", {
  email: text("email").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  iterations: integer("iterations").notNull(),
  sessionVersion: integer("session_version").notNull().default(1),
  updatedAt: text("updated_at").notNull(),
});
