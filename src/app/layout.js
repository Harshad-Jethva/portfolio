import { Bricolage_Grotesque, Inter } from "next/font/google";
import "@/styles/globals.css";
import MainLayoutWrapper from "@/components/common/MainLayoutWrapper";

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
  title: "Harshad Jethva | Creative Developer",
  description: "Crafting modern, immersive web experiences with code, motion, and design.",
  openGraph: {
    title: "Harshad Jethva | Creative Developer",
    description: "Crafting modern, immersive web experiences with code, motion, and design.",
    url: "https://yourwebsite.com",
    siteName: "Harshad Jethva Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body>
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
      </body>
    </html>
  );
}
