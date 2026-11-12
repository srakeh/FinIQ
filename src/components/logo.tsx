import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

export function Logo({
  variant = "full",
  size = "md",
  className = "",
  href,
}: LogoProps) {
  const iconDimensions = {
    sm: { width: 28, height: 28, box: "w-7 h-7" },
    md: { width: 34, height: 34, box: "w-8.5 h-8.5" },
    lg: { width: 44, height: 44, box: "w-11 h-11" },
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
      {/* Aerodynamic McLaren-styled FinIQ Speedmark Delta Icon */}
      {variant !== "wordmark" && (
        <div className={`relative ${iconDimensions.box} shrink-0`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_2px_12px_rgba(255,128,0,0.4)] transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              {/* Primary Papaya Gradient */}
              <linearGradient id="papaya-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA033" />
                <stop offset="45%" stopColor="#FF7700" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>

              {/* Carbon Shadow Gradient */}
              <linearGradient id="carbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272A" />
                <stop offset="100%" stopColor="#090D16" />
              </linearGradient>

              {/* Ambient Glow Filter */}
              <filter id="mclaren-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Rounded Carbon Chassis Background */}
            <rect
              x="4"
              y="4"
              width="92"
              height="92"
              rx="24"
              fill="url(#carbon-grad)"
              stroke="rgba(255, 128, 0, 0.25)"
              strokeWidth="2"
            />

            {/* Aerodynamic Speedmark Wing - Upper Arm */}
            <path
              d="M26 30 C35 24, 65 22, 78 28 C74 34, 52 38, 38 41 L26 43 Z"
              fill="url(#papaya-grad)"
              filter="url(#mclaren-glow)"
            />

            {/* Dynamic FinIQ F-Mid Vector & Upward Trajectory Arrow */}
            <path
              d="M32 46 C42 43, 60 41, 68 47 C62 52, 48 53, 40 55 L32 57 Z"
              fill="#FFA033"
            />

            {/* High-Velocity Carbon Spine & Telemetry Anchor */}
            <path
              d="M28 26 L38 26 L29 76 L21 76 Z"
              fill="url(#papaya-grad)"
            />

            {/* Glowing Apex Telemetry Node */}
            <circle cx="78" cy="28" r="4.5" fill="#FFFFFF" />
            <circle cx="78" cy="28" r="7" stroke="#FF7700" strokeWidth="2" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* FinIQ Typography Wordmark */}
      {variant !== "icon" && (
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tighter text-foreground ${textSize}`}
          >
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
