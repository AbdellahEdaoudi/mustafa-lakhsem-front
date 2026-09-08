"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Trees, Navigation, Sparkles, Droplets, Building2, Cpu, Compass, X, ChevronLeft, ChevronRight,
} from "@/components/lucide-react";

export default function ImouzzerSpotlight({ t = {}, lang }) {
  const [activeImage, setActiveImage] = useState(null);
  const [loaded, setLoaded] = useState({ img1: false, img2: false });

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

  const galleryImages = [
    { src: "/Imouzzer/image1.jpg", alt: "Imouzzer Landscape 1" },
    { src: "/Imouzzer/image2.jpg", alt: "Imouzzer Landscape 2" },
  ];

  const currentIdx = galleryImages.findIndex((img) => img.src === activeImage);

  const showNext = () => {
    if (currentIdx !== -1) {
      const next = (currentIdx + 1) % galleryImages.length;
      setActiveImage(galleryImages[next].src);
    }
  };

  const showPrev = () => {
    if (currentIdx !== -1) {
      const prev = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
      setActiveImage(galleryImages[prev].src);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!activeImage) return;
    const handleKey = (e) => {
      if (e.key === "ArrowRight") showNext();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeImage, currentIdx]);

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
                className="absolute top-0 left-0 w-3/4 aspect-4/5 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl cursor-zoom-in group transform-gpu -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 bg-slate-950"
              >
                <div className={`absolute inset-0 bg-slate-800 animate-pulse pointer-events-none transition-opacity duration-500 ${loaded.img1 ? "opacity-0" : "opacity-100"}`} />
                <Image
                  src="/Imouzzer/image1.jpg"
                  alt="Imouzzer Landscape 1"
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 75vw, (max-width: 1200px) 40vw, 350px"
                  className="object-cover relative z-1"
                  onLoad={() => setLoaded((p) => ({ ...p, img1: true }))}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-2" />
              </div>

              {/* Image 2: Foreground Layer (Offset Bottom/Right) */}
              <div
                onClick={() => setActiveImage("/Imouzzer/image2.jpg")}
                className="absolute bottom-0 right-0 w-3/4 aspect-4/5 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl cursor-zoom-in group transform-gpu rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20 bg-slate-950"
              >
                <div className={`absolute inset-0 bg-slate-800 animate-pulse pointer-events-none transition-opacity duration-500 ${loaded.img2 ? "opacity-0" : "opacity-100"}`} />
                <Image
                  src="/Imouzzer/image2.jpg"
                  alt="Imouzzer Landscape 2"
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 75vw, (max-width: 1200px) 40vw, 350px"
                  className="object-cover relative z-1"
                  onLoad={() => setLoaded((p) => ({ ...p, img2: true }))}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-2" />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Premium Lightbox Modal */}
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
            <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-xs font-semibold text-emerald-400">
              <span>{currentIdx + 1} / {galleryImages.length}</span>
            </div>

            <button
              onClick={() => setActiveImage(null)}
              className="pointer-events-auto w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prev Button */}
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Main Modal Wrapper */}
          <div
            className="relative w-full max-w-5xl h-[85vh] flex flex-col items-center justify-center animate-[scaleIn_0.25s_ease-out_both]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Stage */}
            <div className="relative w-full flex-1 max-h-[72vh] flex items-center justify-center rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-sm">
              <div className="absolute inset-0 bg-slate-900/90 animate-pulse pointer-events-none" />
              <Image
                src={activeImage}
                alt={galleryImages[currentIdx]?.alt || "Imouzzer Spot"}
                fill
                sizes="(max-width: 1024px) 95vw, 1000px"
                unoptimized
                priority
                className="object-contain p-2 sm:p-4 select-none relative z-1"
              />
            </div>

            {/* Bottom Thumbnails Strip */}
            <div className="mt-4 flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/70 border border-slate-800/70 backdrop-blur-md">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img.src)}
                  className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === img.src
                      ? "border-emerald-400 scale-105 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                      : "border-transparent opacity-50 hover:opacity-100 hover:border-slate-600"
                  }`}
                >
                  <div className="absolute inset-0 bg-slate-800 animate-pulse pointer-events-none" />
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="64px"
                    className="object-cover relative z-1"
                  />
                </button>
              ))}
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
