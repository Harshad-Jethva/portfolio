"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { DEFAULT_SKILL_GROUPS } from "@/lib/portfolioData";
import styles from "./Skills.module.css";

export default function Skills() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);
  const lineRef = useRef(null);

  const [skillGroups, setSkillGroups] = useState(DEFAULT_SKILL_GROUPS);

  useEffect(() => {
    let mounted = true;

    const loadSkills = async () => {
      try {
        const response = await fetch("/api/skills", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (mounted && Array.isArray(data.groups) && data.groups.length > 0) {
          setSkillGroups(data.groups);
        }
      } catch {
        // Keep fallback defaults when API is unavailable.
      }
    };

    loadSkills();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!titleRef.current || !lineRef.current || !subtitleRef.current || !gridRef.current) {
      return;
    }

    const chars = titleRef.current.querySelectorAll("span");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
      },
    });

    timeline
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power4.out" }
      )
      .fromTo(
        chars,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, stagger: 0.04, duration: 0.9, ease: "power4.out" },
        "-=0.4"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        gridRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      );

    return () => {
      timeline.kill();
    };
  }, [skillGroups.length]);

  const TITLE = "Full Stack Developer";

  return (
    <section id="skills" className={styles.skills} ref={sectionRef} data-theme="light">
      <div className={styles.inner}>
        <div ref={lineRef} className={styles.lineAccent} />

        <div className={styles.titleWrap}>
          <h2 ref={titleRef} className={styles.title} aria-label={TITLE}>
            {TITLE.split("").map((character, index) => (
              <span key={index} style={{ display: character === " " ? "inline" : "inline-block" }}>
                {character === " " ? "\u00A0" : character}
              </span>
            ))}
          </h2>
        </div>

        <p ref={subtitleRef} className={styles.subtitle}>
          Technologies and tools I use to bring ideas to life.
        </p>

        <div ref={gridRef} className={styles.grid}>
          {skillGroups.map(({ cat, items }, index) => (
            <div key={`${cat}-${index}`} className={styles.col}>
              <h3 className={styles.colHead}>{cat}</h3>
              <ul className={styles.list}>
                {items.map((skill, itemIndex) => (
                  <li key={`${skill}-${itemIndex}`} className={styles.item}>
                    <span className={styles.dash}>-</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

