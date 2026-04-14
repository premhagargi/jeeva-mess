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
import { CheckCircle2, Copy, Plus, Search, Key, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminStudents() {
  const { students, registerStudent, deleteStudent } = useStore();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [regStep, setRegStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({ serialNumber: "", name: "", mobile: "" });
  const [registeredStudent, setRegisteredStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.serialNumber.length < 3 || formData.serialNumber.length > 4) {
      toast({ variant: "destructive", title: "Invalid Serial", description: "Must be 3-4 digits." });
      return;
    }

    setLoading(true);
    const result = await registerStudent({
      id: formData.serialNumber,
      name: formData.name,
      email: `${formData.serialNumber}@jeeva.eats`,
      mobile: formData.mobile,
      createdAt: new Date().toISOString(),
    });
    setLoading(false);

    if (result.success) {
      setRegisteredStudent({
        id: formData.serialNumber,
        name: formData.name,
        password: result.password,
      });
      setRegStep('success');
      toast({ title: "Registered Successfully" });
    } else {
      toast({ variant: "destructive", title: "Error", description: "Student already exists or registration failed." });
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

  // Password is auto-generated as random 8-char string on registration

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center gap-2 sm:gap-3 justify-between">
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8 h-10 sm:h-9 text-sm font-bold border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetReg();
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-10 sm:h-9 px-3 sm:px-4 bg-primary text-primary-foreground flex items-center gap-1.5 transition-all hover:bg-accent active:scale-[0.98]">
              <Plus className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm font-bold hidden xs:inline">Register</span>
              <span className="text-xs font-bold xs:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md p-0 overflow-hidden border-none">
            <div className="bg-primary p-4 sm:p-6 text-primary-foreground">
              <DialogTitle className="text-xl sm:text-2xl font-bold">
                {regStep === 'form' ? "New Member" : "Success"}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/70 font-bold text-xs mt-1">
                {regStep === 'form' ? "Fast Onboarding Console" : "Credentials Generated"}
              </DialogDescription>
            </div>

            <div className="p-4 sm:p-6">
              {regStep === 'form' ? (
                <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold opacity-70">Student Serial (3-4 Digits)</Label>
                    <Input
                      placeholder="e.g. 2401"
                      type="number"
                      className="h-11 sm:h-12 border-border"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      required
                    />
                    <div className="flex items-center gap-2 bg-secondary/50 p-2 sm:p-2.5 border border-border mt-2">
                      <Key className="h-3 w-3 text-accent shrink-0" />
                      <p className="text-xs font-bold">
                        Password will be <span className="text-foreground">auto-generated</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold opacity-70">Full Name</Label>
                    <Input
                      placeholder="Full Name"
                      className="h-11 sm:h-12 border-border"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold opacity-70">Mobile Number</Label>
                    <Input
                      placeholder="9876543210"
                      type="tel"
                      className="h-11 sm:h-12 border-border"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 sm:h-[52px] bg-primary text-primary-foreground font-bold transition-all hover:bg-accent active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Registration"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-5 sm:space-y-6 py-2 sm:py-4">
                  <div className="flex justify-center">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 bg-accent text-accent-foreground flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-lg sm:text-xl">{registeredStudent.name}</h4>
                    <p className="concierge-text text-muted-foreground mt-1">Serial {registeredStudent.id}</p>
                  </div>

                  <div className="bg-secondary p-4 sm:p-5 border border-border space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-border/50">
                      <span className="text-xs font-bold opacity-60">Login ID</span>
                      <span className="font-bold text-base sm:text-lg">{registeredStudent.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold opacity-60">Password</span>
                      <span className="font-bold text-base sm:text-lg font-mono">{registeredStudent.password}</span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Button onClick={copyCredentials} variant="outline" className="w-full h-11 sm:h-12 border-accent text-accent font-bold text-xs active:scale-[0.98]">
                      <Copy className="h-4 w-4 mr-2" /> Copy Creds
                    </Button>
                    <Button onClick={resetReg} className="w-full h-11 sm:h-12 bg-primary text-primary-foreground font-bold active:scale-[0.98]">
                      <Plus className="h-4 w-4 mr-2" /> Add Another
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full p-10 sm:p-12 text-center border border-dashed border-border bg-secondary/20">
            <p className="concierge-text text-muted-foreground text-xs">No records found</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="p-3 sm:p-4 bg-card border border-border hover:border-accent active:border-accent transition-all flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-accent leading-none mb-1">STU{student.id}</p>
                <h4 className="font-bold text-[14px] leading-tight truncate">{student.name}</h4>
                <p className="text-xs font-bold text-muted-foreground truncate">{student.mobile}</p>
              </div>

              <div className="shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => {
                    if (confirm(`Remove student ${student.name} (STU${student.id})?`)) {
                      deleteStudent(student.id);
                      toast({ title: "Student removed" });
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
