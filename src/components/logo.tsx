"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export type LogoId =
  | "lens-inspection-f" // NEW: F inside Magnifying Glass Q
  | "lens-interlocking" // NEW: Monolith FQ Loupe
  | "lens-tech-matrix"  // NEW: Tech Matrix Pills + Loupe
  | "lens-telemetry-fq" // NEW: Ascending Telemetry F + Loupe Q
  | "lens-crosshair-scout" // NEW: Due Diligence Loupe with Chart
  | "ascending-horizon" // User favorite #4
  | "fq-monolith"       // User favorite #5
  | "tech-matrix"       // User favorite #10
  | "delta-vertex"      // Original
  | "quantum-nexus"
  | "hex-prism"
  | "falcon-wing"
  | "sovereign-shield"
  | "power-law-spike";

export interface LogoDefinition {
  id: LogoId;
  name: string;
  tagline: string;
  category: "Due Diligence Lens" | "Geometric" | "Monogram" | "Analytical" | "Abstract";
  description: string;
  isNewHighlight?: boolean;
  renderIcon: (sizeClass: string) => React.ReactNode;
}

export const LOGO_COLLECTION: LogoDefinition[] = [
  // =========================================================================
  // NEW DUE DILIGENCE LENS COLLECTION (Magnifying Glass Q Concepts)
  // =========================================================================
  {
    id: "lens-inspection-f",
    name: "The Inspection Focus",
    tagline: "F Inside Magnifying Glass Q (Due Diligence Core)",
    category: "Due Diligence Lens",
    isNewHighlight: true,
    description:
      "The letter Q forms a precision optical magnifying glass with a 45° handle. Inside the lens, the letter F (Finance) is illuminated and brought into sharp focus with glass glare.",
    renderIcon: (sizeClass) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <defs>
          <linearGradient id="lif-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA033" />
            <stop offset="50%" stopColor="#FF7700" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="lif-chassis" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E2433" />
            <stop offset="100%" stopColor="#0B0F17" />
          </linearGradient>
        </defs>
        {/* Rounded Carbon Chassis */}
        <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#lif-chassis)" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        
        {/* Lens Interior Glow */}
        <circle cx="48" cy="46" r="23" fill="rgba(255, 128, 0, 0.08)" />

        {/* Magnifying Glass Lens Rim (Body of Q) */}
        <circle cx="48" cy="46" r="24" stroke="url(#lif-orange)" strokeWidth="6" />

        {/* Loupe Glass Glare Reflection */}
        <path d="M33 34 C37 28, 47 25, 57 27" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

        {/* The 'F' Inside the Magnifying Lens */}
        {/* Vertical Stem */}
        <rect x="39" y="32" width="5.5" height="28" rx="2.5" fill="#FFFFFF" />
        {/* Top Horizontal Bar */}
        <rect x="39" y="32" width="17" height="5.5" rx="2.5" fill="#FFFFFF" />
        {/* Mid Horizontal Bar */}
        <rect x="39" y="43.5" width="12.5" height="5" rx="2" fill="#FFA033" />

        {/* Magnifying Glass Handle (Tail of Q) */}
        <path d="M66 64 L81 79" stroke="#FF7700" strokeWidth="8" strokeLinecap="round" />
        <path d="M68 66 L79 77" stroke="#FFA033" strokeWidth="4" strokeLinecap="round" />

        {/* Telemetry Focus Node */}
        <circle cx="56.5" cy="46" r="2" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "lens-interlocking",
    name: "The Monolith Loupe",
    tagline: "Interlocking F & Magnifying Glass Q (Swiss Precision)",
    category: "Due Diligence Lens",
    isNewHighlight: true,
    description:
      "A seamless evolution of Option #05 (FQ Monolith). The structural F stands proudly on the left while its horizontal bars interlock with the magnifying glass circle of the Q.",
    renderIcon: (sizeClass) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <defs>
          <linearGradient id="lil-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA033" />
            <stop offset="100%" stopColor="#FF7700" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0A0D15" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        
        {/* Magnifying Glass Circular Body of Q */}
        <circle cx="54" cy="48" r="23" stroke="url(#lil-orange)" strokeWidth="7" />

        {/* F Stem */}
        <rect x="29" y="25" width="7.5" height="48" rx="3.5" fill="#FFFFFF" />
        {/* F Top Bar extending over Q */}
        <rect x="29" y="25" width="28" height="7.5" rx="3.5" fill="#FFFFFF" />
        {/* F Mid Bar entering inside the Q lens */}
        <rect x="29" y="44" width="20" height="6.5" rx="3" fill="#FFA033" />

        {/* Magnifying Glass Loupe Handle */}
        <path d="M70 64 L83 77" stroke="#FF7700" strokeWidth="8" strokeLinecap="round" />
        <circle cx="83" cy="77" r="3" fill="#FFA033" />

        {/* Glass Crescent Highlight */}
        <path d="M44 33 C49 29, 58 28, 65 31" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "lens-telemetry-fq",
    name: "The Telemetry Loupe",
    tagline: "Ascending Chart F + Magnifying Glass Q",
    category: "Due Diligence Lens",
    isNewHighlight: true,
    description:
      "Fuses Option #04 (Ascending Horizon) with the magnifying glass. The F is formed by forward-slanted telemetry bars, while the Q acts as a lens with a growth vector inside.",
    renderIcon: (sizeClass) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0B0F18" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        
        {/* F: Forward-Slanted Telemetry Pillar & Bars */}
        <rect x="21" y="28" width="6.5" height="44" rx="3" fill="#FFFFFF" />
        {/* Top Telemetry Bar */}
        <path d="M21 28 L40 28 L43 35 L21 35 Z" fill="#FFA033" />
        {/* Mid Telemetry Bar */}
        <path d="M21 44 L36 44 L38 50 L21 50 Z" fill="#FF7700" />

        {/* Q: Magnifying Glass Lens */}
        <circle cx="62" cy="46" r="19" stroke="#FF7700" strokeWidth="5.5" />
        
        {/* Inside Q: Rising Growth Vector (Outlier Dot) */}
        <path d="M53 52 L59 46 L64 48 L71 39" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="71" cy="39" r="2.5" fill="#FFA033" />

        {/* Loupe Handle */}
        <path d="M75 59 L85 69" stroke="#FF7700" strokeWidth="6.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "lens-tech-matrix",
    name: "The Tech Pill Loupe",
    tagline: "Tech Matrix Pills + Minimalist Loupe",
    category: "Due Diligence Lens",
    isNewHighlight: true,
    description:
      "Inherits Option #10 (Tech Matrix) rounded capsule pill aesthetic. An ultra-modern capsule 'F' alongside a circular pill magnifying glass 'Q'.",
    renderIcon: (sizeClass) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0A0E17" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        
        {/* F: Capsule Pill Elements */}
        {/* Vertical Stem */}
        <rect x="24" y="26" width="7" height="48" rx="3.5" fill="#FFFFFF" />
        {/* Top Pill */}
        <rect x="34" y="26" width="18" height="7" rx="3.5" fill="#FFA033" />
        {/* Mid Pill */}
        <rect x="34" y="44" width="13" height="7" rx="3.5" fill="#FF7700" />

        {/* Q: Magnifying Glass Ring */}
        <circle cx="67" cy="48" r="18" stroke="#FF7700" strokeWidth="5.5" />
        {/* Pill Handle */}
        <path d="M79 61 L88 70" stroke="#EA580C" strokeWidth="6" strokeLinecap="round" />

        {/* Center Precision Reticle */}
        <circle cx="67" cy="48" r="3" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "lens-crosshair-scout",
    name: "The Forensic Radar Loupe",
    tagline: "Due Diligence Loupe with Venture Crosshair",
    category: "Due Diligence Lens",
    isNewHighlight: true,
    description:
      "A forensic intelligence mark. The magnifying glass features subtle target crosshairs and a 50x hockey-stick curve inside, capturing thorough angel auditing.",
    renderIcon: (sizeClass) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#090D16" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        
        {/* Framing 'F' Bracket */}
        <path d="M22 72 L22 28 L40 28" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 45 L35 45" stroke="#FFA033" strokeWidth="4.5" strokeLinecap="round" />

        {/* Magnifying Glass Q */}
        <circle cx="58" cy="48" r="22" stroke="#FF7700" strokeWidth="6" />
        {/* Handle */}
        <path d="M73 64 L85 76" stroke="#FFA033" strokeWidth="7.5" strokeLinecap="round" />

        {/* Internal Crosshairs */}
        <line x1="58" y1="31" x2="58" y2="65" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="41" y1="48" x2="75" y2="48" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="2 2" />

        {/* Hockey-Stick Alpha Curve Inside Lens */}
        <path d="M46 56 C52 56, 56 54, 62 42 L68 38" stroke="#FFA033" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="68" cy="38" r="2.5" fill="#FFFFFF" />
      </svg>
    ),
  },

  // =========================================================================
  // USER'S FAVORITE BASE MODELS
  // =========================================================================
  {
    id: "fq-monolith",
    name: "The FQ Monolith",
    tagline: "Interlocking Swiss Typographic Ligature",
    category: "Monogram",
    description:
      "A minimalist architectural lockup merging the letter F with a circular Q whose tail shoots forward as an upward venture vector.",
    renderIcon: (sizeClass) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#090D15" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        <circle cx="56" cy="50" r="24" stroke="#FF7700" strokeWidth="8" />
        <rect x="30" y="26" width="8" height="48" rx="3" fill="#FFFFFF" />
        <rect x="30" y="26" width="28" height="8" rx="3" fill="#FFFFFF" />
        <rect x="30" y="44" width="20" height="7" rx="3" fill="#FFA033" />
        <path d="M68 62 L82 76" stroke="#FFA033" strokeWidth="8" strokeLinecap="round" />
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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <defs>
          <linearGradient id="ah-bar" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#FFA033" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0C1019" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        <rect x="25" y="52" width="10" height="24" rx="4" transform="skewX(-15)" fill="#71717A" />
        <rect x="44" y="38" width="10" height="38" rx="4" transform="skewX(-15)" fill="url(#ah-bar)" />
        <rect x="63" y="22" width="10" height="54" rx="4" transform="skewX(-15)" fill="#FFA033" />
        <circle cx="76" cy="22" r="3" fill="#FFFFFF" />
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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0A0D15" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        <rect x="26" y="24" width="10" height="52" rx="5" fill="#FFFFFF" />
        <rect x="42" y="24" width="32" height="10" rx="5" fill="#FFA033" />
        <rect x="42" y="44" width="22" height="10" rx="5" fill="#FF7700" />
        <rect x="52" y="64" width="22" height="10" rx="5" fill="#EA580C" />
      </svg>
    ),
  },

  // =========================================================================
  // OTHER INSTITUTIONAL OPTIONS
  // =========================================================================
  {
    id: "delta-vertex",
    name: "The Delta Vertex",
    tagline: "Venture Alpha & Compounding Trajectory",
    category: "Geometric",
    description:
      "A razor-sharp geometric Delta (Δ) with faceted aerodynamic arms and an apex breakout vector, symbolizing outsized venture returns.",
    renderIcon: (sizeClass) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
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
        <path d="M50 20 L24 72 L42 72 L50 48 Z" fill="url(#dv-orange)" />
        <path d="M50 20 L76 72 L58 72 L50 48 Z" fill="#EA580C" />
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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <defs>
          <linearGradient id="qn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA033" />
            <stop offset="50%" stopColor="#FF7700" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0D111A" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        <path
          d="M32 50 C32 38, 42 34, 50 50 C58 66, 68 62, 68 50 C68 38, 58 34, 50 50 C42 66, 32 62, 32 50 Z"
          stroke="url(#qn-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0A0E17" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        <polygon points="50,22 76,36 50,50 24,36" fill="#FFA033" />
        <polygon points="24,36 50,50 50,78 24,64" fill="#EA580C" />
        <polygon points="50,50 76,36 76,64 50,78" fill="#9A3412" />
        <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <defs>
          <linearGradient id="fw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA033" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#080C14" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        <path d="M22 68 L54 22 L78 22 L46 68 Z" fill="url(#fw-grad)" />
        <path d="M38 76 L62 42 L72 42 L48 76 Z" fill="#FFFFFF" />
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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#090E17" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        <path d="M50 20 L76 28 C76 56, 50 78, 50 78 C50 78, 24 56, 24 28 Z" fill="#1A2234" stroke="#FF7700" strokeWidth="3" />
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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="#0A0E18" stroke="rgba(255,128,0,0.3)" strokeWidth="2" />
        <path d="M22 76 L78 76" stroke="#3F3F46" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M24 74 C44 74, 58 68, 66 46 C70 34, 72 26, 74 20" stroke="#FF7700" strokeWidth="7" strokeLinecap="round" />
        <path d="M74 12 L78 20 L86 24 L78 28 L74 36 L70 28 L62 24 L70 20 Z" fill="#FFA033" />
        <circle cx="74" cy="24" r="2.5" fill="#FFFFFF" />
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
  // Default to the new #1 "The Inspection Focus" (F inside Magnifying Glass Q)
  const [selectedId, setSelectedId] = useState<LogoId>(forceLogoId || "lens-inspection-f");

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
