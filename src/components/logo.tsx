"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export type LogoId =
  | "delta-vertex"
  | "quantum-nexus"
  | "hex-prism"
  | "ascending-horizon"
  | "fq-monolith"
  | "neural-orbit"
  | "falcon-wing"
  | "sovereign-shield"
  | "power-law-spike"
  | "tech-matrix";

export interface LogoDefinition {
  id: LogoId;
  name: string;
  tagline: string;
  category: "Geometric" | "Monogram" | "Analytical" | "Abstract";
  description: string;
  renderIcon: (sizeClass: string) => React.ReactNode;
}

export const LOGO_COLLECTION: LogoDefinition[] = [
  {
    id: "delta-vertex",
    name: "The Delta Vertex",
    tagline: "Venture Alpha & Compounding Trajectory",
    category: "Geometric",
    description:
      "A razor-sharp geometric Delta (Δ) with faceted aerodynamic arms and an apex breakout vector, symbolizing outsized venture returns.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <defs>
          <linearGradient id="dv-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA033" />
            <stop offset="100%" stopColor="#FF7700" />
          </linearGradient>
          <linearGradient id="dv-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="100%" stopColor="#0E121A" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#dv-dark)" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Left facet */}
        <path d="M50 20 L24 72 L42 72 L50 48 Z" fill="url(#dv-orange)" />
        {/* Right facet */}
        <path d="M50 20 L76 72 L58 72 L50 48 Z" fill="#EA580C" />
        {/* Breakout Apex Arrow */}
        <path d="M50 16 L62 30 L54 30 L54 44 L46 44 L46 30 L38 30 Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "quantum-nexus",
    name: "The Quantum Nexus",
    tagline: "Continuous Capital & Intelligence Loop",
    category: "Abstract",
    description:
      "A seamless infinity twist where capital flow and AI intelligence meet at a central telemetry core.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <defs>
          <linearGradient id="qn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA033" />
            <stop offset="50%" stopColor="#FF7700" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0D111A" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Infinity loop path */}
        <path
          d="M32 50 C32 38, 42 34, 50 50 C58 66, 68 62, 68 50 C68 38, 58 34, 50 50 C42 66, 32 62, 32 50 Z"
          stroke="url(#qn-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Center telemetry spark */}
        <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "hex-prism",
    name: "The Hex Prism",
    tagline: "Isometric Multi-Asset Vault",
    category: "Geometric",
    description:
      "A precision 3D isometric prism with faceted surfaces reflecting venture portfolio diversification and stability.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0A0E17" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Top Face */}
        <polygon points="50,22 76,36 50,50 24,36" fill="#FFA033" />
        {/* Left Face */}
        <polygon points="24,36 50,50 50,78 24,64" fill="#EA580C" />
        {/* Right Face */}
        <polygon points="50,50 76,36 76,64 50,78" fill="#9A3412" />
        {/* Core Beacon */}
        <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "ascending-horizon",
    name: "The Ascending Horizon",
    tagline: "Telemetry Pulse & Accelerating Growth",
    category: "Analytical",
    description:
      "Three forward-leaning aerodynamic chevrons that accelerate in height, evoking McLaren telemetry and rising valuations.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <defs>
          <linearGradient id="ah-bar" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#FFA033" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0C1019" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Bar 1 */}
        <rect x="25" y="52" width="10" height="24" rx="4" transform="skewX(-15)" fill="#71717A" />
        {/* Bar 2 */}
        <rect x="44" y="38" width="10" height="38" rx="4" transform="skewX(-15)" fill="url(#ah-bar)" />
        {/* Bar 3 */}
        <rect x="63" y="22" width="10" height="54" rx="4" transform="skewX(-15)" fill="#FFA033" />
        {/* High Watermark Dot */}
        <circle cx="76" cy="22" r="3" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "fq-monolith",
    name: "The FQ Monolith",
    tagline: "Interlocking Swiss Typographic Ligature",
    category: "Monogram",
    description:
      "A minimalist architectural lockup merging the letter F with a circular Q whose tail shoots forward as an upward venture vector.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#090D15" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Outer Q Circle */}
        <circle cx="56" cy="50" r="24" stroke="#FF7700" strokeWidth="8" />
        {/* F Stem */}
        <rect x="30" y="26" width="8" height="48" rx="3" fill="#FFFFFF" />
        {/* F Top Bar */}
        <rect x="30" y="26" width="28" height="8" rx="3" fill="#FFFFFF" />
        {/* F Mid Bar */}
        <rect x="30" y="44" width="20" height="7" rx="3" fill="#FFA033" />
        {/* Q Tail arrow shooting top-right */}
        <path d="M68 62 L82 76" stroke="#FFA033" strokeWidth="8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "neural-orbit",
    name: "The Neural Orbit",
    tagline: "AI Synapse & Multi-Agent Network",
    category: "Abstract",
    description:
      "A planetary system of dual orbiting telemetry rings with luminous nodes, capturing autonomous AI due diligence.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0B0F19" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Orbit Ring 1 */}
        <ellipse cx="50" cy="50" rx="32" ry="14" transform="rotate(-25 50 50)" stroke="#FF7700" strokeWidth="3" opacity="0.8" />
        {/* Orbit Ring 2 */}
        <ellipse cx="50" cy="50" rx="32" ry="14" transform="rotate(40 50 50)" stroke="#FFA033" strokeWidth="3" opacity="0.8" />
        {/* Center Core */}
        <circle cx="50" cy="50" r="9" fill="#FF7700" />
        <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
        {/* Satellite Nodes */}
        <circle cx="74" cy="38" r="3.5" fill="#FFA033" />
        <circle cx="28" cy="64" r="3.5" fill="#FFA033" />
      </svg>
    ),
  },
  {
    id: "falcon-wing",
    name: "The Falcon Speedmark",
    tagline: "Pure Aerodynamic Delta Wing",
    category: "Geometric",
    description:
      "A razor-clean supersonic chevron with negative space incisions pointing at 45° into exponential upside.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <defs>
          <linearGradient id="fw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA033" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#080C14" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Main Swept Wing */}
        <path d="M22 68 L54 22 L78 22 L46 68 Z" fill="url(#fw-grad)" />
        {/* Secondary Feather Wing */}
        <path d="M38 76 L62 42 L72 42 L48 76 Z" fill="#FFFFFF" />
        {/* Tertiary Speed Line */}
        <circle cx="78" cy="22" r="3" fill="#FFA033" />
      </svg>
    ),
  },
  {
    id: "sovereign-shield",
    name: "The Sovereign Shield",
    tagline: "Fiduciary Trust & Risk Guardrails",
    category: "Geometric",
    description:
      "A modern heraldic shield divided by an upward financial horizon, communicating institutional security and downside protection.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#090E17" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Shield Outer */}
        <path
          d="M50 20 L76 28 C76 56, 50 78, 50 78 C50 78, 24 56, 24 28 Z"
          fill="#1A2234"
          stroke="#FF7700"
          strokeWidth="3"
        />
        {/* Internal Chevron Alpha */}
        <path d="M36 44 L50 32 L64 44 L58 48 L50 40 L42 48 Z" fill="#FFA033" />
        <path d="M42 54 L50 46 L58 54 L54 57 L50 53 L46 57 Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "power-law-spike",
    name: "The Power-Law Spike",
    tagline: "Exponential Hockey-Stick Multiplier",
    category: "Analytical",
    description:
      "A pure mathematical hockey-stick trajectory curving sharply upward and culminating in an outlier diamond beacon.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0A0E18" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Coordinate baseline */}
        <path d="M22 76 L78 76" stroke="#3F3F46" strokeWidth="2" strokeDasharray="3 3" />
        {/* Exponential Curve */}
        <path
          d="M24 74 C44 74, 58 68, 66 46 C70 34, 72 26, 74 20"
          stroke="#FF7700"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* 4-Point Outlier Diamond */}
        <path d="M74 12 L78 20 L86 24 L78 28 L74 36 L70 28 L62 24 L70 20 Z" fill="#FFA033" />
        <circle cx="74" cy="24" r="2.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "tech-matrix",
    name: "The Tech Matrix",
    tagline: "Minimalist Modernist Monogram",
    category: "Monogram",
    description:
      "Four precision rounded capsule pills engineered into an abstract digital F and Q, evoking Tokyo and Nordic tech aesthetics.",
    renderIcon: (sizeClass) => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
      >
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0A0D15" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        {/* Left vertical pillar */}
        <rect x="26" y="24" width="10" height="52" rx="5" fill="#FFFFFF" />
        {/* Top horizontal bar */}
        <rect x="42" y="24" width="32" height="10" rx="5" fill="#FFA033" />
        {/* Middle bar */}
        <rect x="42" y="44" width="22" height="10" rx="5" fill="#FF7700" />
        {/* Bottom accent pill / Q-dot */}
        <rect x="52" y="64" width="22" height="10" rx="5" fill="#EA580C" />
      </svg>
    ),
  },
];

