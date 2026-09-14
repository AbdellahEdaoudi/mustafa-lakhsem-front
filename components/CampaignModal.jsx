"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "@/components/lucide-react";

export default function CampaignModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Campaign expiration check: Auto-disable modal on and after September 24, 2026
    const now = new Date();
    const expiryDate = new Date("2026-09-24T00:00:00");
    if (now >= expiryDate) return;

    const isDismissed = typeof window !== "undefined" && sessionStorage.getItem("lakhsem_campaign_modal_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lakhsem_campaign_modal_dismissed", "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-[fadeIn_0.25s_ease-out_both]"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-lg w-auto rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.9)] bg-slate-950 flex flex-col transition-all duration-300 animate-[scaleIn_0.25s_cubic-bezier(0.16,1,0.3,1)_both]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close X Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close campaign alert"
          className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-slate-950/80 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all cursor-pointer hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pure Campaign Image Only */}
        <div className="relative w-full overflow-hidden rounded-3xl">
          <Image
            src="/galerie/Affiche_Election_Nakhla.png"
            alt="صوتوا على حزب النخلة"
            width={800}
            height={1000}
            unoptimized
            priority
            className="w-full h-auto max-h-[85vh] object-contain select-none rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}
