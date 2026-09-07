"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Trees, Navigation, Sparkles, Droplets, Building2, Cpu, Compass, X,
} from "@/components/lucide-react";

export default function ImouzzerSpotlight({ t = {}, lang }) {
  const [activeImage, setActiveImage] = useState(null);

  const featureIcons = [
    Trees,
    Navigation,
    Sparkles,
    Droplets,
    Building2,
    Cpu,
  ];

  const imouzzerData = t.imouzzer || {};
  const features = imouzzerData.features || [];

  return (
    <section id="imouzzer" className="py-20 relative overflow-hidden bg-[#090e1e]">
      {/* Dynamic Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 moroccan-pattern-overlay opacity-[0.15] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Centered Badge Only */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{imouzzerData.badge || "Middle Atlas · Morocco"}</span>
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Features List */}
          <div className="lg:col-span-7">
            {/* Title & Description */}
            <div className="text-start mb-6">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3 leading-tight">
                <span className="text-gold-gradient">{imouzzerData.title}</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {imouzzerData.subtitle}
              </p>
            </div>

            {/* Features Sub-grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {features.map((feature, idx) => {
                const Icon = featureIcons[idx % featureIcons.length];
                return (
                  <div
                    key={idx}
                    className="glass-panel glass-panel-hover rounded-xl p-4 relative overflow-hidden group border-slate-800 hover:border-emerald-500/40 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-emerald-300 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Premium Double Image Composition */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center mt-8 lg:mt-0">
            {/* Ambient gold glow behind images */}
            <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative w-full max-w-105 aspect-4/5 flex items-center justify-center">

              {/* Image 1: Background Layer (Offset Top/Left) */}
              <div
                onClick={() => setActiveImage("/Imouzzer/image1.jpg")}
                className="absolute top-0 left-0 w-3/4 aspect-4/5 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl cursor-zoom-in group transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10"
              >
                <Image
                  src="/Imouzzer/image1.jpg"
                  alt="Imouzzer Landscape 1"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Image 2: Foreground Layer (Offset Bottom/Right) */}
              <div
                onClick={() => setActiveImage("/Imouzzer/image2.jpg")}
                className="absolute bottom-0 right-0 w-3/4 aspect-4/5 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl cursor-zoom-in group transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20"
              >
                <Image
                  src="/Imouzzer/image2.jpg"
                  alt="Imouzzer Landscape 2"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
            className="relative max-w-4xl w-full bg-[#0d1629] p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center animate-[scaleIn_0.2s_ease-out_both]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg hover:border-emerald-500/40 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Image Container */}
            <div className="w-full aspect-16/10 max-h-[75vh] flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden mt-4">
              <Image
                src={activeImage}
                alt="Enlarged Imouzzer Spot"
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
