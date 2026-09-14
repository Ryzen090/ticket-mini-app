import React from "react";
import QRCode from "qrcode";

export type TicketTheme = "crimson" | "white";

export const DEFAULT_CPL_LOGO =
  "https://pkrsr-public-production.s3.ap-southeast-1.amazonaws.com/attachments/TZ5D6VKK-1720763721.png";
export const DEFAULT_CLUB_LOGO =
  "https://pkrsr-public-production.s3.ap-southeast-1.amazonaws.com/attachments/7PN6TGVS-1752048232.png";

export interface CPLTicketProps {
  zoneId?: string;
  zoneName?: string;
  priceUsd?: number;
  priceRiel?: number;
  category?: string;
  matchTitleKhmer?: string;
  matchTitleEn?: string;
  date?: string;
  time?: string;
  stadiumKhmer?: string;
  stadiumEn?: string;
  gate?: string;
  seat?: string;
  stand?: string;
  ticketNumber?: string;
  cplLogoUrl?: string;
  clubLogoUrl?: string;
  theme?: TicketTheme;
  className?: string;
  scale?: number;
  onQrClick?: () => void;
}

export function toKhmerDigits(num: number | string): string {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => khmerDigits[parseInt(digit, 10)]);
}

export function formatRiel(rielAmount: number): {
  khmerFormatted: string;
  engFormatted: string;
} {
  const formattedNumber = rielAmount.toLocaleString("en-US");
  return {
    khmerFormatted: `${toKhmerDigits(formattedNumber)} ៛`,
    engFormatted: `${formattedNumber.replace(/,/g, ".")} Riel`,
  };
}

