"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Building, Share2, BellRing, ChevronDown, Send, Loader } from "@/components/lucide-react";
import { useToast } from "@/components/Toast";

// Icons & URLs only — names come from translations
const SOCIAL_LINKS = [
  {
    fallbackName: "Facebook",
    url: "https://www.facebook.com/Mustafa.Lakhsem.officiel",
    icon: (
      <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
      </svg>
    ),
  },
  {
    fallbackName: "Instagram",
    url: "https://www.instagram.com/mustafalakhsem",
    icon: (
      <svg className="w-3.5 h-3.5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    fallbackName: "TikTok",
    url: "https://www.tiktok.com/@mustafa.lakhsem",
    icon: (
      <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.2 1.12 1.25 2.68 1.99 4.3 2.14v3.89c-1.4-.04-2.79-.44-3.97-1.21-.69-.45-1.27-.98-1.74-1.63-.05 2.53-.02 5.07-.04 7.6-.07 2.05-.62 4.09-1.78 5.75-1.66 2.4-4.52 3.8-7.44 3.6-2.92-.09-5.69-1.75-6.98-4.38-1.57-3.03-1.07-7.1 1.25-9.57 1.83-2.02 4.67-2.88 7.32-2.2v4c-1.28-.35-2.71-.12-3.79.67-1.15.82-1.73 2.32-1.46 3.7.27 1.63 1.7 2.87 3.35 2.89 1.82.04 3.42-1.32 3.51-3.13.06-2.73.02-5.46.03-8.19.01-.04 0-.08 0-.12z" />
      </svg>
    ),
  },
  {
    fallbackName: "Twitter / X",
    url: "https://x.com/LakhsemM",
    icon: (
      <svg className="w-3.5 h-3.5 text-slate-200" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    fallbackName: "LinkedIn",
    url: "https://www.linkedin.com/in/mustafa-lakhsem-0480328b/",
    icon: (
      <svg className="w-3.5 h-3.5 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
];

export default function Contact({ t = {}, lang }) {
  const toast = useToast();
  const c = t?.contact || {};
  const f = c?.form || {};
  const n = c?.newsletter || {};

  // Merge translation names with icon/url data
  const socialNetworks = SOCIAL_LINKS.map((link, i) => ({
    ...link,
    name: c?.socialNetworks?.[i] ?? link.fallbackName,
  }));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [errors, setErrors] = useState({});

  const [emailsubscribe, setEmailsubscribe] = useState("");
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  // ─── Email domain typo detection ──────────────────────────────────────────
  const KNOWN_DOMAINS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
    "live.com", "msn.com", "aol.com", "protonmail.com", "mail.com",
    "yandex.com", "gmx.com", "zoho.com", "me.com", "mac.com",
    "googlemail.com", "yahoo.fr", "yahoo.co.uk", "hotmail.fr", "live.fr",
    "orange.fr", "sfr.fr", "wanadoo.fr", "menara.ma", "iam.net.ma",
  ];

  const levenshtein = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[a.length][b.length];
  };

  const getSuggestedDomain = (domain) => {
    let best = null, bestDist = Infinity;
    for (const known of KNOWN_DOMAINS) {
      const dist = levenshtein(domain.toLowerCase(), known);
      if (dist < bestDist) { bestDist = dist; best = known; }
    }
    return bestDist <= 2 && bestDist > 0 ? best : null;
  };

  const validateEmail = (val) => {
    if (!val.trim()) return f?.required || "This field is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return f?.emailInvalid || "Please enter a valid email address (e.g. name@example.com)";
    const domain = val.split("@")[1];
    const suggestion = getSuggestedDomain(domain);
    if (suggestion)
      return `${f?.didYouMean || "Did you mean"} ${val.split("@")[0]}@${suggestion}?`;
    return null;
  };
  // ─────────────────────────────────────────────────────────────────────────

  const validate = () => {
    const tempErrors = {};

    if (!name.trim()) tempErrors.name = f?.required || "This field is required";

    const emailErr = validateEmail(email);
    if (emailErr) tempErrors.email = emailErr;

    if (!phone.trim()) {
      tempErrors.phone = f?.required || "This field is required";
    } else if (!/^[\+]?[\d\s\-\(\)]{7,20}$/.test(phone.trim())) {
      tempErrors.phone = f?.phoneInvalid || "Please enter a valid phone number (e.g. +212 661 31 42 31)";
    }

    if (!organization.trim()) tempErrors.organization = f?.required || "This field is required";
    if (!type.trim()) tempErrors.type = f?.required || "This field is required";
    if (!message.trim()) {
      tempErrors.message = f?.required || "This field is required";
    } else if (message.trim().length < 100) {
      tempErrors.message = f?.msgMinLength || "Message must be at least 100 characters";
    } else if (message.trim().length > 5000) {
      tempErrors.message = f?.msgMaxLength || "Message cannot exceed 5000 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const SendMessage = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      toast.error(f?.formError || "Please correct the errors in the form.");
      return;
    }

    setLoadingMsg(true);
    const data = { name, email, phone, organization, type, message };
    try {
      await axios.post("/api/contact", data);
      toast.success(c?.messageSent || "Message sent successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setOrganization("");
      setType("");
      setMessage("");
      setErrors({});
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error(c?.rateLimitExceeded || "Request limit exceeded. Please try again later.");
      } else {
        toast.error(c?.messageFailed || "Failed to send message.");
      }
    } finally {
      setLoadingMsg(false);
    }
  };

  const AddSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeError("");

    const emailErr = validateEmail(emailsubscribe);
    if (emailErr) { setSubscribeError(emailErr); return; }

    setLoadingSubscribe(true);
    try {
      await axios.post("/api/subscribe/subscribe", { email: emailsubscribe });
      toast.success(n?.success || "Thank you for subscribing!");
      setEmailsubscribe("");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error(n?.rateLimitExceeded || "Request limit exceeded. Please try again later.");
      } else if (error.response?.status === 400 && (error.response?.data?.message === "This email is already subscribed" || error.response?.data?.message?.toLowerCase().includes("already subscribed"))) {
        toast.error(n?.alreadySubscribed || "This email is already subscribed.");
      } else {
        toast.error(n?.failed || "Subscription failed.");
      }
    } finally {
      setLoadingSubscribe(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#090e1e]">
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>{c?.badge}</span>
            <Mail className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            <span className="text-gold-gradient">{c?.title}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {c?.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="glass-panel rounded-3xl p-8 border-amber-500/30 relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
                <Building className="w-5 h-5 text-amber-400" />
                <span>{c?.officeTitle}</span>
              </h3>

              <div className="space-y-6 text-sm">
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 mb-0.5">{c?.locationLabel}</div>
                    <div className="font-semibold text-slate-200">{c?.locationVal}</div>
                  </div>
                </div>

                {/* Institutions */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 mb-0.5">{c?.institutionsLabel}</div>
                    <div className="font-semibold text-slate-200 leading-relaxed">{c?.institutionsVal}</div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 mb-0.5">{c?.phoneLabel}</div>
                    <a
                      href={`tel:${c?.phoneVal?.replace(/\s+/g, "")}`}
                      dir="ltr"
                      className="inline-block font-bold text-amber-400 hover:text-amber-300 transition-colors text-base font-mono text-start"
                    >
                      {c?.phoneVal}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Networks */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="text-xs font-bold uppercase text-slate-400 mb-3.5 flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{c?.socialLabel}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {socialNetworks.map((network, idx) => (
                    <a
                      key={idx}
                      href={network.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                    >
                      {network.icon}
                      <span>{network.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border-emerald-500/30 bg-linear-to-br from-emerald-950/20 to-slate-900">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <BellRing className="w-4 h-4" />
                <span>{n?.title}</span>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">{n?.desc}</p>
              <form onSubmit={AddSubscribe} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    id="newsletter-email"
                    type="email"
                    aria-label={n?.placeholder || "Email address"}
                    value={emailsubscribe}
                    onChange={(e) => {
                      setEmailsubscribe(e.target.value);
                      if (subscribeError) setSubscribeError("");
                    }}
                    placeholder={n?.placeholder}
                    className={`flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${subscribeError
                      ? "border-red-500 focus:border-red-400"
                      : "border-slate-700 focus:border-emerald-400"
                      }`}
                  />
                  <button
                    type="submit"
                    disabled={loadingSubscribe}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {loadingSubscribe ? (
                      <>
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                        <span>{n?.subscribing}</span>
                      </>
                    ) : (
                      <span>{n?.btn}</span>
                    )}
                  </button>
                </div>
                {subscribeError && (
                  <p className="text-red-400 text-[10px] transition-all duration-300">{subscribeError}</p>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border-amber-500/30 relative">
              <form onSubmit={SendMessage} className="space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-300 mb-1.5">
                      {f?.name} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      maxLength={100}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                      }}
                      placeholder={f?.namePlaceholder}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${errors.name ? "border-red-500 bg-red-950/10 focus:border-red-400" : "border-slate-700 focus:border-amber-400"
                        }`}
                    />
                    {errors.name && <p className="text-red-400 text-[10px] mt-1 transition-all duration-300">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-300 mb-1.5">
                      {f?.email} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      maxLength={100}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                      }}
                      placeholder={f?.emailPlaceholder}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${errors.email ? "border-red-500 bg-red-950/10 focus:border-red-400" : "border-slate-700 focus:border-amber-400"
                        }`}
                    />
                    {errors.email && <p className="text-red-400 text-[10px] mt-1 transition-all duration-300">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-300 mb-1.5">
                      {f?.phone} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="text"
                      dir="ltr"
                      maxLength={30}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                      }}
                      placeholder={f?.phonePlaceholder}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors text-start ${errors.phone ? "border-red-500 bg-red-950/10 focus:border-red-400" : "border-slate-700 focus:border-amber-400"
                        }`}
                    />
                    {errors.phone && <p className="text-red-400 text-[10px] mt-1 transition-all duration-300">{errors.phone}</p>}
                  </div>

                  {/* Organization */}
                  <div>
                    <label htmlFor="contact-org" className="block text-xs font-bold text-slate-300 mb-1.5">
                      {f?.org} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-org"
                      type="text"
                      maxLength={150}
                      value={organization}
                      onChange={(e) => {
                        setOrganization(e.target.value);
                        if (errors.organization) setErrors(prev => ({ ...prev, organization: null }));
                      }}
                      placeholder={f?.orgPlaceholder}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${errors.organization ? "border-red-500 bg-red-950/10 focus:border-red-400" : "border-slate-700 focus:border-amber-400"
                        }`}
                    />
                    {errors.organization && <p className="text-red-400 text-[10px] mt-1 transition-all duration-300">{errors.organization}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-300 mb-1.5">
                    {f?.type} <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    maxLength={150}
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      if (errors.type) setErrors(prev => ({ ...prev, type: null }));
                    }}
                    placeholder={f?.typePlaceholder}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${errors.type ? "border-red-500 bg-red-950/10 focus:border-red-400" : "border-slate-700 focus:border-amber-400"
                      }`}
                  />
                  {errors.type && <p className="text-red-400 text-[10px] mt-1 transition-all duration-300">{errors.type}</p>}
                </div>

                {/* Message */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="contact-msg" className="block text-xs font-bold text-slate-300">
                      {f?.msg} <span className="text-red-400">*</span>
                    </label>
                    <span className={`text-[11px] font-mono ${message.length >= 5000 ? "text-red-400 font-bold" : message.length > 4500 ? "text-amber-400" : "text-slate-400"}`}>
                      {message.length} / 5000
                    </span>
                  </div>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    maxLength={5000}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors(prev => ({ ...prev, message: null }));
                    }}
                    placeholder={f?.msgPlaceholder}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none ${errors.message ? "border-red-500 bg-red-950/10 focus:border-red-400" : "border-slate-700 focus:border-amber-400"
                      }`}
                  />
                  {errors.message && <p className="text-red-400 text-[10px] mt-1 transition-all duration-300">{errors.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loadingMsg}
                  className="w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loadingMsg ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>{f?.sending}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{f?.submit}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
