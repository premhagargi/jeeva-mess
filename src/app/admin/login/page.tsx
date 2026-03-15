"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginAsAdmin } = useStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsAdmin(username)) {
      toast({ title: "Admin Access Granted", description: "Successfully logged into management portal." });
      router.push("/admin/dashboard");
    } else {
      toast({ 
        variant: "destructive", 
        title: "Access Denied", 
        description: "Invalid Admin Username (Try 'admin')" 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF9F6] relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Maroon Accent Glow (Top Left) */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px]" />
        
        {/* Warm Cream Glow (Bottom Right) */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#F5E6D3]/30 blur-[100px]" />
        
        {/* Radial Vignette to focus the center */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.02]" />
      </div>

      <Card className="w-full max-w-md border-border/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md relative z-10 rounded-none">
        <CardHeader className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 pt-2">
            <div className="p-2.5 bg-accent/5 border border-accent/10">
              <ShieldCheck className="h-7 w-7 text-accent" />
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Admin Portal</CardTitle>
              <CardDescription className="concierge-text text-accent text-[10px]">Kitchen Management Console</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest opacity-70">Admin Username</Label>
              <Input 
                id="username" 
                placeholder="admin" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 border-border/80 focus:border-accent rounded-none bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest opacity-70">Security Key</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-border/80 focus:border-accent rounded-none bg-white"
                required
              />
            </div>
            <Button type="submit" className="w-full h-14 text-sm font-black uppercase tracking-[0.2em] bg-primary hover:bg-accent transition-all rounded-none group">
              Authorize Access
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.25em]">
              Authorized Personnel Only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