interface LogoProps {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  forceLogoId?: LogoId;
}

export function Logo({
  variant = "full",
  size = "md",
  className = "",
  href,
  forceLogoId,
}: LogoProps) {
  // Read active logo preference from localStorage
  const [selectedId, setSelectedId] = useState<LogoId>(forceLogoId || "delta-vertex");

  useEffect(() => {
    if (forceLogoId) {
      setSelectedId(forceLogoId);
      return;
    }

    const saved = localStorage.getItem("finiq-active-logo") as LogoId | null;
    if (saved && LOGO_COLLECTION.some((l) => l.id === saved)) {
      setSelectedId(saved);
    }

    const handler = () => {
      const updated = localStorage.getItem("finiq-active-logo") as LogoId | null;
      if (updated && LOGO_COLLECTION.some((l) => l.id === updated)) {
        setSelectedId(updated);
      }
    };

    window.addEventListener("finiq-logo-change", handler);
    return () => window.removeEventListener("finiq-logo-change", handler);
  }, [forceLogoId]);

  const activeDef =
    LOGO_COLLECTION.find((l) => l.id === selectedId) || LOGO_COLLECTION[0];

  const iconDimensions = {
    sm: { box: "w-7 h-7" },
    md: { box: "w-8.5 h-8.5" },
    lg: { box: "w-11 h-11" },
  }[size];

  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 select-none group transition-transform active:scale-[0.98] ${className}`}
    >
      {/* Dynamic Selected Icon Mark */}
      {variant !== "wordmark" && (
        <div className={`relative ${iconDimensions.box} shrink-0 drop-shadow-[0_2px_12px_rgba(255,128,0,0.35)] transition-transform duration-300 group-hover:scale-105`}>
          {activeDef.renderIcon("w-full h-full")}
        </div>
      )}

      {/* Wordmark */}
      {variant !== "icon" && (
        <div className="flex items-baseline">
          <span className={`font-black tracking-tighter text-foreground ${textSize}`}>
            Fin
          </span>
          <span
            className={`font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 ${textSize}`}
          >
            IQ
          </span>
          <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(255,128,0,0.8)]" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
