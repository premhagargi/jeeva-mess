"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Copy, Plus, UserPlus, Users, Search, ShieldCheck, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Student } from "@/lib/mock-data";

export default function AdminStudents() {
  const { students, registerStudent } = useStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    serialNumber: "",
    name: "",
    mobile: ""
  });
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.serialNumber.length < 3 || formData.serialNumber.length > 4) {
      toast({ variant: "destructive", title: "Invalid Serial", description: "Serial number must be 3 or 4 digits." });
      return;
    }

    const newStudent: Student = {
      id: formData.serialNumber,
      name: formData.name,
      email: `${formData.serialNumber}@jeeva.eats`,
      mobile: formData.mobile,
      createdAt: new Date().toISOString()
    };

    const success = registerStudent(newStudent);
    
    if (success) {
      const password = `${formData.serialNumber}@123`;
      setRegisteredStudent({ ...newStudent, password });
      setIsSuccess(true);
      toast({ title: "Registration Successful", description: `${formData.name} is now a member.` });
    } else {
      toast({ variant: "destructive", title: "Error", description: "Student with this Serial Number already exists." });
    }
  };

  const copyCredentials = () => {
    if (!registeredStudent) return;
    const text = `Jeeva Eats Credentials\nID: ${registeredStudent.id}\nPassword: ${registeredStudent.password}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Credentials copied to clipboard." });
  };

  const resetForm = () => {
    setFormData({ serialNumber: "", name: "", mobile: "" });
    setIsSuccess(false);
    setRegisteredStudent(null);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.includes(searchQuery)
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-1">
        <p className="concierge-text text-accent">Member Management</p>
        <h1 className="text-[28px] font-black">Student Registry</h1>
      </header>

      <div className="flex flex-col gap-12 max-w-[520px] mx-auto">
        {/* Registration Section */}
        <section className="w-full">
          {!isSuccess ? (
            <Card className="border-border shadow-none bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <UserPlus className="h-5 w-5" />
                  <span className="concierge-text">Fast Onboarding</span>
                </div>
                <CardTitle className="text-xl">Register New Student</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="serialNumber" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Student Serial (3-4 Digits)</Label>
                    <Input 
                      id="serialNumber" 
                      placeholder="e.g. 2401" 
                      type="number"
                      className="h-12 text-[15px] px-3.5"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      required
                    />
                    {formData.serialNumber && (
                      <div className="flex items-center gap-2 bg-secondary/50 p-2 border border-border mt-2 animate-in fade-in slide-in-from-top-1">
                        <Key className="h-3 w-3 text-muted-foreground" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Default Pass: <span className="text-foreground">{formData.serialNumber}@123</span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Rahul Kumar" 
                      className="h-12 text-[15px] px-3.5"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="mobile" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mobile Number</Label>
                    <Input 
                      id="mobile" 
                      placeholder="e.g. 9876543210" 
                      type="tel"
                      className="h-12 text-[15px] px-3.5"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-[52px] btn-primary-action mt-2">
                    Register Member
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-accent bg-secondary/50 shadow-none animate-in fade-in zoom-in duration-300">
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 bg-accent text-accent-foreground flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black">Success</h3>
                  <p className="concierge-text text-muted-foreground">{registeredStudent.name}</p>
                </div>
                
                <div className="bg-background border border-border p-6 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="concierge-text text-muted-foreground">Login ID</span>
                    <span className="font-black text-lg">{registeredStudent.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="concierge-text text-muted-foreground">Password</span>
                    <span className="font-black text-lg font-mono">{registeredStudent.password}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={copyCredentials} variant="outline" className="w-full h-12 border-accent text-accent hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    <Copy className="h-4 w-4" /> Copy Credentials
                  </Button>
                  <Button onClick={resetForm} className="w-full h-12 btn-primary-action flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" /> Add Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* List Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl flex items-center gap-2 font-black">
              <Users className="h-5 w-5 text-accent" /> Members
            </h2>
            <div className="relative w-40 sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Find..." 
                className="pl-9 h-10 text-xs font-bold uppercase tracking-widest"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-border bg-secondary/20">
                <p className="concierge-text text-muted-foreground">No matching records</p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className="p-4 bg-white border border-border flex items-center justify-between group hover:border-accent transition-all cursor-default">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">STU{student.id}</p>
                    <h4 className="font-bold text-[16px]">{student.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{student.mobile}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Member Since</p>
                    <p className="text-xs font-bold">{new Date(student.createdAt!).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                    <div className="mt-2 flex gap-2">
                      <button className="text-[10px] font-bold text-accent uppercase hover:underline">Reset</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
