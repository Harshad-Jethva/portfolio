"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_ACHIEVEMENTS } from "@/lib/portfolioData";
import styles from "./Achievements.module.css";

export default function Achievements() {
  const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS);

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

  const total = useMemo(() => achievements.length, [achievements.length]);

  return (
    <section id="awards" className={styles.awards}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>Awards Gallery</span>
          <h2 className={styles.title}>Achievements</h2>
          <p className={styles.subtitle}>
            A 3D rotating gallery of my milestones with complete achievement details.
          </p>
        </div>

        <div className={styles.scene}>
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

        <div className={styles.details}>
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

