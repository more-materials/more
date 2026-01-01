import { z } from 'zod';
import { 
  insertDepartmentSchema, 
  insertCourseSchema, 
  insertClassSchema, 
  insertContentSchema, 
  departments, 
  courses, 
  classes, 
  content 
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  forbidden: z.object({
    message: z.string(),
  }),
};

export const api = {
  departments: {
    list: {
      method: 'GET' as const,
      path: '/api/departments',
      responses: {
        200: z.array(z.custom<typeof departments.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/departments',
      input: insertDepartmentSchema,
      responses: {
        201: z.custom<typeof departments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/departments/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses',
      input: z.object({
        departmentId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/courses',
      input: insertCourseSchema,
      responses: {
        201: z.custom<typeof courses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/courses/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  classes: {
    list: {
      method: 'GET' as const,
      path: '/api/classes',
      input: z.object({
        courseId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof classes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/classes',
      input: insertClassSchema,
      responses: {
        201: z.custom<typeof classes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/classes/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  content: {
    list: {
      method: 'GET' as const,
      path: '/api/content',
      input: z.object({
        classId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof content.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/content',
      input: insertContentSchema,
      responses: {
        201: z.custom<typeof content.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/content/:id',
      responses: {
        200: z.custom<typeof content.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/content/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    verify: {
      method: 'POST' as const,
      path: '/api/content/:id/verify',
      input: z.object({ password: z.string() }),
      responses: {
        200: z.object({ success: z.boolean(), url: z.string().optional() }),
        403: errorSchemas.forbidden,
      },
    },
  },
  subscription: {
    check: {
      method: 'POST' as const,
      path: '/api/subscription/check',
      input: z.object({
        email: z.string(),
        deviceId: z.string(),
      }),
      responses: {
        200: z.object({ access: z.boolean(), disabled: z.boolean().optional() }),
      },
    },
    initiate: {
      method: 'POST' as const,
      path: '/api/subscription/initiate',
      input: z.object({
        email: z.string(),
        deviceId: z.string(),
        planId: z.string(),
      }),
      responses: {
        200: z.object({ success: z.boolean(), checkoutUrl: z.string().optional() }),
      },
    },
    plans: {
      method: 'GET' as const,
      path: '/api/subscription/plans',
      responses: {
        200: z.array(z.object({ id: z.string(), name: z.string(), price: z.number() })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
