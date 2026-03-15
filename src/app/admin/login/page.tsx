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
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Glows using Brand Accent */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[100px]" />
        
        {/* Subtle Geometric Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="10" cy="10" r="30" fill="none" stroke="white" strokeWidth="0.1" />
          <circle cx="90" cy="90" r="40" fill="none" stroke="white" strokeWidth="0.1" />
          <line x1="0" y1="20" x2="100" y2="80" stroke="white" strokeWidth="0.05" />
          <line x1="20" y1="0" x2="80" y2="100" stroke="white" strokeWidth="0.05" />
        </svg>

        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      <Card className="w-full max-w-md border-border shadow-2xl bg-background relative z-10">
        <CardHeader className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-accent" />
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black">Admin Portal</CardTitle>
              <CardDescription className="concierge-text">Kitchen Management Access</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Admin Username</Label>
              <Input 
                id="username" 
                placeholder="admin" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Security Key</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-sm font-bold uppercase tracking-widest bg-primary hover:bg-accent transition-all">
              Authorize
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
