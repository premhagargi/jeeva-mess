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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Dynamic Abstract Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary Ambient Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-accent/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/15 blur-[100px]" />
        
        {/* Radial Mesh Effect */}
        <div className="absolute inset-0 opacity-20" 
             style={{ background: 'radial-gradient(circle at 50% 50%, transparent 0%, #000 100%)' }} />

        {/* Subtle Geometric Grid */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Moving Light Particles (CSS Only) */}
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white rounded-full blur-[2px] opacity-40 animate-ping" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full blur-[2px] opacity-30 animate-ping [animation-delay:1s]" />
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-2xl bg-background/95 backdrop-blur-sm relative z-10 rounded-none">
        <CardHeader className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] hover:text-accent transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 pt-2">
            <div className="p-2 bg-accent/10">
              <ShieldCheck className="h-8 w-8 text-accent" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black uppercase tracking-tighter">Admin Portal</CardTitle>
              <CardDescription className="concierge-text text-accent">Kitchen Control Center</CardDescription>
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
                className="h-12 border-border focus:border-accent rounded-none"
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
                className="h-12 border-border focus:border-accent rounded-none"
                required
              />
            </div>
            <Button type="submit" className="w-full h-14 text-sm font-black uppercase tracking-[0.2em] bg-primary hover:bg-accent transition-all rounded-none group">
              Authorize Access
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
