import { useState } from "react";
import { useDepartments, useCourses, useClasses, useContent } from "@/hooks/use-med-a";
import { ContentCard } from "@/components/ContentCard";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudentDashboard() {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: depts } = useDepartments();
  const { data: allCourses } = useCourses();
  const { data: allClasses } = useClasses();
  const { data: content, isLoading } = useContent(selectedClass !== "all" ? selectedClass : undefined);

  const filteredCourses = allCourses?.filter(c => selectedDept === "all" || c.departmentId === Number(selectedDept));
  const filteredClasses = allClasses?.filter(c => selectedCourse === "all" || c.courseId === Number(selectedCourse));

  const filteredContent = content?.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesClass = selectedClass === "all" || item.classId === Number(selectedClass);
    return matchesSearch && matchesType && matchesClass;
  });

  return (
    <div className="container max-w-screen-xl py-8 px-4 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-accent">Study Materials</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto pb-2">
          <span>Home</span>
          <ChevronRight size={14} />
          <span className={selectedDept !== "all" ? "text-primary font-medium" : ""}>
            {depts?.find(d => String(d.id) === selectedDept)?.name || "Departments"}
          </span>
          {selectedDept !== "all" && (
            <>
              <ChevronRight size={14} />
              <span className={selectedCourse !== "all" ? "text-primary font-medium" : ""}>
                {allCourses?.find(c => String(c.id) === selectedCourse)?.name || "Courses"}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedDept} onValueChange={(v) => { setSelectedDept(v); setSelectedCourse("all"); setSelectedClass("all"); }}>
          <SelectTrigger className="h-12 rounded-xl bg-white border-border shadow-sm">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {depts?.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select 
          value={selectedCourse} 
          onValueChange={(v) => { setSelectedCourse(v); setSelectedClass("all"); }}
          disabled={selectedDept === "all"}
        >
          <SelectTrigger className="h-12 rounded-xl bg-white border-border shadow-sm">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {filteredCourses?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select 
          value={selectedClass} 
          onValueChange={setSelectedClass}
          disabled={selectedCourse === "all"}
        >
          <SelectTrigger className="h-12 rounded-xl bg-white border-border shadow-sm">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {filteredClasses?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/50 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10 h-12 rounded-xl border-border bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-border bg-background">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="past_paper">Past Papers</SelectItem>
            <SelectItem value="notes">Notes</SelectItem>
            <SelectItem value="book">Books</SelectItem>
            <SelectItem value="fqe">FQE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-muted/50 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent && filteredContent.length > 0 ? (
            filteredContent.map((item) => <ContentCard key={item.id} item={item} />)
          ) : (
            <div className="col-span-full py-16 text-center text-muted-foreground bg-muted/10 rounded-3xl border border-dashed border-border">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium">No content found</p>
              <p className="text-sm">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
