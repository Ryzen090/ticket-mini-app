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
      setIsScrolled(window.scrollY > 20);
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
          ? "bg-[#061224]/95 backdrop-blur-md shadow-lg"
          : "bg-[#061224]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <nav className="h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <MyImage
              src="/logo_white.svg"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
            />

            <div className="hidden sm:block">
              <div className="text-white font-bold text-lg uppercase tracking-wide">
                United
              </div>
              <div className="text-slate-400 text-[10px] uppercase tracking-widest">
                Football Club
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleGetTicketsClick}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide transition shadow-lg cursor-pointer"
          >
            Get Tickets
          </button>
        </nav>
      </div>
    </header>
  );
}
