"use client";

import About from "@/components/sections/About";
import Achievements from "@/components/sections/Achievements";
import styles from "@/components/sections/About.module.css";

export default function AboutPage() {
  return (
    <main style={{ paddingTop: "80px" }}>
      <About />
      
      {/* Expanded Story & Timeline Section */}
      <section className={styles.about} style={{ background: "#eae7e1", borderTop: "1px solid rgba(12, 12, 12, 0.1)" }}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className={styles.label}>Journey</span>
          </div>
          <div className={styles.right}>
            <h2 className={styles.headline}>
              Education & <em>Experience</em>
            </h2>
            <p className={styles.body} style={{ marginBottom: "2.5rem" }}>
              My career objective is to continuously learn and deliver innovative solutions that create real impact. Here is my structured educational background and professional training history:
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
              <div style={{ borderLeft: "2px solid rgba(12, 12, 12, 0.1)", paddingLeft: "1.8rem", position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "-6px",
                  top: "4px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#0c0c0c"
                }} />
                <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "rgba(12, 12, 12, 0.55)", letterSpacing: "0.05em" }}>Internship</span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginTop: "0.3rem", color: "#0c0c0c" }}>LA MINDS (Surat)</h3>
                <p className={styles.body} style={{ marginTop: "0.5rem" }}>
                  Under the Gujarat Skill Development Mission, in Project Sankalp, training will be given for full-stack web development with industrial-level readiness.
                </p>
              </div>

              <div style={{ borderLeft: "2px solid rgba(12, 12, 12, 0.1)", paddingLeft: "1.8rem", position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "-6px",
                  top: "4px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "rgba(12, 12, 12, 0.3)"
                }} />
                <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "rgba(12, 12, 12, 0.55)", letterSpacing: "0.05em" }}>Jun 2023 - 2026</span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginTop: "0.3rem", color: "#0c0c0c" }}>Bachelor of Computer Application and Science</h3>
                <p className={styles.body} style={{ marginTop: "0.5rem" }}>
                  Sutex College of Computer Application & Science (VNSGU), Surat.
                  <br />
                  <strong>Current Performance:</strong> Maintaining a high academic standing with recent semester marks of 90% (Sem 6), 91.45% (Sem 5), 94.72% (Sem 4) and 89.81% (Sem 3).
                </p>
              </div>

              <div style={{ borderLeft: "2px solid rgba(12, 12, 12, 0.1)", paddingLeft: "1.8rem", position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "-6px",
                  top: "4px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "rgba(12, 12, 12, 0.3)"
                }} />
                <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "rgba(12, 12, 12, 0.55)", letterSpacing: "0.05em" }}>Jun 2022 - May 2023</span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginTop: "0.3rem", color: "#0c0c0c" }}>Higher Secondary Certificate (HSC)</h3>
                <p className={styles.body} style={{ marginTop: "0.5rem" }}>
                  K & M P Patel Vidhyalaya, Surat.
                  <br />
                  <strong>Result:</strong> 80.80% (G.S.H.E.B.).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Achievements />
    </main>
  );
}
