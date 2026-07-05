"use client";

import Projects from "@/components/sections/Projects";
import styles from "@/components/sections/Projects.module.css";

export default function ProjectsPage() {
  return (
    <main style={{ paddingTop: "80px" }}>
      <Projects />
      
      {/* Featured Client Reviews & Curation Details */}
      <section className={styles.projects} style={{ borderTop: "1px solid rgba(242, 237, 229, 0.08)", paddingBottom: "8rem" }}>
        <div className={styles.inner}>
          <div style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "4rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", textAlign: "left", marginBottom: "5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#f2ede5", marginBottom: "1rem", fontFamily: "var(--font-bricolage), sans-serif" }}>
                  Curated Projects
                </h3>
                <p style={{ color: "rgba(242, 237, 229, 0.6)", fontSize: "0.95rem", lineHeight: "1.8" }}>
                  Each project shown here represents a specific milestone in solving layout challenges, handling complex state synchronization (like WebSockets for Cafe Management), or orchestrating high-fidelity GSAP and WebGL canvas animations.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#f2ede5", marginBottom: "1rem", fontFamily: "var(--font-bricolage), sans-serif" }}>
                  Project Standards
                </h3>
                <p style={{ color: "rgba(242, 237, 229, 0.6)", fontSize: "0.95rem", lineHeight: "1.8" }}>
                  I hold myself to extreme standards regarding accessibility, semantic layouts, structured JSON-LD schemas, device-adaptive images, and rapid page-loading benchmarks.
                </p>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "2.2rem", fontWeight: "700", marginBottom: "1rem", color: "#f2ede5", fontFamily: "var(--font-bricolage), sans-serif" }}>
                Interested in working together?
              </h2>
              <p style={{ color: "rgba(242, 237, 229, 0.6)", fontSize: "1rem", marginBottom: "2.5rem", lineHeight: "1.7" }}>
                I am currently accepting freelance opportunities and contract positions. Let's build something extraordinary.
              </p>
              <a href="/contact" className="interactive" style={{
                display: "inline-block",
                background: "#f2ede5",
                color: "#0c0c0c",
                padding: "1.1rem 2.8rem",
                borderRadius: "3rem",
                fontWeight: "600",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                textDecoration: "none",
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
