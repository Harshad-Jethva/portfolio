"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import CustomCursor from "./CustomCursor";
import Background3D from "../ui/Background3D";
import Navbar from "./Navbar";

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();

  // If we're on the admin dashboard or login page, don't show the main site components
  return (
    <>
      <CustomCursor />
      <div className="grain-overlay" />
      {!(pathname?.startsWith("/admin") || pathname?.startsWith("/login")) && (
        <>
          <Navbar />
          <Background3D />
        </>
      )}
      {pathname?.startsWith("/admin") || pathname?.startsWith("/login") ? (
        children
      ) : (
        <SmoothScroll>{children}</SmoothScroll>
      )}
    </>
  );
}

