import dynamic from "next/dynamic";
import { getTranslation } from "@/translations";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Achievements from "@/components/Achievements";
import Career from "@/components/Career";

// Lazy-load below-the-fold sections to optimize mobile First Contentful Paint & TBT
const Vision = dynamic(() => import("@/components/Vision"));
const Diplomacy = dynamic(() => import("@/components/Diplomacy"));
const Foundations = dynamic(() => import("@/components/Foundations"));
const ImouzzerSpotlight = dynamic(() => import("@/components/ImouzzerSpotlight"));
const MediaCenter = dynamic(() => import("@/components/MediaCenter"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));
const CampaignModal = dynamic(() => import("@/components/CampaignModal"));

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mustafa-lakhsem.vercel.app";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = await getTranslation(lang || "en");
  const pageUrl = lang ? `${SITE_URL}/${lang}` : SITE_URL;
  const localeMap = {
    en: "en_US",
    ar: "ar_MA",
    fr: "fr_FR",
    de: "de_DE",
    nl: "nl_NL",
    es: "es_ES",
    it: "it_IT",
  };

  const currentLocale = localeMap[lang] || "en_US";
  const allLocales = ["en_US", "fr_FR", "ar_MA", "it_IT", "de_DE", "nl_NL", "es_ES"];
  const alternateLocales = allLocales.filter((l) => l !== currentLocale);

  return {
    title: t?.meta?.title || "Mustafa Lakhsem | Official Website - Mayor of Imouzzer-Kandar & World Champion",
    description: t?.meta?.description || "Official website of Mustafa Lakhsem — Mayor of Imouzzer-Kandar, 12-time World Kickboxing & Full-Contact Champion, Founder of Lakhsem Foundation.",
    alternates: {
      canonical: `${SITE_URL}/${lang || "en"}`,
      languages: {
        ar: `${SITE_URL}/ar`,
        en: `${SITE_URL}/en`,
        fr: `${SITE_URL}/fr`,
        de: `${SITE_URL}/de`,
        nl: `${SITE_URL}/nl`,
        es: `${SITE_URL}/es`,
        it: `${SITE_URL}/it`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: t?.meta?.title || "Mustafa Lakhsem | Official Website - Mayor of Imouzzer-Kandar & World Champion",
      description: t?.meta?.description || "Official website of Mustafa Lakhsem — Mayor of Imouzzer-Kandar, 12-time World Kickboxing & Full-Contact Champion, Founder of Lakhsem Foundation.",
      images: [
        {
          url: `${SITE_URL}/mustapha-lakhsem.png`,
          width: 1200,
          height: 630,
          alt: "Mustafa Lakhsem - Mayor of Imouzzer-Kandar & World Champion",
        },
      ],
      url: pageUrl,
      siteName: "Mustafa Lakhsem",
      type: "profile",
      firstName: "Mustafa",
      lastName: "Lakhsem",
      gender: "male",
      locale: currentLocale,
      alternateLocale: alternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: `${SITE_URL}/mustapha-lakhsem.png`,
          width: 1200,
          height: 630,
          alt: "Mustafa Lakhsem - Mayor of Imouzzer-Kandar & World Champion",
        },
      ],
      title: t?.meta?.title || "Mustafa Lakhsem | Official Website - Mayor of Imouzzer-Kandar & World Champion",
      description: t?.meta?.description || "Official website of Mustafa Lakhsem — Mayor of Imouzzer-Kandar, 12-time World Kickboxing & Full-Contact Champion, Founder of Lakhsem Foundation.",
    }
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "ar" },
    { lang: "fr" },
    { lang: "de" },
    { lang: "nl" },
    { lang: "es" },
    { lang: "it" },
  ];
}

export default async function LangPage({ params }) {
  const { lang } = await params;
  const t = await getTranslation(lang || "en");
  const isRtl = lang === "ar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": "Mustafa Lakhsem Official Website",
        "description": "Official website of Mustafa Lakhsem — Mayor of Imouzzer-Kandar & 12-time World Champion.",
        "publisher": {
          "@id": `${SITE_URL}/#person`
        }
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        "name": "Mustafa Lakhsem",
        "alternateName": "مصطفى لخصم",
        "description": "Mayor of Imouzzer-Kandar, 12-time World Kickboxing & Full-Contact Champion, Founder of Lakhsem Foundation.",
        "url": SITE_URL,
        "image": `${SITE_URL}/mustapha-lakhsem.png`,
        "jobTitle": "Mayor of Imouzzer-Kandar & World Champion Athlete",
        "knowsAbout": ["Kickboxing", "Full-Contact", "Municipal Management", "Solidarity"],
        "sameAs": [
          "https://www.facebook.com/Mustafa.Lakhsem.officiel",
          "https://www.instagram.com/mustafalakhsem",
          "https://www.tiktok.com/@mustafa.lakhsem",
          "https://x.com/LakhsemM",
          "https://www.linkedin.com/in/mustafa-lakhsem-0480328b/"
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${lang || "en"}#webpage`,
        "url": `${SITE_URL}/${lang || "en"}`,
        "name": t?.meta?.title || "Mustafa Lakhsem | Official Website",
        "description": t?.meta?.description || "Official website of Mustafa Lakhsem",
        "inLanguage": lang || "en",
        "isPartOf": {
          "@id": `${SITE_URL}/#website`
        },
        "about": {
          "@id": `${SITE_URL}/#person`
        },
        "mainEntity": {
          "@id": `${SITE_URL}/#person`
        }
      }
    ]
  };
  const commonProps = { t, lang };  
  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-[#040711] text-[#f8fafc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-col selection:bg-amber-500 selection:text-black">
        {/* Navigation */}
        <Navbar {...commonProps} />

        {/* Hero Section */}
        <Hero {...commonProps} />

        {/* Biography & Leadership */}
        <About {...commonProps} />

        {/* Career Timeline */}
        <Career {...commonProps} />

        {/* Championships & Hall of Fame */}
        <Achievements {...commonProps} />

        {/* Municipal Vision */}
        <Vision {...commonProps} />

        {/* Global Diplomacy */}
        <Diplomacy {...commonProps} />

        {/* Foundations & Social Engagement */}
        <Foundations {...commonProps} />

        {/* Imouzzer-Kandar Spotlight */}
        <ImouzzerSpotlight {...commonProps} />

        {/* Media & Press Center */}
        <MediaCenter {...commonProps} />

        {/* Contact & Civic Office */}
        <Contact {...commonProps} />

        {/* Footer */}
        <Footer {...commonProps} />

        {/* Election Campaign Pop-up Modal */}
        <CampaignModal {...commonProps} />
      </main>
    </div>
  );
}