export const CPLMatchTicket: React.FC<CPLTicketProps> = ({
  zoneId = "A1",
  priceUsd = 1.5,
  priceRiel,
  category,
  matchTitleKhmer = "ជម្រើសជើងឯកខេមបូឌានព្រីមៀរលីក ឆ្នាំ២០២៦/២៧",
  matchTitleEn = "CAMBODIAN PREMIER LEAGUE 2026/27",
  ticketNumber = "CPL-2026-884920",
  cplLogoUrl = DEFAULT_CPL_LOGO,
  clubLogoUrl = DEFAULT_CLUB_LOGO,
  theme = "crimson",
  className = "",
  onQrClick,
}) => {
  const resolvedCategory =
    category ||
    (zoneId.startsWith("B")
      ? "CAT B"
      : zoneId.startsWith("C")
        ? "CAT C"
        : "CAT A");

  const calculatedRiel =
    priceRiel ?? (priceUsd ? Math.round(priceUsd * 4000) : 6000);
  const { khmerFormatted, engFormatted } = formatRiel(calculatedRiel);

  const isDark = theme === "crimson";

  return (
    <div
      className={`relative select-none transition-all duration-300 ${className}`}
      style={{
        fontFamily: "'Kantumruy Pro', 'Outfit', sans-serif",
      }}
    >
      <div
        className={`relative w-full max-w-[960px] mx-auto rounded-2xl overflow-hidden shadow-2xl flex flex-row  ${
          isDark
            ? "bg-[#650303] text-white  shadow-[0_20px_60px_rgba(0,0,0,0.8)] "
            : "bg-[#f8f9fa] text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        }`}
        style={{
          minHeight: "260px",
          background: isDark
            ? "linear-gradient(135deg, #420202 0%, #680505 30%, #870808 50%, #4a0303 80%, #2f0101 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f3f4f6 35%, #ffffff 70%, #eceef2 100%)",
        }}
      >
        {isDark ? (
          <>
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(circle at 75% 20%, #ff2a2a 0%, transparent 45%), radial-gradient(circle at 20% 80%, #e11d48 0%, transparent 40%)",
              }}
            />
            {/* Elegant curved light strokes in red */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
              preserveAspectRatio="none"
              viewBox="0 0 960 280"
            >
              <path
                d="M 120,0 C 220,120 300,280 440,280 L 380,280 C 260,280 170,140 80,0 Z"
                fill="url(#redGlowGrad1)"
              />
              <path
                d="M 680,0 C 760,80 820,200 960,240 L 960,200 C 840,160 780,60 720,0 Z"
                fill="url(#redGlowGrad2)"
              />
              <path
                d="M 280,0 C 350,90 420,280 560,280 L 520,280 C 390,280 320,100 250,0 Z"
                fill="url(#redGlowGrad3)"
                opacity="0.6"
              />
              <defs>
                <linearGradient id="redGlowGrad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#990000" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="redGlowGrad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff2e2e" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#660000" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="redGlowGrad3" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff7070" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#b30000" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </>
        ) : (
          <>
            {/* White Ticket Red Wave Accents */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
              preserveAspectRatio="none"
              viewBox="0 0 960 280"
            >
              <path
                d="M 100,0 C 180,90 240,280 400,280 L 320,280 C 180,280 120,110 50,0 Z"
                fill="url(#whiteRedWave1)"
              />
              <path
                d="M 720,0 C 790,80 840,220 960,260 L 960,180 C 860,140 810,50 760,0 Z"
                fill="url(#whiteRedWave2)"
              />
              <defs>
                <linearGradient id="whiteRedWave1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="whiteRedWave2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}

        {/* ================= SECTION 1: LEFT STUB ================= */}
        <div
          className={`relative z-10 w-[24%] sm:w-[22%] p-3 sm:p-4 flex flex-col justify-between items-center text-center border-r-2 border-dashed ${
            isDark
              ? "border-red-400/40 bg-black/15"
              : "border-slate-400/50 bg-white/40"
          }`}
        >
          {/* Top Notch Hole */}
          <div
            className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full z-20"
            style={{
              backgroundColor: isDark ? "#040d1a" : "#040d1a",
              boxShadow: isDark
                ? "inset 0 2px 4px rgba(0,0,0,0.6)"
                : "inset 0 2px 4px rgba(0,0,0,0.6)",
            }}
          />
          {/* Bottom Notch Hole */}
          <div
            className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full z-20"
            style={{
              backgroundColor: isDark ? "#040d1a" : "#040d1a",
              boxShadow: isDark
                ? "inset 0 -2px 4px rgba(0,0,0,0.6)"
                : "inset 0 -2px 4px rgba(0,0,0,0.6)",
            }}
          />

          {/* CPL Official Monogram Logo */}
          <div className="flex flex-col items-center pt-1">
            <CPLLogo logoUrl={cplLogoUrl} isDark={isDark} />
          </div>

          {/* Price & Category Pills (Left Stub) */}
          <div className="w-full space-y-2 my-auto px-1">
            {/* Price Pill */}
            <div>
              <span
                className={`text-[9px] sm:text-[10px] block font-semibold leading-tight mb-1 ${
                  isDark ? "text-red-200/90" : "text-slate-600"
                }`}
              >
                តម្លៃសំបុត្រ / PRICE TICKET
              </span>
              <div
                className={`py-1 px-2 rounded-lg font-bold text-xs sm:text-sm tracking-wide shadow-sm ${
                  isDark
                    ? "bg-white text-slate-900 border border-slate-200"
                    : "bg-white text-red-700 border border-red-200"
                }`}
              >
                {khmerFormatted}
              </div>
            </div>

            {/* Category Pill */}
            <div>
              <span
                className={`text-[8px] sm:text-[9px] block font-semibold leading-tight mb-1 ${
                  isDark ? "text-red-200/90" : "text-slate-600"
                }`}
              >
                ប្រភេទសំបុត្រ / CAT :
              </span>
              <div
                className={`py-1 px-2 rounded-lg font-black text-xs sm:text-sm tracking-wider shadow-sm uppercase ${
                  isDark
                    ? "bg-white text-slate-900 border border-slate-200"
                    : "bg-white text-slate-900 border border-slate-200"
                }`}
              >
                {resolvedCategory}
              </div>
            </div>
          </div>

          {/* Left Stub Footer */}
          <div className="w-full text-center pb-1">
            <span
              className={`text-[8px] sm:text-[9px] font-bold tracking-wider block uppercase ${
                isDark ? "text-red-200/80" : "text-red-700"
              }`}
            >
              WWW.CPL-CAMBODIA.COM
            </span>
          </div>
        </div>

        {/* ================= SECTION 2: MAIN CENTER BODY ================= */}
        <div className="relative z-10 flex-1 p-3 sm:p-5 flex flex-col justify-between">
          {/* Top League Title Banner */}
          <div className="text-center pt-1">
            <h2
              className={`text-base sm:text-xl font-black tracking-wide leading-tight drop-shadow-sm ${
                isDark ? "text-white" : "text-slate-950"
              }`}
              style={{
                fontFamily: "'Battambang', 'Kantumruy Pro', sans-serif",
                textShadow: isDark ? "0 2px 8px rgba(0,0,0,0.7)" : "none",
              }}
            >
              {matchTitleKhmer}
            </h2>
            <p
              className={`text-[10px] sm:text-xs lg:text-sm font-extrabold uppercase tracking-widest mt-0.5 ${
                isDark ? "text-red-200/95 drop-shadow" : "text-red-700"
              }`}
            >
              {matchTitleEn}
            </p>
          </div>

          {/* Center Main Content Grid */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center my-auto py-2">
            {/* Left Column: CPL Monogram + Price/Category Pill + QR Code */}
            <div className="col-span-5 sm:col-span-4 flex items-center gap-2 sm:gap-3">
              {/* QR Code with Clean White Box & Zoom Interaction */}
              <div
                onClick={onQrClick}
                role={onQrClick ? "button" : undefined}
                tabIndex={onQrClick ? 0 : undefined}
                onKeyDown={
                  onQrClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onQrClick();
                        }
                      }
                    : undefined
                }
                className={`p-1 sm:p-1.5 bg-white rounded-xl shadow-md border border-slate-200 shrink-0 relative group select-none ${
                  onQrClick
                    ? "cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-xl hover:border-red-400 active:scale-95"
                    : ""
                }`}
                title={
                  onQrClick ? "Click to view Large Entry QR" : "Match Pass QR"
                }
              >
                <SVGQRCode
                  value={`TICKET:${ticketNumber}:${resolvedCategory}:${zoneId}`}
                />
                {onQrClick && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[0.5px]">
                    <svg
                      className="w-4 h-4 text-white drop-shadow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                    <span className="text-[7px] font-bold uppercase tracking-tighter mt-0.5 leading-none">
                      Zoom
                    </span>
                  </div>
                )}
              </div>

              {/* Stacked Left Info Pills */}
              <div className="space-y-1.5 flex-1 min-w-0"></div>
            </div>

            {/* Middle Column: Match Details Pill Boxes */}
            <div className="col-span-7 sm:col-span-4 space-y-1.5"></div>

            {/* Right Column: English Price & Category Large Pills */}
            <div className="hidden sm:flex sm:col-span-4 flex-col justify-center space-y-2 pl-2">
              <div>
                <span
                  className={`text-[9px] lg:text-[10px] font-semibold block leading-none mb-1 text-center ${
                    isDark ? "text-red-200/90" : "text-slate-600"
                  }`}
                >
                  តម្លៃសំបុត្រ / PRICE TICKET
                </span>
                <div
                  className={`py-1.5 px-3 rounded-xl font-black text-sm lg:text-base text-center shadow-md ${
                    isDark
                      ? "bg-white text-slate-950"
                      : "bg-white text-red-700 border border-red-200"
                  }`}
                >
                  {engFormatted}
                </div>
              </div>

              <div>
                <span
                  className={`text-[9px] lg:text-[10px] font-semibold block leading-none mb-1 text-center ${
                    isDark ? "text-red-200/90" : "text-slate-600"
                  }`}
                >
                  ប្រភេទសំបុត្រ / CAT :
                </span>
                <div
                  className={`py-1.5 px-3 rounded-xl font-black text-sm lg:text-base text-center shadow-md uppercase ${
                    isDark
                      ? "bg-white text-slate-950"
                      : "bg-white text-slate-950 border border-slate-200"
                  }`}
                >
                  {resolvedCategory}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Ribbon Strip */}
          <div
            className={`-mx-3 -mb-3 sm:-mx-5 sm:-mb-5 px-4 py-1.5 flex items-center justify-between text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-b-xl ${
              isDark ? "bg-[#b91c1c] text-white" : "bg-[#dc2626] text-white"
            }`}
          >
            <span>CPL SEASON 2026/27</span>
            <span>WWW.CPL-CAMBODIA.COM</span>
            <span>NO. {ticketNumber}</span>
          </div>
        </div>

        {/* ================= SECTION 3: RIGHT TEAR-OFF STUB ================= */}
        <div
          className={`relative z-10 w-[24%] sm:w-[22%] p-3 sm:p-4 flex flex-col justify-between items-center text-center border-l-2 border-dashed ${
            isDark
              ? "border-red-400/40 bg-black/15"
              : "border-slate-400/50 bg-white/40"
          }`}
        >
          {/* Top Notch Hole */}
          <div
            className="absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full z-20"
            style={{
              backgroundColor: isDark ? "#040d1a" : "#040d1a",
              boxShadow: isDark
                ? "inset 0 2px 4px rgba(0,0,0,0.6)"
                : "inset 0 2px 4px rgba(0,0,0,0.6)",
            }}
          />
          {/* Bottom Notch Hole */}
          <div
            className="absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full z-20"
            style={{
              backgroundColor: isDark ? "#040d1a" : "#040d1a",
              boxShadow: isDark
                ? "inset 0 -2px 4px rgba(0,0,0,0.6)"
                : "inset 0 -2px 4px rgba(0,0,0,0.6)",
            }}
          />

          {/* Tournament / Football Shield Crest Logo */}
          <div className="pt-1 flex flex-col items-center">
            <CPLShieldCrest logoUrl={clubLogoUrl} isDark={isDark} />
          </div>

          {/* Right Stub Price & Cat Pills */}
          <div className="w-full space-y-2 my-auto px-1">
            {/* Price Pill */}
            <div>
              <span
                className={`text-[8px] sm:text-[9px] block font-semibold leading-tight mb-1 ${
                  isDark ? "text-red-200/90" : "text-slate-600"
                }`}
              >
                តម្លៃសំបុត្រ / PRICE TICKET
              </span>
              <div
                className={`py-1 px-2 rounded-lg font-black text-xs sm:text-sm tracking-wide shadow-sm ${
                  isDark
                    ? "bg-white text-slate-950"
                    : "bg-white text-red-700 border border-red-200"
                }`}
              >
                {engFormatted}
              </div>
            </div>

            {/* Category Pill */}
            <div>
              <span
                className={`text-[8px] sm:text-[9px] block font-semibold leading-tight mb-1 ${
                  isDark ? "text-red-200/90" : "text-slate-600"
                }`}
              >
                ប្រភេទសំបុត្រ / CAT :
              </span>
              <div
                className={`py-1 px-2 rounded-lg font-black text-xs sm:text-sm tracking-wider shadow-sm uppercase ${
                  isDark
                    ? "bg-white text-slate-950"
                    : "bg-white text-slate-950 border border-slate-200"
                }`}
              >
                {resolvedCategory}
              </div>
            </div>
          </div>

          {/* Right Stub Footer Strip */}
          <div className="w-full text-center pb-1">
            <span
              className={`text-[8px] sm:text-[9px] font-extrabold tracking-wider block uppercase ${
                isDark ? "text-red-200/90" : "text-red-700"
              }`}
            >
              CPL SEASON 2026/27
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CPLLogo({
  logoUrl = DEFAULT_CPL_LOGO,
  isDark = true,
}: {
  logoUrl?: string;
  isDark?: boolean;
}) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className="flex flex-col items-center select-none">
      {!hasError && logoUrl ? (
        <div className="relative w-14 h-12 sm:w-20 sm:h-20 flex items-center justify-center p-0.5">
          <img
            src={logoUrl}
            alt="Cambodian Premier League"
            onError={() => setHasError(true)}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      ) : (
        <div className="relative w-12 h-10 sm:w-16 sm:h-12 flex items-center justify-center">
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
            <path
              d="M 12 10 L 45 10 L 45 22 L 26 22 L 26 58 L 45 58 L 45 70 L 12 70 Z"
              fill="#e11d48"
            />
            <path
              d="M 40 10 L 88 10 L 88 46 L 54 46 L 54 70 L 40 70 Z"
              fill="#ffffff"
              stroke="#b91c1c"
              strokeWidth="1.5"
            />
            <path d="M 54 22 L 74 22 L 74 34 L 54 34 Z" fill="#b91c1c" />
          </svg>
        </div>
      )}
    </div>
  );
}

