"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const { loginAsStudent } = useStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsStudent(studentId)) {
      toast({ title: "Welcome back!", description: "Successfully logged into student portal." });
      router.push("/student/dashboard");
    } else {
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
        description: "Invalid Student ID (Try STU101 or STU102)" 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:p-6 bg-secondary">
      <Card className="w-full max-w-md border-border shadow-none">
        <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-black">Student Portal</CardTitle>
            <CardDescription className="concierge-text">Subscription Member Access</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="STU101"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="h-11 sm:h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 sm:h-10"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-sm font-bold uppercase tracking-widest bg-primary hover:bg-accent transition-all active:scale-[0.98]">
              Sign In
            </Button>
          </form>
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Not a member yet? Contact mess management at Jeeva Mess Hall.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}