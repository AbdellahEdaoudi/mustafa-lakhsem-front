"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Newspaper, Calendar, ArrowRight, MapPin } from "@/components/lucide-react";

// Dynamically load modals ONLY when invoked (lazy modal loading)
const NewsDetailModal = dynamic(() => import("./MediaNewsModal"), { ssr: false });
const MediaImageModal = dynamic(() => import("./MediaImageModal"), { ssr: false });

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

export default function MediaCenter({ t = {}, lang }) {
  const [newsModalData, setNewsModalData] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(null);

  const articles = t.media?.articles || [];

  return (
    <section id="media" className="py-24 relative overflow-hidden bg-[#060913]">
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <div
              key={art.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group border-slate-800 hover:border-amber-500/50"
            >
              <div>
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
                  <div className="absolute inset-0 bg-slate-900/90 animate-pulse pointer-events-none" />

                  <Image
                    src={IMAGE_MAP[art.id] || "/galerie/Evenement_Officiel.jpg"}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover/img:scale-105 transition-transform duration-500 relative z-1"
                    style={{ objectPosition: art.id === "plan-2022" ? "center 20%" : art.id === "metal-luxe-2023" ? "center 15%" : "center" }}
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity z-2" />
                </div>

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

      {newsModalData && (
        <NewsDetailModal newsModalData={newsModalData} onClose={() => setNewsModalData(null)} t={t} lang={lang} />
      )}

      {activeImageIdx !== null && (
        <MediaImageModal
          activeIdx={activeImageIdx}
          setActiveIdx={setActiveImageIdx}
          articles={articles}
          onClose={() => setActiveImageIdx(null)}
          lang={lang}
        />
      )}
    </section>
  );
}
