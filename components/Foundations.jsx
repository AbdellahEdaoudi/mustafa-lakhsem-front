"use client";

import React, { useState } from "react";
import Image from "next/image";

import {
  HeartHandshake,
  CheckCircle,
  X,
} from "@/components/lucide-react";

export default function Foundations({ t = {}, lang }) {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section id="foundations" className="py-24 relative overflow-hidden bg-[#060913]">
      {/* Background glow meshes */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{t.foundations.badge}</span>
            <HeartHandshake className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            <span className="text-gold-gradient">{t.foundations.title}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.foundations.subtitle}
          </p>
        </div>

        {/* Two Foundations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Lakhsem Foundation */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden border-amber-500/30 flex flex-col justify-between group hover:border-amber-400/60 transition-all duration-300">
            <div>
              {/* Title & Tagline */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  onClick={() => setActiveImage("/foundation/mlf.png")}
                  className="w-20 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-md border border-slate-200/10 cursor-zoom-in hover:scale-105 transition-transform"
                  title="Click to view large logo"
                >
                  <Image
                    src="/foundation/mlf.png"
                    alt="Lakhsem Foundation Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {t.foundations.lakhsem.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-amber-400/90 tracking-wide">
                    {t.foundations.lakhsem.tagline}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                {t.foundations.lakhsem.desc}
              </p>

              {/* Missions Checklist */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {t.foundations.lakhsem.missionTitle || "Key Objectives & Action Pillars"}
                </p>
                {t.foundations.lakhsem.missions.map((mission, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{mission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. MDM Foundation (Marocains du Monde) */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden border-blue-500/30 flex flex-col justify-between group hover:border-blue-400/60 transition-all duration-300">
            <div>
              {/* Title & Tagline */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  onClick={() => setActiveImage("/foundation/mdmpds.png")}
                  className="w-20 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-md border border-slate-200/10 cursor-zoom-in hover:scale-105 transition-transform"
                  title="Click to view large logo"
                >
                  <Image
                    src="/foundation/mdmpds.png"
                    alt="MDM Foundation Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {t.foundations.mdm.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-400 tracking-wide">
                    {t.foundations.mdm.tagline}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                {t.foundations.mdm.desc}
              </p>

              {/* Missions Checklist */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {t.foundations.mdm.missionTitle || "Strategic MDM Pillars"}
                </p>
                {t.foundations.mdm.missions.map((mission, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{mission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out_both]"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0d1629] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center animate-[scaleIn_0.2s_ease-out_both]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg hover:border-amber-500/40 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Image Container */}
            <div className="w-full aspect-4/3 flex items-center justify-center bg-white rounded-2xl overflow-hidden p-6 mt-4">
              <Image
                src={activeImage}
                alt="Enlarged logo"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
