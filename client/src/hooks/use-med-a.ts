import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertClass, type InsertContent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// ==========================================
// CLASSES
// ==========================================

export function useClasses() {
  return useQuery({
    queryKey: [api.classes.list.path],
    queryFn: async () => {
      const res = await fetch(api.classes.list.path);
      if (!res.ok) throw new Error("Failed to fetch classes");
      return api.classes.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertClass) => {
      const res = await fetch(api.classes.create.path, {
        method: api.classes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create class");
      return api.classes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.classes.list.path] });
      toast({ title: "Success", description: "Class created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.classes.delete.path, { id });
      const res = await fetch(url, { method: api.classes.delete.method });
      if (!res.ok) throw new Error("Failed to delete class");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.classes.list.path] });
      toast({ title: "Success", description: "Class deleted" });
    },
  });
}

// ==========================================
// CONTENT
// ==========================================

export function useContent(classId?: string) {
  return useQuery({
    queryKey: [api.content.list.path, classId],
    queryFn: async () => {
      // Build URL with query param if classId exists
      const url = classId 
        ? `${api.content.list.path}?classId=${classId}` 
        : api.content.list.path;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch content");
      return api.content.list.responses[200].parse(await res.json());
    },
    enabled: true, // Always enable, just might return empty or full list
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertContent) => {
      // Ensure booleans are handled if form sends strings (common with select inputs)
      const res = await fetch(api.content.create.path, {
        method: api.content.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create content");
      return api.content.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.content.list.path] });
      toast({ title: "Success", description: "Content added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.content.delete.path, { id });
      const res = await fetch(url, { method: api.content.delete.method });
      if (!res.ok) throw new Error("Failed to delete content");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.content.list.path] });
      toast({ title: "Success", description: "Content deleted" });
    },
  });
}

// ==========================================
// ACCESS & VERIFICATION
// ==========================================

export function useCheckSubscription() {
  return useMutation({
    mutationFn: async (data: { email: string; deviceId: string }) => {
      const res = await fetch(api.subscription.check.path, {
        method: api.subscription.check.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Subscription check failed");
      return api.subscription.check.responses[200].parse(await res.json());
    },
  });
}

export function useVerifyContent() {
  return useMutation({
    mutationFn: async ({ contentId, password }: { contentId: number; password: string }) => {
      const url = buildUrl(api.content.verify.path, { id: contentId });
      const res = await fetch(url, {
        method: api.content.verify.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      if (res.status === 403) {
        throw new Error("Invalid password");
      }
      if (!res.ok) {
        throw new Error("Verification failed");
      }
      
      return api.content.verify.responses[200].parse(await res.json());
    },
  });
}
