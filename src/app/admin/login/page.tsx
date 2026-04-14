"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAsAdmin } = useStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginAsAdmin(email, password);
    setLoading(false);
    if (success) {
      toast({ title: "Admin Access Granted", description: "Successfully logged into management portal." });
      router.push("/admin/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid email or password."
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:p-6 bg-[#FAF9F6] relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#F5E6D3]/30 blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.02]" />
      </div>

      <Card className="w-full max-w-md border-border/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md relative z-10 rounded-none">
        <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-accent transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 pt-2">
            <div className="p-2 sm:p-2.5 bg-accent/5 border border-accent/10 shrink-0">
              <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <CardTitle className="text-xl sm:text-2xl font-bold">Admin Portal</CardTitle>
              <CardDescription className="concierge-text text-accent text-xs">Kitchen Management Console</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold opacity-70">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@jeeva.eats"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 sm:h-12 border-border/80 focus:border-accent rounded-none bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold opacity-70">Security Key</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 sm:h-12 border-border/80 focus:border-accent rounded-none bg-white"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-14 text-sm font-bold bg-primary hover:bg-accent transition-all rounded-none group active:scale-[0.98]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
