"use client";

import React, { useState } from "react";
import { Briefcase } from "@/components/lucide-react";

const CATEGORY_STYLE = {
  origins: { accent: "#c9a227", glyph: "R", ring: "rgba(201,162,39,0.35)" },
  sport: { accent: "#c9a227", glyph: "S", ring: "rgba(201,162,39,0.35)" },
  civic: { accent: "#2c5f9e", glyph: "C", ring: "rgba(44,95,158,0.35)" },
  diplomacy: { accent: "#2f6f5e", glyph: "D", ring: "rgba(47,111,94,0.35)" },
  other: { accent: "#5b6b82", glyph: "•", ring: "rgba(91,107,130,0.35)" },
};

export default function Career({ t = {}, lang }) {
  const career = t?.career ?? {};
  const items = career.items ?? [];
  const [selectedFilter, setSelectedFilter] = useState("all");

  const tabs = [
    { id: "all", label: career.filterAll ?? "All" },
    { id: "sport", label: career.filterSport ?? "Sport & Titles" },
    { id: "civic", label: career.filterCivic ?? "Civic & Foundations" },
    { id: "diplomacy", label: career.filterDiplomacy ?? "Diplomacy" },
  ];

  // "origins" items only show under "All" — they have no dedicated tab,
  // since birth/roots isn't a filterable career track.
  const filteredItems = items.filter((item) =>
    selectedFilter === "all" ? true : (item.type ?? []).includes(selectedFilter)
  );

  return (
    <section id="career" className="relative overflow-hidden bg-[#0a0f1c] py-24">
      {/* Ambient ink texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-size-[24px_24px]" />
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-amber-500/5 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header — file cover style */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>{career.badge || "Career"}</span>
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-gold-gradient">{career.title}</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
            {career.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* Filters: wrapping pills on mobile, folder tabs on desktop */}
          <div
            role="tablist"
            aria-label="Career filter"
            className="flex flex-wrap justify-center gap-2 md:sticky md:top-24 md:w-56 md:flex-col md:flex-nowrap md:justify-start"
          >
            {tabs.map((tab) => {
              const active = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-pressed={active}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 sm:text-xs md:rounded-e-lg md:rounded-s-sm md:border-y md:border-s-4 md:border-e md:px-4 md:py-3 text-center md:text-start ${active
                      ? "border-amber-500 bg-amber-500/10 text-amber-400 md:translate-x-1 rtl:md:-translate-x-1"
                      : "border-slate-800 bg-slate-900/50 text-slate-500 hover:text-slate-300"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Case file list */}
          <div className="flex-1 space-y-5 md:space-y-6">
            {filteredItems.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
                {career.emptyState ?? "No entries in this file."}
              </p>
            )}

            {filteredItems.map((item, idx) => {
              const primaryType = item.type?.[0] ?? "other";
              const style = CATEGORY_STYLE[primaryType] ?? CATEGORY_STYLE.other;

              return (
                <div
                  key={`${item.year}-${item.title}-${idx}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0e1524] p-5 shadow-lg shadow-black/20 transition-colors duration-200 hover:border-slate-700 sm:p-6 md:p-7"
                  style={{ borderInlineStart: `4px solid ${style.accent}` }}
                >

                  {/* Watermark stamp */}
                  <span
                    className="pointer-events-none absolute -inset-e-3 top-1/2 -translate-y-1/2 -rotate-12 rtl:rotate-12 select-none text-4xl font-black uppercase opacity-[0.05] sm:-inset-e-4 sm:text-5xl md:text-6xl"
                    style={{ color: style.accent }}
                  >
                    {item.tag || primaryType}
                  </span>

                  <div className="relative flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="font-mono text-xs font-bold tracking-widest text-slate-500">
                          {item.year}
                        </span>
                        <span
                          className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                          style={{
                            color: style.accent,
                            borderColor: `${style.accent}55`,
                            backgroundColor: `${style.accent}14`,
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="mb-2 text-base font-bold text-white transition-colors group-hover:text-amber-400 sm:text-lg md:text-xl">
                        {item.title}
                      </h3>

                      <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
                        {item.desc}
                      </p>
                    </div>

                    {/* Wax seal */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-base font-black sm:h-12 sm:w-12 sm:text-lg"
                      style={{
                        borderColor: style.accent,
                        color: style.accent,
                        boxShadow: `0 0 0 4px ${style.ring}`,
                      }}
                    >
                      {style.glyph}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}