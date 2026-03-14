"use client";

import { useState, useEffect } from "react";

const HERO_URL =
  "https://pub-54abc7dd204845bb8da6cc0318821757.r2.dev/clawford/hero-bg-dark.webp";

export default function HeroBackground() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = HERO_URL;
    if (img.complete) {
      setLoaded(true);
    } else {
      img.onload = () => setLoaded(true);
    }
  }, []);

  return (
    <>
      {/* Loading spinner — fades out when image is ready */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white transition-opacity duration-500 dark:bg-zinc-950 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <svg
          className="h-10 w-10 animate-spin text-zinc-300 dark:text-zinc-600"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

      {/* Background image — always rendered, spinner covers it until ready */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_URL}')` }}
      />
    </>
  );
}
