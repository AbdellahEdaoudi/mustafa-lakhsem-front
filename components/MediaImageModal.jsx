"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "@/components/lucide-react";

const IMAGE_MAP = {
  "sefrou-meeting-2026": "/galerie/Sefrou_Meeting_Lakhsem.png",
  "adhesion-mds-2026": "/galerie/Adhesion_MDS_Nakhla.jpg",
  "senegal-2024": "/galerie/Accord_Senegal_Maroc.jpg",
  "smart-cities-2023": "/galerie/Forum_Smart_Cities.jpg",
  "metal-luxe-2023": "/galerie/Championnat_Mondial.jpg",
  "elus-2023": "/galerie/Evenement_Officiel.jpg",
  "african-conf-2023": "/galerie/Conference_Internationale.jpg",
  "plan-2022": "/galerie/Engagement_Politique.jpg",
};

export default function MediaImageModal({ activeIdx, setActiveIdx, articles, onClose, lang }) {
  const isRtl = lang === "ar";
  const currentArt = articles[activeIdx];

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : articles.length - 1));
  }, [articles.length, setActiveIdx]);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev < articles.length - 1 ? prev + 1 : 0));
  }, [articles.length, setActiveIdx]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") isRtl ? handlePrev() : handleNext();
      if (e.key === "ArrowLeft") isRtl ? handleNext() : handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, isRtl, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!currentArt) return null;

  const currentImgSrc = IMAGE_MAP[currentArt.id] || "/galerie/Evenement_Officiel.jpg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-3 sm:p-6 animate-[fadeIn_0.25s_ease-out_both]"
      onClick={onClose}
    >
      <div
        className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 backdrop-blur-md text-xs font-bold text-amber-400 shadow-xl">
          <span>{activeIdx + 1} / {articles.length}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-300 truncate max-w-45 sm:max-w-xs">{currentArt.category}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Close image lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          isRtl ? handleNext() : handlePrev();
        }}
        className="absolute left-3 sm:left-6 z-30 p-3 rounded-full bg-slate-900/80 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer hover:scale-110 shadow-2xl"
        aria-label="Previous image"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          isRtl ? handlePrev() : handleNext();
        }}
        className="absolute right-3 sm:right-6 z-30 p-3 rounded-full bg-slate-900/80 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer hover:scale-110 shadow-2xl"
        aria-label="Next image"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        className="relative w-full max-w-5xl h-[85vh] flex flex-col items-center justify-center animate-[scaleIn_0.25s_ease-out_both]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full flex-1 max-h-[66vh] flex items-center justify-center rounded-2xl overflow-hidden border border-amber-500/20 bg-slate-950/90 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          <div className="absolute inset-0 bg-slate-900/90 animate-pulse pointer-events-none" />

          <Image
            src={currentImgSrc}
            alt={currentArt.title}
            fill
            sizes="(max-width: 1024px) 95vw, 1000px"
            unoptimized
            priority
            className="object-contain p-2 sm:p-4 select-none relative z-1"
          />
        </div>

        <div className="mt-3 text-center px-4 max-w-2xl">
          <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-1">
            {currentArt.title}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentArt.date} {currentArt.location ? `· ${currentArt.location}` : ""}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md overflow-x-auto max-w-full custom-modal-scroll">
          {articles.map((art, i) => {
            const thumbSrc = IMAGE_MAP[art.id] || "/galerie/Evenement_Officiel.jpg";
            const isActive = i === activeIdx;
            return (
              <button
                key={art.id}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`View image for ${art.title}`}
                className={`relative w-14 sm:w-16 h-10 sm:h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${isActive
                    ? "border-amber-400 scale-105 shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    : "border-transparent opacity-50 hover:opacity-100 hover:border-slate-600"
                  }`}
              >
                <div className="absolute inset-0 bg-slate-800/80 animate-pulse pointer-events-none" />
                <Image
                  src={thumbSrc}
                  alt={art.title}
                  style={{ objectPosition: art.id === "plan-2022" ? "center 10%" : art.id === "metal-luxe-2023" ? "center 15%" : "center" }}
                  fill
                  sizes="64px"
                  className="object-cover relative z-1"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
