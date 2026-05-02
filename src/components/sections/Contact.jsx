"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Contact.module.css";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/harshadjethva" },
  { label: "LinkedIn", href: "https://linkedin.com/in/harshadjethva" },
  { label: "Email", href: "mailto:harshadjethva@gmail.com" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  message: "",
};

export default function Contact() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef([]);
  const linksRef = useRef([]);
  const footRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [errorText, setErrorText] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const chars = headRef.current.querySelectorAll("span");

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
    });

    timeline
      .fromTo(
        chars,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, stagger: 0.025, duration: 1, ease: "power4.out" }
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        fieldsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        linksRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(footRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2");

    return () => {
      timeline.kill();
    };
  }, []);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setErrorText("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Could not send message. Please try again.");
      }

      setStatus("success");
      setFormData(INITIAL_FORM);
    } catch (error) {
      setStatus("idle");
      setErrorText(error.message || "Could not send message. Please try again.");
    }
  };

  const CTA = "Let's Build Something.";

  return (
    <section id="contact" className={styles.contact} ref={sectionRef}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.label}>Get In Touch</span>
        </div>

        <div className={styles.headWrap}>
          <h2 ref={headRef} className={styles.headline} aria-label={CTA}>
            {CTA.split("").map((character, index) => (
              <span key={index} style={{ display: character === " " ? "inline" : "inline-block" }}>
                {character === " " ? "\u00A0" : character}
              </span>
            ))}
          </h2>
        </div>

        <div className={styles.content}>
          <div className={styles.leftCol}>
            <p ref={subRef} className={styles.sub}>
              Open to freelance projects, collaborations, and new opportunities. Feel free to reach out if
              you have a question or just want to say hi.
            </p>

            <div className={styles.links}>
              {SOCIALS.map(({ label, href }, index) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`interactive ${styles.link}`}
                  ref={(element) => {
                    linksRef.current[index] = element;
                  }}
                >
                  <span className={styles.linkLabel}>{label}</span>
                  <svg className={styles.linkArrow} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 13L13 1M13 1H4M13 1V10"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.rightCol}>
            <form
              ref={formRef}
              className={`${styles.form} ${status === "success" ? styles.formHidden : ""}`}
              onSubmit={handleSubmit}
            >
              {errorText ? <p className={styles.errorMessage}>{errorText}</p> : null}

              <div
                className={styles.field}
                ref={(element) => {
                  fieldsRef.current[0] = element;
                }}
              >
                <label className={styles.fieldLabel}>Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              <div
                className={styles.field}
                ref={(element) => {
                  fieldsRef.current[1] = element;
                }}
              >
                <label className={styles.fieldLabel}>Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>

              <div
                className={styles.field}
                ref={(element) => {
                  fieldsRef.current[2] = element;
                }}
              >
                <label className={styles.fieldLabel}>Message</label>
                <textarea
                  placeholder="Tell me about your project..."
                  className={styles.textarea}
                  value={formData.message}
                  onChange={handleChange("message")}
                  required
                />
              </div>

              <button
                type="submit"
                className={`interactive ${styles.submitBtn}`}
                ref={(element) => {
                  fieldsRef.current[3] = element;
                }}
                disabled={status === "loading"}
              >
                <span className={styles.btnText}>{status === "loading" ? "Sending..." : "Send Message"}</span>
                <div className={styles.btnIcon}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 13L13 1M13 1H4M13 1V10"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </form>

            {status === "success" && (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className={styles.successTitle}>Message Sent Successfully!</h3>
                <p className={styles.successText}>Thanks for reaching out. I&apos;ll get back to you as soon as possible.</p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setErrorText("");
                  }}
                  className={styles.resetBtn}
                >
                  Send another message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer ref={footRef} className={styles.footer}>
        <span>© {new Date().getFullYear()} Harshad Jethva</span>
        <span>Creative Developer - India</span>
      </footer>
    </section>
  );
}

