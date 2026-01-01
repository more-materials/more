import { pgTable, text, serial, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'past_paper', 'notes', 'book', 'fqe'
  url: text("url").notNull(),
  isLocked: boolean("is_locked").default(false),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true, createdAt: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export const insertClassSchema = createInsertSchema(classes).omit({ id: true, createdAt: true });
export const insertContentSchema = createInsertSchema(content).omit({ id: true, createdAt: true });

// === EXPLICIT TYPES ===

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

// Request Types
export type CreateDepartmentRequest = InsertDepartment;
export type CreateCourseRequest = InsertCourse;
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
