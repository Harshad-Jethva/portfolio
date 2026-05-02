"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);
  const panelTopRef = useRef(null);
  const panelBotRef = useRef(null);
  const barRef = useRef(null);
  const titleRef = useRef(null);
  const counterRef = useRef(null);
  const taglineRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Entrance: stagger chars in
    const chars = titleRef.current?.querySelectorAll(`.${styles.char}`);
    if (chars?.length) {
      gsap.fromTo(
        chars,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, stagger: 0.04, duration: 0.9, ease: "power4.out", delay: 0.2 }
      );
    }
    if (taglineRef.current) {
      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );
    }

    // Progress bar
    let val = 0;
    const interval = setInterval(() => {
      const inc = Math.random() * 14 + 3;
      val = Math.min(val + inc, 100);
      setProgress(Math.floor(val));

      if (barRef.current) {
        gsap.to(barRef.current, { scaleX: val / 100, duration: 0.4, ease: "power2.out" });
      }

      if (val >= 100 && !completedRef.current) {
        completedRef.current = true;
        clearInterval(interval);

        const freshChars = titleRef.current?.querySelectorAll(`.${styles.char}`);

        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = "";
            onComplete();
          },
        });

        if (freshChars?.length) {
          tl.to(freshChars, { y: "-110%", opacity: 0, stagger: 0.025, duration: 0.6, ease: "power4.in" }, 0);
        }
        if (taglineRef.current) {
          tl.to(taglineRef.current, { opacity: 0, y: -12, duration: 0.4, ease: "power3.in" }, 0);
        }
        if (counterRef.current) {
          tl.to(counterRef.current, { opacity: 0, duration: 0.3 }, 0);
        }
        if (panelTopRef.current) {
          tl.to(panelTopRef.current, { yPercent: -102, duration: 1.0, ease: "power4.inOut" }, 0.3);
        }
        if (panelBotRef.current) {
          tl.to(panelBotRef.current, { yPercent: 102, duration: 1.0, ease: "power4.inOut" }, 0.3);
        }
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  const NAME1 = "JETHVA";
  const NAME2 = "HARSHAD";

  return (
    <div ref={loaderRef} className={styles.preloader} aria-hidden="true">
      {/* Two-panel split curtain */}
      <div ref={panelTopRef} className={`${styles.panel} ${styles.panelTop}`} />
      <div ref={panelBotRef} className={`${styles.panel} ${styles.panelBot}`} />

      {/* Content */}
      <div className={styles.content}>
        <div ref={titleRef} className={styles.titleWrap}>
          {/* Name 1 */}
          <span className={styles.name} aria-label={NAME1}>
            {NAME1.split("").map((ch, i) => (
              <span key={`n1-${i}`} className={styles.char} style={{ display: "inline-block" }}>
                {ch}
              </span>
            ))}
          </span>
          <span className={styles.nameSep}>&nbsp;</span>
          {/* Name 2 italic */}
          <span className={`${styles.name} ${styles.nameItalic}`} aria-label={NAME2}>
            {NAME2.split("").map((ch, i) => (
              <span key={`n2-${i}`} className={styles.char} style={{ display: "inline-block" }}>
                {ch}
              </span>
            ))}
          </span>
        </div>
        <p ref={taglineRef} className={styles.tagline}>Creative Developer</p>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.barTrack}>
          <div ref={barRef} className={styles.bar} />
        </div>
        <span ref={counterRef} className={styles.counter}>{String(progress).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
