import React, { useState, useEffect } from "react";
import { SVGQRCode } from "./CPLMatchTicket";
import {
  CREATE_PAYMENT,
  GET_PAYMENT_STATUS,
  MARK_PAYMENT,
} from "@/app/service/payment";

export interface AbaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amountUsd: number;
  zoneId: string;
  zoneName: string;
  quantity: number;
  orderId?: string;
}

export const AbaPaymentModal: React.FC<AbaPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  amountUsd,
  zoneId,
  zoneName,
  quantity,
  orderId,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeOrderId, setActiveOrderId] = useState<string>(
    orderId ||
      `CPL-PAY-${zoneId}-${Math.floor(100000 + Math.random() * 900000)}`,
  );
  const [payWayUrl, setPayWayUrl] = useState<string>(
    "https://pay.ababank.com/oRF8/cbgn43e0",
  );
  const [isCreatingPayment, setIsCreatingPayment] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const amountKhr = Math.round(amountUsd * 4000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);

  // Call CREATE_PAYMENT API when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setIsSuccess(false);
    setTimeLeft(300);
    setCopied(false);

    const initPayment = async () => {
      try {
        setIsCreatingPayment(true);
        const unitPrice = quantity > 0 ? amountUsd / quantity : amountUsd;
        const res = await CREATE_PAYMENT({
          zoneId: zoneId,
          price: unitPrice,
          quantity: quantity,
        });

        const batchOrder = res?.batchOrder || res?.data?.batchOrder;
        const ticketList = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
            ? res.data.data
            : res?.data
              ? [res.data]
              : [];
        const firstTicket = ticketList[0];

        if (batchOrder) {
          setActiveOrderId(batchOrder);
        } else if (firstTicket?.batchOrder || firstTicket?.order) {
          setActiveOrderId(firstTicket.batchOrder || firstTicket.order);
        }

        if (firstTicket?.payWayUrl) {
          setPayWayUrl(firstTicket.payWayUrl);
        }

        // On mobile device, try opening the ABA app link directly
        const isMobileDevice =
          typeof window !== "undefined" &&
          /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        const targetUrl = firstTicket?.payWayUrl || payWayUrl;
        if (isMobileDevice && targetUrl) {
          window.location.href = targetUrl;
        }
      } catch (err) {
        console.warn("Payment API request fallback:", err);
      } finally {
        setIsCreatingPayment(false);
      }
    };

    initPayment();
  }, [isOpen, zoneId, amountUsd, quantity]);

  // Expiration countdown timer
  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSuccess]);

  // Status polling from GET_PAYMENT_STATUS API (supports batchOrder and orderId)
  useEffect(() => {
    if (!isOpen || isSuccess || !activeOrderId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await GET_PAYMENT_STATUS(activeOrderId);
        const rawData = res?.data?.data || res?.data;
        const status = Array.isArray(rawData)
          ? rawData[0]?.status?.toUpperCase()
          : rawData?.status?.toUpperCase();

        if (
          status === "SUCCESS" ||
          status === "PAID" ||
          status === "COMPLETED"
        ) {
          setIsSuccess(true);
          clearInterval(pollInterval);
          setTimeout(() => {
            onPaymentSuccess();
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("reload-tickets"));
            }
          }, 1200);
        }
      } catch {}
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isOpen, isSuccess, activeOrderId, onPaymentSuccess]);

  const handleConfirmPayment = async () => {
    try {
      setIsSubmitting(true);
      if (activeOrderId) {
        await MARK_PAYMENT(activeOrderId, "COMPLETED");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("reload-tickets"));
        }
      }
    } catch (err) {
      console.warn("Update payment status error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[400px] bg-[#111827] rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-800 flex flex-col">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005B8C] flex items-center justify-center text-white font-black tracking-widest text-xs shadow-inner">
              ABA
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                ABA PayWay (Scan to Pay)
              </h2>
              <p className="text-gray-400 text-xs">
                {zoneName} • {quantity} Ticket{quantity > 1 ? "s" : ""} • $
                {amountUsd.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Ticket Stub Divider */}
        <div className="relative flex items-center px-2">
          <div className="w-4 h-8 bg-black/85 backdrop-blur-sm rounded-r-full absolute left-[-1px] border-r border-y border-gray-800"></div>
          <div className="flex-1 border-t-2 border-dashed border-gray-800 mx-4"></div>
          <div className="w-4 h-8 bg-black/85 backdrop-blur-sm rounded-l-full absolute right-[-1px] border-l border-y border-gray-800"></div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 pt-4 pb-6">
          {isSuccess ? (
            <div className="py-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-5">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] text-white">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Payment Confirmed
              </h3>
              <p className="text-gray-400 text-sm px-4">
                Your payment of{" "}
                <strong className="text-white">${amountUsd.toFixed(2)}</strong>{" "}
                was successful. Securing your tickets now...
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* QR Code */}
              <div className="bg-white rounded-2xl p-4 mx-auto w-56 h-56 flex items-center justify-center relative shadow-xl">
                {isCreatingPayment ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <div className="w-8 h-8 border-2 border-[#005B8C] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[11px] font-semibold">
                      Generating KHQR...
                    </span>
                  </div>
                ) : (
                  <SVGQRCode value={payWayUrl} className="w-full h-full" />
                )}
              </div>

              {/* Timer & Copy ID */}
              <div className="flex items-center justify-center text-xs px-2">
                <div className="flex flex-col">
                  <span className="text-gray-500">Time remaining</span>
                  <span className="text-yellow-500 text-center font-mono font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {isMobile && payWayUrl && (
                  <a
                    href={payWayUrl}
                    className="w-full py-3.5 rounded-xl bg-[#005B8C] hover:bg-[#004870] text-white font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 block text-center"
                  >
                    Open in ABA App
                  </a>
                )}

                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold text-sm transition-colors border border-gray-700 shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Completing Payment...</span>
                    </>
                  ) : (
                    <span>Complete Payment</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbaPaymentModal;
