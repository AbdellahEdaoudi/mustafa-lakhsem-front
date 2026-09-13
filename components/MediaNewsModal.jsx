"use client";

import React from "react";
import { Calendar, MapPin, X } from "@/components/lucide-react";

export default function NewsDetailModal({ newsModalData, onClose, t = {}, lang }) {
  if (!newsModalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b1122] border border-amber-500/40 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article details"
          className={`absolute ${lang === "ar" ? "top-4 left-4" : "top-4 right-4"} p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-amber-400 transition-colors cursor-pointer`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
            {newsModalData.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{newsModalData.date}</span>
          </div>
          {newsModalData.location && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{newsModalData.location}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-4 leading-snug">
          {newsModalData.title}
        </h3>

        <div className="h-px w-full bg-slate-800 mb-6" />

        <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold text-slate-200">
            {newsModalData.summary}
          </p>
          <p>{newsModalData.fullText}</p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-medium">
            {t.media?.pressReleaseNote || "Mustafa Lakhsem · Official Press Release"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            {t.media?.closeModal || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
