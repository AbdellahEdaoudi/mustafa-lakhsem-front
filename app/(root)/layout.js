import "@/app/globals.css";
import { Prompt } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className={`scroll-smooth ${prompt.variable}`}>
      <body
        className={`${prompt.className} bg-[#060913] text-[#f8fafc] min-h-screen antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}