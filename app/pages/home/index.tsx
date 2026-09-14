"use client";

import React from "react";
import { GET_TICKET } from "@/app/service/ticket";
import TicketModal from "@/app/components/ticket/TicketModal";
import CPLMatchTicket from "@/app/components/ticket/CPLMatchTicket";
import AbaPaymentModal from "@/app/components/ticket/AbaPaymentModal";

export enum TicketStatus {
  Out = 1,
  Available = 2,
}

type Zone = {
  _id?: string;
  id: string;
  name: string;
  floor: number;
  capacity: number;
  available: number;
  price: number;
  status: TicketStatus | number;
  dateCreated?: string;
  dateUpdated?: string;
};

const zoneThemeColors: Record<string, { base: string; hover: string }> = {
  A1: { base: "#e53935", hover: "#ef5350" },
  A2: { base: "#c62828", hover: "#e53935" },
  B1: { base: "#2e7d32", hover: "#66bb6a" },
  B2: { base: "#43a047", hover: "#81c784" },
  C1: { base: "#1e88e5", hover: "#64b5f6" },
  C2: { base: "#1565c0", hover: "#42a5f5" },
  D1: { base: "#8e24aa", hover: "#ba68c8" },
  D2: { base: "#6a1b9a", hover: "#ab47bc" },
};

