"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { DEFAULT_ACHIEVEMENTS } from "@/lib/portfolioData";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Achievements.module.css";

export default function Achievements() {
  const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const sceneRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadAchievements = async () => {
      try {
        const response = await fetch("/api/achievements", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (mounted && Array.isArray(data.items) && data.items.length > 0) {
          setAchievements(data.items);
        }
      } catch {
        // Keep fallback defaults when API is unavailable.
      }
    };

    loadAchievements();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    // Header animation
    const headerAnim = gsap.fromTo(
      headerRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        },
      }
    );

    // 3D Scene entrance and rotation linked to scroll (scrub!)
    const sceneAnim = gsap.fromTo(
      sceneRef.current,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sceneRef.current,
          start: "top 75%",
        },
      }
    );

    // Dynamic rotation of 3D gallery on scroll (adds premium feeling)
    const rotatingGallery = sceneRef.current?.querySelector(`.${styles.a3d}`);
    let scrubRotation;
    if (rotatingGallery) {
      scrubRotation = gsap.fromTo(
        rotatingGallery,
        { rotateY: "0deg" },
        {
          rotateY: "360deg",
          scrollTrigger: {
            trigger: sceneRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }

    // Detail cards animation
    const cardsAnim = gsap.fromTo(
      detailsRef.current.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: detailsRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      headerAnim.kill();
      sceneAnim.kill();
      if (scrubRotation) scrubRotation.kill();
      cardsAnim.kill();
    };
  }, [achievements.length]);

  const total = useMemo(() => achievements.length, [achievements.length]);

  return (
    <section id="awards" className={styles.awards} ref={sectionRef}>
      <div className={styles.inner}>
        <div className={styles.header} ref={headerRef}>
          <span className={styles.label}>Awards Gallery</span>
          <h2 className={styles.title}>Achievements</h2>
          <p className={styles.subtitle}>
            A 3D rotating gallery of my milestones with complete achievement details.
          </p>
        </div>

        <div className={styles.scene} ref={sceneRef}>
          <div className={styles.a3d} style={{ "--n": total }}>
            {achievements.map((achievement, index) => (
               <img
                 key={achievement.id ?? `${achievement.title}-${index}`}
                 className={styles.card}
                 src={achievement.imageUrl}
                 style={{ "--i": index }}
                 alt={achievement.title}
                 loading="lazy"
                 onError={(e) => {
                   e.target.onerror = null;
                   e.target.src = "https://images.unsplash.com/photo-1635350736475-c8cef4b21906?w=400"; // Premium abstract placeholder
                 }}
               />
            ))}
          </div>
        </div>

        <div className={styles.details} ref={detailsRef}>
          {achievements.map((achievement, index) => (
            <article key={achievement.id ?? `${achievement.title}-detail-${index}`} className={styles.detailCard}>
              <div className={styles.detailImageWrapper}>
                <img 
                  src={achievement.imageUrl} 
                  alt={achievement.title} 
                  className={styles.detailImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1635350736475-c8cef4b21906?w=400";
                  }}
                />
              </div>
              <div className={styles.detailContent}>
                <div className={styles.metaRow}>
                  <span>{achievement.year}</span>
                  <span className={styles.categoryBadge}>{achievement.category}</span>
                </div>
                <h3 className={styles.detailTitle}>{achievement.title}</h3>
                <p className={styles.organizer}>{achievement.organizer}</p>
                <p className={styles.detailText}>{achievement.details}</p>
                <p className={styles.location}>{achievement.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

