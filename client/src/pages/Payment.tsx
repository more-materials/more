import { useState, useEffect } from "react";
import { usePaymentPlans, useInitiatePayment, useCheckSubscription } from "@/hooks/use-med-a";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function PaymentHandler() {
  const [email, setEmail] = useState(localStorage.getItem("med_a_email") || "");
  const [deviceId, setDeviceId] = useState(localStorage.getItem("med_a_device_id") || "");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [status, setStatus] = useState<string>("");
  
  const { data: plans, isLoading: loadingPlans } = usePaymentPlans();
  const initiatePayment = useInitiatePayment();
  const checkSubscription = useCheckSubscription();
  const { toast } = useToast();

  useEffect(() => {
    if (!deviceId) {
      const savedId = localStorage.getItem("med_a_device_id");
      if (savedId) setDeviceId(savedId);
    }
  }, []);

  const handlePay = async () => {
    if (!email || !selectedPlan) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      const result = await initiatePayment.mutateAsync({
        email,
        deviceId,
        planId: selectedPlan
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else if (result.success) {
        setStatus("Payment initiated! Follow the instructions on your phone.");
      }
    } catch (err: any) {
      toast({ title: "Payment Error", description: err.message, variant: "destructive" });
    }
  };

  const handleCheckStatus = async () => {
    try {
      const result = await checkSubscription.mutateAsync({ email, deviceId });
      if (result.access) {
        setStatus("Access active! Redirecting...");
        setTimeout(() => window.location.href = "/dashboard", 2000);
      } else {
        setStatus("No active subscription found yet.");
      }
    } catch (err: any) {
      setStatus("Error checking status.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] p-4 font-['Nunito']">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#1c1c1c_25%,transparent_25%),linear-gradient(-45deg,#1c1c1c_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1c1c1c_75%),linear-gradient(-45deg,transparent_75%,#1c1c1c_75%)] bg-[length:30px_30px] opacity-20 pointer-events-none" />
      
      <Card className="w-full max-w-[340px] bg-black/90 border-accent/20 rounded-[24px] shadow-[0_0_15px_rgba(255,102,0,0.2)] animate-in fade-in slide-in-from-bottom-5">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#ff4500] via-[#ff8c00] to-[#ffcc00] bg-clip-text text-transparent">
            🎉 MED-A Premium 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#ffb380] ml-1">Your Email✉️</label>
            <Input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-[#1a1a1a] border-[#444] text-white rounded-xl h-11 focus:ring-2 focus:ring-[#ff4500]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#ffb380] ml-1">Account ID🪪</label>
            <Input 
              value={deviceId ? "••••••••" : "Not Found"}
              readOnly
              className="bg-[#222] border-[#444] text-gray-400 rounded-xl h-11 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#ffb380] ml-1">Choose a Plan</label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan} disabled={loadingPlans}>
              <SelectTrigger className="bg-[#1a1a1a] border-[#444] text-white rounded-xl h-11 focus:ring-2 focus:ring-[#ff4500]">
                <SelectValue placeholder={loadingPlans ? "Loading plans..." : "Select a plan"} />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#444] text-white">
                {plans?.map((p: any) => (
                  <SelectItem key={p.id} value={p.id} className="focus:bg-[#ff4500] focus:text-white">
                    {p.name} — Ksh {p.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handlePay}
            disabled={initiatePayment.isPending}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ff4500] via-[#ff8c00] to-[#ffcc00] hover:opacity-90 font-bold text-white transition-all shadow-lg shadow-orange-900/20"
          >
            {initiatePayment.isPending ? <Loader2 className="animate-spin" /> : "Continue to Payment"}
          </Button>

          <Button 
            variant="ghost"
            onClick={handleCheckStatus}
            disabled={checkSubscription.isPending}
            className="w-full text-gray-400 hover:text-white hover:bg-white/5"
          >
            {checkSubscription.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Check Payment Status"}
          </Button>

          {status && (
            <div className={cn(
              "p-3 rounded-xl text-center text-sm flex items-center justify-center gap-2",
              status.includes("active") ? "bg-green-500/10 text-green-400" : "bg-white/5 text-gray-300"
            )}>
              {status.includes("active") ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {status}
            </div>
          )}

          <div className="text-center pt-2">
            <span className="text-sm font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              Powered by ZetuBridge❤️💱
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
