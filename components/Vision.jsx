"use client";

import React, { useState } from "react";

import {
  Landmark,
  Quote,
  Milestone,
  GraduationCap,
  Trees,
  TrendingUp,
  Palmtree,
  Trophy,
  HeartPulse,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from "@/components/lucide-react";
import Image from "next/image";

// Icon mapping based on pillar number
const ICON_MAP = {
  "01": Milestone,
  "02": Trophy,
  "03": Trees,
  "04": ShieldCheck,
  "05": HeartPulse,
  "06": GraduationCap,
  "07": TrendingUp,
  "08": Building2,
};

export default function Vision({ t = {}, lang }) {
  const [activePillarIdx, setActivePillarIdx] = useState(null);

  const isRtl = lang === "ar";
  const visionData = t.vision || {};
  const pillars = visionData.pillars || [];

  return (
    <section id="vision" className="py-24 relative overflow-hidden bg-[#050918]">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 right-0 w-125 h-125 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-125 h-125 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 moroccan-pattern-overlay opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>{visionData.badge || "MUNICIPAL MANDATE & GOVERNANCE"}</span>
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          {/* Inspirational Mayorship Quote */}
          {visionData.quote && (
            <div className="relative inline-block my-3 px-7 py-3.5 rounded-2xl bg-[#091024]/90 border border-amber-500/30 text-amber-300 font-bold text-sm sm:text-base italic shadow-xl">
              <Quote className="w-4 h-4 inline-block opacity-70 mr-2 -mt-1 text-amber-400" />
              &ldquo;{visionData.quote}&rdquo;
            </div>
          )}

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mt-6 mb-4">
            <span className="text-emerald-gradient">{visionData.title || "Strategic Vision for"}</span>
            <br />
            <span className="text-white text-2xl sm:text-4xl">{visionData.subtitle || "Imouzzer-Kandar & The Middle Atlas"}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {visionData.desc || ""}
          </p>
        </div>

        {/* 8 Strategic Action Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = ICON_MAP[pillar.num] || Milestone;
            const isHovered = activePillarIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setActivePillarIdx(idx)}
                onMouseLeave={() => setActivePillarIdx(null)}
                className={`glass-panel rounded-3xl p-7 relative overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between group ${isHovered
                    ? "bg-[#0c1533] border-emerald-500/60 -translate-y-2 shadow-[0_20px_40px_rgba(16,185,129,0.15)]"
                    : "border-slate-800 hover:border-slate-700"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-slate-400 group-hover:text-amber-300 transition-colors">
                      {pillar.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-emerald-300 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-800/80 mt-auto">
                  <div className="flex items-start gap-2 text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pillar.detail}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mayorship Commitment Callout Banner */}
        <div className={`rounded-3xl p-8 sm:p-10 border border-emerald-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 text-center ${
          isRtl 
            ? "bg-linear-to-l from-emerald-950/50 via-[#070c1a] to-amber-950/40 lg:text-right" 
            : "bg-linear-to-r from-emerald-950/50 via-[#070c1a] to-amber-950/40 lg:text-left"
        }`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] shrink-0 bg-slate-950">
              <div className="absolute inset-0 bg-slate-900/90 animate-pulse pointer-events-none" />
              <Image
                src="/galerie/Portrait_Officiel.jpg"
                alt="Mustafa Lakhsem Mayor"
                width={112}
                height={112}
                className={`w-full h-full object-cover object-top relative z-1 ${isRtl ? "scale-x-[-1]" : ""}`}
              />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-2 block">
                {visionData.bannerBadge || "MUNICIPALITY OF IMOUZZER-KANDAR · MANDATE 2021–2027"}
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-white leading-snug max-w-xl">
                {visionData.bannerTitle || ""}
              </h4>
            </div>
          </div>
          <a
            href="#contact"
            className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2.5 shrink-0 cursor-pointer"
          >
            <span>{visionData.bannerBtn || "Contact Municipal Office"}</span>
            <ArrowUpRight className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </a>
        </div>

      </div>
    </section>
  );
}
