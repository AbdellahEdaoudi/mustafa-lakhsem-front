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

  const f = t?.foundations || {};
  const lakhsem = f.lakhsem || {};
  const mdm = f.mdm || {};
  const lakhsemMissions = lakhsem.missions || [];
  const mdmMissions = mdm.missions || [];

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
            <span>{f.badge || "Foundations"}</span>
            <HeartHandshake className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            <span className="text-gold-gradient">{f.title || "Building a Brighter Future"}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {f.subtitle || ""}
          </p>
        </div>

        {/* Two Foundations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Lakhsem Foundation */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden border-amber-500/30 flex flex-col justify-between group hover:border-amber-400/60 transition-all duration-300">
            <div>
              {/* Title & Tagline */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveImage("/foundation/mlf.png")}
                  className="relative w-20 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-md border border-slate-200/10 cursor-zoom-in hover:scale-105 transition-transform"
                  title="Click to view large logo"
                  aria-label="View Lakhsem Foundation Logo"
                >
                  <div className="absolute inset-0 bg-slate-200 animate-pulse pointer-events-none" />
                  <Image
                    src="/foundation/mlf.png"
                    alt={lakhsem.name || "Lakhsem Foundation"}
                    width={80}
                    height={56}
                    className="w-full h-full object-contain relative z-1"
                  />
                </button>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {lakhsem.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wide">
                    {lakhsem.tagline}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                {lakhsem.desc}
              </p>

              {/* Missions Checklist */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {lakhsem.missionTitle || "Key Objectives & Action Pillars"}
                </p>
                {lakhsemMissions.map((mission, idx) => (
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
                <button
                  type="button"
                  onClick={() => setActiveImage("/foundation/mdmpds.png")}
                  className="relative w-20 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-md border border-slate-200/10 cursor-zoom-in hover:scale-105 transition-transform"
                  title="Click to view large logo"
                  aria-label="View MDM Foundation Logo"
                >
                  <div className="absolute inset-0 bg-slate-200 animate-pulse pointer-events-none" />
                  <Image
                    src="/foundation/mdmpds.png"
                    alt={mdm.name || "MDM Foundation"}
                    width={80}
                    height={56}
                    className="w-full h-full object-contain relative z-1"
                  />
                </button>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {mdm.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-400 tracking-wide">
                    {mdm.tagline}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                {mdm.desc}
              </p>

              {/* Missions Checklist */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {mdm.missionTitle || "Strategic MDM Pillars"}
                </p>
                {mdmMissions.map((mission, idx) => (
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

      {/* Premium Logo/Foundation Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-[fadeIn_0.25s_ease-out_both]"
          onClick={() => setActiveImage(null)}
        >
          {/* Top Bar Controls */}
          <div
            className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-xs font-semibold text-amber-400">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>
                {activeImage.includes("mlf") ? (lakhsem.name || "Lakhsem Foundation") : (mdm.name || "MDM Foundation")}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="pointer-events-auto w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Modal Wrapper */}
          <div
            className="relative w-full max-w-3xl flex flex-col items-center justify-center animate-[scaleIn_0.25s_ease-out_both]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo Display Box */}
            <div className="relative w-full aspect-16/10 max-h-[60vh] flex items-center justify-center bg-linear-to-b from-white via-slate-50 to-slate-100 rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-8 sm:p-12">
              <div className="absolute inset-0 bg-slate-200 animate-pulse pointer-events-none" />
              <Image
                src={activeImage}
                alt="Enlarged Foundation Logo"
                fill
                sizes="(max-width: 768px) 90vw, 700px"
                unoptimized
                priority
                className="object-contain p-6 sm:p-8 select-none drop-shadow-md relative z-1"
              />
            </div>

            {/* Bottom Foundation Switcher */}
            <div className="mt-5 flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveImage("/foundation/mlf.png")}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeImage === "/foundation/mlf.png"
                    ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                <span>{lakhsem.name || "Fondation Lakhsem"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveImage("/foundation/mdmpds.png")}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeImage === "/foundation/mdmpds.png"
                    ? "bg-blue-500/20 border border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                <span>{mdm.name || "Fondation MDM"}</span>
              </button>
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
          from { transform: scale(0.96); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}

