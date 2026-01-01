import { useState } from "react";
import { Content } from "@shared/schema";
import { useCheckSubscription, useVerifyContent } from "@/hooks/use-med-a";
import { motion } from "framer-motion";
import { 
  Lock, 
  Unlock, 
  BookOpen, 
  FileText, 
  FileQuestion, 
  Library, 
  Loader2, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface ContentCardProps {
  item: Content;
}

const ICONS = {
  past_paper: FileQuestion,
  notes: FileText,
  book: BookOpen,
  fqe: Library,
};

export function ContentCard({ item }: ContentCardProps) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const checkSub = useCheckSubscription();
  const verifyContent = useVerifyContent();

  const Icon = ICONS[item.type as keyof typeof ICONS] || FileText;

  // Get credentials from storage (simulated for now if missing)
  const getCredentials = () => {
    const email = localStorage.getItem("med_a_email") || "demo@student.com";
    const deviceId = localStorage.getItem("med_a_device_id") || "demo-device-123";
    return { email, deviceId };
  };

  const handleAccess = async () => {
    setIsChecking(true);
    try {
      const creds = getCredentials();
      
      // 1. Check Subscription
      const status = await checkSub.mutateAsync(creds);

      if (status.disabled) {
        alert("Your account has been disabled. Please contact support.");
        return;
      }

      if (!status.access) {
        setShowPaymentModal(true);
        return;
      }

      // 2. Check Lock Status
      if (item.isLocked) {
        setShowPasswordModal(true);
      } else {
        // Direct access - URL is in the item for unlocked content
        openViewer(item.url, item.title);
      }

    } catch (error) {
      console.error(error);
      alert("Failed to verify access. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    try {
      const result = await verifyContent.mutateAsync({
        contentId: item.id,
        password
      });

      if (result.success && result.url) {
        setShowPasswordModal(false);
        setPassword("");
        openViewer(result.url, item.title);
      } else {
        setPasswordError("Incorrect password");
      }
    } catch (err) {
      setPasswordError("Incorrect password");
    }
  };

  const openViewer = (url: string, title: string) => {
    // Navigate to viewer page with encoded URL
    // In a real app, we might store this in a transient state to avoid URL sharing
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    setLocation(`/viewer?url=${encodedUrl}&title=${encodedTitle}`);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <div className="absolute top-0 right-0 p-3">
          <div className={cn(
            "rounded-full p-2 backdrop-blur-sm",
            item.isLocked ? "bg-red-50 text-red-500" : "bg-teal-50 text-teal-500"
          )}>
            {item.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </div>
        </div>

        <div className="p-6">
          <div className={cn(
            "mb-4 inline-flex items-center justify-center rounded-xl p-3",
            "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
          )}>
            <Icon size={24} />
          </div>

          <h3 className="mb-2 font-display text-lg font-bold text-accent line-clamp-1">
            {item.title}
          </h3>
          <p className="mb-6 text-sm text-muted-foreground line-clamp-2">
            {item.description || "No description provided."}
          </p>

          <Button 
            onClick={handleAccess}
            disabled={isChecking}
            className="w-full rounded-xl bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20"
          >
            {isChecking ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              item.isLocked ? "Unlock Access" : "Open Content"
            )}
          </Button>
        </div>
      </motion.div>

      {/* Password Dialog */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Protected Content</DialogTitle>
            <DialogDescription>
              This content is password protected. Please enter the access code.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn("text-center text-lg tracking-widest", passwordError && "border-red-500 ring-red-500/20")}
              />
              {passwordError && <p className="text-xs text-red-500 text-center">{passwordError}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={verifyContent.isPending} className="w-full bg-primary text-primary-foreground">
                {verifyContent.isPending ? <Loader2 className="animate-spin" /> : "Verify & Open"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Required Dialog */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-red-500">Subscription Required</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your device does not have an active subscription to access this content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="rounded-lg bg-muted p-4 text-center text-sm">
              <p className="font-semibold">M-PESA Paybill: 123456</p>
              <p className="text-muted-foreground mt-1">Account: Your Email</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Close</Button>
            <Button className="bg-primary hover:bg-primary/90">Verify Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
