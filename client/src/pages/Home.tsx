import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Activity, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50 via-background to-background">
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate={mounted ? "show" : "hidden"}
        className="max-w-md w-full text-center space-y-8"
      >
        <motion.div variants={item} className="relative mx-auto w-24 h-24 mb-8">
           <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
           <img 
             src="https://raw.githubusercontent.com/MODERN-SERVER/Assets/main/BackgroundEraser_20250906_184426881.png"
             className="relative w-full h-full object-contain drop-shadow-xl"
             alt="MED-A"
           />
        </motion.div>

        <motion.div variants={item} className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-accent tracking-tight">
            Welcome to <span className="text-primary">MED-A</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your premium medical content extension.
          </p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 gap-4 py-8">
          <div className="p-4 rounded-2xl bg-white border border-border/50 shadow-lg text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
              <Book size={20} />
            </div>
            <span className="text-sm font-semibold text-accent">Library</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-border/50 shadow-lg text-center">
             <div className="mx-auto w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
              <Activity size={20} />
            </div>
            <span className="text-sm font-semibold text-accent">Exam Prep</span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <Button 
            onClick={() => setLocation("/dashboard")}
            className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/25 bg-gradient-to-r from-primary to-teal-500 hover:to-teal-600 transition-all duration-300 group"
          >
            Start Learning
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Identity verified via Device ID
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
