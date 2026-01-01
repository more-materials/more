import { useLocation } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Viewer() {
  const [location, setLocation] = useLocation();
  
  // Extract query params manually since wouter doesn't have useSearchParams
  const searchParams = new URLSearchParams(window.location.search);
  const url = searchParams.get("url");
  const title = searchParams.get("title");

  if (!url) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display font-semibold text-lg truncate max-w-[200px] md:max-w-md">
            {title || "Document Viewer"}
          </h1>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Open Original</span>
          </Button>
        </a>
      </div>
      
      <div className="flex-1 bg-gray-100 relative">
        <iframe 
          src={url} 
          className="w-full h-full border-0"
          title="Content Viewer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
