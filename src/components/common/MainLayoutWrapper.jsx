"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import CustomCursor from "./CustomCursor";
import Background3D from "../ui/Background3D";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();

  const isAdminOrLogin = (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) && !pathname?.startsWith("/admin/builder/preview");

  return (
    <>
      <CustomCursor />
      <div className="grain-overlay" />
      {!isAdminOrLogin && (
        <>
          <Navbar />
          <Background3D />
        </>
      )}
      {isAdminOrLogin ? (
        children
      ) : (
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}


