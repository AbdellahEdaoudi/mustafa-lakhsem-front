"use client";

import React, { useState } from "react";
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

function NewsDetailModal({ newsModalData, onClose, t = {}, lang }) {
  if (!newsModalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b1122] border border-amber-500/40 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
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

export default function MediaCenter({ t = {}, lang }) {
  const [newsModalData, setNewsModalData] = useState(null);

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
          {articles.map((art) => (
            <div
              key={art.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group border-slate-800 hover:border-amber-500/50"
            >
              <div>
                {/* Premium Image Header */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5 border border-slate-800/80 shadow-md">
                  <Image
                    src={IMAGE_MAP[art.id] || "/galerie/Evenement_Officiel.jpg"}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: art.id === "plan-2022" ? "center 20%" : art.id === "metal-luxe-2023" ? "center 15%" : "center" }}
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
      <NewsDetailModal newsModalData={newsModalData} onClose={() => setNewsModalData(null)} t={t} lang={lang} />
    </section>
  );
}
