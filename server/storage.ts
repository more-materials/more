import { db } from "./db";
import {
  departments,
  courses,
  classes,
  content,
  type InsertDepartment,
  type InsertCourse,
  type InsertClass,
  type InsertContent,
  type Department,
  type Course,
  type Class,
  type Content,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Departments
  getDepartments(): Promise<Department[]>;
  createDepartment(dept: InsertDepartment): Promise<Department>;
  deleteDepartment(id: number): Promise<void>;

  // Courses
  getCoursesByDepartment(departmentId?: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Classes
  getClassesByCourse(courseId?: number): Promise<Class[]>;
  createClass(cls: InsertClass): Promise<Class>;
  deleteClass(id: number): Promise<void>;

  // Content
  getContentByClass(classId?: number): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  createContent(item: InsertContent): Promise<Content>;
  deleteContent(id: number): Promise<void>;
  
  verifyContentPassword(id: number, password: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Departments
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments).orderBy(desc(departments.createdAt));
  }

  async createDepartment(dept: InsertDepartment): Promise<Department> {
    const [newDept] = await db.insert(departments).values(dept).returning();
    return newDept;
  }

  async deleteDepartment(id: number): Promise<void> {
    await db.delete(departments).where(eq(departments.id, id));
  }

  // Courses
  async getCoursesByDepartment(departmentId?: number): Promise<Course[]> {
    let query = db.select().from(courses);
    if (departmentId) {
      // @ts-ignore
      query = query.where(eq(courses.departmentId, departmentId));
    }
    return await query.orderBy(desc(courses.createdAt));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Classes
  async getClassesByCourse(courseId?: number): Promise<Class[]> {
    let query = db.select().from(classes);
    if (courseId) {
      // @ts-ignore
      query = query.where(eq(classes.courseId, courseId));
    }
    return await query.orderBy(desc(classes.createdAt));
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
      // @ts-ignore
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
    if (!item || !item.isLocked) return true;
    return item.password === password;
  }
}

export const storage = new DatabaseStorage();
