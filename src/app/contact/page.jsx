"use client";

import Contact from "@/components/sections/Contact";
import styles from "@/components/sections/Contact.module.css";

export default function ContactPage() {
  return (
    <main style={{ paddingTop: "80px" }}>
      <Contact />
      
      {/* Expanded FAQ/Information Section */}
      <section className={styles.contact} style={{ borderTop: "1px solid rgba(242, 237, 229, 0.08)", background: "#0c0c0c", color: "#f2ede5", paddingBottom: "8rem" }}>
        <div className={styles.inner}>
          <div style={{ maxWidth: "800px", margin: "0 auto", paddingTop: "4rem" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "700", marginBottom: "2.5rem", textAlign: "center", fontFamily: "var(--font-bricolage), sans-serif", color: "#f2ede5" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.6rem", color: "#f2ede5" }}>What is your typical project timeline?</h4>
                <p style={{ color: "rgba(242, 237, 229, 0.6)", lineHeight: "1.7", fontSize: "0.98rem" }}>
                  Depending on the complexity, a custom-designed interactive website takes between 3 to 6 weeks from layout staging and prototype loops to final quality checks and production hosting.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.6rem", color: "#f2ede5" }}>Do you work with global clients?</h4>
                <p style={{ color: "rgba(242, 237, 229, 0.6)", lineHeight: "1.7", fontSize: "0.98rem" }}>
                  Yes! I have collaborated with clients across North America, Europe, and Asia. Communication is typically done asynchronously via email, Slack, or scheduled Zoom/Google Meet video syncs.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.6rem", color: "#f2ede5" }}>What technologies do you specialize in?</h4>
                <p style={{ color: "rgba(242, 237, 229, 0.6)", lineHeight: "1.7", fontSize: "0.98rem" }}>
                  I specialize in Next.js, React, Node.js, Express, MongoDB/PostgreSQL, GSAP for scroll-driven animations, and Three.js/WebGL for custom 3D element rendering.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.6rem", color: "#f2ede5" }}>What is your revision and onboarding process?</h4>
                <p style={{ color: "rgba(242, 237, 229, 0.6)", lineHeight: "1.7", fontSize: "0.98rem" }}>
                  We start with a design consultation to align on branding, goals, and layout styles. Once the design mockup is signed off, we go into development. I offer up to 3 major revision rounds during the prototyping stage to ensure every pixel aligns with your vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
