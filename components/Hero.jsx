"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import {
  Trophy, Landmark, HeartHandshake, Globe2, ArrowRight, Sparkles, ChevronDown, Medal, Flame, ShieldCheck, Award,
} from "@/components/lucide-react";
import Link from "next/link";

export default function Hero({ t = {}, lang }) {
  const [activeRoleIdx, setActiveRoleIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const roles = [
    { text: t.hero?.roles?.[0] || "World Champion · Kickboxing & Full-Contact", icon: Trophy, accent: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
    { text: t.hero?.roles?.[1] || "Mayor · Imouzzer-Kandar", icon: Landmark, accent: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
    { text: t.hero?.roles?.[2] || "Founder · Lakhsem Foundation", icon: HeartHandshake, accent: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
    { text: t.hero?.roles?.[3] || "Humanitarian · Leader · Visionary", icon: Medal, accent: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
  ];

  const heroImages = [
    "/hero/hero1.jpg",
    "/hero/hero2.jpg",
    "/hero/hero3.jpg",
    "/hero/hero4.jpg",
  ];

  const [loadedImages, setLoadedImages] = useState([0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRoleIdx((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [roles.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadedImages([0, 1, 2, 3]);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const imgTimer = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(imgTimer);
  }, [heroImages.length]);

  const stats = [
    { value: t.hero?.stats?.[0]?.value || "70+", label: t.hero?.stats?.[0]?.label || "Victories", icon: Trophy },
    { value: t.hero?.stats?.[1]?.value || "12+", label: t.hero?.stats?.[1]?.label || "World Titles", icon: Flame },
    { value: t.hero?.stats?.[2]?.value || "30+", label: t.hero?.stats?.[2]?.label || "Years", icon: ShieldCheck },
    { value: t.hero?.stats?.[3]?.value || "5+", label: t.hero?.stats?.[3]?.label || "Continents", icon: Globe2 },
  ];

  const CurrentIcon = roles[activeRoleIdx].icon;
  const badgeText = t.hero?.badge || "Royal Decoration";
  const titleText = t.hero?.title || "MUSTAFA LAKHSEM";
  const descText = t.hero?.desc || "From the ring to the town hall, from Morocco to the world. After making history in combat sports, he committed himself to serving his municipality and the Moroccan diaspora.";
  const btn1Text = t.hero?.btn1 || "Discover";
  const btn2Text = t.hero?.btn2 || "Foundations";
  const tickerItems = t.hero?.ticker || ["World Champion", "Mayor of Imouzzer-Kandar", "Lakhsem Foundation", "Tiger of the Rings", "Kingdom of Morocco", "Humanitarian Leader"];

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-20 sm:pt-24 pb-0 overflow-x-hidden bg-[#040711]">

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('/moroccan-pattern.svg')] bg-repeat opacity-5 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">

        {/* Right Column on desktop, shown FIRST on mobile: Image */}
        <div className="order-1 lg:order-2 w-full lg:w-1/2 h-70 sm:h-100 lg:h-137.5 relative rounded-4xl overflow-hidden border border-amber-500/20 shadow-[0_0_30px_rgba(212,175,55,0.15)] shrink-0 bg-slate-950">
          {/* Universal Loading Skeleton Placeholder */}
          <div className="absolute inset-0 bg-slate-900/90 animate-pulse pointer-events-none" />

          {heroImages.map((src, idx) => {
            const isFirst = idx === 0;
            // Only mount first image initially; mount others after initial load
            if (!isFirst && !loadedImages.includes(idx)) return null;

            return (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeImageIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                style={{ transitionProperty: 'opacity, transform', transitionDuration: '1.5s' }}
              >
                <Image
                  src={src}
                  alt={`Mustafa Lakhsem image ${idx + 1}`}
                  fill
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 92vw, (max-width: 1024px) 85vw, 550px"
                  className={`object-cover ${src.includes("hero4") ? "object-top" : "object-center lg:object-top"}`}
                  style={{ objectPosition: src.includes("hero4") ? "center 10%" : undefined }}
                  priority={isFirst}
                  loading="eager"
                  fetchPriority={isFirst ? "high" : "auto"}
                  quality={75}
                />
                {/* Very light inner shadow to frame the image, no full overlay */}
                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(4,7,17,0.3)] pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Left Column on desktop, shown SECOND on mobile: Text & Content */}
        <div className="order-2 lg:order-1 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-start">

          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-amber-500/30 bg-[#040711]/80 backdrop-blur-md mb-5 shadow-sm">
            <span className={`font-bold text-amber-200 uppercase ${lang === "ar" ? "text-sm sm:text-base tracking-normal" : "text-[10px] sm:text-xs tracking-[0.15em]"}`}>
              {badgeText}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tight text-white uppercase mb-3 leading-none">
            <span className="bg-clip-text text-transparent bg-linear-to-b from-amber-200 via-amber-400 to-amber-600">
              {titleText}
            </span>
          </h1>

          <div className="min-h-10 flex items-center mb-4">
            <div
              key={activeRoleIdx}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${roles[activeRoleIdx].accent} backdrop-blur-xl text-xs sm:text-sm font-black tracking-wide transition-all duration-500`}
            >
              <CurrentIcon className="w-4 h-4" />
              <span>{roles[activeRoleIdx].text}</span>
            </div>
          </div>

          <p className="max-w-xl text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            {descText}
          </p>
          {/*  */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
            <Link
              href="#achievements"
              className="px-6 py-3 rounded-full bg-linear-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider hover:-translate-y-0.5 transition-transform flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>{btn1Text}</span>
              <Trophy className="w-4 h-4" />
            </Link>
            <Link
              href="#foundations"
              className="px-6 py-3 rounded-full bg-[#040711]/80 border border-amber-500/50 text-amber-300 font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:-translate-y-0.5 transition-transform flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>{btn2Text}</span>
              <Award className="w-4 h-4" />
            </Link>
          </div>

          {/* Luxury Unified Glass Stats Bar */}
          <div className="w-full max-w-xl rounded-2xl sm:rounded-3xl bg-slate-950/60 border border-amber-500/25 p-4 sm:p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 relative z-10">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center text-center p-3 rounded-xl sm:rounded-2xl bg-white/3 border border-amber-500/15 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-300 group min-w-0"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform duration-300 shrink-0" />
                      <span className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-linear-to-b from-amber-200 via-amber-300 to-amber-500 leading-none">
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300/90 uppercase tracking-wide leading-tight wrap-break-word max-w-full">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Ticker - Seamless continuous loop */}
      <div className="w-full bg-amber-500/10 border-t border-amber-500/30 py-3 backdrop-blur-md overflow-hidden relative z-10 mt-12 lg:mt-12">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-amber-200">
          {/* Track A */}
          <div className="flex items-center gap-8 shrink-0">
            {tickerItems.map((item, i) => (
              <span key={`a-${i}`} className="inline-flex items-center gap-8">
                <span>{item}</span>
                <span className="text-amber-500 select-none">✦</span>
              </span>
            ))}
          </div>
          {/* Track B (exact identical duplicate for 100% gapless infinite loop) */}
          <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
            {tickerItems.map((item, i) => (
              <span key={`b-${i}`} className="inline-flex items-center gap-8">
                <span>{item}</span>
                <span className="text-amber-500 select-none">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}