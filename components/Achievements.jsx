"use client";

import React, { useState } from "react";

import { Trophy, Crown, Medal, Flame, ShieldCheck, Star, } from "@/components/lucide-react";

// Map item id → icon + gold gradient
const ICON_MAP = {
  "wako-pro-world": { icon: Crown, grade: "from-amber-400 via-yellow-200 to-amber-600" },
  "wkn-world": { icon: Trophy, grade: "from-yellow-400 via-amber-300 to-yellow-600" },
  "wkpl-world": { icon: Crown, grade: "from-amber-500 via-yellow-300 to-amber-700" },
  "african-champ": { icon: Medal, grade: "from-red-400 via-amber-200 to-red-600" },
  "euro-champ": { icon: Trophy, grade: "from-blue-400 via-cyan-200 to-blue-600" },
  "german-national": { icon: ShieldCheck, grade: "from-emerald-400 via-teal-200 to-emerald-600" },
};

export default function Achievements({ t = {}, lang }) {
  const [activeTab, setActiveTab] = useState("all");

  const achievementsData = t.achievements || {};
  const items = achievementsData.items || [];
  const tabsData = achievementsData.tabs || {};
  const stats = achievementsData.stats || {};

  const tabs = [
    { id: "all", label: tabsData.all || "All Championships" },
    { id: "world", label: tabsData.world || "World Titles (12×)" },
    { id: "continental", label: tabsData.continental || "European & African" },
    { id: "national", label: tabsData.national || "National Honors" },
  ];

  const filtered = items.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "world") return item.id.includes("world");
    if (activeTab === "continental") return item.id.includes("euro") || item.id.includes("african");
    if (activeTab === "national") return item.id.includes("german");
    return true;
  });

  return (
    <section id="achievements" className="py-24 relative overflow-hidden bg-[#040711]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-137.5 h-137.5 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-112.5 h-112.5 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 moroccan-pattern-overlay opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{achievementsData.badge || "Achievements"}</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-5">
            <span className="text-gold-gradient">{achievementsData.title || "12× World Championship"}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {achievementsData.subtitle || ""}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeTab === tab.id
                ? "bg-linear-to-r from-[#d4af37] via-[#fef08a] to-[#d4af37] text-slate-950 shadow-[0_0_25px_rgba(212,175,55,0.35)] scale-105"
                : "bg-[#090f22]/80 border border-amber-500/20 text-slate-300 hover:text-white hover:border-amber-400/40"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Prestigious Belt & Trophy Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-16">
          {filtered.map((item) => {
            const iconConfig = ICON_MAP[item.id] || { icon: Trophy, grade: "from-amber-400 via-yellow-200 to-amber-600" };
            const Icon = iconConfig.icon;
            const goldGrade = iconConfig.grade;
            return (
              <div
                key={item.id}
                className="glass-panel glass-panel-hover rounded-3xl p-8 relative overflow-hidden group border-amber-500/20 flex flex-col justify-between"
              >
                {/* Gold Top Light Filament */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Card Header & Emblems */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${goldGrade} p-[1.5px] shadow-[0_0_20px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-transform`}>
                      <div className="w-full h-full bg-[#070c1a] rounded-[14px] flex items-center justify-center text-amber-300">
                        <Icon className="w-7 h-7" />
                      </div>
                    </div>

                    <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] sm:text-[11px] font-black text-amber-300 uppercase tracking-widest">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5 group-hover:text-amber-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                    <span>{item.category}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="text-amber-400/90 font-mono tracking-wider">{item.years}</span>
                  <span className="text-[11px] text-slate-500 uppercase tracking-widest">{achievementsData.sanction || "Official Sanction"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Career Milestone Double Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass-panel rounded-3xl p-8 flex items-center gap-6 border-amber-500/30 bg-linear-to-r from-amber-950/40 to-[#070c1a]">
            <div className="w-18 h-18 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
              <Flame className="w-9 h-9 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-gold-gradient mb-1">
                {stats.fightsTitle || "70+ Professional Fights"}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {stats.fightsDesc || ""}
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 flex items-center gap-6 border-emerald-500/30 bg-linear-to-r from-emerald-950/40 to-[#070c1a]">
            <div className="w-18 h-18 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <Medal className="w-9 h-9 text-emerald-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mb-1">
                {stats.royalTitle || "Royal Order of National Merit — Exceptional Grade"}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {stats.royalDesc || ""}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
