"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Loader2 } from "@/components/lucide-react";
import { getTranslation } from "@/translations/admin";
import AdminLanguageSelector from "@/components/AdminLanguageSelector";

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [t, setT] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorKey, setErrorKey] = useState("");
  const [errorRaw, setErrorRaw] = useState("");
  const [loading, setLoading] = useState(false);

  const error = errorKey === "invalidCredentials"
    ? (t?.login?.invalidCredentials || "Invalid email or password")
    : errorKey === "fillAllFields"
      ? (t?.login?.fillAllFields || "Please fill in all fields.")
      : errorKey === "rateLimitExceeded"
        ? (t?.login?.rateLimitExceeded || "Request limit exceeded. Please try again later.")
        : errorRaw;

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("admin_lang") || "en" : "en";
    setLang(saved);
    getTranslation(saved).then((dict) => {
      setT(dict);
      if (typeof document !== "undefined") {
        document.title = saved === "ar" ? "مصطفى لخصم | تسجيل الدخول" : "Mustafa Lakhsem | Auth";
      }
    });
  }, []);

  const handleLangChange = async (newLang) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_lang", newLang);
      document.title = newLang === "ar" ? "مصطفى لخصم | تسجيل الدخول" : "Mustafa Lakhsem | Auth";
    }
    const dict = await getTranslation(newLang);
    setT(dict);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorKey("");
    setErrorRaw("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorKey("fillAllFields");
      setErrorRaw("");
      return;
    }

    setLoading(true);
    setErrorKey("");
    setErrorRaw("");

    try {
      await axios.post("/api/auth/login", formData, { withCredentials: true });
      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err) {
      if (err.response?.status === 429) {
        setErrorKey("rateLimitExceeded");
        setErrorRaw("");
      } else {
        const serverMsg = err.response?.data?.message || "";
        if (serverMsg.toLowerCase() === "invalid credentials") {
          setErrorKey("invalidCredentials");
          setErrorRaw("");
        } else if (serverMsg.toLowerCase() === "email and password are required") {
          setErrorKey("fillAllFields");
          setErrorRaw("");
        } else {
          setErrorKey("");
          setErrorRaw(serverMsg || err.message || "");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isRtl = lang === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#040711] text-[#f8fafc] flex flex-col justify-center items-center px-4 relative overflow-hidden"
    >
      {/* Background decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Language Selector Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <AdminLanguageSelector currentLang={lang} onLangChange={handleLangChange} />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black tracking-tight mb-2">
            <span className="bg-linear-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              {t?.login?.title || "MUSTAFA LAKHSEM"}
            </span>
          </Link>
          <p className="text-slate-400 text-sm">{t?.login?.subtitle || "Administrative Portal Sign In"}</p>
        </div>

        {/* Card */}
        <div className="bg-[#090e1e]/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">{t?.login?.cardTitle || "Login"}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="email">
                {t?.login?.emailLabel || "Email Address"}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:outline-none focus:border-amber-500/80 text-white placeholder-slate-600 transition-colors"
                placeholder={t?.login?.emailPlaceholder || "email@example.com"}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-300 text-sm font-medium" htmlFor="password">
                  {t?.login?.passwordLabel || "Password"}
                </label>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg focus:outline-none focus:border-amber-500/80 text-white placeholder-slate-600 transition-colors"
                placeholder={t?.login?.passwordPlaceholder || "••••••••"}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 px-4 bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-semibold rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t?.login?.signingIn || "Signing in..."}</span>
                </>
              ) : (
                t?.login?.signInBtn || "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
