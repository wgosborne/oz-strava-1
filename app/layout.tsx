import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeHydrationWrapper from "./components/ThemeHydrationWrapper"; // or wherever you save it
import { NavBar } from "./components/NavBar";
import "./globals.css";
import { useStore } from "./store/store";
import { shouldSync } from "@/lib/sync";
import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wags loves to run",
  description: "Special shout out to Hyperfocus and coffee!",
};

// if (shouldSync()) {
//   console.log("Running Strava sync on startup...");
//   try {
//     await axios.post(
//       "http://localhost:3000/api/refreshDatabase"
//     );
//   } catch (err) {
//     console.error("Strava sync failed:", err);
//   }
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            })();
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeHydrationWrapper>
          <NavBar />
          {children}
        </ThemeHydrationWrapper>
      </body>
    </html>
  );
}
