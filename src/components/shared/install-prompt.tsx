"use client";

import { useState, useEffect, useRef } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const deferredPrompt = useRef<any>(null);

  useEffect(() => {
    // Already installed or already dismissed this session
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;
    if (localStorage.getItem('install_dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      // Show banner after a short delay so it doesn't flash on load
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const result = await deferredPrompt.current.userChoice;
    if (result.outcome === 'accepted') {
      setShowBanner(false);
    }
    deferredPrompt.current = null;
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('install_dismissed', '1');
  };

  // Success toast after installation
  if (showSuccess) {
    return (
      <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-[360px] z-[200] animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="bg-card border border-border p-4 shadow-lg rounded-lg flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Download className="h-5 w-5 text-amber-600 animate-bounce" />
          </div>
          <div>
            <p className="font-bold text-sm">Installing Jeeva Café...</p>
            <p className="text-xs text-muted-foreground">The app is being added to your home screen.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-[380px] z-[200] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-card border border-border p-4 shadow-xl rounded-lg">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 mb-3 pr-6">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#C8850A' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="12" r="5.5" stroke="white" strokeWidth="1.8"/>
              <path d="M10.5 12 C10.5 12 13 18 16 18 C19 18 21.5 12 21.5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="16" y1="18" x2="16" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="13" y1="22" x2="19" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm">Install Jeeva Café</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add to your home screen for quick access. Works offline too!
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex-1 h-9 bg-primary text-primary-foreground font-bold text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Install App
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold"
          >
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}
