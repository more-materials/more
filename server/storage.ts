import { db } from "./db";
import {
  departments, courses, classes, content,
  type Department, type Course, type Class, type Content,
  type InsertDepartment, type InsertCourse, type InsertClass, type InsertContent
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getDepartments(): Promise<Department[]>;
  createDepartment(dept: InsertDepartment): Promise<Department>;
  deleteDepartment(id: number): Promise<void>;

  getCourses(deptId?: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  getClasses(courseId?: number): Promise<Class[]>;
  createClass(cls: InsertClass): Promise<Class>;
  deleteClass(id: number): Promise<void>;

  getContent(classId?: number): Promise<Content[]>;
  getContentById(id: number): Promise<Content | undefined>;
  createContent(item: InsertContent): Promise<Content>;
  deleteContent(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getDepartments() { return await db.select().from(departments).orderBy(desc(departments.createdAt)); }
  async createDepartment(dept: InsertDepartment) { const [d] = await db.insert(departments).values(dept).returning(); return d; }
  async deleteDepartment(id: number) { await db.delete(departments).where(eq(departments.id, id)); }

  async getCourses(deptId?: number) {
    const q = db.select().from(courses);
    return deptId ? await q.where(eq(courses.departmentId, deptId)) : await q;
  }
  async createCourse(course: InsertCourse) { const [c] = await db.insert(courses).values(course).returning(); return c; }
  async deleteCourse(id: number) { await db.delete(courses).where(eq(courses.id, id)); }

  async getClasses(courseId?: number) {
    const q = db.select().from(classes);
    return courseId ? await q.where(eq(classes.courseId, courseId)) : await q;
  }
  async createClass(cls: InsertClass) { const [c] = await db.insert(classes).values(cls).returning(); return c; }
  async deleteClass(id: number) { await db.delete(classes).where(eq(classes.id, id)); }

  async getContent(classId?: number) {
    const q = db.select().from(content);
    return classId ? await q.where(eq(content.classId, classId)) : await q;
  }
  async getContentById(id: number) { const [i] = await db.select().from(content).where(eq(content.id, id)); return i; }
  async createContent(item: InsertContent) { const [i] = await db.insert(content).values(item).returning(); return i; }
  async deleteContent(id: number) { await db.delete(content).where(eq(content.id, id)); }
}

export const storage = new DatabaseStorage();
