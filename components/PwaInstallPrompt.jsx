"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Sparkles, Share, PlusSquare } from "@/components/lucide-react";

const DISMISSAL_KEY = "pwa_prompt_dismissed_until";
const DISMISSAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const SHOW_DELAY_MS = 15000; // don't bother brand-new visitors immediately

// In-app browsers (Facebook, Instagram, TikTok...) have no "Add to Home Screen"
const IN_APP_BROWSER = /fban|fbav|fb_iab|instagram|line\/|twitter|snapchat|tiktok|micromessenger|linkedinapp/;

const labels = {
  ar: {
    title: "تثبيت تطبيق مصطفى لخصم",
    desc: "أضف الموقع كـ «تطبيق هاتف» على شاشتك الرئيسية لتصفح أسرع وتجربة سلسة.",
    iosDesc: "لتثبيت التطبيق على آيفون / آيباد: انقر على زر المشاركة",
    iosStep2: "ثم اختر «إضافة إلى الشاشة الرئيسية»",
    install: "تثبيت الآن",
    dismiss: "إغلاق",
  },
  fr: {
    title: "Installer l'Application",
    desc: "Ajoutez l'application sur votre écran d'accueil pour un accès rapide.",
    iosDesc: "Sur iPhone / iPad : appuyez sur le bouton Partager",
    iosStep2: "puis «Sur l'écran d'accueil»",
    install: "Installer",
    dismiss: "Fermer",
  },
  en: {
    title: "Install Official App",
    desc: "Add to your home screen for quick 1-click access.",
    iosDesc: "On iPhone / iPad: tap the Share button",
    iosStep2: "then 'Add to Home Screen'",
    install: "Install Now",
    dismiss: "Dismiss",
  },
};

function saveDismissal() {
  try {
    localStorage.setItem(DISMISSAL_KEY, String(Date.now() + DISMISSAL_DURATION_MS));
  } catch (e) {
    /* private mode / storage disabled: ignore */
  }
}

export default function PwaInstallPrompt({ lang = "en" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      if (isStandalone) return;

      const dismissedUntil = localStorage.getItem(DISMISSAL_KEY);
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) return;
    } catch (e) {
      /* storage unavailable: continue */
    }

    const ua = (window.navigator.userAgent || "").toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    const isSafari =
      /safari/.test(ua) && !/chrome|crios|fxios|edgios|opios/.test(ua) && !IN_APP_BROWSER.test(ua);

    if (isIosDevice && isSafari) {
      setIsIos(true);
      setShowPrompt(true);
      return;
    }

    const installHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    const installedHandler = () => setShowPrompt(false);

    window.addEventListener("beforeinstallprompt", installHandler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", installHandler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
    if (outcome === "dismissed") saveDismissal();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    saveDismissal();
  };

  if (!showPrompt || !ready) return null;

  const isRtl = lang === "ar";
  const l = labels[lang] || labels.en;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed bottom-5 inset-x-4 z-50 mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-[#0a0f1d]/95 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 sm:bottom-6 sm:inset-x-auto sm:inset-e-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <Smartphone className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className={`flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-0.5 ${isRtl ? "" : "uppercase tracking-wider"}`}>
            <Sparkles className="h-3.5 w-3.5" />
            <span>{l.title}</span>
          </div>

          {isIos ? (
            <div className="text-xs leading-relaxed text-slate-300 space-y-1 my-1">
              <p className="flex items-center gap-1">
                <span>{l.iosDesc}</span>
                <Share className="h-4 w-4 inline text-amber-400" />
              </p>
              <p className="flex items-center gap-1 text-amber-300 font-semibold">
                <PlusSquare className="h-4 w-4 inline" />
                <span>{l.iosStep2}</span>
              </p>
            </div>
          ) : (
            <p className="text-xs leading-relaxed text-slate-300">{l.desc}</p>
          )}

          <div className="mt-3 flex items-center gap-2">
            {!isIos && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md transition-all hover:from-amber-400 hover:to-amber-500 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{l.install}</span>
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 cursor-pointer"
            >
              {l.dismiss}
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
          aria-label={l.dismiss}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}