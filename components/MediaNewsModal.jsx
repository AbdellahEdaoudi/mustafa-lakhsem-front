"use client";

import React, { useEffect } from "react";
import { Calendar, MapPin, X } from "@/components/lucide-react";

export default function NewsDetailModal({ newsModalData, onClose, t = {}, lang }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!newsModalData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#0b1122] border border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden max-h-[85vh] flex flex-col transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 pt-5 pb-4 bg-[#0b1122]/95 backdrop-blur-md border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
              {newsModalData.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
              <span>{newsModalData.date}</span>
            </div>
            {newsModalData.location && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{newsModalData.location}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close article details"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-amber-400/80 hover:bg-slate-800 transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Contained Cleanly Inside Rounded Frame */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 custom-modal-scroll">
          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
            {newsModalData.title}
          </h3>

          <div className="h-px w-full bg-linear-to-r from-amber-500/40 via-slate-800 to-transparent" />

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p className="font-semibold text-slate-100 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
              {newsModalData.summary}
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {newsModalData.fullText}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#080d1a] border-t border-slate-800/80 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-medium truncate">
            {t.media?.pressReleaseNote || "Mustafa Lakhsem · Official Press Release"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold text-white transition-all cursor-pointer shrink-0 shadow-md"
          >
            {t.media?.closeModal || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
