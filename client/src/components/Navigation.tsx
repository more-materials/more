import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { GraduationCap, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          {/* System Logo */}
          <img 
            src="https://raw.githubusercontent.com/MODERN-SERVER/Assets/main/BackgroundEraser_20250906_184426881.png" 
            alt="MED-A Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="hidden md:flex flex-col">
            <span className="font-display font-bold text-lg leading-tight text-accent">MED-A</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Content Extension</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <img 
            src="https://raw.githubusercontent.com/MODERN-SERVER/Assets/main/BackgroundEraser_20251010_092733868.png"
            alt="KMTC Logo"
            className="h-10 w-auto object-contain opacity-80"
          />
          
          {isAdmin && (
             <Link href="/">
               <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                 <LogOut className="h-4 w-4" />
                 Exit Admin
               </Button>
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}