export default function HomePage() {
  const [tickets, setTickets] = React.useState<Zone[]>([]);
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(
    null,
  );
  const [selectedSection, setSelectedSection] = React.useState<string | null>(
    null,
  );
  const [showTicketModal, setShowTicketModal] = React.useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] =
    React.useState<boolean>(false);
  const [showAbaModal, setShowAbaModal] = React.useState<boolean>(false);
  const [quantity, setQuantity] = React.useState<number>(1);
  const [bookingSuccess, setBookingSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await GET_TICKET({ limit: 100 });

        if (res?.data?.items) {
          setTickets(res.data.items);
        }
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      }
    };

    fetchTickets();

    const interval = setInterval(fetchTickets, 60 * 100);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const handleOpenModal = () => {
      setShowTicketModal(true);
    };

    window.addEventListener("open-ticket-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-ticket-modal", handleOpenModal);
    };
  }, []);

  const activeZone = tickets.find((z) => z.id === selectedSection);

  const isAvailable = activeZone
    ? (activeZone.status === TicketStatus.Available ||
        activeZone.status === 2) &&
      activeZone.available > 0
    : false;

  const handlePointerOver = (e: React.PointerEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    const group = target.closest("g[id]") as SVGGElement | null;
    if (group && group.id) {
      setHoveredSection(group.id);
    }
  };

  const handlePointerOut = (e: React.PointerEvent<SVGSVGElement>) => {
    const related = e.relatedTarget as SVGElement | null;
    if (!related || !related.closest("#StDio_x5F_mapundefined")) {
      setHoveredSection(null);
    }
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    const group = target.closest("g[id]") as SVGGElement | null;
    if (group && group.id) {
      const zone = tickets.find((z) => z.id === group.id);
      if (zone) {
        setSelectedSection(zone.id);
        setBookingSuccess(false);
        setShowCheckoutModal(true);
      }
    }
  };

  const handleBookTickets = () => {
    if (!activeZone || !isAvailable) return;
    setShowAbaModal(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 stadium-grid pointer-events-none opacity-50" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 max-w-360 w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 relative z-10">
        <div className="lg:col-span-8 bg-zinc-900/85 backdrop-blur-2xl rounded-3xl border border-zinc-800 p-4 sm:p-8 flex flex-col items-center justify-center shadow-[0_25px_70px_rgba(0,0,0,0.7)] relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wider">
                Stadium Seating Map
              </h2>
              <p className="text-xs text-zinc-400">
                Click a stand to select your category and seats
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Availability
            </div>
          </div>
          <svg
            xmlns="https://www.w3.org/2000/svg"
            version="1.1"
            id="StDio_x5F_mapundefined"
            x="0"
            y="0"
            viewBox="0 0 521 417"
            className="css-ducv57"
            style={{
              maxWidth: "1000px",
              width: "160%",
              height: "auto",
            }}
            data-hovered={hoveredSection || undefined}
            data-selected={selectedSection || undefined}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          >
            <style>{`
          .shape { cursor: pointer; transition: fill 0.2s ease, filter 0.2s ease, opacity 0.2s ease; }
          text { pointer-events: none; user-select: none; }

          /* Focus dimming when a section is hovered or selected */
          svg[data-hovered] .shape:not([fill]),
          svg[data-selected] .shape:not([fill]) { opacity: 0.15; }

          ${["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"]
            .map((sectionId) => {
              const theme = zoneThemeColors[sectionId] || {
                base: "#64748b",
                hover: "#94a3b8",
              };
              const zone = tickets.find((t) => t.id === sectionId);
              const isOut = zone
                ? zone.status === TicketStatus.Out ||
                  zone.status === 1 ||
                  zone.available <= 0
                : false;

              if (isOut) {
                return `
                  #${sectionId} .shape:not([fill]) {
                    fill: #3f3f46;
                    opacity: 0.45;
                    cursor: not-allowed;
                  }
                  svg[data-hovered="${sectionId}"] #${sectionId} .shape:not([fill]),
                  svg[data-selected="${sectionId}"] #${sectionId} .shape:not([fill]) {
                    fill: #52525b;
                    opacity: 0.85;
                    filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.6));
                  }
                `;
              }

              return `
                #${sectionId} .shape:not([fill]) {
                  fill: ${theme.base};
                }
                svg[data-hovered="${sectionId}"] #${sectionId} .shape:not([fill]) {
                  fill: ${theme.hover};
                  opacity: 1;
                  filter: drop-shadow(0 0 4px ${theme.hover}e6);
                }
                svg[data-selected="${sectionId}"] #${sectionId} .shape:not([fill]) {
                  fill: ${theme.hover};
                  opacity: 1;
                  filter: drop-shadow(0 0 5px ${theme.hover}f2);
                }
              `;
            })
            .join("\n")}
        `}</style>
            <style>{`
          path:not([fill]) { fill: white; }
          .shape:not([fill]) { fill: black; }
      `}</style>

            <g data-area="41">
              <g id="B2" data-area="B2">
                <path
                  className="shape"
                  d="M130.856 269.858H110.36V285.903H130.856V269.858Z"
                ></path>
                <text
                  x="120.61"
                  y="277.88"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B1" data-area="B1">
                <path
                  className="shape"
                  d="M154.01 269.858H133.522V285.903H154.01V269.858Z"
                ></path>
                <text
                  x="143.77"
                  y="277.88"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B1" data-area="B1">
                <path
                  className="shape"
                  d="M154.01 180.07H133.522V196.115H154.01V180.07Z"
                ></path>
                <text
                  x="143.77"
                  y="188.09"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B2" data-area="B2">
                <path
                  className="shape"
                  d="M130.856 198.033H110.36V214.077H130.856V198.033Z"
                ></path>
                <text
                  x="120.61"
                  y="206.06"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B1" data-area="B1">
                <path
                  className="shape"
                  d="M154.01 198.033H133.522V214.077H154.01V198.033Z"
                ></path>
                <text
                  x="143.77"
                  y="206.06"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B2" data-area="B2">
                <path
                  className="shape"
                  d="M130.856 215.987H110.36V232.032H130.856V215.987Z"
                ></path>
                <text
                  x="120.61"
                  y="224.01"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B1" data-area="B1">
                <path
                  className="shape"
                  d="M154.01 215.987H133.522V232.032H154.01V215.987Z"
                ></path>
                <text
                  x="143.77"
                  y="224.01"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B2" data-area="B2">
                <path
                  className="shape"
                  d="M130.856 233.941H110.36V249.986H130.856V233.941Z"
                ></path>
                <text
                  x="120.61"
                  y="241.96"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B1" data-area="B1">
                <path
                  className="shape"
                  d="M154.01 233.941H133.522V249.986H154.01V233.941Z"
                ></path>
                <text
                  x="143.77"
                  y="241.96"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B2" data-area="B2">
                <path
                  className="shape"
                  d="M130.856 251.904H110.36V267.949H130.856V251.904Z"
                ></path>
                <text
                  x="120.61"
                  y="259.93"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B1" data-area="B1">
                <path
                  className="shape"
                  d="M154.01 251.904H133.522V267.949H154.01V251.904Z"
                ></path>
                <text
                  x="143.77"
                  y="259.93"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B2" data-area="B2">
                <path
                  className="shape"
                  d="M130.856 180.07H110.36V196.123H130.856V180.07Z"
                ></path>
                <text
                  x="120.61"
                  y="188.1"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
            </g>

            <g data-area="31">
              <g id="B2">
                <path
                  className="shape"
                  d="M411.407 198.033H390.91V214.077H411.407V198.033Z"
                ></path>
                <text
                  x="401.16"
                  y="206.06"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B2">
                <path
                  className="shape"
                  d="M411.407 180.078H390.91V196.123H411.407V180.078Z"
                ></path>
                <text
                  x="401.16"
                  y="188.1"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B2">
                <path
                  className="shape"
                  d="M411.407 269.858H390.91V285.903H411.407V269.858Z"
                ></path>
                <text
                  x="401.16"
                  y="277.88"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B2">
                <path
                  className="shape"
                  d="M411.407 251.904H390.91V267.949H411.407V251.904Z"
                ></path>
                <text
                  x="401.16"
                  y="259.93"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B2">
                <path
                  className="shape"
                  d="M411.407 233.941H390.91V249.986H411.407V233.941Z"
                ></path>
                <text
                  x="401.16"
                  y="241.96"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B2">
                <path
                  className="shape"
                  d="M411.407 215.987H390.91V232.032H411.407V215.987Z"
                ></path>
                <text
                  x="401.16"
                  y="224.01"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B2
                </text>
              </g>
              <g id="B1">
                <path
                  className="shape"
                  d="M388.243 215.987H367.747V232.032H388.243V215.987Z"
                ></path>
                <text
                  x="377.99"
                  y="224.01"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B1">
                <path
                  className="shape"
                  d="M388.243 198.033H367.747V214.077H388.243V198.033Z"
                ></path>
                <text
                  x="377.99"
                  y="206.06"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B1">
                <path
                  className="shape"
                  d="M388.243 180.078H367.747V196.123H388.243V180.078Z"
                ></path>
                <text
                  x="377.99"
                  y="188.1"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B1">
                <path
                  className="shape"
                  d="M388.243 269.858H367.747V285.903H388.243V269.858Z"
                ></path>
                <text
                  x="377.99"
                  y="277.88"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B1">
                <path
                  className="shape"
                  d="M388.243 251.904H367.747V267.949H388.243V251.904Z"
                ></path>
                <text
                  x="377.99"
                  y="259.93"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
              <g id="B1">
                <path
                  className="shape"
                  d="M388.243 233.941H367.747V249.986H388.243V233.941Z"
                ></path>
                <text
                  x="377.99"
                  y="241.96"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  B1
                </text>
              </g>
            </g>

            <g data-area="T4">
              <g id="C2">
                <path
                  className="shape"
                  d="M223.772 335.872H201.753V356.37H223.772V335.872Z"
                ></path>
                <text
                  x="212.76"
                  y="346.12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C2
                </text>
              </g>
            </g>

            <g data-area="T8">
              <g id="C2">
                <path
                  className="shape"
                  d="M320.146 335.872H298.127V356.37H320.146V335.872Z"
                ></path>
                <text
                  x="309.14"
                  y="346.12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C2
                </text>
              </g>
            </g>

            <g data-area="T2">
              <g id="C2">
                <path
                  className="shape"
                  d="M260.089 335.872H225.476V356.37H260.089V335.872Z"
                ></path>
                <text
                  x="242.78"
                  y="346.12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C2
                </text>
              </g>
            </g>

            <g data-area="T0">
              <g id="C2">
                <path
                  className="shape"
                  d="M296.415 335.872H261.802V356.37H296.415V335.872Z"
                ></path>
                <text
                  x="279.11"
                  y="346.12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C2
                </text>
              </g>
            </g>

            <g data-area="21">
              <g id="C2">
                <path
                  className="shape"
                  d="M200.001 335.923H180.814V356.413H200.001V335.923Z"
                ></path>
                <text
                  x="190.41"
                  y="346.17"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C2
                </text>
              </g>
              <g id="C1">
                <path
                  className="shape"
                  d="M200.001 312.75H180.814V333.248H200.001V312.75Z"
                ></path>
                <text
                  x="190.41"
                  y="323.0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C1
                </text>
              </g>
              <g id="C2">
                <path
                  className="shape"
                  d="M340.98 335.923H322.04V356.413H340.98V335.923Z"
                ></path>
                <text
                  x="331.51"
                  y="346.17"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C2
                </text>
              </g>
              <g id="C1">
                <path
                  className="shape"
                  d="M340.972 312.75H322.04V333.248H340.972V312.75Z"
                ></path>
                <text
                  x="331.51"
                  y="323.0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C1
                </text>
              </g>
            </g>

            <g data-area="2A">
              <g id="C1">
                <path
                  className="shape"
                  d="M223.772 312.75H201.753V333.248H223.772V312.75Z"
                ></path>
                <text
                  x="212.76"
                  y="323.0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C1
                </text>
              </g>
              <g id="C1">
                <path
                  className="shape"
                  d="M320.146 312.75H298.127V333.248H320.146V312.75Z"
                ></path>
                <text
                  x="309.14"
                  y="323.0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C1
                </text>
              </g>
            </g>

            <g data-area="2D">
              <g id="C1">
                <path
                  className="shape"
                  d="M247.494 312.75H225.476V333.248H247.494V312.75Z"
                ></path>
                <text
                  x="236.49"
                  y="323.00"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C1
                </text>
              </g>
              <g id="C1">
                <path
                  className="shape"
                  d="M296.415 312.75H274.395V333.248H296.415V312.75Z"
                ></path>
                <text
                  x="285.41"
                  y="323.00"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  C1
                </text>
              </g>
            </g>

            <g data-area="2F">
              <g id="X">
                <path
                  fill="black"
                  d="M272.527 319.037H249.372V333.197H272.527V319.037Z"
                ></path>
                <text
                  x="260.95"
                  y="326.12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  X
                </text>
              </g>
            </g>

            <g data-area="2L">
              <g id="D2">
                <path
                  className="shape"
                  d="M136.569 310.937C132.996 304.211 130.856 296.317 130.856 288.15H110.368C110.368 300.054 113.545 311.431 118.822 321.178L136.569 310.937Z"
                ></path>
                <text
                  x="122.09"
                  y="301.23"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M153.601 328.875C152.037 327.936 150.539 326.891 149.106 325.763L146.357 329.237C143.147 326.718 140.249 323.836 137.706 320.642L141.204 317.86C140.002 316.345 138.883 314.773 137.862 313.143L120.124 323.384C125.927 332.785 133.78 340.976 143.344 346.623L153.601 328.875Z"
                ></path>
                <text
                  x="135.80"
                  y="330.39"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D1">
                <path
                  className="shape"
                  d="M154.424 304.302L158.12 301.832C158.161 301.89 158.202 301.939 158.235 301.997C155.568 298.054 153.971 293.213 154.046 288.134H133.558C133.558 300.153 138.389 311.406 146.127 319.424L157.503 308.121C156.927 307.512 156.367 306.887 155.848 306.228C155.346 305.611 154.869 304.969 154.424 304.302Z"
                ></path>
                <text
                  x="145.64"
                  y="299.96"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D1
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M145.573 347.924C155.352 353.456 166.605 356.37 178.598 356.37V335.872C170.358 335.872 162.563 333.921 155.821 330.175L145.573 347.924Z"
                ></path>
                <text
                  x="163.07"
                  y="343.52"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D1">
                <path
                  className="shape"
                  d="M178.599 312.698C178.484 312.69 178.377 312.698 178.262 312.698C173.076 312.616 168.779 311.25 164.977 308.665L162.524 312.369C161.882 311.941 161.264 311.497 160.655 311.019C160.079 310.566 159.519 310.081 158.976 309.587L148.448 320.116L147.625 320.947C155.675 328.587 166.705 333.205 178.599 333.205V312.698Z"
                ></path>
                <text
                  x="166.98"
                  y="320.37"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D1
                </text>
              </g>
            </g>

            <g data-area="2M">
              <g id="D2">
                <path
                  className="shape"
                  d="M383.914 313.143C382.976 314.707 381.93 316.205 380.803 317.638L384.276 320.387C381.758 323.598 378.877 326.495 375.683 329.039L372.901 325.541C371.386 326.742 369.814 327.862 368.184 328.883L378.424 346.623C387.824 340.819 396.014 332.966 401.669 323.4L383.914 313.143Z"
                ></path>
                <text
                  x="386.37"
                  y="329.22"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D1">
                <path
                  className="shape"
                  d="M359.345 312.32L356.875 308.624C356.933 308.582 356.982 308.541 357.04 308.508C353.097 311.176 348.257 312.781 343.178 312.698V333.197C355.196 333.197 366.448 328.364 374.466 320.626L363.164 309.257C362.555 309.834 361.929 310.393 361.271 310.912C360.653 311.406 360.011 311.875 359.345 312.32Z"
                ></path>
                <text
                  x="355.44"
                  y="320.45"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D1
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M385.198 310.92C388.771 304.195 390.911 296.317 390.911 288.142H411.407C411.407 300.046 408.238 311.406 402.962 321.161L385.198 310.92Z"
                ></path>
                <text
                  x="399.11"
                  y="302.85"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D1">
                <path
                  className="shape"
                  d="M367.748 288.142C367.74 288.257 367.748 288.364 367.748 288.48C367.666 293.666 366.299 297.963 363.715 301.766L367.419 304.228C366.991 304.87 366.546 305.487 366.069 306.096C365.616 306.681 365.131 307.232 364.637 307.776L375.165 318.305L375.996 319.128C383.635 311.077 388.252 300.046 388.252 288.15H367.748V288.142Z"
                ></path>
                <text
                  x="376.31"
                  y="299.32"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D1
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M376.202 347.916C366.432 353.448 355.179 356.37 343.178 356.37V335.88C351.418 335.88 359.205 333.921 365.954 330.175L376.202 347.916Z"
                ></path>
                <text
                  x="357.03"
                  y="343.89"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
            </g>

            <g data-area="1L">
              <g id="A2">
                <path
                  className="shape"
                  d="M340.98 109.57H328.312V130.068H340.98V109.57Z"
                ></path>
                <text
                  x="334.65"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A2">
                <path
                  className="shape"
                  d="M193.482 109.57H180.814V130.068H193.482V109.57Z"
                ></path>
                <text
                  x="187.15"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M340.979 132.735H326.616V153.233H340.979V132.735Z"
                ></path>
                <text
                  x="333.80"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M195.178 132.735H180.814V153.233H195.178V132.735Z"
                ></path>
                <text
                  x="188.00"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
            </g>

            <g data-area="11">
              <g id="A2">
                <path
                  className="shape"
                  d="M326.393 109.57H313.725V130.068H326.393V109.57Z"
                ></path>
                <text
                  x="320.06"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A2">
                <path
                  className="shape"
                  d="M208.067 109.57H195.399V130.068H208.067V109.57Z"
                ></path>
                <text
                  x="201.73"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M324.78 132.735H310.416V153.233H324.78V132.735Z"
                ></path>
                <text
                  x="317.60"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M211.377 132.735H197.013V153.225H211.377V132.735Z"
                ></path>
                <text
                  x="204.20"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
            </g>

            <g data-area="1A">
              <g id="A2">
                <path
                  className="shape"
                  d="M222.652 109.57H209.984V130.068H222.652V109.57Z"
                ></path>
                <text
                  x="216.32"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A2">
                <path
                  className="shape"
                  d="M311.807 109.57H299.139V130.068H311.807V109.57Z"
                ></path>
                <text
                  x="305.47"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M227.576 132.735H213.212V153.225H227.576V132.735Z"
                ></path>
                <text
                  x="220.39"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M308.581 132.735H294.217V153.233H308.581V132.735Z"
                ></path>
                <text
                  x="301.40"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
            </g>

            <g data-area="1F">
              <g id="A2">
                <path
                  className="shape"
                  d="M237.239 109.57H224.571V130.068H237.239V109.57Z"
                ></path>
                <text
                  x="230.91"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A2">
                <path
                  className="shape"
                  d="M297.22 109.57H284.552V130.068H297.22V109.57Z"
                ></path>
                <text
                  x="290.89"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M243.775 132.735H229.411V153.225H243.775V132.735Z"
                ></path>
                <text
                  x="236.59"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M292.38 132.735H278.017V153.233H292.38V132.735Z"
                ></path>
                <text
                  x="285.20"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
            </g>

            <g data-area="1D">
              <g id="A2">
                <path
                  className="shape"
                  d="M252.234 109.57H239.566V130.068H252.234V109.57Z"
                ></path>
                <text
                  x="245.90"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A2">
                <path
                  className="shape"
                  d="M267.229 109.57H254.561V130.068H267.229V109.57Z"
                ></path>
                <text
                  x="260.90"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A2">
                <path
                  className="shape"
                  d="M282.224 109.57H269.556V130.068H282.224V109.57Z"
                ></path>
                <text
                  x="275.89"
                  y="119.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A2
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M259.982 132.735H245.618V153.233H259.982V132.735Z"
                ></path>
                <text
                  x="252.80"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
              <g id="A1">
                <path
                  className="shape"
                  d="M276.173 132.735H261.81V153.233H276.173V132.735Z"
                ></path>
                <text
                  x="268.99"
                  y="142.98"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  A1
                </text>
              </g>
            </g>

            <g data-area="1M">
              <g id="D1">
                <path
                  className="shape"
                  d="M361.154 160.972L375.714 146.516C383.452 154.534 388.407 165.944 388.234 177.856H367.746C367.747 171.097 365.228 165.31 361.154 160.972Z"
                ></path>
                <text
                  x="377.18"
                  y="166.82"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D1
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M402.978 144.812C408.518 154.592 411.407 165.853 411.407 177.856H390.911C390.911 169.615 388.977 161.811 385.232 155.061L402.978 144.812Z"
                ></path>
                <text
                  x="401.18"
                  y="167.62"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D1">
                <path
                  className="shape"
                  d="M359.713 159.506C355.35 155.604 349.712 153.143 343.184 153.225V132.735C355.301 132.735 366.149 137.378 374.2 145.018L373.344 145.89L359.713 159.506Z"
                ></path>
                <text
                  x="357.76"
                  y="146.38"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D1
                </text>
              </g>
              <g id="D1">
                <path
                  className="shape"
                  d="M147.573 145.001L148.446 145.882L162.052 159.49C166.341 155.662 172.078 153.25 178.252 153.225C178.392 153.225 178.482 153.233 178.598 153.225V132.735C166.703 132.735 155.624 137.37 147.573 145.001Z"
                ></path>
                <text
                  x="168.97"
                  y="144.55"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D1
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M155.79 135.773C162.523 132.2 170.433 130.06 178.599 130.06V109.57C166.696 109.57 155.279 112.756 145.525 118.041L155.79 135.773Z"
                ></path>
                <text
                  x="165.58"
                  y="120.14"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M143.326 119.309C133.761 124.964 125.875 133.188 120.072 142.589L133.983 150.624C135.646 147.891 137.539 145.314 139.663 142.943L143.046 145.882C146.108 142.449 149.639 139.436 153.566 137.065L143.326 119.309Z"
                ></path>
                <text
                  x="138.96"
                  y="134.09"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M118.806 144.812C113.274 154.592 110.36 165.853 110.36 177.856H130.856C130.856 169.615 132.799 161.795 136.544 155.053L118.806 144.812Z"
                ></path>
                <text
                  x="122.97"
                  y="160.68"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D1">
                <path
                  className="shape"
                  d="M146.059 146.508C138.321 154.526 133.522 166.232 133.522 177.856H154.018C154.109 171.468 156.521 165.269 160.595 160.93L146.059 146.508Z"
                ></path>
                <text
                  x="145.70"
                  y="164.99"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D1
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M378.432 119.309C387.997 124.964 395.882 133.188 401.686 142.589L387.775 150.624C386.112 147.891 384.219 145.314 382.096 142.943L378.713 145.882C375.651 142.449 372.119 139.436 368.194 137.065L378.432 119.309Z"
                ></path>
                <text
                  x="384.94"
                  y="134.97"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
              <g id="D2">
                <path
                  className="shape"
                  d="M365.986 135.789C359.26 132.217 351.35 130.068 343.177 130.068V109.578C355.079 109.578 366.43 112.583 376.209 118.041L365.986 135.789Z"
                ></path>
                <text
                  x="359.70"
                  y="122.68"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="white"
                >
                  D2
                </text>
              </g>
            </g>

            <g id="scenery">
              <g id="blocks">
                <path
                  d="M200 302.392H180.812V310.739H200V302.392Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M340.971 302.392H322.039V310.739H340.971V302.392Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M211.038 302.392H201.753V310.739H211.038V302.392Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M223.674 302.392H214.389V310.739H223.674V302.392Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M247.495 302.392H225.476V310.739H247.495V302.392Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M307.189 302.392H297.904V310.739H307.189V302.392Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M319.833 302.392H310.548V310.739H319.833V302.392Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M296.423 302.392H274.404V310.739H296.423V302.392Z"
                  fill="#3C3C3C"
                ></path>

                <path
                  d="M272.527 302.392H249.372V317.16H272.527V302.392Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M343.39 358.148V368.134C365.014 368.134 384.646 359.482 399.026 345.471L391.972 338.416C379.403 350.616 362.265 358.148 343.39 358.148Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M178.367 368.126V358.148C159.501 358.148 142.363 350.616 129.786 338.408L122.731 345.463C137.112 359.474 156.744 368.126 178.367 368.126Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M233.245 358.148H180.812V368.126H233.245V358.148Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M287.112 358.148H234.679V368.126H287.112V358.148Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M340.979 358.148H288.546V368.126H340.979V358.148Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M108.573 288.348H98.5967C98.5967 309.974 107.248 329.607 121.266 343.989L128.32 336.934C116.105 324.363 108.573 307.216 108.573 288.348Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M423.161 288.348H413.185C413.185 307.216 405.653 324.363 393.446 336.934L400.5 343.989C414.51 329.607 423.161 309.974 423.161 288.348Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M233.433 97.8101H181V107.787H233.433V97.8101Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M287.300 97.8101H234.867V107.787H287.300V97.8101Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M341.167 97.8101H288.734V107.787H341.167V97.8101Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M178.368 97.8063C164.375 97.8063 151.205 101.437 139.763 107.792C126.14 115.909 116.633 125.433 109.851 136.769C102.21 150.484 98.5967 163.622 98.5967 177.584V232.249H108.573V177.584C108.573 165.433 111.701 153.991 117.183 144.03C124.404 131.92 132.643 123.672 142.455 117.761C154.728 110.928 166.194 107.784 178.377 107.784H178.615V97.8063H178.368Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M343.415 97.8063C357.408 97.8063 370.578 101.437 382.02 107.792C395.643 115.909 405.15 125.433 411.933 136.769C419.531 150.426 423.17 163.589 423.17 177.584V232.249H413.185V177.584C413.185 165.401 410.049 153.933 404.542 143.956C397.38 131.92 389.14 123.672 379.328 117.761C367.055 110.928 355.589 107.784 343.406 107.784H343.168V97.8063H343.415Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M108.573 233.683H98.5967V288.348C98.5967 309.974 107.248 329.607 121.266 343.989L128.32 336.934C116.105 324.363 108.573 307.216 108.573 288.348V233.683Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M413.185 233.683H423.161V288.348C423.161 309.974 414.51 329.607 400.5 343.989L393.446 336.934C405.653 324.363 413.185 307.216 413.185 288.348V233.683Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M198.808 155.168H186.65V163.664H198.808V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M212.126 155.168H199.968V163.664H212.126V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M225.434 155.168H213.276V163.664H225.434V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M238.752 155.168H226.595V163.664H238.752V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M252.072 155.168H239.914V163.664H252.072V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M335.037 155.168H322.879V163.664H335.037V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M321.717 155.168H309.56V163.664H321.717V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M308.399 155.168H296.242V163.664H308.399V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M295.081 155.168H282.923V163.664H295.081V155.168Z"
                  fill="#3C3C3C"
                ></path>
                <path
                  d="M281.761 155.168H269.604V163.664H281.761V155.168Z"
                  fill="#3C3C3C"
                ></path>
              </g>
              <g id="field">
                <path
                  d="M344.094 177.815H176.894V288.126H344.094V177.815Z"
                  fill="#131313"
                ></path>
                <path
                  d="M340.84 181.039H180.129V284.827H340.84V181.039Z"
                  fill="#131313"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M260.494 284.827V181.066"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M260.496 247.124C268.285 247.124 274.599 240.83 274.599 233.065C274.599 225.3 268.285 219.006 260.496 219.006C252.707 219.006 246.393 225.3 246.393 233.065C246.393 240.83 252.707 247.124 260.496 247.124Z"
                  fill="#131313"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M315.909 222.223C314.304 223.543 313.011 225.2 312.124 227.076C311.236 228.952 310.776 231.001 310.776 233.075C310.776 235.149 311.236 237.198 312.124 239.074C313.011 240.95 314.304 242.607 315.909 243.927"
                  fill="#131313"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M340.842 202.196H315.917V263.779H340.842V202.196Z"
                  fill="#131313"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M340.811 219.026H332.824V246.935H340.811V219.026Z"
                  fill="#131313"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M205.045 243.718C206.652 242.399 207.947 240.742 208.835 238.866C209.724 236.99 210.185 234.941 210.185 232.866C210.185 230.791 209.724 228.741 208.835 226.865C207.947 224.989 206.652 223.332 205.045 222.014"
                  fill="#131313"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M205.053 202.196H180.129V263.779H205.053V202.196Z"
                  fill="#131313"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M188.143 219.006H180.156V246.915H188.143V219.006Z"
                  fill="#131313"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M260.496 233.274C260.657 233.274 260.788 233.144 260.788 232.984C260.788 232.823 260.657 232.693 260.496 232.693C260.335 232.693 260.205 232.823 260.205 232.984C260.205 233.144 260.335 233.274 260.496 233.274Z"
                  stroke="white"
                  strokeWidth="0.517158"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <g>
                  <path d="M340.834 182.344C340.493 182.342 340.167 182.206 339.927 181.965C339.687 181.724 339.552 181.399 339.552 181.059"></path>
                  <path
                    d="M340.834 182.344C340.493 182.342 340.167 182.206 339.927 181.965C339.687 181.724 339.552 181.399 339.552 181.059"
                    stroke="white"
                    strokeWidth="0.517158"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
                <g>
                  <path d="M339.552 284.807C339.552 284.467 339.687 284.142 339.927 283.901C340.167 283.661 340.493 283.524 340.834 283.523"></path>
                  <path
                    d="M339.552 284.807C339.552 284.467 339.687 284.142 339.927 283.901C340.167 283.661 340.493 283.524 340.834 283.523"
                    stroke="white"
                    strokeWidth="0.517158"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
                <g>
                  <path d="M180.119 182.344C180.461 182.344 180.788 182.208 181.03 181.967C181.271 181.727 181.407 181.4 181.407 181.059"></path>
                  <path
                    d="M180.119 182.344C180.461 182.344 180.788 182.208 181.03 181.967C181.271 181.727 181.407 181.4 181.407 181.059"
                    stroke="white"
                    strokeWidth="0.517158"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
                <g>
                  <path d="M181.438 284.807C181.438 284.466 181.302 284.14 181.06 283.899C180.819 283.658 180.491 283.523 180.15 283.523"></path>
                  <path
                    d="M181.438 284.807C181.438 284.466 181.302 284.14 181.06 283.899C180.819 283.658 180.491 283.523 180.15 283.523"
                    stroke="white"
                    strokeWidth="0.517158"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && activeZone && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-scrollbar animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowCheckoutModal(false)}
          />

          <div className="relative z-10 max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 text-white my-auto overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Dialog Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 relative z-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
                  Ticket Checkout
                </h2>
                <p className="text-xs text-zinc-400">
                  Stand {activeZone.id} &bull; {activeZone.name} &bull; Floor{" "}
                  {activeZone.floor} &bull; ({activeZone.available} seats
                  remaining)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-zinc-700 cursor-pointer"
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

            {!bookingSuccess ? (
              <>
                <div className="overflow-x-auto no-scrollbar relative z-10">
                  <div className="min-w-[620px] max-w-[860px] mx-auto">
                    <CPLMatchTicket
                      zoneId={activeZone.id}
                      zoneName={activeZone.name}
                      priceUsd={activeZone.price}
                      category={
                        activeZone.id.startsWith("A")
                          ? "CAT A"
                          : activeZone.id.startsWith("B")
                            ? "CAT B"
                            : "CAT C"
                      }
                      stand={`Stand ${activeZone.id}`}
                      seat={`S-${14 + (quantity - 1) * 2}`}
                      theme="crimson"
                    />
                  </div>
                </div>

                {isAvailable ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 relative z-10">
                    {(() => {
                      const maxAvailable = Math.max(
                        1,
                        typeof activeZone?.available === "number" &&
                          activeZone.available > 0
                          ? activeZone.available
                          : typeof activeZone?.capacity === "number" &&
                              activeZone.capacity > 0
                            ? activeZone.capacity
                            : 10,
                      );

                      return (
                        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                              Select Ticket Quantity
                            </label>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              Max: {maxAvailable}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuantity((q) =>
                                  Math.max(1, (Number(q) || 1) - 1),
                                );
                              }}
                              className="w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl cursor-pointer select-none shadow"
                            >
                              &minus;
                            </button>
                            <div className="text-center px-4">
                              <span className="text-2xl font-black text-white block">
                                {quantity}
                              </span>
                              <span className="text-[10px] text-zinc-400 block uppercase font-bold">
                                {quantity === 1 ? "Ticket" : "Tickets"}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuantity((q) =>
                                  Math.min(maxAvailable, (Number(q) || 1) + 1),
                                );
                              }}
                              className="w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl cursor-pointer select-none shadow"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Pricing Summary & Checkout Button */}
                    <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 p-6 backdrop-blur-xl border border-zinc-800 shadow-2xl">
                      <div className="mb-5 flex items-center gap-2 text-sm font-medium text-zinc-200">
                        Order Summary
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-400">
                            Price per Ticket
                          </span>
                          <div className="text-right font-mono">
                            <span className="font-semibold text-zinc-100">
                              ${activeZone.price}
                            </span>
                            <span className="ml-1 text-xs text-zinc-500">
                              ({(activeZone.price * 4000).toLocaleString()} ៛)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm font-mono">
                          <span className="text-zinc-400">Quantity</span>
                          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-md bg-zinc-800 px-2 text-xs font-bold text-white">
                            {quantity}
                          </span>
                        </div>

                        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

                        <div className="mb-6 flex items-end justify-between font-mono">
                          <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                              Total Due
                            </p>
                            <p className="text-3xl font-extrabold text-white">
                              ${(activeZone.price * quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right text-sm font-medium text-emerald-400">
                            {(
                              activeZone.price *
                              quantity *
                              4000
                            ).toLocaleString()}{" "}
                            ៛
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleBookTickets}
                          className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-zinc-950 transition-all duration-300 hover:bg-emerald-500 cursor-pointer active:scale-[0.98]"
                        >
                          <span>Pay Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2 relative z-10">
                    <span className="font-bold text-rose-400 text-lg uppercase block">
                      This Zone is Sold Out
                    </span>
                    <p className="text-xs text-zinc-400">
                      Please choose another stand on the map.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-5 relative z-10">
                <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
                  {Array.from({ length: quantity }).map((_, idx) => (
                    <div
                      key={idx}
                      className="overflow-x-auto no-scrollbar py-1 space-y-1.5"
                    >
                      {quantity > 1 && (
                        <div className="flex items-center justify-between px-2 text-xs text-zinc-400 font-mono">
                          <span className="font-bold text-white uppercase flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Ticket #{idx + 1} of {quantity}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Seat: S-{14 + idx * 2}
                          </span>
                        </div>
                      )}
                      <div className="min-w-[620px] max-w-[860px] mx-auto">
                        <CPLMatchTicket
                          zoneId={activeZone.id}
                          zoneName={activeZone.name}
                          priceUsd={activeZone.price}
                          category={
                            activeZone.id.startsWith("A")
                              ? "CAT A"
                              : activeZone.id.startsWith("B")
                                ? "CAT B"
                                : "CAT C"
                          }
                          stand={`Stand ${activeZone.id}`}
                          seat={`S-${14 + idx * 2}`}
                          ticketNumber={`CPL-2026-${(884920 + idx * 137).toString()}`}
                          theme="crimson"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setBookingSuccess(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase text-xs tracking-wider transition-all cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeZone && (
        <TicketModal
          isOpen={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          zone={activeZone}
          quantity={quantity}
        />
      )}
      {!activeZone && tickets.length > 0 && (
        <TicketModal
          isOpen={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          zone={tickets[0]}
          quantity={quantity}
        />
      )}

      {activeZone && (
        <AbaPaymentModal
          isOpen={showAbaModal}
          onClose={() => setShowAbaModal(false)}
          onPaymentSuccess={() => {
            setShowAbaModal(false);
            setBookingSuccess(true);
          }}
          amountUsd={activeZone.price * quantity}
          zoneId={activeZone.id}
          zoneName={activeZone.name}
          quantity={quantity}
        />
      )}
    </div>
  );
}
