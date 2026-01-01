import { pgTable, text, serial, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS (Mirroring Firestore Structure for now) ===

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(), // Foreign key to classes (logically)
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'past_paper', 'notes', 'book', 'fqe'
  url: text("url").notNull(),
  isLocked: boolean("is_locked").default(false),
  password: text("password"), // Only set if isLocked is true
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users (for local auth fallback or metadata)
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertClassSchema = createInsertSchema(classes).omit({ id: true, createdAt: true });
export const insertContentSchema = createInsertSchema(content).omit({ id: true, createdAt: true });

// === EXPLICIT TYPES ===

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

// Request Types
export type CreateClassRequest = InsertClass;
export type CreateContentRequest = InsertContent;
export type UpdateContentRequest = Partial<InsertContent>;

export type VerifyPasswordRequest = {
  contentId: number;
  password: string;
};

// Response Types
export type ContentResponse = Omit<Content, "password"> & { hasPassword: boolean };

// ZetuBridge Response Type
export type SubscriptionStatus = {
  access: boolean;
  disabled?: boolean;
};
