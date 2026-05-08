"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import styles from "./ProjectModal.module.css";

const ProjectModal = ({ project, onClose }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (project) {
      // Entry animation
      document.body.style.overflow = "hidden";
      
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: "power2.out"
      })
      .to(contentRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power4.out"
      }, "-=0.2");
    } else {
      document.body.style.overflow = "unset";
    }
  }, [project]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "unset";
        onClose();
      }
    });

    tl.to(contentRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in"
    })
    .to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.in"
    }, "-=0.2");
  };

  if (!project) return null;

  return createPortal(
    <div ref={overlayRef} className={styles.modalOverlay} onClick={handleClose}>
      <div 
        ref={contentRef} 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className={styles.imgSection}>
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className={styles.projectImg} 
          />
        </div>

        <div className={styles.infoSection}>
          <div className={styles.header}>
            <span className={styles.year}>{project.year}</span>
            <h2 className={styles.title}>{project.title}</h2>
          </div>

          <div className={styles.techStack}>
            {project.tech?.split("-").map((t, i) => (
              <span key={i} className={styles.techItem}>{t.trim()}</span>
            ))}
          </div>

          <p className={styles.description}>{project.desc}</p>

          <div className={styles.actions}>
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.visitLink}
              >
                Visit Website
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
