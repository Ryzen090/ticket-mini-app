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
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentTicketIndex(0);
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }

    const fetchOfficialTickets = async () => {
      try {
        setIsLoading(true);
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
      }
    };

    fetchOfficialTickets();
  }, [isOpen]);

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-scrollbar bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

        <div className="relative z-10 max-w-5xl w-full bg-[#071326] border border-slate-700/80 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 text-white overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
                    Official Ticket
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Verified Pass
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Cambodian Premier League Season 2026/27 • Stand {activeZoneId}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedTheme("crimson")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedTheme === "crimson"
                      ? "bg-red-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="hidden sm:inline">Crimson Red</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme("white")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedTheme === "white"
                      ? "bg-slate-200 text-slate-900 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="hidden sm:inline">Silver White</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body Content */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
              <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">
                Loading your official passes...
              </span>
            </div>
          ) : apiTickets.length === 0 ? (
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 text-xl font-bold shadow-inner">
                CPL
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  No Official Tickets Found
                </h3>
                <p className="text-xs text-slate-400">
                  You have not purchased any matchday passes yet. Please select
                  a stand on the map to complete your reservation.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold uppercase text-xs tracking-wider transition-all shadow-lg shadow-red-950/40 cursor-pointer"
              >
                Book a Ticket
              </button>
            </div>
          ) : (
            <>
              {/* Swiper Tickets Carousel */}
              <div className="py-2 relative z-10">
                <style>{`
                  .ticket-swiper .swiper-pagination-bullet {
                    background: #94a3b8;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                  }
                  .ticket-swiper .swiper-pagination-bullet-active {
                    background: #ef4444;
                    opacity: 1;
                    width: 24px;
                    border-radius: 9999px;
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
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 relative z-10">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>Ticket Pass ID:</span>
                  <code className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-700 font-mono">
                    {activeTicketNum}
                  </code>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenSingleQr}
                    className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold uppercase text-xs tracking-wider transition-all shadow-lg shadow-red-950/40 cursor-pointer"
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
          onClose={() => setShowLargeQr(false)}
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
