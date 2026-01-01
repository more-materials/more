import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ShieldCheck, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // Mock authentication for now since we don't have full Firebase backend auth triggered yet
    // In production, this would call Firebase Auth
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("med_a_admin", "true");
      setLocation("/admin/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-border"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center mb-4 text-accent">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-display font-bold text-accent">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to manage content and classes</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@med-a.com" {...field} className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl text-lg font-medium">
              {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
