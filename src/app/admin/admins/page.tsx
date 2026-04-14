"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ShieldCheck, Loader2, Crown, ChefHat, Package } from "lucide-react";
import { PasswordInput } from "@/components/shared/password-input";
import { useToast } from "@/hooks/use-toast";
import { AdminRole } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ROLE_CONFIG: Record<AdminRole, { label: string; description: string; icon: any; color: string }> = {
  super_admin: { label: "Super Admin", description: "Full system access", icon: Crown, color: "text-amber-600 bg-amber-50" },
  kitchen_manager: { label: "Kitchen Manager", description: "Menu & kitchen ops", icon: ChefHat, color: "text-green-600 bg-green-50" },
  order_manager: { label: "Order Manager", description: "Orders & students", icon: Package, color: "text-blue-600 bg-blue-50" },
};

export default function AdminManagement() {
  const { admins, admin: currentAdmin, registerAdmin } = useStore();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "kitchen_manager" as AdminRole,
  });

  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast({ variant: "destructive", title: "Unauthorized", description: "Only super admins can add new admins." });
      return;
    }

    setLoading(true);
    const success = await registerAdmin(formData.name, formData.email, formData.password, formData.role);
    setLoading(false);

    if (success) {
      toast({ title: "Admin Added", description: `${formData.name} has been registered.` });
      setFormData({ name: "", email: "", password: "", role: "kitchen_manager" });
      setIsDialogOpen(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Failed to create admin. Email may already be in use." });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3 justify-between">
        <div className="space-y-0.5 min-w-0">
          <p className="concierge-text text-accent text-xs">Access Control</p>
          <h1 className="text-lg sm:text-xl font-bold leading-none">Admin Team</h1>
        </div>

        {isSuperAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 sm:h-9 px-3 sm:px-4 bg-primary text-primary-foreground flex items-center gap-1.5 transition-all hover:bg-accent active:scale-[0.98]">
                <Plus className="h-3.5 w-3.5" />
                <span className="text-xs sm:text-sm font-bold">Add Admin</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md p-0 overflow-hidden border-none">
              <div className="bg-primary p-4 sm:p-6 text-primary-foreground">
                <DialogTitle className="text-xl sm:text-2xl font-bold">New Admin</DialogTitle>
                <DialogDescription className="text-primary-foreground/70 font-bold text-xs mt-1">
                  Add a team member with role-based access
                </DialogDescription>
              </div>

              <form onSubmit={handleAdd} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold opacity-70">Full Name</Label>
                  <Input
                    placeholder="Name"
                    className="h-11 sm:h-12 border-border"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold opacity-70">Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@jeeva.eats"
                    className="h-11 sm:h-12 border-border"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold opacity-70">Password</Label>
                  <PasswordInput
                    placeholder="Min 6 characters"
                    className="h-11 sm:h-12 border-border pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold opacity-70">Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as AdminRole })}>
                    <SelectTrigger className="h-11 sm:h-12 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin - Full access</SelectItem>
                      <SelectItem value="kitchen_manager">Kitchen Manager - Menu & kitchen ops</SelectItem>
                      <SelectItem value="order_manager">Order Manager - Orders & students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 sm:h-[52px] bg-primary text-primary-foreground font-bold transition-all hover:bg-accent active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Admin"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="border border-border p-4 bg-secondary/50">
          <p className="text-xs font-bold text-muted-foreground">
            Only Super Admins can add or manage admin accounts.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {admins.length === 0 ? (
          <div className="col-span-full p-10 sm:p-12 text-center border border-dashed border-border bg-secondary/20">
            <p className="concierge-text text-muted-foreground text-xs">No admins found. Run /seed to initialize.</p>
          </div>
        ) : (
          admins.map((a) => {
            const roleInfo = ROLE_CONFIG[a.role] || ROLE_CONFIG.kitchen_manager;
            const Icon = roleInfo.icon;
            return (
              <div key={a.uid} className="p-4 sm:p-5 bg-white border border-border hover:border-accent transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[15px] leading-tight truncate">{a.name}</h4>
                    <p className="text-xs font-bold text-muted-foreground truncate mt-0.5">{a.email}</p>
                  </div>
                  <div className={cn("p-1.5 shrink-0", roleInfo.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("px-2 py-0.5 text-xs font-bold", roleInfo.color)}>
                    {roleInfo.label}
                  </span>
                  {a.uid === currentAdmin?.uid && (
                    <span className="text-xs font-bold text-muted-foreground">(You)</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
