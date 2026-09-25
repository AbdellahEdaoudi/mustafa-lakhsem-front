import "@/app/globals.css";
import { notFound } from "next/navigation";
import { Prompt, Cairo } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import PwaRegister from "@/components/PwaRegister";
import { Analytics } from "@vercel/analytics/next";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-prompt",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const SUPPORTED_LANGUAGES = ["en", "ar", "fr", "de", "nl", "es", "it"];

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#040711",
};

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params;

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const isRtl = lang === "ar";

  return (
    <html
      lang={lang}
      dir={isRtl ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={`scroll-smooth ${prompt.variable} ${cairo.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icons/favicon-48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mustafa Lakhsem" />
      </head>
      <body
        className={`${prompt.className} bg-[#060913] text-[#f8fafc] min-h-screen selection:bg-[#d4af37] selection:text-black font-sans antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
        <PwaRegister />
        <Analytics />
      </body>
    </html>
  );
}