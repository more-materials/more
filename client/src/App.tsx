import { Switch, Route, Redirect } from "wouter";
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
import Payment from "@/pages/Payment";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        <Switch>
          <Route path="/">
            <Redirect to="/admin" />
          </Route>
          <Route path="/admin">
            {user ? <Redirect to="/admin/dashboard" /> : <AdminLogin />}
          </Route>
          <Route path="/admin/dashboard">
            {user ? <AdminDashboard /> : <Redirect to="/admin" />}
          </Route>
          <Route path="/home" component={Home} />
          <Route path="/dashboard" component={StudentDashboard} />
          <Route path="/viewer" component={Viewer} />
          <Route path="/payment" component={Payment} />
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
