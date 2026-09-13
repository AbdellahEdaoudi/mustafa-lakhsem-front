"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowUp, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin,
} from "@/components/lucide-react";

const SOCIAL_LINKS = [
  {
    key: "facebook",
    url: "https://www.facebook.com/Mustafa.Lakhsem.officiel",
    colorClass: "hover:text-[#1877F2] hover:border-[#1877F2]",
    Icon: Facebook,
  },
  {
    key: "instagram",
    url: "https://www.instagram.com/mustafalakhsem",
    colorClass: "hover:text-[#E1306C] hover:border-[#E1306C]",
    Icon: Instagram,
  },
  {
    key: "tiktok",
    url: "https://www.tiktok.com/@mustafa.lakhsem",
    colorClass: "hover:text-[#25F4EE] hover:border-[#25F4EE]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.2 1.12 1.25 2.68 1.99 4.3 2.14v3.89c-1.4-.04-2.79-.44-3.97-1.21-.69-.45-1.27-.98-1.74-1.63-.05 2.53-.02 5.07-.04 7.6-.07 2.05-.62 4.09-1.78 5.75-1.66 2.4-4.52 3.8-7.44 3.6-2.92-.09-5.69-1.75-6.98-4.38-1.57-3.03-1.07-7.1 1.25-9.57 1.83-2.02 4.67-2.88 7.32-2.2v4c-1.28-.35-2.71-.12-3.79.67-1.15.82-1.73 2.32-1.46 3.7.27 1.63 1.7 2.87 3.35 2.89 1.82.04 3.42-1.32 3.51-3.13.06-2.73.02-5.46.03-8.19.01-.04 0-.08 0-.12z" />
      </svg>
    ),
  },
  {
    key: "twitter",
    url: "https://x.com/LakhsemM",
    colorClass: "hover:text-white hover:border-white",
    Icon: Twitter,
  },
  {
    key: "linkedin",
    url: "https://www.linkedin.com/in/mustafa-lakhsem-0480328b/",
    colorClass: "hover:text-[#0A66C2] hover:border-[#0A66C2]",
    Icon: Linkedin,
  },
];

export default function Footer({ t = {}, lang }) {
  const f = t.footer || {};
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exploreLinks = f.exploreLinks || [];
  const institutions = f.institutions || [];
  const social = f.social || {};

  return (
    <footer className="relative bg-[#03050c] border-t border-[#d4af37]/20 pt-20 pb-10 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-175 h-75 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 moroccan-pattern-overlay opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top row — identity + socials */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#d4af37] via-[#fef08a] to-[#855d10] p-[1.5px] shadow-md shrink-0">
              <div className="relative w-full h-full bg-[#050814] rounded-[10px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-800 animate-pulse pointer-events-none" />
                <Image
                  src="/mds-logo.png"
                  alt="MDS"
                  width={46}
                  height={46}
                  className="w-full h-full object-contain relative z-1"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white uppercase tracking-wider leading-tight">
                {f.name}
              </span>
              <span className="text-[11px] font-bold text-[#d4af37] tracking-widest uppercase">
                {f.tagline}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ key, url, icon, Icon, colorClass }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social[key]}
                className={`w-9 h-9 flex items-center justify-center rounded-full border border-[#d4af37]/25 text-[#d4af37]/80 transition-all duration-300 [&_svg]:w-4 [&_svg]:h-4 ${colorClass}`}
              >
                {Icon ? <Icon className="w-4 h-4" /> : icon}
              </a>
            ))}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-t border-slate-800/70 pt-12">

          {/* Bio */}
          <div className="space-y-4 lg:col-span-1">
            <p className="text-xs text-slate-400 leading-relaxed">
              {f.bio}
            </p>
            <p className="text-[11px] font-semibold text-[#d4af37]/80 uppercase tracking-wide">
              {f.honor}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-300 mb-4">
              {f.exploreTitle}
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-300">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-amber-300 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutions */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">
              {f.institutionsTitle}
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-300">
              {institutions.map((name) => (
                <li key={name} className="leading-relaxed">{name}</li>
              ))}
            </ul>
          </div>

          {/* Official office */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-4">
              {f.officeTitle}
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span>{f.officeLocation}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span dir="ltr" className="font-mono text-amber-300 text-start">{f.officePhone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Signature divider — eight-pointed star (khatam), a nod to Moroccan zellige and to a champion's medal */}
        <div className="flex items-center justify-center gap-4 py-2">
          <span className="h-px flex-1 max-w-40 bg-linear-to-r from-transparent to-[#d4af37]/30" />
          <svg
            viewBox="0 0 40 40"
            className="w-6 h-6 text-[#d4af37]/70 transition-transform duration-700 hover:rotate-45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M20 2 L24 12 L34 8 L26 16 L38 20 L26 24 L34 32 L24 28 L20 38 L16 28 L6 32 L14 24 L2 20 L14 16 L6 8 L16 12 Z" />
          </svg>
          <span className="h-px flex-1 max-w-40 bg-linear-to-l from-transparent to-[#d4af37]/30" />
        </div>

        {/* Bottom bar */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center text-[11px] text-slate-400">
          <p className="sm:text-left">
            © {new Date().getFullYear()} {f.name}. {f.copyright}
          </p>

          <a
            href={`https://abdellah-edaoudi.vercel.app/${lang ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-[#d4af37] transition-colors"
          >
            {f.developedBy}
          </a>

          <div className="flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a1024] border border-amber-500/30 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <span>{f.backToTop}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}