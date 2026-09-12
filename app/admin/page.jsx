"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useToast } from "@/components/Toast";
import GoldVerifiedBadge from "@/components/GoldVerifiedBadge";
import { getTranslation } from "@/translations/admin";
import AdminLanguageSelector from "@/components/AdminLanguageSelector";
import { Loader2 } from "@/components/lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [lang, setLang] = useState("en");
  const [t, setT] = useState(null);
  const [activeTab, setActiveTab] = useState("contacts"); // "contacts" | "subscribers"
  const [isForbidden, setIsForbidden] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "starred" | "unread"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [starringId, setStarringId] = useState(null);
  const [readingId, setReadingId] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [contactsPage, setContactsPage] = useState(1);
  const [subscribersPage, setSubscribersPage] = useState(1);
  const [contactsTotalPages, setContactsTotalPages] = useState(1);
  const [subscribersTotalPages, setSubscribersTotalPages] = useState(1);
  const [contactsTotal, setContactsTotal] = useState(0);
  const [subscribersTotal, setSubscribersTotal] = useState(0);
  const [contactsUnreadTotal, setContactsUnreadTotal] = useState(0);
  const [contactsStarredTotal, setContactsStarredTotal] = useState(0);

  // Helper to get locale string based on active language
  const getLocale = (l) => {
    const map = {
      en: "en-US",
      ar: "ar-MA",
      fr: "fr-FR",
      de: "de-DE",
      nl: "nl-NL",
      es: "es-ES",
      it: "it-IT",
    };
    return map[l] || "en-US";
  };

  const handleLangChange = async (newLang) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_lang", newLang);
    }
    const dict = await getTranslation(newLang);
    setT(dict);
    if (typeof document !== "undefined") {
      document.title = newLang === "ar" ? "مصطفى لخصم | لوحة التحكم" : `Mustafa Lakhsem | ${dict?.dashboard?.portalTitle || "Admin"}`;
    }
  };

  const handleApiError = async (
    error,
    retryCallback,
    defaultErrorMsg = t?.dashboard?.toasts?.operationFailed || "Operation failed."
  ) => {
    console.error("API error details:", error);
    if (error.response) {
      const errorCode = error.response.data?.code;
      const errorMsg = error.response.data?.message || defaultErrorMsg;
      if (errorCode === "ACCESS_TOKEN_EXPIRED") {
        try {
          await axios.post(
            "/api/auth/refresh",
            {},
            { withCredentials: true }
          );
          if (retryCallback) await retryCallback();
        } catch (refreshError) {
          toast.error(t?.dashboard?.toasts?.sessionExpired || "Session expired. Please login again.");
          localStorage.removeItem("accessToken");
          router.push("/auth/login");
        }
      } else if (
        ["TOKEN_MISSING", "ACCESS_TOKEN_INVALID"].includes(errorCode) ||
        error.response.status === 401
      ) {
        toast.error(t?.dashboard?.toasts?.unauthorized || "Unauthorized: Please login again.");
        localStorage.removeItem("accessToken");
        router.push("/auth/login");
      } else if (error.response.status === 403) {
        setIsForbidden(true);
        toast.error(t?.dashboard?.toasts?.forbidden || "Forbidden: You don't have permission.");
        router.push("/");
      } else {
        toast.error(`Error: ${errorMsg}`);
      }
    } else if (error.request) {
      toast.error(t?.dashboard?.toasts?.networkError || "Network error: No response received.");
    } else {
      toast.error(t?.dashboard?.toasts?.requestSetupError || "Error setting up request.");
    }
  };

  const getAuthConfig = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
  };

  const fetchContacts = async (cPage = contactsPage) => {
    try {
      const res = await axios.get(`/api/admin/contacts?page=${cPage}&limit=20`, getAuthConfig());
      setContacts(res.data.contacts || []);
      setContactsTotal(res.data.total || 0);
      setContactsTotalPages(res.data.totalPages || 1);
      setContactsUnreadTotal(res.data.unreadCount ?? 0);
      setContactsStarredTotal(res.data.starredCount ?? 0);
    } catch (err) {
      await handleApiError(err, () => fetchContacts(cPage), t?.dashboard?.toasts?.dashboardLoadFailed || "Failed to load contacts.");
      throw err;
    }
  };

  const fetchSubscribers = async (sPage = subscribersPage) => {
    try {
      const res = await axios.get(`/api/admin/subscribers?page=${sPage}&limit=20`, getAuthConfig());
      setSubscribers(res.data.subscribers || []);
      setSubscribersTotal(res.data.total || 0);
      setSubscribersTotalPages(res.data.totalPages || 1);
    } catch (err) {
      await handleApiError(err, () => fetchSubscribers(sPage), t?.dashboard?.toasts?.dashboardLoadFailed || "Failed to load subscribers.");
      throw err;
    }
  };

  const fetchData = async (cPage = contactsPage, sPage = subscribersPage) => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([
        fetchContacts(cPage),
        fetchSubscribers(sPage),
      ]);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || t?.dashboard?.toasts?.dashboardLoadFailed || "Failed to load dashboard data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data and load translation on component mount
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("admin_lang") || "en" : "en";
    setLang(saved);
    getTranslation(saved).then((dict) => {
      setT(dict);
      if (typeof document !== "undefined") {
        document.title = saved === "ar" ? "مصطفى لخصم | لوحة التحكم" : `Mustafa Lakhsem | ${dict?.dashboard?.portalTitle || "Admin"}`;
      }
    });
    fetchData();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      toast.info(t?.dashboard?.toasts?.signedOut || "Signed out successfully");
      setTimeout(() => {
        router.push("/auth/login");
      }, 500);
    }
  };

  const toggleStar = async (contactId) => {
    setStarringId(contactId);
    try {
      const res = await axios.patch(
        `/api/admin/contacts/${contactId}/star`,
        {},
        getAuthConfig()
      );

      const updated = res.data.contact;
      setContacts((prev) =>
        prev.map((c) => (c._id === contactId ? updated : c))
      );
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact(updated);
      }
      // Update starred count locally
      setContactsStarredTotal((prev) => updated.isStarred ? prev + 1 : Math.max(0, prev - 1));
      toast.success(
        updated.isStarred
          ? (t?.dashboard?.toasts?.markedStarred || "Marked as starred")
          : (t?.dashboard?.toasts?.removedStarred || "Removed from starred")
      );
    } catch (err) {
      await handleApiError(
        err,
        () => toggleStar(contactId),
        t?.dashboard?.toasts?.starUpdateFailed || "Failed to update starred status."
      );
    } finally {
      setStarringId(null);
    }
  };

  const toggleRead = async (contactId) => {
    setReadingId(contactId);
    try {
      const res = await axios.patch(
        `/api/admin/contacts/${contactId}/read`,
        {},
        getAuthConfig()
      );

      const updated = res.data.contact;
      setContacts((prev) =>
        prev.map((c) => (c._id === contactId ? updated : c))
      );
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact(updated);
      }
      // Update unread count locally
      setContactsUnreadTotal((prev) => updated.isRead ? Math.max(0, prev - 1) : prev + 1);
      toast.success(
        updated.isRead
          ? (t?.dashboard?.toasts?.markedRead || "Marked as read")
          : (t?.dashboard?.toasts?.markedUnread || "Marked as unread")
      );
    } catch (err) {
      await handleApiError(
        err,
        () => toggleRead(contactId),
        t?.dashboard?.toasts?.readUpdateFailed || "Failed to update read status."
      );
    } finally {
      setReadingId(null);
    }
  };

  const openContact = async (contact) => {
    setHasInteracted(true);
    setSelectedContact(contact);
    if (!contact.isRead) {
      try {
        const res = await axios.patch(
          `/api/admin/contacts/${contact._id}/read`,
          {},
          getAuthConfig()
        );
        const updated = res.data.contact;
        setContacts((prev) =>
          prev.map((c) => (c._id === contact._id ? updated : c))
        );
        setSelectedContact(updated);
        // Decrement unread count since we just marked it as read
        setContactsUnreadTotal((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Auto mark as read error:", err);
      }
    }
  };

  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;
    const targetId = contactToDelete._id;
    const wasUnread = !contactToDelete.isRead;
    const wasStarred = contactToDelete.isStarred;
    setDeleting(true);

    try {
      await axios.delete(
        `/api/admin/contacts/${targetId}`,
        getAuthConfig()
      );

      setContacts((prev) => prev.filter((c) => c._id !== targetId));
      if (selectedContact && selectedContact._id === targetId) {
        setSelectedContact(null);
      }
      // Update counts locally after deletion
      setContactsTotal((prev) => Math.max(0, prev - 1));
      if (wasUnread) setContactsUnreadTotal((prev) => Math.max(0, prev - 1));
      if (wasStarred) setContactsStarredTotal((prev) => Math.max(0, prev - 1));
      toast.success(t?.dashboard?.toasts?.messageDeleted || "Message deleted successfully");
      setContactToDelete(null);
    } catch (err) {
      await handleApiError(
        err,
        () => confirmDeleteContact(),
        t?.dashboard?.toasts?.messageDeleteFailed || "Failed to delete message."
      );
    } finally {
      setDeleting(false);
    }
  };

  const confirmDeleteSubscriber = async () => {
    if (!subscriberToDelete) return;
    const targetId = subscriberToDelete._id;
    setDeleting(true);

    try {
      await axios.delete(
        `/api/admin/subscribers/${targetId}`,
        getAuthConfig()
      );

      setSubscribers((prev) => prev.filter((s) => s._id !== targetId));
      toast.success(t?.dashboard?.toasts?.subscriberDeleted || "Subscriber deleted successfully");
      setSubscriberToDelete(null);
    } catch (err) {
      await handleApiError(
        err,
        () => confirmDeleteSubscriber(),
        t?.dashboard?.toasts?.subscriberDeleteFailed || "Failed to delete subscriber."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Stats calculation — uses server-side counts for accuracy across all pages
  const stats = useMemo(() => {
    return {
      totalContacts: contactsTotal,
      unreadContacts: contactsUnreadTotal,
      starredContacts: contactsStarredTotal,
      totalSubscribers: subscribersTotal,
    };
  }, [contactsTotal, contactsUnreadTotal, contactsStarredTotal, subscribersTotal]);

  // Filter & Search contacts
  const filteredContacts = useMemo(() => {
    return (contacts || []).filter((c) => {
      // Tab / Filter
      if (filter === "starred" && !c.isStarred) return false;
      if (filter === "unread" && c.isRead) return false;

      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchEmail = c.email?.toLowerCase().includes(q);
        const matchMsg = c.message?.toLowerCase().includes(q);
        const matchType = c.type?.toLowerCase().includes(q);
        return matchName || matchEmail || matchMsg || matchType;
      }
      return true;
    });
  }, [contacts, filter, searchQuery]);

  // Filter & Search subscribers
  const filteredSubscribers = useMemo(() => {
    if (!searchQuery.trim()) return subscribers || [];
    const q = searchQuery.toLowerCase();
    return (subscribers || []).filter((s) => s.email?.toLowerCase().includes(q));
  }, [subscribers, searchQuery]);

  const isRtl = lang === "ar";

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* Dynamic Background Light Orbs */}
      <div className="fixed top-0 right-1/4 w-125 h-125 bg-amber-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-125 h-125 bg-sky-500/5 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#030712]/90 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              href={"/" + lang}
              className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105 cursor-pointer shrink-0"
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
                  <div className="w-full h-full rounded-md bg-[#060913] overflow-hidden flex items-center justify-center">
                    <Image
                      src="/mds-logo.png"
                      alt="MDS"
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
                  {t?.dashboard?.brandName || "MUSTAFA LAKHSEM"}
                </span>
                <span className="text-[10px] tracking-widest text-[#d4af37] uppercase font-semibold">
                  {t?.dashboard?.portalTitle || "Admin Portal"}
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {t?.dashboard?.portalTitle || "Admin Portal"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Selector */}
            <AdminLanguageSelector currentLang={lang} onLangChange={handleLangChange} />

            <button
              onClick={() => fetchData()}
              disabled={loading}
              title={t?.dashboard?.refreshTitle || "Refresh Data"}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              <span className="hidden xs:inline">{t?.dashboard?.logout || "Logout"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="wrap-break-word">{error}</span>
          </div>
        )}

        {/* Tab Controls and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5 mb-5 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-900/60 border border-slate-800/80 rounded-xl w-full sm:w-fit overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab("contacts");
                setSearchQuery("");
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${activeTab === "contacts"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>{t?.dashboard?.tabs?.messages || "Messages"}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "contacts" ? "bg-black/20 text-black font-extrabold" : "bg-slate-800 text-slate-300"}`}>
                {contactsTotal}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("subscribers");
                setSearchQuery("");
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${activeTab === "subscribers"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{t?.dashboard?.tabs?.subscribers || "Subscribers"}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "subscribers" ? "bg-black/20 text-black font-extrabold" : "bg-slate-800 text-slate-300"}`}>
                {subscribersTotal}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRtl ? "right-3.5" : "left-3.5"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "contacts"
                  ? (t?.dashboard?.search?.contactsPlaceholder || "Search sender, email, content...")
                  : (t?.dashboard?.search?.subscribersPlaceholder || "Search subscriber email...")
              }
              className={`w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer p-1 ${isRtl ? "left-3" : "right-3"
                  }`}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">
              {t?.dashboard?.loadingData || "Loading data..."}
            </p>
          </div>
        ) : (
          <>
            {/* Contacts View */}
            {activeTab === "contacts" && (
              <div>
                {/* Filter Pills & Top Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
                    <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">
                      {t?.dashboard?.filters?.title || "Filter:"}
                    </span>
                    {[
                      { key: "all", label: `${t?.dashboard?.filters?.all || "All"} (${contactsTotal})` },
                      { key: "unread", label: `${t?.dashboard?.filters?.unread || "Unread"} (${stats.unreadContacts})` },
                      { key: "starred", label: `${t?.dashboard?.filters?.starred || "Starred"} (${stats.starredContacts})` },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${filter === f.key
                          ? "bg-amber-500/15 border border-amber-500 text-amber-400"
                          : "border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                          }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {contactsTotalPages > 1 && (
                    <div className="flex items-center gap-2 ms-auto">
                      <button
                        disabled={contactsPage === 1}
                        onClick={() => {
                          const newPage = contactsPage - 1;
                          setContactsPage(newPage);
                          fetchContacts(newPage);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        {t?.dashboard?.pagination?.prev || "← Prev"}
                      </button>
                      <span className="text-xs text-slate-400 px-1">
                        {contactsPage} / {contactsTotalPages}
                      </span>
                      <button
                        disabled={contactsPage === contactsTotalPages}
                        onClick={() => {
                          const newPage = contactsPage + 1;
                          setContactsPage(newPage);
                          fetchContacts(newPage);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        {t?.dashboard?.pagination?.next || "Next →"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Table & Cards List */}
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-16 sm:py-20 bg-slate-900/20 border border-slate-800/80 rounded-2xl p-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-3 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-slate-300 font-semibold text-sm">
                      {t?.dashboard?.empty?.noContactsTitle || "No contact inquiries found"}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {t?.dashboard?.empty?.noContactsDesc || "Try adjusting your filters or search criteria."}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Mobile View: Modern Compact Cards (Visible on mobile screens < md) */}
                    <div className="grid grid-cols-1 gap-2.5 md:hidden">
                      {filteredContacts.map((c, index) => (
                        <div
                          key={c._id}
                          onClick={() => openContact(c)}
                          className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col gap-1.5 ${!c.isRead
                            ? "bg-slate-900/95 border-amber-500/40 shadow-sm shadow-amber-500/5"
                            : "bg-slate-950/40 border-slate-800/70 hover:border-slate-700"
                            }`}
                        >
                          {/* Top Row: Unread Indicator + Name + Subject + Date + Actions */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {!c.isRead ? (
                                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-xs shadow-amber-400" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                              )}
                              <span className={`text-xs sm:text-sm truncate ${!c.isRead ? "font-bold text-white" : "font-medium text-slate-200"}`}>
                                {c.name}
                              </span>
                              {c.type && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-amber-400 border border-slate-700/50 truncate max-w-28 shrink-0">
                                  {c.type}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[10px] sm:text-[11px] text-slate-500 whitespace-nowrap">
                                {new Date(c.createdAt).toLocaleDateString(getLocale(lang), {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <button
                                onClick={() => toggleStar(c._id)}
                                disabled={starringId === c._id}
                                title={c.isStarred ? (t?.dashboard?.actions?.unstar || "Unstar") : (t?.dashboard?.actions?.star || "Star")}
                                className="p-1 text-slate-400 hover:text-amber-400 focus:outline-none cursor-pointer disabled:opacity-50"
                              >
                                {starringId === c._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={c.isStarred ? "#f59e0b" : "none"}
                                    stroke={c.isStarred ? "#f59e0b" : "#64748b"}
                                    strokeWidth="2"
                                    className="w-3.5 h-3.5"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => toggleRead(c._id)}
                                disabled={readingId === c._id}
                                title={c.isRead ? (t?.dashboard?.actions?.markAsUnread || "Mark as Unread") : (t?.dashboard?.actions?.markAsRead || "Mark as Read")}
                                className="p-1 text-slate-500 hover:text-amber-400 focus:outline-none cursor-pointer disabled:opacity-50"
                              >
                                {readingId === c._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={c.isRead ? "M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5z" : "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"} />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => setContactToDelete(c)}
                                title={t?.dashboard?.actions?.deleteMessage || "Delete Message"}
                                className="p-1 text-slate-500 hover:text-red-400 focus:outline-none cursor-pointer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Message Snippet */}
                          <p
                            dir={isArabic(c.message) ? "rtl" : "ltr"}
                            className="text-xs text-slate-300 line-clamp-1 leading-relaxed"
                          >
                            {c.message}
                          </p>

                          {/* Footer: Email + NEW label */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                            <span className="truncate max-w-[70%] font-mono text-[10px] text-slate-400">{c.email}</span>
                            {!c.isRead && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                {t?.dashboard?.actions?.newBadge || (lang === "ar" ? "جديد" : "NEW")}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop View: Full Table (Hidden on small screens, visible on md+) */}
                    <div className="hidden md:block bg-slate-950/40 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800/70 bg-slate-900/70 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                              <th className="py-3.5 sm:py-4 px-4 sm:px-5 w-20 text-start">{t?.dashboard?.table?.status || "Status"}</th>
                              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-start">{t?.dashboard?.table?.sender || "Sender"}</th>
                              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-start">{t?.dashboard?.table?.category || "Category"}</th>
                              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-start">{t?.dashboard?.table?.messagePreview || "Message Preview"}</th>
                              <th className="py-3.5 sm:py-4 px-4 sm:px-5 whitespace-nowrap text-start">{t?.dashboard?.table?.date || "Date"}</th>
                              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-end w-24">{t?.dashboard?.table?.actions || "Actions"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50 text-sm">
                            {filteredContacts.map((c, index) => (
                              <tr
                                key={c._id}
                                onClick={() => openContact(c)}
                                className={`group hover:bg-slate-800/40 transition-colors cursor-pointer relative ${!c.isRead ? "bg-amber-500/5 font-medium" : "text-slate-300"
                                  }`}
                              >
                                <td className="py-3.5 sm:py-4 px-4 sm:px-5" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => toggleStar(c._id)}
                                      disabled={starringId === c._id}
                                      title={c.isStarred ? (t?.dashboard?.actions?.unstar || "Unstar message") : (t?.dashboard?.actions?.star || "Star message")}
                                      className="focus:outline-none cursor-pointer transition-transform active:scale-90 disabled:opacity-50"
                                    >
                                      {starringId === c._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill={c.isStarred ? "#f59e0b" : "none"}
                                          stroke={c.isStarred ? "#f59e0b" : "#64748b"}
                                          strokeWidth="2"
                                          className="w-4 h-4 transition-transform hover:scale-110"
                                        >
                                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                      )}
                                    </button>
                                    {!c.isRead ? (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-black shadow-xs shadow-amber-500/30 animate-pulse">
                                        {t?.dashboard?.actions?.newBadge || (lang === "ar" ? "جديد" : "NEW")}
                                      </span>
                                    ) : (
                                      <span
                                        title={t?.dashboard?.actions?.read || "Read"}
                                        className="w-2 h-2 rounded-full bg-slate-700/60 shrink-0"
                                      />
                                    )}
                                  </div>
                                </td>

                                <td className="py-3.5 sm:py-4 px-4 sm:px-5">
                                  <div className="flex flex-col min-w-0">
                                    <span className={`truncate max-w-37.5 sm:max-w-none ${!c.isRead ? "text-white font-semibold" : "text-slate-200"}`}>
                                      {c.name}
                                    </span>
                                    <span className="text-xs text-slate-400 font-normal truncate max-w-37.5 sm:max-w-none">{c.email}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 sm:py-4 px-4 sm:px-5">
                                  <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 max-w-44 truncate">
                                    {c.type || t?.dashboard?.modal?.notAvailable || "N/A"}
                                  </span>
                                </td>

                                <td className="py-3.5 sm:py-4 px-4 sm:px-5 max-w-xs xl:max-w-md">
                                  <div className="flex items-center gap-2">
                                    <p
                                      dir={isArabic(c.message) ? "rtl" : "ltr"}
                                      className="truncate text-xs text-slate-400 font-normal group-hover:text-slate-300 transition-colors"
                                    >
                                      {c.message}
                                    </p>
                                    {index === 0 && !hasInteracted && (
                                      <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[10px] font-bold shadow-xs animate-bounce">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                        <span>{t?.dashboard?.actions?.tapToRead || (lang === "ar" ? "انقر للقراءة" : "Click to read")}</span>
                                        <span>{isRtl ? "👉" : "👈"}</span>
                                      </span>
                                    )}
                                  </div>
                                </td>

                                <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-xs text-slate-400 whitespace-nowrap font-normal">
                                  {new Date(c.createdAt).toLocaleDateString(getLocale(lang), {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </td>

                                <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-end whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                                    <button
                                      onClick={() => openContact(c)}
                                      title={t?.dashboard?.actions?.viewDetails || (lang === "ar" ? "عرض التفاصيل" : "View Details")}
                                      className="p-1.5 rounded-lg border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 bg-slate-900 hover:bg-slate-850 transition-all cursor-pointer"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => toggleRead(c._id)}
                                      disabled={readingId === c._id}
                                      title={c.isRead ? (t?.dashboard?.actions?.markAsUnread || "Mark as Unread") : (t?.dashboard?.actions?.markAsRead || "Mark as Read")}
                                      className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-50 ${c.isRead
                                        ? "border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 bg-slate-900/60 hover:bg-slate-800"
                                        : "border-amber-500/30 text-amber-400 hover:text-amber-300 hover:border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 shadow-xs shadow-amber-500/10"
                                        }`}
                                    >
                                      {readingId === c._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : c.isRead ? (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="2"
                                          stroke="currentColor"
                                          className="w-4 h-4"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5z"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="2"
                                          stroke="currentColor"
                                          className="w-4 h-4"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                          />
                                        </svg>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setContactToDelete(c)}
                                      title={t?.dashboard?.actions?.deleteMessage || "Delete Message"}
                                      className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 bg-red-500/10 transition-all cursor-pointer"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {contactsTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      disabled={contactsPage === 1}
                      onClick={() => {
                        const newPage = contactsPage - 1;
                        setContactsPage(newPage);
                        fetchContacts(newPage);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {t?.dashboard?.pagination?.prev || "← Prev"}
                    </button>
                    <span className="text-xs text-slate-400 px-2">
                      {contactsPage} / {contactsTotalPages}
                    </span>
                    <button
                      disabled={contactsPage === contactsTotalPages}
                      onClick={() => {
                        const newPage = contactsPage + 1;
                        setContactsPage(newPage);
                        fetchContacts(newPage);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {t?.dashboard?.pagination?.next || "Next →"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Subscribers View */}
            {activeTab === "subscribers" && (
              <div>
                {subscribersTotalPages > 1 && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-400">
                      {t?.dashboard?.pagination?.total || "Total:"} {subscribersTotal}
                    </span>
                    <div className="flex items-center gap-2 ms-auto">
                      <button
                        disabled={subscribersPage === 1}
                        onClick={() => {
                          const newPage = subscribersPage - 1;
                          setSubscribersPage(newPage);
                          fetchSubscribers(newPage);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        {t?.dashboard?.pagination?.prev || "← Prev"}
                      </button>
                      <span className="text-xs text-slate-400 px-1">
                        {subscribersPage} / {subscribersTotalPages}
                      </span>
                      <button
                        disabled={subscribersPage === subscribersTotalPages}
                        onClick={() => {
                          const newPage = subscribersPage + 1;
                          setSubscribersPage(newPage);
                          fetchSubscribers(newPage);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        {t?.dashboard?.pagination?.next || "Next →"}
                      </button>
                    </div>
                  </div>
                )}
                {filteredSubscribers.length === 0 ? (
                  <div className="text-center py-16 sm:py-20 bg-slate-900/20 border border-slate-800/80 rounded-2xl p-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-3 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-300 font-semibold text-sm">
                      {t?.dashboard?.empty?.noSubscribersTitle || "No email subscribers found"}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {t?.dashboard?.empty?.noSubscribersDesc || "No subscribers matched your current search query."}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Mobile View: Cards for Subscribers */}
                    <div className="grid grid-cols-1 gap-2.5 md:hidden">
                      {filteredSubscribers.map((s) => (
                        <div
                          key={s._id}
                          className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold uppercase shrink-0">
                              {s.email.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-white truncate">{s.email}</span>
                              <span className="text-[11px] text-slate-500">
                                {new Date(s.createdAt).toLocaleDateString(getLocale(lang), {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSubscriberToDelete(s)}
                            title={t?.dashboard?.actions?.deleteSubscriber || "Delete Subscriber"}
                            className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/20 bg-red-500/10 shrink-0 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Desktop View: Full Table */}
                    <div className="hidden md:block bg-slate-950/40 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800/70 bg-slate-900/70 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                              <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-start">{t?.dashboard?.table?.subscriberEmail || "Subscriber Email"}</th>
                              <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-start">{t?.dashboard?.table?.subscriptionDate || "Subscription Date"}</th>
                              <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-end">{t?.dashboard?.table?.actions || "Actions"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50 text-sm">
                            {filteredSubscribers.map((s) => (
                              <tr key={s._id} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                                <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-semibold text-white">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold uppercase shrink-0">
                                      {s.email.charAt(0)}
                                    </div>
                                    <span className="truncate max-w-50 sm:max-w-none">{s.email}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs text-slate-400 whitespace-nowrap">
                                  {new Date(s.createdAt).toLocaleString(getLocale(lang), {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </td>
                                <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-end whitespace-nowrap">
                                  <button
                                    onClick={() => setSubscriberToDelete(s)}
                                    title={t?.dashboard?.actions?.deleteSubscriber || "Delete Subscriber"}
                                    className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 bg-red-500/10 transition-colors cursor-pointer"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="2"
                                      stroke="currentColor"
                                      className="w-4 h-4"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {subscribersTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      disabled={subscribersPage === 1}
                      onClick={() => {
                        const newPage = subscribersPage - 1;
                        setSubscribersPage(newPage);
                        fetchData(contactsPage, newPage);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {t?.dashboard?.pagination?.prev || "← Prev"}
                    </button>
                    <span className="text-xs text-slate-400 px-2">
                      {subscribersPage} / {subscribersTotalPages}
                    </span>
                    <button
                      disabled={subscribersPage === subscribersTotalPages}
                      onClick={() => {
                        const newPage = subscribersPage + 1;
                        setSubscribersPage(newPage);
                        fetchData(contactsPage, newPage);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {t?.dashboard?.pagination?.next || "Next →"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MESSAGE DETAILS MODAL (z-40) - FULLY RESPONSIVE
      ────────────────────────────────────────────────────────────── */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black/80 z-40 flex justify-center items-start p-3 sm:p-4 pt-6 sm:pt-12 backdrop-blur-md transition-opacity overflow-y-auto"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-[#090e1e] border border-slate-800/90 rounded-2xl w-full max-w-2xl max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-slate-800/80 p-4 sm:p-6 flex justify-between items-center bg-slate-950/60 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 font-bold shrink-0">
                  ✉️
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight truncate">
                    {t?.dashboard?.modal?.inquiryDetails || "Inquiry Details"}
                  </h3>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {t?.dashboard?.modal?.id || "ID"}: {selectedContact._id}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 max-w-44 sm:max-w-xs truncate">
                  {selectedContact.type || t?.dashboard?.modal?.notAvailable || "N/A"}
                </span>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t?.dashboard?.modal?.senderName || "Sender Name"}
                  </span>
                  <span className="text-white text-sm font-semibold wrap-break-word">{selectedContact.name}</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t?.dashboard?.modal?.emailAddress || "Email Address"}
                  </span>
                  <a href={`mailto:${selectedContact.email}`} className="text-amber-400 hover:underline text-sm font-semibold break-all">
                    {selectedContact.email}
                  </a>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t?.dashboard?.modal?.phoneNumber || "Phone Number"}
                  </span>
                  <span className="text-white text-sm font-semibold wrap-break-word">
                    {selectedContact.phone || t?.dashboard?.modal?.notAvailable || "N/A"}
                  </span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t?.dashboard?.modal?.organization || "Organization / Entity"}
                  </span>
                  <span className="text-white text-sm font-semibold wrap-break-word">
                    {selectedContact.org || selectedContact.organization || t?.dashboard?.modal?.notAvailable || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t?.dashboard?.modal?.messageContent || "Message Content"}
                </span>
                <div
                  dir={isArabic(selectedContact.message) ? "rtl" : "ltr"}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-slate-200 text-xs sm:text-sm leading-relaxed max-h-48 sm:max-h-60 overflow-y-auto whitespace-pre-wrap font-sans"
                >
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] sm:text-xs text-slate-500 border-t border-slate-800/80 pt-3 sm:pt-4 gap-1.5">
                <span>
                  {t?.dashboard?.modal?.received || "Received"}: {new Date(selectedContact.createdAt).toLocaleString(getLocale(lang))}
                </span>
              </div>
            </div>

            {/* Modal Footer (Always visible) */}
            <div className="bg-slate-950/60 border-t border-slate-800/80 p-3 sm:p-4 flex flex-wrap justify-between items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setContactToDelete(selectedContact)}
                className="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                <span>{t?.dashboard?.modal?.delete || "Delete"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStar(selectedContact._id)}
                  disabled={starringId === selectedContact._id}
                  className="px-3 sm:px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {starringId === selectedContact._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={selectedContact.isStarred ? "#f59e0b" : "none"}
                      stroke={selectedContact.isStarred ? "#f59e0b" : "currentColor"}
                      strokeWidth="2"
                      className="w-3.5 h-3.5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  )}
                  <span>
                    {selectedContact.isStarred
                      ? (t?.dashboard?.modal?.unstar || "Unstar")
                      : (t?.dashboard?.modal?.star || "Star")}
                  </span>
                </button>
                <button
                  onClick={() => toggleRead(selectedContact._id)}
                  disabled={readingId === selectedContact._id}
                  title={selectedContact.isRead ? (t?.dashboard?.actions?.markAsUnread || "Mark as Unread") : (t?.dashboard?.actions?.markAsRead || "Mark as Read")}
                  className="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {readingId === selectedContact._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : selectedContact.isRead ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  )}
                  <span className="hidden xs:inline">
                    {selectedContact.isRead
                      ? (t?.dashboard?.actions?.markAsUnread || "Mark as Unread")
                      : (t?.dashboard?.actions?.markAsRead || "Mark as Read")}
                  </span>
                  <span className="xs:hidden">
                    {selectedContact.isRead
                      ? (t?.dashboard?.actions?.unread || "Unread")
                      : (t?.dashboard?.actions?.read || "Read")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CONFIRMATION MODALS (z-50 — ALWAYS ON TOP OF MESSAGE MODAL)
      ────────────────────────────────────────────────────────────── */}
      {/* Delete Contact Confirmation Modal */}
      {contactToDelete && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex justify-center items-center p-4 backdrop-blur-md"
          onClick={() => setContactToDelete(null)}
        >
          <div
            className="bg-[#090e1e] border border-red-500/40 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-1.5">
              {t?.dashboard?.confirmDelete?.deleteContactTitle || "Delete Message?"}
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              {(t?.dashboard?.confirmDelete?.deleteContactMessage || "Are you sure you want to permanently delete the inquiry from {name}? This action cannot be undone.").replace("{name}", contactToDelete.name)}
            </p>
            <div className="flex justify-end gap-2.5 sm:gap-3">
              <button
                onClick={() => setContactToDelete(null)}
                disabled={deleting}
                className="px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t?.dashboard?.confirmDelete?.cancel || "Cancel"}
              </button>
              <button
                onClick={confirmDeleteContact}
                disabled={deleting}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t?.dashboard?.confirmDelete?.deleting || "Deleting..."}</span>
                  </>
                ) : (
                  <span>{t?.dashboard?.confirmDelete?.confirmDelete || "Yes, Delete"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Subscriber Confirmation Modal */}
      {subscriberToDelete && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex justify-center items-center p-4 backdrop-blur-md"
          onClick={() => setSubscriberToDelete(null)}
        >
          <div
            className="bg-[#090e1e] border border-red-500/40 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-1.5">
              {t?.dashboard?.confirmDelete?.deleteSubscriberTitle || "Delete Subscriber?"}
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              {(t?.dashboard?.confirmDelete?.deleteSubscriberMessage || "Are you sure you want to remove {email} from newsletter subscribers?").replace("{email}", subscriberToDelete.email)}
            </p>
            <div className="flex justify-end gap-2.5 sm:gap-3">
              <button
                onClick={() => setSubscriberToDelete(null)}
                disabled={deleting}
                className="px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t?.dashboard?.confirmDelete?.cancel || "Cancel"}
              </button>
              <button
                onClick={confirmDeleteSubscriber}
                disabled={deleting}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t?.dashboard?.confirmDelete?.deleting || "Deleting..."}</span>
                  </>
                ) : (
                  <span>{t?.dashboard?.confirmDelete?.confirmDelete || "Yes, Delete"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


