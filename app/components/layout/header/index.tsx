"use client";

import Link from "next/link";
import React from "react";
import MyImage from "../../image";

interface HeaderProps {
  onGetTickets?: () => void;
}

export default function Header({ onGetTickets }: HeaderProps = {}) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetTicketsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onGetTickets) {
      onGetTickets();
    } else {
      window.dispatchEvent(new CustomEvent("open-ticket-modal"));
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
          : "bg-zinc-950/70 backdrop-blur-lg border-b border-zinc-900"
      }`}
    >
      {/* Top ambient highlight beam */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <nav className="h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-xl blur-xs group-hover:from-indigo-500/40 group-hover:to-emerald-500/40 transition duration-300" />
              <div className="relative p-1.5 sm:p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner group-hover:border-zinc-700 transition duration-300">
                <MyImage
                  src="/logo_white.svg"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <span>United</span>
                <span className="text-indigo-400 font-black">FC</span>
              </div>
              <div className="text-zinc-400 text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Matchday Portal</span>
              </div>
            </div>
          </Link>

          {/* Center Matchday Badge (Hidden on mobile, visible on md+) */}
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner backdrop-blur-md">
            <span className="text-xs font-semibold text-zinc-300">
              Cambodian Premier League
            </span>
            <span className="text-zinc-700">&bull;</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              Matchweek 18
            </span>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGetTicketsClick}
              className="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-emerald-900/20 cursor-pointer overflow-hidden"
            >
              {/* Shimmer effect highlight */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <span className="relative z-10">Get Tickets</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
