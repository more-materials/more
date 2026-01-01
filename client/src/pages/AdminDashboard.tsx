import { useState } from "react";
import { useClasses, useCreateClass, useDeleteClass, useContent, useCreateContent, useDeleteContent } from "@/hooks/use-med-a";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClassSchema, insertContentSchema } from "@shared/schema";
import { z } from "zod";
import { Plus, Trash2, FolderOpen, FileText, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// === COMPONENTS FOR ADMIN DASHBOARD ===

function ClassesManager() {
  const { data: classes } = useClasses();
  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertClassSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: any) => {
    await createClass.mutateAsync(data);
    form.reset();
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Classes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Add Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Clinical Medicine Sep 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={createClass.isPending} className="w-full">
                  Create Class
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {classes?.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FolderOpen size={20} />
              </div>
              <span className="font-medium">{c.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive/90"
              onClick={() => {
                if (confirm("Delete this class? This will also delete related content logs.")) {
                  deleteClass.mutate(c.id);
                }
              }}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentManager() {
  const { data: classes } = useClasses();
  const { data: content } = useContent();
  const createContent = useCreateContent();
  const deleteContent = useDeleteContent();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertContentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "notes",
      url: "",
      isLocked: false,
      password: "",
      classId: undefined as unknown as number, // Cast for select
    },
  });

  const isLocked = form.watch("isLocked");

  const onSubmit = async (data: any) => {
    // Convert string inputs to correct types if needed (though zod handles most)
    await createContent.mutateAsync({
      ...data,
      classId: Number(data.classId),
    });
    form.reset();
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Content Library</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Add Content</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Content</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Anatomy 101 Notes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="past_paper">Past Paper</SelectItem>
                            <SelectItem value="notes">Notes</SelectItem>
                            <SelectItem value="book">Book</SelectItem>
                            <SelectItem value="fqe">FQE</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes?.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://heyzine.com/..." {...field} />
                      </FormControl>
                      <FormDescription>Link to the external viewer/PDF</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Short description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <FormField
                    control={form.control}
                    name="isLocked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white">
                        <div className="space-y-0.5">
                          <FormLabel>Password Protection</FormLabel>
                          <FormDescription>
                            Restrict access with a password
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {isLocked && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Set access code..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <Button type="submit" disabled={createContent.isPending} className="w-full">
                  Publish Content
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {content?.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="uppercase bg-muted px-1.5 py-0.5 rounded">{item.type.replace('_', ' ')}</span>
                  {item.isLocked && <span className="flex items-center gap-1 text-amber-600"><Lock size={10} /> Locked</span>}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-destructive hover:text-destructive/90"
              onClick={() => {
                if(confirm("Delete this content?")) deleteContent.mutate(item.id);
              }}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// === MAIN ADMIN PAGE ===

export default function AdminDashboard() {
  return (
    <div className="container max-w-screen-xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-accent">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage system content and configuration.</p>
      </div>

      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="w-full justify-start h-12 bg-white border border-border/50 p-1 mb-6 rounded-xl shadow-sm">
          <TabsTrigger value="classes" className="flex-1 md:flex-none px-8 rounded-lg">Classes</TabsTrigger>
          <TabsTrigger value="content" className="flex-1 md:flex-none px-8 rounded-lg">Content</TabsTrigger>
        </TabsList>
        <TabsContent value="classes">
          <ClassesManager />
        </TabsContent>
        <TabsContent value="content">
          <ContentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
