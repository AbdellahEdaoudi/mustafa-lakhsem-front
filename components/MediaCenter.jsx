"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

import {
  Newspaper,
  Calendar,
  ArrowRight,
  X,
  MapPin,
} from "@/components/lucide-react";

// Image mapping for each article ID using public/galerie assets
const IMAGE_MAP = {
  "senegal-2024": "/galerie/Accord_Senegal_Maroc.jpg",
  "smart-cities-2023": "/galerie/Forum_Smart_Cities.jpg",
  "metal-luxe-2023": "/galerie/Championnat_Mondial.jpg",
  "elus-2023": "/galerie/Evenement_Officiel.jpg",
  "african-conf-2023": "/galerie/Conference_Internationale.jpg",
  "plan-2022": "/galerie/Engagement_Politique.jpg",
};

// ─── Article Text Detail Modal ──────────────────────────────────────────────
function NewsDetailModal({ newsModalData, onClose, t = {}, lang }) {
  if (!newsModalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b1122] border border-amber-500/40 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article details"
          className={`absolute ${lang === "ar" ? "top-4 left-4" : "top-4 right-4"} p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-amber-400 transition-colors cursor-pointer`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Meta */}
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

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white mb-4 leading-snug">
          {newsModalData.title}
        </h3>

        {/* Divider */}
        <div className="h-px w-full bg-slate-800 mb-6" />

        {/* Full Text */}
        <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold text-slate-200">
            {newsModalData.summary}
          </p>
          <p>{newsModalData.fullText}</p>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
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

// ─── High-End Image Lightbox Modal ──────────────────────────────────────────
function MediaImageModal({ activeIdx, setActiveIdx, articles, onClose, lang }) {
  const isRtl = lang === "ar";
  const currentArt = articles[activeIdx];

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : articles.length - 1));
  }, [articles.length, setActiveIdx]);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev < articles.length - 1 ? prev + 1 : 0));
  }, [articles.length, setActiveIdx]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") isRtl ? handlePrev() : handleNext();
      if (e.key === "ArrowLeft") isRtl ? handleNext() : handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, isRtl, onClose]);

  // Prevent background scroll
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
      {/* Top Controls Bar */}
      <div
        className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 backdrop-blur-md text-xs font-bold text-amber-400 shadow-xl">
          <span>{activeIdx + 1} / {articles.length}</span>
          <span className="text-slate-500">·</span>
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

      {/* Prev & Next Arrow Buttons */}
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

      {/* Main Image Stage */}
      <div
        className="relative w-full max-w-5xl h-[85vh] flex flex-col items-center justify-center animate-[scaleIn_0.25s_ease-out_both]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full flex-1 max-h-[66vh] flex items-center justify-center rounded-2xl overflow-hidden border border-amber-500/20 bg-slate-950/90 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          {/* Pulse skeleton behind active image */}
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

        {/* Caption */}
        <div className="mt-3 text-center px-4 max-w-2xl">
          <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-1">
            {currentArt.title}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentArt.date} {currentArt.location ? `· ${currentArt.location}` : ""}
          </p>
        </div>

        {/* Thumbnails Navigation Strip */}
        <div className="mt-3 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md overflow-x-auto max-w-full">
          {articles.map((art, i) => {
            const thumbSrc = IMAGE_MAP[art.id] || "/galerie/Evenement_Officiel.jpg";
            const isActive = i === activeIdx;
            return (
              <button
                key={art.id}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`View image for ${art.title}`}
                className={`relative w-14 sm:w-16 h-10 sm:h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  isActive
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

// ─── Main MediaCenter Component ─────────────────────────────────────────────
export default function MediaCenter({ t = {}, lang }) {
  const [newsModalData, setNewsModalData] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(null);

  const articles = t.media?.articles || [];

  return (
    <section id="media" className="py-24 relative overflow-hidden bg-[#060913]">
      {/* Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Newspaper className="w-3.5 h-3.5" />
            <span>{t.media?.badge || "News Center"}</span>
            <Newspaper className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            <span className="text-gold-gradient">{t.media?.title}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.media?.subtitle}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <div
              key={art.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group border-slate-800 hover:border-amber-500/50"
            >
              <div>
                {/* Premium Clickable Image with Skeleton (Imouzzer style) */}
                <div
                  onClick={() => setActiveImageIdx(idx)}
                  className="relative w-full h-48 rounded-xl overflow-hidden mb-5 border border-slate-800/80 shadow-md cursor-zoom-in group/img"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveImageIdx(idx);
                    }
                  }}
                  aria-label={`Enlarge image: ${art.title}`}
                >
                  {/* Universal Skeleton Pulse Background */}
                  <div className="absolute inset-0 bg-slate-900/90 animate-pulse pointer-events-none" />

                  <Image
                    src={IMAGE_MAP[art.id] || "/galerie/Evenement_Officiel.jpg"}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover/img:scale-105 transition-transform duration-500 relative z-1"
                    style={{ objectPosition: art.id === "plan-2022" ? "center 20%" : art.id === "metal-luxe-2023" ? "center 15%" : "center" }}
                  />

                  {/* Subtle hover overlay (Imouzzer style) */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity z-2" />
                </div>

                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{art.date}</span>
                  </div>
                </div>
                {art.location && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{art.location}</span>
                  </div>
                )}

                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 line-clamp-3">
                  {art.summary}
                </p>
              </div>

              {/* Read More Trigger */}
              <button
                type="button"
                onClick={() => setNewsModalData(art)}
                className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors cursor-pointer w-full text-start"
              >
                <span>{t.media?.readMore || "Read Details"}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      <NewsDetailModal newsModalData={newsModalData} onClose={() => setNewsModalData(null)} t={t} lang={lang} />

      {/* High-End Image Lightbox Modal */}
      {activeImageIdx !== null && (
        <MediaImageModal
          activeIdx={activeImageIdx}
          setActiveIdx={setActiveImageIdx}
          articles={articles}
          onClose={() => setActiveImageIdx(null)}
          lang={lang}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
