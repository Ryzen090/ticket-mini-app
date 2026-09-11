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
          ? "bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
          : "bg-[#030712]/70 backdrop-blur-lg border-b border-white/5"
      }`}
    >
      {/* Top ambient highlight beam */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <nav className="h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xs group-hover:from-emerald-500/40 group-hover:to-blue-500/40 transition duration-300" />
              <div className="relative p-1.5 sm:p-2 rounded-xl bg-[#061224]/90 border border-slate-700/60 shadow-inner group-hover:border-emerald-500/50 transition duration-300">
                <MyImage
                  src="/logo_white.svg"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-white font-extrabold text-base sm:text-lg uppercase tracking-wider flex items-center gap-1.5">
                <span>United</span>
                <span className="text-emerald-400 font-black">FC</span>
              </div>
              <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Matchday Live</span>
              </div>
            </div>
          </Link>

          {/* Center Matchday Badge (Hidden on mobile, visible on md+) */}
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/90 shadow-inner backdrop-blur-md">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="text-amber-400">🏆</span>
              Cambodian Premier League
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Matchweek 18
            </span>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGetTicketsClick}
              className="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden"
            >
              {/* Shimmer effect highlight */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <span className="relative z-10 font-black">Get Tickets</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
