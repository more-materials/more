import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navigation";
import Home from "@/pages/Home";
import StudentDashboard from "@/pages/StudentDashboard";
import Viewer from "@/pages/Viewer";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={StudentDashboard} />
          <Route path="/viewer" component={Viewer} />
          <Route path="/admin" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
