"use client";

import React from "react";

interface CharacterGlowProps {
  text: string;
  className?: string;
}

export function CharacterGlow({ text, className = "" }: CharacterGlowProps) {
  const words = text.split(" ");

  return (
    <span className={`inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 select-none ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap">
          {word.split("").map((char, cIdx) => (
            <span
              key={cIdx}
              className="inline-block cursor-pointer transition-all duration-150 ease-out hover:-translate-y-1.5 hover:scale-125 text-orange-500 dark:text-orange-400 hover:text-amber-300 dark:hover:text-amber-200 hover:drop-shadow-[0_0_24px_rgba(255,140,0,1)] hover:drop-shadow-[0_0_10px_rgba(255,200,80,0.9)] hover:z-20 relative active:scale-110"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
