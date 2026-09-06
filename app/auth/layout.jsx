import "@/app/globals.css";
import { Prompt } from "next/font/google";
import { ToastProvider } from "@/components/Toast";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata = {
  title: "Mustafa Lakhsem | Auth",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className={`scroll-smooth ${prompt.variable}`}>
      <body
        className={`${prompt.className} bg-[#060913] text-[#f8fafc] min-h-screen antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
