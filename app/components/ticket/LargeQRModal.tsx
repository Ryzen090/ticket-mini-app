import React, { useState } from "react";
import { DEFAULT_CPL_LOGO, SVGQRCode } from "./CPLMatchTicket";

export interface LargeQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string;
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
}

export const LargeQRModal: React.FC<LargeQRModalProps> = ({
  isOpen,
  onClose,
  ticketNumber,
  zoneId,
  zoneName = "Zone Stand",
  gate = "GATE 04",
  seat = "S-18",
  category = "CAT A",
  priceUsd = 1.5,
  matchTitleKhmer = "ជម្រើសជើងឯកខេមបូឌានព្រីមៀរលីក ឆ្នាំ២០២៦/២៧",
  matchTitleEn = "CAMBODIAN PREMIER LEAGUE 2026/27",
  date = "18 / OCT / 2026",
  time = "18:00 PM",
  stadiumEn = "NATIONAL OLYMPIC STADIUM",
  cplLogoUrl = DEFAULT_CPL_LOGO,
  totalQuantity = 1,
  initialGroupMode = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isGroupMode, setIsGroupMode] = useState<boolean>(
    initialGroupMode || totalQuantity > 1,
  );
  const [batchCount, setBatchCount] = useState<number>(totalQuantity);

  if (!isOpen) return null;

  // Calculate batch seats and identifiers
  const effectiveBatchCount = isGroupMode
    ? Math.min(Math.max(1, batchCount), totalQuantity)
    : 1;

  const seatList = Array.from({ length: effectiveBatchCount }).map(
    (_, i) => `S-${14 + i * 2}`,
  );

  const groupPassId =
    effectiveBatchCount > 1
      ? `CPL-GROUP-${effectiveBatchCount}X-${zoneId}-${884920}`
      : ticketNumber;

  const groupQrValue =
    effectiveBatchCount > 1
      ? `GROUP_PASS:CPL2026:${effectiveBatchCount}_PERSONS:${zoneId}:${category}:${seatList.join(",")}:${groupPassId}`
      : `TICKET:${ticketNumber}:${category}:${zoneId}:${seat}`;

  const totalPrice = (priceUsd * effectiveBatchCount).toFixed(2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(groupPassId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 max-w-lg w-full bg-gradient-to-b from-[#0b172a] via-[#071326] to-[#040d1a] border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 text-white overflow-hidden my-auto max-h-[95vh] overflow-y-auto">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-lg">
              {effectiveBatchCount > 1 ? "👥" : "🎟️"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white">
                  {effectiveBatchCount > 1
                    ? `Group Master Pass (${effectiveBatchCount} Tickets)`
                    : "Matchday QR Pass"}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {effectiveBatchCount > 1
                  ? `Single Scan for ${effectiveBatchCount} Admissions • Turnstile Gate`
                  : `Stand ${zoneId} (${zoneName}) • Seat ${seat}`}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
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

        {/* Multi-Ticket Batch Quantity & 1-Scan Selector (When totalQuantity > 1) */}
        {totalQuantity > 1 && (
          <div className="relative z-10 p-3 bg-slate-900/90 rounded-2xl space-y-2.5 shadow-inner">
            {/* Stepper and Presets for 1-Scan Group */}
            {isGroupMode && (
              <div className="pt-2 border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    Admit in 1 QR:
                  </span>
                  <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                    <button
                      type="button"
                      disabled={effectiveBatchCount <= 1}
                      onClick={() =>
                        setBatchCount((prev) => Math.max(1, prev - 1))
                      }
                      className="w-7 h-7 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700/80 flex items-center justify-center text-white font-bold"
                    >
                      -
                    </button>
                    <span className="w-14 text-center font-bold text-sm text-amber-400">
                      {effectiveBatchCount} / {totalQuantity}
                    </span>
                    <button
                      type="button"
                      disabled={effectiveBatchCount >= totalQuantity}
                      onClick={() =>
                        setBatchCount((prev) =>
                          Math.min(totalQuantity, prev + 1),
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700/80 flex items-center justify-center text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets: Scan All 10, Scan 5, Scan 2 */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBatchCount(totalQuantity)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                      effectiveBatchCount === totalQuantity
                        ? "bg-red-600 text-white border-red-500"
                        : "bg-slate-800 text-slate-400 hover:text-white border-slate-700"
                    }`}
                  >
                    All ({totalQuantity})
                  </button>
                  {totalQuantity >= 5 && (
                    <button
                      type="button"
                      onClick={() => setBatchCount(5)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        effectiveBatchCount === 5
                          ? "bg-red-600 text-white border-red-500"
                          : "bg-slate-800 text-slate-400 hover:text-white border-slate-700"
                      }`}
                    >
                      5 Tickets
                    </button>
                  )}
                  {totalQuantity >= 2 && totalQuantity !== 2 && (
                    <button
                      type="button"
                      onClick={() => setBatchCount(2)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        effectiveBatchCount === 2
                          ? "bg-red-600 text-white border-red-500"
                          : "bg-slate-800 text-slate-400 hover:text-white border-slate-700"
                      }`}
                    >
                      2 Tickets
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Center QR Code Viewer Container */}
        <div className="flex flex-col items-center justify-center relative z-10 space-y-3">
          {/* Crisp White QR Container with Corner Brackets */}
          <div className="relative p-5 sm:p-6 bg-white rounded-3xl shadow-xl border-2 border-slate-200 group">
            {/* Viewfinder Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-slate-900 rounded-tl-lg pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-slate-900 rounded-tr-lg pointer-events-none" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-slate-900 rounded-bl-lg pointer-events-none" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-slate-900 rounded-br-lg pointer-events-none" />

            {/* Large Vector QR Code */}
            <div className="w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
              <SVGQRCode value={groupQrValue} className="w-full h-full" />
            </div>

            {/* Turnstile Pass Tag */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>
                  {effectiveBatchCount > 1
                    ? `GROUP PASS: ${effectiveBatchCount} PERSONS`
                    : "CPL MATCH PASS"}
                </span>
              </span>
              <span className="font-mono text-slate-600">{groupPassId}</span>
            </div>
          </div>

          {/* Seating Breakdown Grid */}
          <div className="w-full grid grid-cols-3 gap-2 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 text-center shadow-inner">
            <div className="p-1.5 sm:p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[9px] font-semibold text-slate-400 block uppercase">
                Stand / Gate
              </span>
              <span className="text-xs sm:text-sm font-bold text-red-400 uppercase">
                {zoneId} • {gate}
              </span>
            </div>
            <div className="p-1.5 sm:p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[9px] font-semibold text-slate-400 block uppercase">
                {effectiveBatchCount > 1
                  ? `Seats (${effectiveBatchCount}x)`
                  : "Seat Number"}
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase truncate block">
                {effectiveBatchCount > 1
                  ? `${seatList[0]} → ${seatList[seatList.length - 1]}`
                  : seat}
              </span>
            </div>
            <div className="p-1.5 sm:p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[9px] font-semibold text-slate-400 block uppercase">
                Pass Total
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase">
                ${totalPrice}
              </span>
            </div>
          </div>

          {/* Included Seats List when Group Pass */}
          {effectiveBatchCount > 1 && (
            <div className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Included Seats in this single scan:</span>
                <span className="text-emerald-400 font-bold">
                  {effectiveBatchCount} Admissions
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {seatList.map((st, i) => (
                  <span
                    key={st}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-mono font-bold"
                  >
                    #{i + 1} {st}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Turnstile Gate Instructions Notice */}
          <div className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-300">
            <span className="text-base shrink-0">💡</span>
            <p className="leading-tight text-[11px] sm:text-xs">
              {effectiveBatchCount > 1 ? (
                <>
                  Present this{" "}
                  <strong className="text-white">1 Master QR</strong> at the
                  turnstile gate optical scanner to admit your party of{" "}
                  <strong className="text-white">
                    {effectiveBatchCount} people
                  </strong>{" "}
                  automatically without scanning 1-by-1.
                </>
              ) : (
                <>
                  Present this QR code at{" "}
                  <strong className="text-white">{gate}</strong> turnstile
                  scanner for automatic gate admission.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2.5 border-t border-slate-800 relative z-10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-xs tracking-wider transition-all shadow-md shadow-red-950/50"
            >
              Back to Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeQRModal;
