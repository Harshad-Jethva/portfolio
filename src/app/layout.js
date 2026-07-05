import { Bricolage_Grotesque, Inter } from "next/font/google";
import "@/styles/globals.css";
import MainLayoutWrapper from "@/components/common/MainLayoutWrapper";
import SchemaMarkup from "@/components/common/SchemaMarkup";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Harshad Jethva | Visual Designer & Creative Developer Portfolio",
  description: "Creative developer and visual designer specializing in building highly immersive, premium, and interactive web experiences using React, Next.js, GSAP, and Three.js.",
  keywords: [
    "Creative Developer",
    "Visual Designer",
    "Front-end Engineer",
    "React Developer India",
    "Next.js Developer Gujarat",
    "WebGL Three.js Animations",
    "Interactive UI UX Developer Portfolio",
    "Portfolio of Harshad Jethva"
  ],
  authors: [{ name: "Harshad Jethva", url: "https://portfolio-hj.vercel.app" }],
  creator: "Harshad Jethva",
  metadataBase: new URL("https://portfolio-hj.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Harshad Jethva | Visual Designer & Creative Developer Portfolio",
    description: "Creative developer and visual designer specializing in building highly immersive, premium, and interactive web experiences using React, Next.js, GSAP, and Three.js.",
    url: "https://portfolio-hj.vercel.app",
    siteName: "Harshad Jethva Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshad Jethva | Creative Developer",
    description: "Visual Designer & Creative Developer crafting immersive web experiences.",
    creator: "@harshadjethva",
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Rajkot",
    "geo.position": "22.3039;70.8022",
    "ICBM": "22.3039, 70.8022",
  },
};

import { getGlobalSettings } from "@/lib/portfolioRepository";

export default async function RootLayout({ children }) {
  let theme = {
    primaryColor: "#3b82f6",
    secondaryColor: "#6366f1",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    fontFamily: "var(--font-inter), sans-serif",
    borderRadius: "8px"
  };

  try {
    const settings = await getGlobalSettings();
    if (settings.theme_variables) {
      theme = settings.theme_variables;
    }
  } catch (e) {
    console.error("Theme fetch failed, using fallback:", e);
  }

  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <head>
        <SchemaMarkup />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${theme.primaryColor};
            --secondary: ${theme.secondaryColor};
            --bg-override: ${theme.backgroundColor};
            --text-override: ${theme.textColor};
            --radius-override: ${theme.borderRadius};
          }
          body {
            background-color: var(--bg-override) !important;
            color: var(--text-override) !important;
          }
        ` }} />
      </head>
      <body>
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
      </body>
    </html>
  );
}
