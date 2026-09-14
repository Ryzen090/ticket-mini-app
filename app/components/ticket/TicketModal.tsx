"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { CPLMatchTicket, TicketTheme } from "./CPLMatchTicket";
import { LargeQRModal } from "./LargeQRModal";
import { GET_PAYMENTS } from "@/app/service/payment";

import "swiper/css";
import "swiper/css/pagination";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: {
    id: string;
    name: string;
    floor: number;
    price: number;
    capacity?: number;
    available?: number;
  };
  quantity?: number;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  zone,
  quantity = 1,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<TicketTheme>("crimson");
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>(0);
  const [showLargeQr, setShowLargeQr] = useState<boolean>(false);
  const [groupQrMode, setGroupQrMode] = useState<boolean>(false);
  const [apiTickets, setApiTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const fetchOfficialTickets = React.useCallback(
    async (isInitial: boolean = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
        const res = await GET_PAYMENTS();
        const items = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setApiTickets(items);
      } catch (err) {
        console.warn("Could not fetch official tickets from API:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    setCurrentTicketIndex(0);
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }

    // Initial fetch
    fetchOfficialTickets(true);

    // Auto-poll every 2.5 seconds while modal is open so scans reflect immediately
    const pollInterval = setInterval(() => {
      fetchOfficialTickets(false);
    }, 2500);

    const handleReload = () => {
      fetchOfficialTickets(false);
    };

    window.addEventListener("reload-tickets", handleReload);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("reload-tickets", handleReload);
    };
  }, [isOpen, fetchOfficialTickets]);

  if (!isOpen || !zone) return null;

  const activeTicket = apiTickets[currentTicketIndex];
  const activeZoneId = activeTicket?._id || zone.id;
  const activePrice = activeTicket?.price || activeTicket?.total || zone.price;
  const activeTicketNum =
    activeTicket?.order ||
    `CPL-2026-${(884920 + currentTicketIndex * 137).toString()}`;
  const activeSeat = `S-${14 + currentTicketIndex * 2}`;

  const getGateNumber = (zId: string) =>
    zId.startsWith("A")
      ? "GATE 02"
      : zId.startsWith("B")
        ? "GATE 04"
        : zId.startsWith("C")
          ? "GATE 06"
          : "GATE 08";

  const getCategory = (zId: string) =>
    zId.startsWith("A")
      ? "CAT A"
      : zId.startsWith("B")
        ? "CAT B"
        : zId.startsWith("C")
          ? "CAT C"
          : "VIP";

  const activeGate = getGateNumber(activeZoneId);
  const activeCategory = getCategory(activeZoneId);

  const handleOpenSingleQr = () => {
    setGroupQrMode(false);
    setShowLargeQr(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-scrollbar bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
        <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

        <div className="relative z-10 max-w-5xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 text-zinc-100 overflow-hidden">
          {/* Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 relative z-10">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white">
                  Official Match Pass
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cambodian Premier League
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedTheme("crimson")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedTheme === "crimson"
                      ? "bg-zinc-800 text-white shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Crimson
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme("white")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedTheme === "white"
                      ? "bg-zinc-800 text-white shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Silver
                </button>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => fetchOfficialTickets(false)}
                disabled={isLoading || isRefreshing}
                title="Reload Passes"
                aria-label="Reload Passes"
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-zinc-700 cursor-pointer disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 ${
                    isRefreshing || isLoading
                      ? "animate-spin text-indigo-400"
                      : "transition-transform hover:rotate-45"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-zinc-700 cursor-pointer font-mono"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Body Content */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium text-zinc-400 font-mono">
                Loading official passes...
              </span>
            </div>
          ) : apiTickets.length === 0 ? (
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  No Official Tickets Found
                </h3>
                <p className="text-xs text-zinc-400">
                  You have not purchased any matchday passes yet. Please select
                  a stand on the map to complete your reservation.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchOfficialTickets(true)}
                  disabled={isLoading || isRefreshing}
                  className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold uppercase text-xs tracking-wider transition-all border border-zinc-700 cursor-pointer flex items-center gap-2"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${isRefreshing || isLoading ? "animate-spin text-indigo-400" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase text-xs tracking-wider transition-all cursor-pointer"
                >
                  Book a Ticket
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Swiper Tickets Carousel */}
              <div className="py-2 relative z-10">
                <style>{`
                  .ticket-swiper .swiper-pagination-bullet {
                    background: #52525b;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                  }
                  .ticket-swiper .swiper-pagination-bullet-active {
                    background: #6366f1;
                    opacity: 1;
                    width: 20px;
                    border-radius: 4px;
                  }
                `}</style>

                <Swiper
                  modules={[Pagination, Keyboard, A11y]}
                  spaceBetween={24}
                  slidesPerView={1.05}
                  grabCursor={true}
                  pagination={{ clickable: true }}
                  keyboard={{ enabled: true }}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => {
                    setCurrentTicketIndex(swiper.activeIndex);
                  }}
                  className="ticket-swiper pb-10"
                >
                  {apiTickets.map((apiItem, idx) => {
                    const itemZoneId = apiItem?._id || zone.id;
                    const itemPrice =
                      apiItem?.price || apiItem?.total || zone.price;
                    const itemTicketNum =
                      apiItem?.order ||
                      `CPL-2026-${(884920 + idx * 137).toString()}`;
                    const itemGate = getGateNumber(itemZoneId);
                    const itemCategory = getCategory(itemZoneId);
                    const itemSeat = `S-${14 + idx * 2}`;

                    return (
                      <SwiperSlide key={idx}>
                        <div className="w-full overflow-x-auto no-scrollbar pb-4 pt-2 flex justify-center">
                          <div className="min-w-[640px] max-w-[920px] w-full transform transition-transform duration-300">
                            <CPLMatchTicket
                              zoneId={itemZoneId}
                              zoneName={zone.name}
                              priceUsd={itemPrice}
                              category={itemCategory}
                              stand={`Stand ${itemZoneId}`}
                              gate={itemGate}
                              seat={itemSeat}
                              ticketNumber={itemTicketNum}
                              theme={selectedTheme}
                              onQrClick={handleOpenSingleQr}
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>

              {/* Action Footer Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800 relative z-10 text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span>Pass ID:</span>
                  <code className="px-2 py-1 rounded bg-zinc-950 text-zinc-200 border border-zinc-800">
                    {activeTicket?.order}
                  </code>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenSingleQr}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Scan QR
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Large QR Modal */}
      {apiTickets.length > 0 && (
        <LargeQRModal
          isOpen={showLargeQr}
          onClose={() => {
            setShowLargeQr(false);
            fetchOfficialTickets(false);
          }}
          onScanSuccess={() => {
            fetchOfficialTickets(false);
          }}
          batchOrder={activeTicket?.batchOrder || activeTicket?.order}
          ticketNumber={activeTicketNum}
          zoneId={activeZoneId}
          zoneName={zone.name}
          gate={activeGate}
          seat={activeSeat}
          category={activeCategory}
          priceUsd={activePrice}
          totalQuantity={apiTickets.length || quantity}
          initialGroupMode={groupQrMode}
          initialTicketIndex={currentTicketIndex}
        />
      )}
    </>
  );
};

export default TicketModal;
