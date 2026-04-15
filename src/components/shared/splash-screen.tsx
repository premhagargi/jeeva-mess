"use client";

import { useState, useEffect } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show splash in standalone (installed PWA) mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (!isStandalone) return;

    // Only show once per session
    if (sessionStorage.getItem('splash_shown')) return;
    sessionStorage.setItem('splash_shown', '1');

    setVisible(true);

    // Start fade out after 1.8s
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    // Remove from DOM after fade animation
    const hideTimer = setTimeout(() => setVisible(false), 2400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(160deg, #D4940B 0%, #C8850A 40%, #B5760A 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[60px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-black/10 blur-[80px]" />

      {/* Icon */}
      <div className="relative mb-6 animate-[bounce_1s_ease-in-out]">
        <div className="h-24 w-24 sm:h-28 sm:w-28 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="12" r="5.5" stroke="white" strokeWidth="1.8"/>
            <path d="M10.5 12 C10.5 12 13 18 16 18 C19 18 21.5 12 21.5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="16" y1="18" x2="16" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="13" y1="22" x2="19" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Brand */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
        Jeeva Café
      </h1>
      <p className="text-white/70 text-sm font-medium">
        South Indian Heritage Kitchen
      </p>

      {/* Loading dots */}
      <div className="mt-10 flex gap-1.5">
        <div className="h-2 w-2 rounded-full bg-white/60 animate-[pulse_1s_ease-in-out_infinite]" />
        <div className="h-2 w-2 rounded-full bg-white/60 animate-[pulse_1s_ease-in-out_0.2s_infinite]" />
        <div className="h-2 w-2 rounded-full bg-white/60 animate-[pulse_1s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}
