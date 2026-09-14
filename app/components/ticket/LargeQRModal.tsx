import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { SVGQRCode } from "./CPLMatchTicket";
import { GET_PAYMENT_STATUS } from "@/app/service/payment";

import "swiper/css";
import "swiper/css/pagination";

export interface LargeQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber?: string;
  batchOrder?: string;
  zoneId: string;
  zoneName?: string;
  gate?: string;
  seat?: string;
  category?: string;
  priceUsd?: number;
  matchTitleKhmer?: string;
  matchTitleEn?: string;
  date?: string;
  time?: string;
  stadiumEn?: string;
  cplLogoUrl?: string;
  totalQuantity?: number;
  initialGroupMode?: boolean;
  initialTicketIndex?: number;
  onScanSuccess?: () => void;
}

export const LargeQRModal: React.FC<LargeQRModalProps> = ({
  isOpen,
  onClose,
  ticketNumber,
  batchOrder,
  zoneId,
  zoneName = "Zone Stand",
  gate = "GATE 04",
  category = "CAT A",
  totalQuantity = 1,
  initialGroupMode = false,
  initialTicketIndex = 0,
  onScanSuccess,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isGroupMode, setIsGroupMode] = useState<boolean>(initialGroupMode);
  const [activeTicketIndex, setActiveTicketIndex] =
    useState<number>(initialTicketIndex);
  const [scannedStatus, setScannedStatus] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsGroupMode(initialGroupMode);
      const safeIndex = Math.min(
        Math.max(0, initialTicketIndex),
        Math.max(0, totalQuantity - 1),
      );
      setActiveTicketIndex(safeIndex);
      setCopied(false);
      setScannedStatus(null);

      setTimeout(() => {
        if (swiperRef.current && !swiperRef.current.destroyed) {
          swiperRef.current.slideTo(safeIndex, 0);
        }
      }, 50);
    }
  }, [isOpen, initialGroupMode, initialTicketIndex, totalQuantity]);

  // Real-time scan check polling while QR is open
  useEffect(() => {
    if (!isOpen) return;
    const orderToPoll = batchOrder || ticketNumber;
    if (!orderToPoll) return;

    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        const res = await GET_PAYMENT_STATUS(orderToPoll);
        const rawData = res?.data?.data || res?.data;
        const status = Array.isArray(rawData)
          ? rawData[0]?.status?.toUpperCase()
          : rawData?.status?.toUpperCase();

        if (
          status === "REDEEMED" ||
          status === "USED" ||
          status === "SCANNED"
        ) {
          if (isMounted) {
            setScannedStatus(status);
            if (onScanSuccess) {
              onScanSuccess();
            }
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("reload-tickets"));
            }
          }
        }
      } catch (err) {
        // silently fallback
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [isOpen, batchOrder, ticketNumber, onScanSuccess]);

  if (!isOpen) return null;

  // Generate list of all individual tickets
  const totalCount = Math.max(1, totalQuantity);
  const allTickets = Array.from({ length: totalCount }).map((_, idx) => {
    const itemSeat = `S-${14 + idx * 2}`;
    const baseNum = batchOrder || ticketNumber;
    const itemTicketNum = baseNum
      ? totalCount > 1 && !baseNum.endsWith(`-${idx + 1}`)
        ? `${baseNum}-${idx + 1}`
        : baseNum
      : `CPL-2026-${(884920 + idx * 137).toString()}`;
    return {
      index: idx,
      seat: itemSeat,
      ticketNum: itemTicketNum,
      qrValue:
        baseNum || `TICKET:${itemTicketNum}:${category}:${zoneId}:${itemSeat}`,
    };
  });

  const currentTicket = allTickets[activeTicketIndex] || allTickets[0];
  const groupSeatList = allTickets.map((t) => t.seat);
  const groupPassId =
    batchOrder || `CPL-GROUP-${totalQuantity}X-${zoneId}-884920`;
  const groupQrValue =
    batchOrder ||
    `GROUP_PASS:CPL2026:${totalQuantity}_PERSONS:${zoneId}:${category}:${groupSeatList.join(",")}:${groupPassId}`;

  // Fixed: Dynamically updates to match the swiped ticket's number or group pass ID
  const displayedPassId = isGroupMode
    ? groupPassId
    : totalQuantity > 1
      ? currentTicket.ticketNum
      : ticketNumber || currentTicket.ticketNum;

  const handleCopyPassId = () => {
    navigator.clipboard?.writeText(displayedPassId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 max-w-md w-full bg-gradient-to-b from-[#0b172a] via-[#071326] to-[#040d1a] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3.5 text-white overflow-hidden my-auto max-h-[95vh] overflow-y-auto">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white">
                {isGroupMode
                  ? `Group Master Pass (${totalQuantity} Tickets)`
                  : totalQuantity > 1
                    ? `Scan Pass (${activeTicketIndex + 1}/${totalQuantity})`
                    : "Scan Pass"}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {isGroupMode
                ? `Scan for ${totalQuantity}`
                : `Stand (${zoneName})`}
            </p>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
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

        {/* Multi-Ticket Mode Switcher */}
        {totalQuantity > 1 && (
          <div className="relative z-10">
            <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setIsGroupMode(false)}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isGroupMode
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Scan Passes {totalQuantity}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGroupMode(true)}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isGroupMode
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Master QR (Group)</span>
              </button>
            </div>
          </div>
        )}

        {/* Center Extra-Large QR Code Swiper / Viewer */}
        <div className="flex flex-col items-center justify-center relative z-10 w-full py-1">
          {!isGroupMode && totalQuantity > 1 ? (
            /* Swiper Large QR Container */
            <div className="w-full">
              <style>{`
                .qr-only-swiper .swiper-pagination {
                  position: relative;
                  margin-top: 10px;
                  bottom: 0;
                }
                .qr-only-swiper .swiper-pagination-bullet {
                  background: #64748b;
                  opacity: 0.5;
                  transition: all 0.3s ease;
                  width: 8px;
                  height: 8px;
                }
                .qr-only-swiper .swiper-pagination-bullet-active {
                  background: #ef4444;
                  opacity: 1;
                  width: 22px;
                  border-radius: 9999px;
                }
              `}</style>

              <Swiper
                modules={[Pagination, Keyboard, A11y]}
                spaceBetween={16}
                slidesPerView={1}
                grabCursor={true}
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                initialSlide={activeTicketIndex}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                  setActiveTicketIndex(swiper.activeIndex);
                }}
                className="qr-only-swiper"
              >
                {allTickets.map((t, idx) => (
                  <SwiperSlide key={t.ticketNum}>
                    <div className="relative p-5 sm:p-6 bg-white rounded-3xl shadow-2xl border-2 border-slate-200 group max-w-[320px] sm:max-w-[350px] mx-auto">
                      <div className="w-60 h-60 sm:w-68 sm:h-68 flex items-center justify-center select-none mx-auto">
                        <SVGQRCode
                          value={t.qrValue}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            /* Single Extra-Large QR Card */
            <div className="relative p-5 sm:p-6 bg-white rounded-3xl shadow-2xl border-2 border-slate-200 group max-w-[320px] sm:max-w-[350px] w-full mx-auto">
              <div className="w-60 h-60 sm:w-68 sm:h-68 flex items-center justify-center select-none mx-auto">
                <SVGQRCode
                  value={isGroupMode ? groupQrValue : currentTicket.qrValue}
                  className="w-full h-full"
                />
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>
                    {isGroupMode
                      ? `GROUP PASS`
                      : `MATCH PASS • ${currentTicket.seat}`}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Admin Scan Status Tag */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Present to Turnstile Scanner / Gate Steward</span>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 relative z-10">
          <button
            type="button"
            onClick={handleCopyPassId}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-[10px] font-mono">
              {copied ? "✓ Copied" : displayedPassId}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-xs tracking-wider transition-all shadow-md shadow-red-950/50 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LargeQRModal;