// Authentic Club Shield Crest
export function CPLShieldCrest({
  logoUrl = DEFAULT_CLUB_LOGO,
  isDark = true,
}: {
  logoUrl?: string;
  isDark?: boolean;
}) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className="flex flex-col items-center select-none">
      {!hasError && logoUrl ? (
        <div className="w-12 h-14 sm:w-16 sm:h-18 relative flex items-center justify-center p-0.5">
          <img
            src={logoUrl}
            alt="Club Crest"
            onError={() => setHasError(true)}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      ) : (
        <div className="w-11 h-13 sm:w-14 sm:h-16 relative flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
            <path
              d="M 50 4 L 90 20 L 90 70 C 90 95 50 116 50 116 C 50 116 10 95 10 70 L 10 20 Z"
              fill="#ffffff"
              stroke="#3b82f6"
              strokeWidth="3.5"
            />
            <path
              d="M 50 10 L 84 24 L 84 68 C 84 90 50 109 50 109 C 50 109 16 90 16 68 L 16 24 Z"
              fill="#1e3a8a"
            />
            <path
              d="M 50 20 C 58 35 68 40 68 55 C 68 66 60 74 50 74 C 40 74 32 66 32 55 C 32 40 42 35 50 20 Z"
              fill="#dc2626"
            />
            <path
              d="M 50 30 C 54 40 60 45 60 55 C 60 62 55 67 50 67 C 45 67 40 62 40 55 C 40 45 46 40 50 30 Z"
              fill="#f59e0b"
            />
            <circle
              cx="50"
              cy="56"
              r="12"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="1"
            />
            <polygon points="50,49 55,53 53,58 47,58 45,53" fill="#1e293b" />
            <path d="M 22 92 L 78 92 L 72 102 L 28 102 Z" fill="#3b82f6" />
            <text
              x="50"
              y="99"
              fill="#ffffff"
              fontSize="7"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              CPL 2026/27
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}

export function SVGQRCode({
  value,
  className = "w-10 h-10 sm:w-14 sm:h-14",
}: {
  value: string;
  className?: string;
}) {
  const [svgString, setSvgString] = React.useState<string>("");

  React.useEffect(() => {
    if (!value) return;
    QRCode.toString(
      value,
      {
        type: "svg",
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      },
      (err, str) => {
        if (!err && str) {
          // Ensure svg is responsive
          const responsiveSvg = str.replace(
            /<svg([^>]*)>/,
            '<svg$1 style="width:100%;height:100%;display:block;">',
          );
          setSvgString(responsiveSvg);
        }
      },
    );
  }, [value]);

  if (!svgString) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-6 h-6 border-2 border-[#005B8C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}

export default CPLMatchTicket;
