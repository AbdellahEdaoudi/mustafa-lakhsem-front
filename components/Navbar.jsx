"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "@/components/lucide-react";
import GoldVerifiedBadge from "./GoldVerifiedBadge";

export default function Navbar({ t = {}, lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // Synchronize hash with scroll and clean up when user scrolls to top
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY < 100 && window.location.hash) {
          history.replaceState(null, "", window.location.pathname);
          setCurrentHash("");
        }
      }, 100);
    };

    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Lock background scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "#about", label: t?.nav?.about || "About" },
    { href: "#career", label: t?.nav?.career || "Career" },
    { href: "#achievements", label: t?.nav?.achievements || "Achievements" },
    { href: "#vision", label: t?.nav?.vision || "Vision" },
    { href: "#diplomacy", label: t?.nav?.diplomacy || "Diplomacy" },
    { href: "#foundations", label: t?.nav?.foundations || "Foundations" },
    { href: "#imouzzer", label: t?.nav?.imouzzer || "Imouzzer" },
    { href: "#media", label: t?.nav?.media || "Media Center" },
    { href: "#contact", label: t?.nav?.contact || "Contact" },
  ];

  const languages = [
    { code: "en", label: "English", countryCode: "gb" },
    { code: "fr", label: "Français", countryCode: "fr" },
    { code: "ar", label: "العربية", countryCode: "ma" },
    { code: "de", label: "Deutsch", countryCode: "de" },
    { code: "es", label: "Español", countryCode: "es" },
    { code: "nl", label: "Nederlands", countryCode: "nl" },
    { code: "it", label: "Italiano", countryCode: "it" },
  ];

  const currentLang = languages.find((l) => l.code === lang) || languages[0];
  const isRtl = lang === "ar";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 shadow-xl py-3"
        : "bg-linear-to-b from-[#060913]/80 to-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand */}
          <Link
            href={`/${lang}`}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            {/* Logo frame — gold ring square */}
            <div className="relative shrink-0" style={{ width: 46, height: 46 }}>
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  background: "linear-gradient(135deg, #FFE566, #D4A017, #8B5E00)",
                  padding: 2,
                  boxShadow: "0 0 12px rgba(212,175,55,0.35)",
                }}
              >
                <div className="relative w-full h-full rounded-md bg-[#060913] overflow-hidden flex items-center justify-center">
                  <Image
                    src="/mds-logo.png"
                    alt={t?.nav?.logoAlt || "Democratic and Social Movement (MDS) Logo - Mustafa Lakhsem"}
                    width={46}
                    height={46}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
              {/* Gold Verified Badge */}
              <span
                className="absolute -bottom-1.5 -right-1.5"
                style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.9))" }}
              >
                <GoldVerifiedBadge size={19} />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-wider text-[#f8fafc] group-hover:text-[#d4af37] transition-colors">
                {t?.nav?.name || "MUSTAFA LAKHSEM"}
              </span>
              <span className="text-[10px] tracking-widest text-[#d4af37] uppercase font-semibold">
                {t?.nav?.role || "World Champion & Mayor"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-xs xl:text-sm font-medium text-slate-300 hover:text-[#d4af37] hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Language Select + Mobile menu */}
          <div className="flex items-center gap-2">

            {/* ── Custom Language Select ── */}
            <div className="relative" ref={dropdownRef}>
              {/* Trigger button — shows flag + code e.g. "en" */}
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-slate-900/70 hover:border-amber-400/60 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
                aria-label="Select Language"
              >
                <span className="shrink-0 rounded-xs overflow-hidden flex items-center justify-center shadow-xs">
                  <span className={`fi fi-${currentLang.countryCode || currentLang.code} text-sm leading-none`}></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-200 group-hover:text-amber-300 transition-colors leading-none">
                  {currentLang.code}
                </span>
                <ChevronDown
                  className="w-3 h-3 text-amber-500/60 transition-transform duration-200"
                  style={{ transform: langOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {/* Dropdown panel — styled like a premium Select */}
              {langOpen && (
                <div
                  className="absolute inset-e-0 mt-1.5 w-44 rounded-xl overflow-hidden z-50 ms-auto"
                  style={{
                    background: "#0d1629",
                    border: "1px solid rgba(212,175,55,0.2)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.06) inset",
                    animation: "dropIn 0.18s ease both",
                  }}
                >
                  {languages.map((l, i) => {
                    const isActive = lang === l.code;
                    return (
                      <Link
                        key={l.code}
                        href={`/${l.code}`}
                        onClick={() => setLangOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 cursor-pointer"
                        style={{
                          background: isActive ? "rgba(212,175,55,0.12)" : "transparent",
                          borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <span className="shrink-0 rounded-xs overflow-hidden flex items-center justify-center shadow-xs">
                          <span className={`fi fi-${l.countryCode || l.code} text-sm leading-none`}></span>
                        </span>
                        <span
                          className="text-xs truncate flex-1"
                          style={{ color: isActive ? "#f1c55a" : "#cbd5e1" }}
                        >
                          {l.label}
                        </span>

                        {/* Active dot */}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-amber-400 cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer — full-height slide-in panel */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-999 bg-black/70 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.25s ease both" }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div
            className={`lg:hidden fixed top-0 bottom-0 z-1000 h-dvh w-[84%] max-w-sm flex flex-col border-slate-800/80 shadow-2xl ${isRtl ? "left-0 border-r" : "right-0 border-l"
              }`}
            style={{
              background: "#050814",
              boxShadow: isRtl ? "24px 0 60px rgba(0,0,0,0.6)" : "-24px 0 60px rgba(0,0,0,0.6)",
              animation: `${isRtl ? "slideInLeft" : "slideInRight"} 0.35s cubic-bezier(0.16,1,0.3,1) both`,
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800/70">
              <Link
                href={`/${lang}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                {/* Logo frame — gold ring square identical to desktop */}
                <div className="relative shrink-0" style={{ width: 46, height: 46 }}>
                  <div
                    className="absolute inset-0 rounded-md"
                    style={{
                      background: "linear-gradient(135deg, #FFE566, #D4A017, #8B5E00)",
                      padding: 2,
                      boxShadow: "0 0 12px rgba(212,175,55,0.35)",
                    }}
                  >
                    <div className="relative w-full h-full rounded-md bg-[#060913] overflow-hidden flex items-center justify-center">
                      <Image
                        src="/mds-logo.png"
                        alt={t?.nav?.logoAlt || "Democratic and Social Movement (MDS) Logo - Mustafa Lakhsem"}
                        width={46}
                        height={46}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                  </div>
                  {/* Gold Verified Badge */}
                  <span
                    className="absolute -bottom-1.5 -right-1.5"
                    style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.9))" }}
                  >
                    <GoldVerifiedBadge size={19} />
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-wider text-[#f8fafc]">
                    {t?.nav?.name || "MUSTAFA LAKHSEM"}
                  </span>
                  <span className="text-[10px] tracking-widest text-[#d4af37] uppercase font-semibold">
                    {t?.nav?.role || "World Champion & Mayor"}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Numbered link list — order mirrors the page's own journey */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all text-slate-200 hover:text-amber-400 group"
                >
                  <span
                    className="text-xs font-mono text-[#d4af37]/70 group-hover:text-[#d4af37] w-6 shrink-0"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-semibold transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Divider + primary action */}
            <div className="px-6 py-6 border-t border-slate-800/70">
              <div className="flex items-center justify-center gap-3 mb-5 opacity-50">
                <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#d4af37]/40" />
                <svg viewBox="0 0 40 40" className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M20 2 L24 12 L34 8 L26 16 L38 20 L26 24 L34 32 L24 28 L20 38 L16 28 L6 32 L14 24 L2 20 L14 16 L6 8 L16 12 Z" />
                </svg>
                <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#d4af37]/40" />
              </div>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 rounded-full font-bold text-sm tracking-wide text-[#050814] transition-transform duration-200 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #FFE566, #D4A017, #8B5E00)" }}
              >
                {t?.nav?.cta || "Get in Touch"}
              </Link>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .group:hover > span:first-child {
          height: 24px;
        }
      `}</style>
    </header>
  );
}