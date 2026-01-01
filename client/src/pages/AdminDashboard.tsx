import { useState } from "react";
import { 
  useDepartments, useCreateDepartment, useDeleteDepartment,
  useCourses, useCreateCourse, useDeleteCourse,
  useClasses, useCreateClass, useDeleteClass,
  useContent, useCreateContent, useDeleteContent 
} from "@/hooks/use-med-a";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDepartmentSchema, insertCourseSchema, insertClassSchema, insertContentSchema } from "@shared/schema";
import { Plus, Trash2, FolderOpen, FileText, Lock, LayoutGrid, GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
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
  icon: Icon 
}: { 
  title: string, 
  data: any[], 
  onDelete: any, 
  onCreate: any, 
  schema: any, 
  fields: any[], 
  icon: any 
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === 'number' ? undefined : "" }), {}),
  });

  const onSubmit = async (vals: any) => {
    await onCreate.mutateAsync(vals);
    form.reset();
    setOpen(false);
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
                        ) : (
                          <FormControl><Input placeholder={f.placeholder} {...field} type={f.inputType || 'text'} /></FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="submit" disabled={onCreate.isPending} className="w-full">Create</Button>
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

  return (
    <div className="container max-w-screen-xl py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage hierarchy and content.</p>
        </div>
        <Link href="/"><Button variant="outline">View Site</Button></Link>
      </div>

      <Tabs defaultValue="departments">
        <TabsList className="w-full justify-start h-12 bg-white border p-1 mb-6 rounded-xl">
          <TabsTrigger value="departments" className="px-8">Departments</TabsTrigger>
          <TabsTrigger value="courses" className="px-8">Courses</TabsTrigger>
          <TabsTrigger value="classes" className="px-8">Classes</TabsTrigger>
          <TabsTrigger value="content" className="px-8">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <Manager title="Departments" data={depts.data || []} onCreate={createDept} onDelete={deleteDept} schema={insertDepartmentSchema} icon={LayoutGrid} fields={[{ name: "name", label: "Name", placeholder: "e.g. Medicine" }]} />
        </TabsContent>

        <TabsContent value="courses">
          <Manager title="Courses" data={courses.data || []} onCreate={createCourse} onDelete={deleteCourse} schema={insertCourseSchema} icon={GraduationCap} fields={[{ name: "departmentId", label: "Department", placeholder: "Select Department", options: depts.data, type: 'number' }, { name: "name", label: "Name", placeholder: "e.g. Clinical Medicine" }]} />
        </TabsContent>

        <TabsContent value="classes">
          <Manager title="Classes" data={classes.data || []} onCreate={createClass} onDelete={deleteClass} schema={insertClassSchema} icon={School} fields={[{ name: "courseId", label: "Course", placeholder: "Select Course", options: courses.data, type: 'number' }, { name: "name", label: "Name", placeholder: "e.g. Sep 2023 Intake" }]} />
        </TabsContent>

        <TabsContent value="content">
          <Manager title="Content" data={content.data || []} onCreate={createContent} onDelete={deleteContent} schema={insertContentSchema} icon={FileText} fields={[{ name: "classId", label: "Class", placeholder: "Select Class", options: classes.data, type: 'number' }, { name: "title", label: "Title", placeholder: "e.g. Anatomy Notes" }, { name: "type", label: "Type", placeholder: "Select Type", options: [{id: 'notes', name: 'Notes'}, {id: 'past_paper', name: 'Past Paper'}, {id: 'book', name: 'Book'}, {id: 'fqe', name: 'FQE'}] }, { name: "url", label: "URL", placeholder: "https://..." }]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
