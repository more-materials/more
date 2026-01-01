import { db } from "./db";
import {
  classes,
  content,
  type InsertClass,
  type InsertContent,
  type Class,
  type Content,
  type UpdateContentRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Classes
  getClasses(): Promise<Class[]>;
  createClass(cls: InsertClass): Promise<Class>;
  deleteClass(id: number): Promise<void>;

  // Content
  getContentByClass(classId?: number): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  createContent(item: InsertContent): Promise<Content>;
  deleteContent(id: number): Promise<void>;
  
  // Verify Password (Internal helper)
  verifyContentPassword(id: number, password: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Classes
  async getClasses(): Promise<Class[]> {
    return await db.select().from(classes).orderBy(desc(classes.createdAt));
  }

  async createClass(cls: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(cls).returning();
    return newClass;
  }

  async deleteClass(id: number): Promise<void> {
    await db.delete(classes).where(eq(classes.id, id));
  }

  // Content
  async getContentByClass(classId?: number): Promise<Content[]> {
    let query = db.select().from(content);
    if (classId) {
      // @ts-ignore - simple where clause
      query = query.where(eq(content.classId, classId));
    }
    return await query.orderBy(desc(content.createdAt));
  }

  async getContent(id: number): Promise<Content | undefined> {
    const [item] = await db.select().from(content).where(eq(content.id, id));
    return item;
  }

  async createContent(item: InsertContent): Promise<Content> {
    const [newContent] = await db.insert(content).values(item).returning();
    return newContent;
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(content).where(eq(content.id, id));
  }

  async verifyContentPassword(id: number, password: string): Promise<boolean> {
    const [item] = await db.select().from(content).where(eq(content.id, id));
    if (!item || !item.isLocked) return true; // If not locked, 'true' (accessible)
    return item.password === password;
  }
}

export const storage = new DatabaseStorage();
