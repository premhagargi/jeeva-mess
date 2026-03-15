"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { CheckCircle2, Copy, Plus, UserPlus, Users, Search, Key, ShieldX, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/lib/mock-data";

export default function AdminStudents() {
  const { students, registerStudent } = useStore();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [regStep, setRegStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({ serialNumber: "", name: "", mobile: "" });
  const [registeredStudent, setRegisteredStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.serialNumber.length < 3 || formData.serialNumber.length > 4) {
      toast({ variant: "destructive", title: "Invalid Serial", description: "Must be 3-4 digits." });
      return;
    }

    const newStudent: Student = {
      id: formData.serialNumber,
      name: formData.name,
      email: `${formData.serialNumber}@jeeva.eats`,
      mobile: formData.mobile,
      createdAt: new Date().toISOString()
    };

    if (registerStudent(newStudent)) {
      const password = `${formData.serialNumber}@123`;
      setRegisteredStudent({ ...newStudent, password });
      setRegStep('success');
      toast({ title: "Registered Successfully" });
    } else {
      toast({ variant: "destructive", title: "Error", description: "Student already exists." });
    }
  };

  const copyCredentials = () => {
    if (!registeredStudent) return;
    navigator.clipboard.writeText(`ID: ${registeredStudent.id}\nPass: ${registeredStudent.password}`);
    toast({ title: "Copied!" });
  };

  const resetReg = () => {
    setFormData({ serialNumber: "", name: "", mobile: "" });
    setRegStep('form');
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.includes(searchQuery)
  );

  const autoPass = formData.serialNumber ? `${formData.serialNumber}@123` : "";

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="concierge-text text-accent">Management</p>
          <h1 className="text-2xl font-black uppercase">Student Registry</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search ID/Name..." 
              className="pl-9 h-11 text-xs font-bold uppercase tracking-widest border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetReg();
          }}>
            <DialogTrigger asChild>
              <Button className="h-11 px-6 btn-primary-action flex items-center gap-2">
                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Register</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-0 overflow-hidden border-none">
              <div className="bg-primary p-6 text-primary-foreground">
                <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                  {regStep === 'form' ? "New Member" : "Success"}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/70 font-bold uppercase text-[10px] tracking-widest mt-1">
                  {regStep === 'form' ? "Fast Onboarding Console" : "Credentials Generated"}
                </DialogDescription>
              </div>

              <div className="p-6">
                {regStep === 'form' ? (
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Student Serial (3-4 Digits)</Label>
                      <Input 
                        placeholder="e.g. 2401" 
                        type="number"
                        className="h-12 border-border"
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                        required
                      />
                      {autoPass && (
                        <div className="flex items-center gap-2 bg-secondary/50 p-2.5 border border-border mt-2 animate-in slide-in-from-top-1">
                          <Key className="h-3 w-3 text-accent" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">
                            Pass: <span className="text-foreground">{autoPass}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Full Name</Label>
                      <Input 
                        placeholder="Rahul Kumar" 
                        className="h-12 border-border"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Mobile Number</Label>
                      <Input 
                        placeholder="9876543210" 
                        type="tel"
                        className="h-12 border-border"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full h-[52px] btn-primary-action bg-primary text-primary-foreground">
                      Confirm Registration
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6 py-4">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 bg-accent text-accent-foreground flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-black text-xl">{registeredStudent.name}</h4>
                      <p className="concierge-text text-muted-foreground mt-1">Serial {registeredStudent.id}</p>
                    </div>
                    
                    <div className="bg-secondary p-5 border border-border space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-border/50">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Login ID</span>
                        <span className="font-black text-lg">{registeredStudent.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Password</span>
                        <span className="font-black text-lg font-mono">{registeredStudent.password}</span>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Button onClick={copyCredentials} variant="outline" className="w-full h-12 border-accent text-accent font-bold uppercase text-[10px] tracking-widest">
                        <Copy className="h-4 w-4 mr-2" /> Copy Creds
                      </Button>
                      <Button onClick={resetReg} className="w-full h-12 btn-primary-action bg-primary text-primary-foreground">
                        <Plus className="h-4 w-4 mr-2" /> Add Another
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full p-20 text-center border border-dashed border-border bg-secondary/20">
            <p className="concierge-text text-muted-foreground">No records found</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="p-5 bg-white border border-border hover:border-accent transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">STU{student.id}</p>
                  <h4 className="font-black text-lg leading-tight">{student.name}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{student.mobile}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Member Since</p>
                  <p className="text-[11px] font-black">{new Date(student.createdAt!).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                <Button variant="outline" size="sm" className="flex-1 h-9 text-[9px] font-black uppercase tracking-widest border-border hover:bg-secondary">
                  <RefreshCcw className="h-3 w-3 mr-1.5" /> Reset
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-9 text-[9px] font-black uppercase tracking-widest border-border text-destructive hover:bg-destructive/10">
                  <ShieldX className="h-3 w-3 mr-1.5" /> Block
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
