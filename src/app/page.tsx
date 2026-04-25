"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Utensils, ShieldCheck, ArrowRight, UserRound, Loader2 } from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, admin, isAdmin, authLoading, isGuest, loginAsGuest } = useStore();
  const router = useRouter();
  const { toast } = useToast();
  const [redirecting, setRedirecting] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (isAdmin && admin) {
      setRedirecting(true);
      router.replace("/admin/dashboard");
    } else if (user) {
      setRedirecting(true);
      router.replace("/student/dashboard");
    }
  }, [user, admin, isAdmin, authLoading, router]);

  if (authLoading || redirecting) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Jeeva Café</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  const handleGuestSubmit = async () => {
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    if (!/^\d{7,15}$/.test(cleanPhone)) {
      toast({ variant: "destructive", title: "Enter a valid phone number" });
      return;
    }
    if (cleanAddress.length < 4) {
      toast({ variant: "destructive", title: "Enter your delivery address" });
      return;
    }
    setSubmitting(true);
    const ok = await loginAsGuest(cleanPhone, cleanAddress, name.trim() || undefined);
    setSubmitting(false);
    if (!ok) {
      toast({ variant: "destructive", title: "Could not start guest session", description: "Please try again." });
      return;
    }
    setGuestOpen(false);
    router.push("/guest/menu");
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:p-6 space-y-8 sm:space-y-12">
        <header className="text-center space-y-3 sm:space-y-4">
          <p className="concierge-text text-accent">South Indian Heritage Kitchen</p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold">Jeeva Café</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Traditional flavors meets modern convenience. Premium subscription mess service for the discerning student.
          </p>
        </header>

        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-lg">
          <Link
            href="/student/login"
            className="group relative border border-border p-6 sm:p-10 md:p-12 w-full flex flex-col items-center text-center space-y-4 sm:space-y-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-[0.98]"
          >
            <Utensils className="h-10 w-10 sm:h-12 sm:w-12 text-accent group-hover:text-primary-foreground transition-colors" />
            <div className="space-y-1.5 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">Student Portal</h2>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary-foreground/70">
                Access your daily menu, manage subscriptions, and place food orders.
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold text-xs">
              Sign In <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (isGuest) {
                router.push("/guest/menu");
              } else {
                setGuestOpen(true);
              }
            }}
            className="group relative border border-dashed border-border p-5 sm:p-8 w-full flex flex-col items-center text-center space-y-3 sm:space-y-4 hover:bg-accent/10 hover:border-accent transition-all duration-300 active:scale-[0.98]"
          >
            <UserRound className="h-8 w-8 sm:h-10 sm:w-10 text-accent transition-colors" />
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold">{isGuest ? "Continue as Guest" : "Guest Access"}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isGuest
                  ? "Pick up where you left off — view menu and order history."
                  : "No account? Order with phone + address as a walk-in guest."}
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold text-xs text-accent">
              {isGuest ? "Continue" : "Quick Order"} <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          <Link
            href="/admin/login"
            className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="font-medium">Admin Portal</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <footer className="px-4 py-6 sm:p-8 border-t border-border flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center text-xs font-bold text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Jeeva Mess Co.</span>
        <div className="flex gap-4 sm:gap-8">
          <Link href="#" className="hover:text-accent">Terms</Link>
          <Link href="#" className="hover:text-accent">Privacy</Link>
          <Link href="#" className="hover:text-accent">Contact</Link>
        </div>
      </footer>

      <Dialog open={guestOpen} onOpenChange={(o) => { if (!submitting) setGuestOpen(o); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guest Access</DialogTitle>
            <DialogDescription>
              Enter your phone and delivery address to start ordering. We use your phone number to load your past orders next time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="guest-phone">Phone Number</Label>
              <Input
                id="guest-phone"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={15}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guest-address">Delivery Address</Label>
              <Input
                id="guest-address"
                placeholder="Hostel block / room or address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guest-name">Name (optional)</Label>
              <Input
                id="guest-name"
                placeholder="So the kitchen knows who to greet"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGuestOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleGuestSubmit} disabled={submitting} className="btn-primary-action">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Starting...</> : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
