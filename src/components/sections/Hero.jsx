"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./Hero.module.css";
import HeroImageReveal from "./HeroImageReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FACTS = [
  "I drink tea, not coffee.",
  "I love clean code & clean design.",
  "I build at the speed of thought.",
  "Currently learning WebGL shaders.",
  "Dark mode is the only mode.",
];

// Suppress hydration mismatch for time-dependent values
const IS_SERVER = typeof window === "undefined";

export default function Hero({ isLoaded }) {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const name1Ref = useRef(null);
  const name2Ref = useRef(null);
  const roleRef = useRef(null);
  const scrollRef = useRef(null);
  const factRef = useRef(null);
  const clockRef = useRef(null);

  // Rotating facts
  const [factIdx, setFactIdx] = useState(0);
  const [factsVisible, setFactsVisible] = useState(true);

  // Live clock
  const [time, setTime] = useState({ h: "00", m: "00" });

  // Clock update
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime({
        h: String(now.getHours()).padStart(2, "0"),
        m: String(now.getMinutes()).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fact rotation
  useEffect(() => {
    const id = setInterval(() => {
      setFactsVisible(false);
      setTimeout(() => {
        setFactIdx((i) => (i + 1) % FACTS.length);
        setFactsVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(bgRef.current,
      { scale: 1.04, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.8 }
    )
      .fromTo([name1Ref.current, name2Ref.current],
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.08 },
        "-=1.4"
      )
      .fromTo(roleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.8"
      )
      .fromTo(scrollRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo([factRef.current, clockRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        "-=0.6"
      );

    // Scroll-indicator bounce
    gsap.to(scrollRef.current?.querySelector(`.${styles.scrollArrow}`), {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 0.9,
      ease: "sine.inOut",
    });

    // Parallax zoom on scroll
    gsap.to(bgRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      scale: 1.06,
      ease: "none",
    });
  }, [isLoaded]);

  return (
    <section className={styles.hero} ref={containerRef} id="hero">
      {/* Full-bleed background photo */}
      <div ref={bgRef} className={styles.bgWrap}>
        <HeroImageReveal
          className={styles.bgCanvas}
          mainImage="/assets/hero-photo-main.png"
          secondImage="/assets/hero-photo-second.png"
          interactionRef={containerRef}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className={styles.overlay} />

      {/* Name: JETHVA — top left bleed */}
      <div className={styles.nameLeft}>
        <div className={styles.overflow}>
          <h1 ref={name1Ref} className={styles.nameText}>Harshad</h1>
        </div>
      </div>

      {/* Name: HARSHAD — bottom right */}
      <div className={styles.nameRight}>
        <div className={styles.overflow}>
          <h1 ref={name2Ref} className={`${styles.nameText} ${styles.nameItalic}`}>Jethva</h1>
        </div>
      </div>

      {/* Center role label */}
      <div ref={roleRef} className={styles.roleWrap}>
        <p className={styles.roleTop}>Portfolio Of</p>
        <p className={styles.role}>Visual Designer &amp; Creative Developer</p>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className={styles.scrollIndicator}>
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollArrow}>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <path d="M7 1v20M1 15l6 6 6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Bottom-left: rotating facts */}
      <div ref={factRef} className={styles.facts}>
        <span
          className={styles.factText}
          style={{ opacity: factsVisible ? 1 : 0, transform: factsVisible ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}
        >
          {FACTS[factIdx]}
        </span>
      </div>

      {/* Bottom-right: live clock */}
      <div ref={clockRef} className={styles.clock}>
        <span className={styles.clockTime}>{time.h}</span>
        <span className={styles.clockSep}>:</span>
        <span className={styles.clockTime}>{time.m}</span>
      </div>
    </section>
  );
}
