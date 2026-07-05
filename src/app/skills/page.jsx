"use client";

import Skills from "@/components/sections/Skills";
import styles from "@/components/sections/Skills.module.css";

export default function SkillsPage() {
  return (
    <main style={{ paddingTop: "80px" }}>
      <Skills />
      
      {/* Expanded Methodology/Capabilities Section with Correct Dark Color Contrast */}
      <section className={styles.skills} style={{ borderTop: "1px solid rgba(12, 12, 12, 0.1)", background: "#eae7e1" }}>
        <div className={styles.inner}>
          <div className={styles.lineAccent} />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginTop: "3rem" }}>
            <div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: "700", marginBottom: "1.2rem", color: "#0c0c0c", fontFamily: "var(--font-bricolage), sans-serif" }}>
                Development Philosophy
              </h3>
              <p style={{ color: "rgba(12, 12, 12, 0.7)", lineHeight: "1.8", fontSize: "0.98rem", marginBottom: "1.5rem" }}>
                I am a versatile, growth-oriented Full-Stack Developer with a strong foundation in software development and problem-solving. I am passionate about exploring diverse technologies, continuously learning, and delivering innovative solutions that create real impact.
              </p>
              <p style={{ color: "rgba(12, 12, 12, 0.7)", lineHeight: "1.8", fontSize: "0.98rem" }}>
                I specialize in vibe coding and website development, ensuring high performance, smooth animations, and fully featured layouts.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: "700", marginBottom: "1.2rem", color: "#0c0c0c", fontFamily: "var(--font-bricolage), sans-serif" }}>
                Core Capabilities & Tools
              </h3>
              <ul style={{ color: "rgba(12, 12, 12, 0.7)", lineHeight: "2.1", fontSize: "0.98rem", listStyleType: "none", padding: 0 }}>
                <li>⚡ <strong>Full-Stack Architectures</strong>: Built utilizing React, Node.js, Express, PHP, and ASP.NET.</li>
                <li>🗄️ <strong>Databases</strong>: Proficient in PostgreSQL, MySQL, and MongoDB.</li>
                <li>🛠️ <strong>Modern Tooling</strong>: Git/GitHub, Postman, ConnectWaba, and Canva for UI/UX.</li>
                <li>🎯 <strong>Industry Standards</strong>: Object-Oriented Programming (OOPS), SDLC, and DevOps (in progress).</li>
                <li>💻 <strong>Multi-Language</strong>: Writing backend logic in JavaScript, Python, Java, C++, and PHP.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
