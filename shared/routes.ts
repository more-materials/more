import { z } from 'zod';
import { departments, courses, classes, content } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  forbidden: z.object({ message: z.string() }),
};

export const api = {
  departments: {
    list: { method: 'GET' as const, path: '/api/departments', responses: { 200: z.array(z.custom<typeof departments.$inferSelect>()) } },
    create: { method: 'POST' as const, path: '/api/departments', input: z.object({ name: z.string() }), responses: { 201: z.custom<typeof departments.$inferSelect>(), 400: errorSchemas.validation } },
    delete: { method: 'DELETE' as const, path: '/api/departments/:id', responses: { 204: z.void() } },
  },
  courses: {
    list: { method: 'GET' as const, path: '/api/courses', responses: { 200: z.array(z.custom<typeof courses.$inferSelect>()) } },
    create: { method: 'POST' as const, path: '/api/courses', input: z.object({ name: z.string(), departmentId: z.number() }), responses: { 201: z.custom<typeof courses.$inferSelect>(), 400: errorSchemas.validation } },
    delete: { method: 'DELETE' as const, path: '/api/courses/:id', responses: { 204: z.void() } },
  },
  classes: {
    list: { method: 'GET' as const, path: '/api/classes', responses: { 200: z.array(z.custom<typeof classes.$inferSelect>()) } },
    create: { method: 'POST' as const, path: '/api/classes', input: z.object({ name: z.string(), courseId: z.number() }), responses: { 201: z.custom<typeof classes.$inferSelect>(), 400: errorSchemas.validation } },
    delete: { method: 'DELETE' as const, path: '/api/classes/:id', responses: { 204: z.void() } },
  },
  content: {
    list: { method: 'GET' as const, path: '/api/content', responses: { 200: z.array(z.custom<typeof content.$inferSelect>()) } },
    create: { method: 'POST' as const, path: '/api/content', input: z.object({ classId: z.number(), title: z.string(), description: z.string().optional(), type: z.string(), url: z.string(), isLocked: z.boolean().optional(), password: z.string().optional() }), responses: { 201: z.custom<typeof content.$inferSelect>(), 400: errorSchemas.validation } },
    verify: { method: 'POST' as const, path: '/api/content/:id/verify', input: z.object({ password: z.string() }), responses: { 200: z.object({ success: z.boolean(), url: z.string().optional() }) } },
    delete: { method: 'DELETE' as const, path: '/api/content/:id', responses: { 204: z.void() } },
  },
  subscription: {
    check: { method: 'POST' as const, path: '/api/subscription/check', input: z.object({ email: z.string(), deviceId: z.string() }), responses: { 200: z.object({ access: z.boolean(), disabled: z.boolean().optional() }) } },
    initiate: { method: 'POST' as const, path: '/api/subscription/initiate', input: z.object({ email: z.string(), deviceId: z.string(), planId: z.string() }), responses: { 200: z.object({ success: z.boolean(), checkoutUrl: z.string().optional() }) } },
    plans: { method: 'GET' as const, path: '/api/subscription/plans', responses: { 200: z.array(z.any()) } },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) Object.entries(params).forEach(([key, value]) => { if (url.includes(`:${key}`)) url = url.replace(`:${key}`, String(value)); });
  return url;
}
