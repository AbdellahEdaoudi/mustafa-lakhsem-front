"use client";
import React from "react";
import Image from "next/image";
import { Medal, Crown, ArrowRight } from "@/components/lucide-react";

export default function About({ t = {}, lang }) {
  const about = t.about || {};
  return (
    <section id="about" className="relative py-24 min-h-[80vh] flex items-center overflow-hidden bg-[#040711]">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-125 h-125 bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('/moroccan-pattern.svg')] bg-repeat opacity-[0.04]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center">

          {/* Left: Portrait with Premium Frame and Glow */}
          <div className="w-full lg:w-5/12 relative group">
            <div className="absolute -inset-1 bg-linear-to-tr from-amber-500/20 to-emerald-500/25 rounded-[2.2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative aspect-4/5 w-full rounded-4xl overflow-hidden border border-amber-500/30 bg-[#040711] shadow-[0_0_50px_rgba(212,175,55,0.1)]">
              {/* Universal Loading Skeleton Placeholder */}
              <div className="absolute inset-0 bg-slate-900 animate-pulse pointer-events-none" />
              <Image 
                src="/about/image.jpg" 
                alt="Mustafa Lakhsem - About" 
                fill 
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 75vw, 480px" 
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] relative z-1" 
                quality={80}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#040711]/60 via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(4,7,17,0.5)]" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/25 backdrop-blur-md text-[10px] font-bold text-amber-300 tracking-wider uppercase shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {about.badge}
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 -left-3 -top-3 border border-amber-500/10 rounded-[2.4rem] pointer-events-none group-hover:border-amber-500/35 transition-all duration-700" />
          </div>

          {/* Right: Biography */}
          <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start text-center lg:text-start">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-8 text-center w-full">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-200 via-amber-400 to-amber-600">
                {about.title}
              </span>
            </h2>

            <div className="relative border-s-2 border-amber-500/30 ps-5 mb-10 max-w-2xl text-start">
              <p className="text-slate-300/90 text-sm sm:text-base md:text-lg leading-relaxed">
                {about.bio1_prefix}
                <span className="text-amber-200 font-medium">{about.bio1_date}</span>
                {about.bio1_mid}
                <span className="text-amber-400 font-semibold">{about.bio1_champion}</span>
                {about.bio1_suffix}
                <span className="text-emerald-400 font-semibold">{about.bio1_mayor}</span>.
              </p>
              <p className="text-slate-300/90 text-sm sm:text-base md:text-lg leading-relaxed mt-4">
                {about.bio2_prefix}
                <span className="text-amber-100/90 italic font-medium">{about.bio2_quote}</span>
                {about.bio2_mid}
                <span className="text-white font-medium">{about.bio2_lakhsem}</span>
                {about.bio2_connector}
                <span className="text-white font-medium">{about.bio2_mdm}</span>.
              </p>
            </div>

            {/* Royal Distinction */}
            <div className="w-full max-w-2xl rounded-2xl p-6 sm:p-7 bg-white/3 border border-amber-500/25 backdrop-blur-sm mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="shrink-0 w-16 h-16 rounded-xl bg-linear-to-tr from-amber-500 via-amber-300 to-amber-600 p-[1.5px]">
                  <div className="w-full h-full bg-[#050814] rounded-[11px] flex items-center justify-center">
                    <Medal className="w-7 h-7 text-amber-400" />
                  </div>
                </div>
                <div className="text-center sm:text-start">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    {about.royalLabel}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1.5">{about.royalTitle}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {about.royalDesc}
                  </p>
                </div>
              </div>
            </div>

            <a href="#career" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs uppercase tracking-widest hover:bg-amber-500/20 transition-colors">
              {about.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}