"use client";

import React from "react";

import { Globe2, Handshake, ArrowRight, ShieldCheck, Users } from "@/components/lucide-react";

const ICONS = [Handshake, Users, ShieldCheck];

export default function Diplomacy({ t = {}, lang }) {
  const d = t.diplomacy || {};
  const highlights = d.highlights || [];

  return (
    <section id="diplomacy" className="py-24 relative overflow-hidden bg-linear-to-b from-[#050918] to-[#040711]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 border-amber-500/30 relative overflow-hidden bg-linear-to-br from-[#0c1533] via-[#080e22] to-[#040711] shadow-2xl">

          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">

            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{d.badge || "GLOBAL DIPLOMACY & COOPERATION"}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                  <span className="text-gold-gradient">{d.titleGold || "Ambassador for Morocco"}</span>
                  <br />
                  <span className="text-white">{d.titleWhite || "on the Global Stage"}</span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {d.desc}
                </p>

                <div className="flex items-center gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all group"
                  >
                    <span>{d.cta || "Diplomatic Inquiries"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 gap-4">
                {highlights.map((item, idx) => {
                  const Icon = ICONS[idx] || Handshake;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#091026]/80 border border-amber-500/15 flex items-start gap-4 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
