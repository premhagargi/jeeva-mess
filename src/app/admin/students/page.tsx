
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
import { CheckCircle2, Copy, Plus, Search, Key } from "lucide-react";
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
      {/* Top Action Bar */}
      <div className="flex items-center gap-2 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search students..." 
            className="pl-8 h-9 text-[11px] font-bold uppercase tracking-widest border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetReg();
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9 px-4 bg-primary text-primary-foreground flex items-center gap-1.5 transition-all hover:bg-accent active:scale-[0.98]">
              <Plus className="h-3.5 w-3.5" /> 
              <span className="text-[11px] font-black uppercase tracking-widest">Register</span>
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
                      <div className="flex items-center gap-2 bg-secondary/50 p-2.5 border border-border mt-2">
                        <Key className="h-3 w-3 text-accent" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                          Auto Pass: <span className="text-foreground">{autoPass}</span>
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

                  <Button type="submit" className="w-full h-[52px] bg-primary text-primary-foreground font-black uppercase tracking-widest transition-all hover:bg-accent active:scale-[0.98]">
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
                    <Button onClick={resetReg} className="w-full h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest">
                      <Plus className="h-4 w-4 mr-2" /> Add Another
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <header>
        <p className="concierge-text text-accent text-[10px]">Registry</p>
        <h1 className="text-xl font-black uppercase">Students</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-dashed border-border bg-secondary/20">
            <p className="concierge-text text-muted-foreground text-[10px]">No records found</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="p-4 bg-white border border-border hover:border-accent transition-all flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black text-accent uppercase tracking-widest leading-none mb-1">STU{student.id}</p>
                <h4 className="font-black text-[14px] leading-tight truncate">{student.name}</h4>
                <p className="text-[10px] font-bold text-muted-foreground truncate">{student.mobile}</p>
              </div>
              
              <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-border/50">
                <Button variant="outline" size="sm" className="flex-1 h-7 text-[8px] font-black uppercase tracking-widest border-border hover:bg-secondary">
                  Reset
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-7 text-[8px] font-black uppercase tracking-widest border-border text-destructive hover:bg-destructive/10">
                  Block
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
