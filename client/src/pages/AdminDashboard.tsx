import { useState, useEffect } from "react";
import { 
  useDepartments, useCreateDepartment, useDeleteDepartment,
  useCourses, useCreateCourse, useDeleteCourse,
  useClasses, useCreateClass, useDeleteClass,
  useContent, useCreateContent, useDeleteContent 
} from "@/hooks/use-med-a";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDepartmentSchema, insertCourseSchema, insertClassSchema, insertContentSchema } from "@shared/schema";
import { Plus, Trash2, FolderOpen, FileText, Lock, LayoutGrid, GraduationCap, School, LogOut, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
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

function Manager({ 
  title, 
  data, 
  onDelete, 
  onCreate, 
  schema, 
  fields, 
  icon: Icon,
  firestoreColl
}: { 
  title: string, 
  data: any[], 
  onDelete: any, 
  onCreate: any, 
  schema: any, 
  fields: any[], 
  icon: any,
  firestoreColl: string
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === 'number' ? undefined : (f.defaultValue || "") }), {}),
  });

  const onSubmit = async (vals: any) => {
    try {
      const created = await onCreate.mutateAsync(vals);
      // Automatically sync to Firebase Firestore
      await setDoc(doc(collection(db, firestoreColl), String(created.id)), {
        ...created,
        syncedAt: new Date().toISOString()
      });
      form.reset();
      setOpen(false);
    } catch (err: any) {
      console.error("Sync error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Add {title.slice(0, -1)}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add {title.slice(0, -1)}</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {fields.map(f => (
                  <FormField
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{f.label}</FormLabel>
                        {f.options ? (
                          <Select onValueChange={v => field.onChange(f.type === 'number' ? Number(v) : v)} defaultValue={String(field.value)}>
                            <FormControl><SelectTrigger><SelectValue placeholder={f.placeholder} /></SelectTrigger></FormControl>
                            <SelectContent>{f.options.map((o: any) => <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>)}</SelectContent>
                          </Select>
                        ) : f.type === 'boolean' ? (
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        ) : f.type === 'textarea' ? (
                          <FormControl><Textarea placeholder={f.placeholder} {...field} /></FormControl>
                        ) : (
                          <FormControl><Input placeholder={f.placeholder} {...field} type={f.inputType || 'text'} /></FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="submit" disabled={onCreate.isPending} className="w-full">
                  {onCreate.isPending ? <Loader2 className="animate-spin" /> : "Create & Sync"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {data?.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Icon size={20} /></div>
              <span className="font-medium">{item.name || item.title}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirm("Delete?") && onDelete.mutate(item.id)}><Trash2 size={18} /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const depts = useDepartments();
  const createDept = useCreateDepartment();
  const deleteDept = useDeleteDepartment();

  const courses = useCourses();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();

  const classes = useClasses();
  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();

  const content = useContent();
  const createContent = useCreateContent();
  const deleteContent = useDeleteContent();

  const studentUrl = window.location.origin + "/dashboard";

  const copyUrl = () => {
    navigator.clipboard.writeText(studentUrl);
    setCopied(true);
    toast({ title: "Copied!", description: "Student side URL copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!user) {
    setLocation("/admin");
    return null;
  }

  return (
    <div className="container max-w-screen-xl py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage hierarchy and educational content.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border flex-1 md:flex-none">
            <code className="text-xs font-mono truncate max-w-[150px]">{studentUrl}</code>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyUrl}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ExternalLink size={16} /> Preview Site
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2" onClick={logout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="departments">
        <TabsList className="w-full justify-start h-12 bg-white border p-1 mb-6 rounded-xl">
          <TabsTrigger value="departments" className="px-8">Departments</TabsTrigger>
          <TabsTrigger value="courses" className="px-8">Courses</TabsTrigger>
          <TabsTrigger value="classes" className="px-8">Classes</TabsTrigger>
          <TabsTrigger value="content" className="px-8">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <Manager title="Departments" data={depts.data || []} onCreate={createDept} onDelete={deleteDept} schema={insertDepartmentSchema} icon={LayoutGrid} firestoreColl="departments" fields={[{ name: "name", label: "Name", placeholder: "e.g. Medicine" }]} />
        </TabsContent>

        <TabsContent value="courses">
          <Manager title="Courses" data={courses.data || []} onCreate={createCourse} onDelete={deleteCourse} schema={insertCourseSchema} icon={GraduationCap} firestoreColl="courses" fields={[{ name: "departmentId", label: "Department", placeholder: "Select Department", options: depts.data, type: 'number' }, { name: "name", label: "Name", placeholder: "e.g. Clinical Medicine" }]} />
        </TabsContent>

        <TabsContent value="classes">
          <Manager title="Classes" data={classes.data || []} onCreate={createClass} onDelete={deleteClass} schema={insertClassSchema} icon={School} firestoreColl="classes" fields={[{ name: "courseId", label: "Course", placeholder: "Select Course", options: courses.data, type: 'number' }, { name: "name", label: "Name", placeholder: "e.g. Sep 2023 Intake" }]} />
        </TabsContent>

        <TabsContent value="content">
          <Manager title="Content" data={content.data || []} onCreate={createContent} onDelete={deleteContent} schema={insertContentSchema} icon={FileText} firestoreColl="content" fields={[
            { name: "classId", label: "Class", placeholder: "Select Class", options: classes.data, type: 'number' },
            { name: "title", label: "Title", placeholder: "e.g. Anatomy Notes" },
            { name: "description", label: "Description", placeholder: "Short description...", type: 'textarea' },
            { name: "type", label: "Type", placeholder: "Select Type", options: [{id: 'notes', name: 'Notes'}, {id: 'past_paper', name: 'Past Paper'}, {id: 'book', name: 'Book'}, {id: 'fqe', name: 'FQE'}] },
            { name: "url", label: "URL", placeholder: "https://..." },
            { name: "isLocked", label: "Password Protection", type: 'boolean', defaultValue: false },
            { name: "password", label: "Access Password", placeholder: "Leave empty if not locked" }
          ]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
