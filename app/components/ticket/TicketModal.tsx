import React from "react";
import { CPLMatchTicket, TicketTheme } from "./CPLMatchTicket";
import { LargeQRModal } from "./LargeQRModal";

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
  const [selectedTheme, setSelectedTheme] =
    React.useState<TicketTheme>("crimson");
  const [currentTicketIndex, setCurrentTicketIndex] = React.useState<number>(0);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [showLargeQr, setShowLargeQr] = React.useState<boolean>(false);
  const [groupQrMode, setGroupQrMode] = React.useState<boolean>(false);

  if (!isOpen || !zone) return null;

  // Generate mock seat numbers for multiple tickets
  const gateNumber = zone.id.startsWith("A")
    ? "GATE 02"
    : zone.id.startsWith("B")
      ? "GATE 04"
      : zone.id.startsWith("C")
        ? "GATE 06"
        : "GATE 08";

  const currentSeat = `S-${14 + currentTicketIndex * 2}`;
  const currentTicketNum = `CPL-2026-${(884920 + currentTicketIndex * 137).toString()}`;
  const categoryName = zone.id.startsWith("A")
    ? "CAT A"
    : zone.id.startsWith("B")
      ? "CAT B"
      : zone.id.startsWith("C")
        ? "CAT C"
        : "VIP";

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentTicketNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSingleQr = () => {
    setGroupQrMode(false);
    setShowLargeQr(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        {/* Backdrop click to dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Container */}
        <div className="relative z-10 max-w-5xl w-full bg-[#071326] border border-slate-700/80 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 text-white overflow-hidden">
          {/* Glow ambient effects behind modal */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-lg">
                🎟️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
                    Official Ticket
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Verified Pass
                  </span>
                  {quantity > 1 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {quantity} Tickets
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Cambodian Premier League Season 2026/27 • Stand {zone.id} (
                  {zone.name})
                </p>
              </div>
            </div>

            {/* Action Controls in Header: QR Zoom, Group Pass, Theme Picker & Close */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Theme Toggle (Crimson Red / White Silver) */}
              <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedTheme("crimson")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedTheme === "white"
                      ? "bg-slate-200 text-slate-900 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="hidden sm:inline">Silver White</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
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

          {/* Dual 3D Stack / Perspective Preview Presentation or Single Ticket */}
          <div className="py-2 relative z-10 flex flex-col items-center justify-center">
            {/* Main Ticket Display */}
            <div className="w-full overflow-x-auto pb-4 pt-2 flex justify-center">
              <div className="min-w-[640px] max-w-[920px] w-full transform transition-transform duration-300">
                <CPLMatchTicket
                  zoneId={zone.id}
                  zoneName={zone.name}
                  priceUsd={zone.price}
                  category={categoryName}
                  stand={`Stand ${zone.id}`}
                  gate={gateNumber}
                  seat={currentSeat}
                  ticketNumber={currentTicketNum}
                  theme={selectedTheme}
                  onQrClick={handleOpenSingleQr}
                />
              </div>
            </div>
          </div>

          {/* Action Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 relative z-10">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Ticket Pass ID:</span>
              <code className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-700 font-mono">
                {currentTicketNum}
              </code>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-1"
              ></button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleOpenSingleQr}
                className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <span>Scan</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold uppercase text-xs tracking-wider transition-all shadow-lg shadow-red-950/40"
              >
                Done & Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Large QR Scanner Pass Modal with Multi-Ticket & Batch Support */}
      <LargeQRModal
        isOpen={showLargeQr}
        onClose={() => setShowLargeQr(false)}
        ticketNumber={currentTicketNum}
        zoneId={zone.id}
        zoneName={zone.name}
        gate={gateNumber}
        seat={currentSeat}
        category={categoryName}
        priceUsd={zone.price}
        totalQuantity={quantity}
        initialGroupMode={groupQrMode}
      />
    </>
  );
};

export default TicketModal;
