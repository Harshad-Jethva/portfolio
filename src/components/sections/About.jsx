"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./About.module.css";

export default function About() {
  const sectionRef = useRef(null);
  const labelRef   = useRef(null);
  const headRef    = useRef(null);
  const paraRef    = useRef(null);
  const statsRef   = useRef([]);
  const numRefs    = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 65%",
      },
    });

    tl.fromTo(labelRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }
    )
    .fromTo(headRef.current,
      { y: "100%", opacity: 0 },
      { y: "0%",   opacity: 1, duration: 1.1, ease: "power4.out" },
      "-=0.3"
    )
    .fromTo(paraRef.current,
      { y: 30, opacity: 0 },
      { y: 0,  opacity: 1, duration: 1,   ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(statsRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .call(() => {
      statsRef.current.forEach((statEl, idx) => {
        const numEl = numRefs.current[idx];
        if (!numEl) return;
        const targetVal = idx === 0 ? 4 : idx === 1 ? 15 : null;
        if (targetVal !== null) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetVal,
            duration: 1.8,
            ease: "power3.out",
            onUpdate: () => {
              numEl.textContent = Math.floor(obj.val) + "+";
            }
          });
        } else {
          gsap.fromTo(numEl,
            { scale: 0.2, opacity: 0.3, rotate: -90 },
            { scale: 1, opacity: 1, rotate: 0, duration: 1.4, ease: "back.out(2)" }
          );
        }
      });
    });
  }, []);

  return (
    <section
      id="about"
      className={`${styles.about}`}
      ref={sectionRef}
      data-theme="light"
    >
      {/* Thin top border */}
      <div className={styles.topLine} />

      <div className={styles.inner}>
        {/* Left column */}
        <div className={styles.left}>
          <span ref={labelRef} className={styles.label}>Identity</span>
        </div>

        {/* Right column */}
        <div className={styles.right}>
          <div className={styles.headWrap}>
            <h2 ref={headRef} className={styles.headline}>
              I craft digital experiences that live at the intersection of
              {" "}<em>design</em> and{" "}<em>engineering.</em>
            </h2>
          </div>

          <p ref={paraRef} className={styles.body}>
            {"I'm a creative developer based in India — passionate about building beautiful, performant interfaces. Since 2022 I've shipped production-ready apps with MERN, Next.js, GSAP, and Three.js. I believe every pixel is a decision, every animation tells a story, and every project is a chance to push the craft."}
          </p>

          {/* Stats row */}
          <div className={styles.stats}>
            {[
              { num: "4+",  label: "Years exploring" },
              { num: "15+", label: "Projects shipped" },
              { num: "∞",   label: "Cups of tea" },
            ].map((s, i) => (
              <div key={i} className={styles.stat} ref={el => statsRef.current[i] = el}>
                <span className={styles.statNum} ref={el => numRefs.current[i] = el}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomLine} />
    </section>
  );
}
