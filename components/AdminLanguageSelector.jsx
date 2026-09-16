"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "@/components/lucide-react";

const ADMIN_LANGUAGES = [
    { code: "en", label: "English", countryCode: "gb" },
    { code: "de", label: "Deutsch", countryCode: "de" },
    { code: "ar", label: "العربية", countryCode: "ma" },
    { code: "fr", label: "Français", countryCode: "fr" },
    { code: "nl", label: "Nederlands", countryCode: "nl" },
    { code: "es", label: "Español", countryCode: "es" },
    { code: "it", label: "Italiano", countryCode: "it" },
  ];

export default function AdminLanguageSelector({ currentLang = "en", onLangChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const activeLang = ADMIN_LANGUAGES.find((l) => l.code === currentLang) || ADMIN_LANGUAGES[1];

  const handleSelect = (langCode) => {
    setOpen(false);
    if (onLangChange) {
      onLangChange(langCode);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-amber-500/30 bg-slate-900/70 hover:border-amber-400/60 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
        aria-label="Select Language"
      >
        <span className="shrink-0 rounded-xs overflow-hidden flex items-center justify-center shadow-xs">
          <span className={`fi fi-${activeLang.countryCode || activeLang.code} text-xs sm:text-sm leading-none`}></span>
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-200 group-hover:text-amber-300 transition-colors leading-none">
          {activeLang.code}
        </span>
        <ChevronDown
          className="w-3 h-3 text-amber-500/60 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 rtl:right-0 rtl:left-auto mt-1.5 w-36 sm:w-40 rounded-xl overflow-hidden z-50 shadow-2xl"
          style={{
            background: "#0d1629",
            border: "1px solid rgba(212,175,55,0.2)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.06) inset",
          }}
        >
          {ADMIN_LANGUAGES.map((lang, i) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs transition-colors duration-150 cursor-pointer"
                style={{
                  background: isSelected ? "rgba(212,175,55,0.12)" : "transparent",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0 rounded-xs overflow-hidden flex items-center justify-center shadow-xs">
                    <span className={`fi fi-${lang.countryCode || lang.code} text-sm leading-none`}></span>
                  </span>
                  <span
                    className="text-xs truncate"
                    style={{ color: isSelected ? "#f1c55a" : "#cbd5e1", fontWeight: isSelected ? "bold" : "normal" }}
                  >
                    {lang.label}
                  </span>
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
