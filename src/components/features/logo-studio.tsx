"use client";

import React, { useState, useEffect } from "react";
import { LOGO_COLLECTION, LogoId, LogoDefinition } from "@/components/logo";
import { Check, Sparkles, Palette, Eye, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function LogoStudio() {
  const [activeLogoId, setActiveLogoId] = useState<LogoId>("delta-vertex");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("finiq-active-logo") as LogoId | null;
    if (saved && LOGO_COLLECTION.some((l) => l.id === saved)) {
      setActiveLogoId(saved);
    }

    const handler = () => {
      const updated = localStorage.getItem("finiq-active-logo") as LogoId | null;
      if (updated && LOGO_COLLECTION.some((l) => l.id === updated)) {
        setActiveLogoId(updated);
      }
    };

    window.addEventListener("finiq-logo-change", handler);
    return () => window.removeEventListener("finiq-logo-change", handler);
  }, []);

  const selectLogo = (logo: LogoDefinition) => {
    setActiveLogoId(logo.id);
    localStorage.setItem("finiq-active-logo", logo.id);
    window.dispatchEvent(new Event("finiq-logo-change"));
    toast.success(`Active logo changed to "${logo.name}"!`);
  };

  const currentDef =
    LOGO_COLLECTION.find((l) => l.id === activeLogoId) || LOGO_COLLECTION[0];

  return (
    <div className="space-y-8">
      {/* Studio Header & Live Preview */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5" />
            FinIQ Brand Identity Studio
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">
            Logo & Visual Emblem Selection
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Choose from 10 bespoke vector emblems designed for high-velocity venture syndicates.
            Click any logo to set it as the active global emblem across headers, sidebars, and deal memos.
          </p>
        </div>

        {/* Live Active Preview Banner */}
        <div className="flex flex-col items-center md:items-end gap-2 bg-secondary/40 border border-border p-4 rounded-xl shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Currently Active Worldwide:
          </span>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 shrink-0 drop-shadow-[0_2px_10px_rgba(255,128,0,0.4)]">
              {currentDef.renderIcon("w-full h-full")}
            </div>
            <div className="text-left">
              <div className="flex items-baseline">
                <span className="font-black text-lg text-foreground">Fin</span>
                <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                  IQ
                </span>
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-semibold">
                {currentDef.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Canvas Preview Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-orange-500" />
          10 Master Vector Concepts
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground text-[11px]">Preview background:</span>
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button
              type="button"
              onClick={() => setPreviewTheme("dark")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                previewTheme === "dark"
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Carbon Dark
            </button>
            <button
              type="button"
              onClick={() => setPreviewTheme("light")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                previewTheme === "light"
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Alpine Light
            </button>
          </div>
        </div>
      </div>

      {/* 10 Logos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LOGO_COLLECTION.map((logo, idx) => {
          const isActive = activeLogoId === logo.id;

          return (
            <div
              key={logo.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isActive
                  ? "bg-orange-500/[0.06] border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/10"
                  : "bg-card hover:border-orange-500/50 border-border"
              }`}
            >
              {/* Card Canvas Header */}
              <div
                className={`p-6 flex items-center justify-between border-b transition-colors ${
                  previewTheme === "dark"
                    ? "bg-[#090D14] border-zinc-800 text-white"
                    : "bg-[#F8FAFC] border-zinc-200 text-zinc-900"
                }`}
              >
                {/* Logo Vector + Lockup */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0 drop-shadow-[0_4px_16px_rgba(255,128,0,0.4)]">
                    {logo.renderIcon("w-full h-full")}
                  </div>
                  <div>
                    <div className="flex items-baseline">
                      <span className="font-black text-2xl tracking-tighter">Fin</span>
                      <span className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                        IQ
                      </span>
                      <span className="ml-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider opacity-70 uppercase">
                      Option {String(idx + 1).padStart(2, "0")} • {logo.category}
                    </span>
                  </div>
                </div>

                {/* Badge if active */}
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold shadow-sm">
                    <Check className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-muted-foreground opacity-60">
                    #{idx + 1}
                  </span>
                )}
              </div>

              {/* Card Description & Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    {logo.name}
                  </h4>
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mt-0.5">
                    {logo.tagline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {logo.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    ID: <code>{logo.id}</code>
                  </span>

                  <button
                    type="button"
                    onClick={() => selectLogo(logo)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-secondary text-foreground cursor-default"
                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-95"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-orange-500" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Select as Official Logo
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
