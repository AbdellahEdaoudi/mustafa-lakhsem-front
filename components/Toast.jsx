"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);
  const remainingRef = useRef(4000);
  const startTimeRef = useRef(null);
  const activeIdRef = useRef(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startTimer = useCallback((id, duration) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const addToast = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    activeIdRef.current = id;
    remainingRef.current = 4000;
    isPausedRef.current = false;

    // Show only 1 active toast at a time, replacing previous ones
    setToasts([{ id, message, type }]);
    startTimer(id, 4000);
  }, [startTimer]);

  const handleMouseEnter = useCallback(() => {
    if (!isPausedRef.current && timerRef.current) {
      isPausedRef.current = true;
      clearTimeout(timerRef.current);
      timerRef.current = null;
      // Calculate how much time was remaining
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isPausedRef.current && activeIdRef.current) {
      isPausedRef.current = false;
      startTimer(activeIdRef.current, remainingRef.current);
    }
  }, [startTimer]);

  const toast = {
    success: (m) => addToast(m, "success"),
    error: (m) => addToast(m, "error"),
    info: (m) => addToast(m, "info"),
    warning: (m) => addToast(m, "warning"),
    // Backward compatibility support for showToast(msg, type)
    showToast: (m, type = "info") => addToast(m, type),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container with exact custom styling & animations */}
      {(() => {
        const hasArabicToast = toasts.some((t) => /[\u0600-\u06FF]/.test(t.message || ""));
        const posClass = hasArabicToast ? "sm:left-5" : "sm:right-5";
        return (
          <div className={`fixed top-4 inset-x-4 sm:inset-x-auto sm:top-5 ${posClass} sm:max-w-md w-auto sm:w-full z-9999 flex flex-col gap-3 pointer-events-none`}>
            {toasts.map((t) => {
              const isArabic = /[\u0600-\u06FF]/.test(t.message || "");
          let bgClass = "bg-slate-900/90 border-slate-800 text-white";
          let iconColor = "text-amber-400";
          let iconSvg = (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          );

          if (t.type === "success") {
            bgClass = "bg-emerald-950/90 border-emerald-500/30 text-emerald-100";
            iconColor = "text-emerald-400";
            iconSvg = (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );
          } else if (t.type === "error") {
            bgClass = "bg-rose-950/90 border-rose-500/30 text-rose-100";
            iconColor = "text-rose-400";
            iconSvg = (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );
          } else if (t.type === "info") {
            bgClass = "bg-blue-950/90 border-blue-500/30 text-blue-100";
            iconColor = "text-blue-400";
            iconSvg = (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );
          }

          return (
            <div
              key={t.id}
              dir={isArabic ? "rtl" : "ltr"}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${bgClass}`}
            >
              {/* Icon */}
              <div className={`${iconColor} shrink-0 mt-0.5`}>
                {iconSvg}
              </div>

              {/* Message */}
              <div className={`flex-1 text-sm font-semibold leading-relaxed wrap-break-word min-w-0 ${isArabic ? "text-right" : "text-left"}`}>
                {t.message}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 p-0.5 rounded-lg hover:bg-white/10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
        );
      })()}
    </ToastContext.Provider>
  );
}

