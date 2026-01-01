import { useState } from "react";
import { useClasses, useContent } from "@/hooks/use-med-a";
import { ContentCard } from "@/components/ContentCard";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentDashboard() {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: classes } = useClasses();
  const { data: content, isLoading } = useContent(selectedClass !== "all" ? selectedClass : undefined);

  // Client-side filtering
  const filteredContent = content?.filter(item => {
    const itemClass = classes?.find(c => c.id === item.classId);
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itemClass?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container max-w-screen-xl py-8 px-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-accent">Study Materials</h1>
          <p className="text-muted-foreground mt-1">Browse past papers, notes, and books.</p>
        </div>
        
        {/* Class Selector */}
        <div className="w-full md:w-64">
           <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full h-12 rounded-xl bg-white border-border shadow-sm">
              <SelectValue placeholder="Select a Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/50 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search documents, courses, or classes..." 
            className="pl-10 h-12 rounded-xl border-border bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-12 rounded-xl border-border bg-background">
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
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent && filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-muted-foreground bg-muted/20 rounded-3xl border border-dashed border-border">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium">No content found</p>
              <p className="text-sm">Try adjusting your filters or selecting a different class.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
