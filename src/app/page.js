"use client";

import { useState } from "react";
import Link from "next/link";
import Preloader from "@/components/common/Preloader";
import Hero     from "@/components/sections/Hero";
import stylesAbout from "@/components/sections/About.module.css";
import stylesProjects from "@/components/sections/Projects.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main>
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}
      <Hero isLoaded={!isLoading} />
      
      {/* About Preview */}
      <section className={stylesAbout.about} data-theme="light">
        <div className={stylesAbout.inner}>
          <div className={stylesAbout.left}>
            <span className={stylesAbout.label}>Introduction</span>
          </div>
          <div className={stylesAbout.right}>
            <h2 className={stylesAbout.headline}>
              I craft digital experiences that live at the intersection of <em>design</em> and <em>engineering.</em>
            </h2>
            <p className={stylesAbout.body}>
              I'm a creative developer based in India — passionate about building beautiful, performant interfaces. Since 2022 I've shipped high-quality applications with Next.js, React, Node.js, GSAP, and WebGL. I believe every website is a brand story and an opportunity to push creative bounds.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <Link href="/about" className="interactive" style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0c0c0c",
                textDecoration: "underline",
                textUnderlineOffset: "4px"
              }}>
                Learn more about me →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={stylesAbout.about} style={{ background: "#eae7e1", borderTop: "1px solid rgba(12, 12, 12, 0.08)" }} data-theme="light">
        <div className={stylesAbout.inner}>
          <div className={stylesAbout.left}>
            <span className={stylesAbout.label}>Services</span>
          </div>
          <div className={stylesAbout.right}>
            <h2 className={stylesAbout.headline}>
              Transforming complex visions into <em>clean execution.</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "3rem", marginTop: "2.5rem" }}>
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.6rem" }}>Frontend Engineering</h4>
                <p style={{ color: "rgba(12, 12, 12, 0.6)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  Building robust, accessible, and high-performance user interfaces with React, Next.js, and TypeScript. Focus on SEO architecture and page rendering efficiency.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.6rem" }}>Interactive & Motion Design</h4>
                <p style={{ color: "rgba(12, 12, 12, 0.6)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  Creating smooth layout transitions, scroll-driven narratives, and physics-engine interactions using GSAP, Lenis scroll, and custom Canvas logic.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.6rem" }}>Creative WebGL & 3D</h4>
                <p style={{ color: "rgba(12, 12, 12, 0.6)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  Integrating custom 3D models and rendering lightweight particle scenes with Three.js to provide users with a premium, tactile feeling while browsing.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.6rem" }}>Fullstack Solutions</h4>
                <p style={{ color: "rgba(12, 12, 12, 0.6)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  Designing secure RESTful and WebSocket APIs with Node.js and Express, backed by relational or document databases (PostgreSQL, Supabase, MongoDB).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className={stylesProjects.projects} style={{ borderTop: "1px solid rgba(242, 237, 229, 0.08)" }}>
        <div className={stylesProjects.inner} style={{ textAlign: "center", padding: "7rem 5.5vw 8rem" }}>
          <span style={{ fontSize: "0.62rem", fontWeight: "600", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(242, 237, 229, 0.45)" }}>Works Preview</span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: "700", color: "#f2ede5", marginTop: "1rem", marginBottom: "1.5rem", fontFamily: "var(--font-bricolage), sans-serif" }}>
            Explore Selected Projects
          </h2>
          <p style={{ color: "rgba(242, 237, 229, 0.6)", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: "1.7", fontSize: "0.95rem" }}>
            Take a look at the commercial platforms, open source tools, and interactive designs I've shipped.
          </p>
          <Link href="/projects" className="interactive" style={{
            display: "inline-block",
            background: "#f2ede5",
            color: "#0c0c0c",
            padding: "1.1rem 2.8rem",
            borderRadius: "3rem",
            fontWeight: "600",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textDecoration: "none",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            Go to Showcase
          </Link>
        </div>
      </section>
    </main>
  );
}
