import "@/app/globals.css";
import { Prompt } from "next/font/google";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
      </body>
    </html>
  );
}