import "@/app/globals.css";
import { notFound } from "next/navigation";
import { Prompt, Cinzel, Plus_Jakarta_Sans, Cairo } from "next/font/google";
import { ToastProvider } from "@/components/Toast";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-prompt",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const SUPPORTED_LANGUAGES = ["en", "ar", "fr", "de", "nl", "es", "it"];

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
      className={`scroll-smooth ${prompt.variable} ${cinzel.variable} ${jakarta.variable} ${cairo.variable}`}
    >
      <body
        className={`${prompt.className} bg-[#060913] text-[#f8fafc] min-h-screen selection:bg-[#d4af37] selection:text-black font-sans antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}