"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { DEFAULT_PROJECTS } from "@/lib/portfolioData";
import ProjectModal from "@/components/common/ProjectModal";
import styles from "./Projects.module.css";

function ProjectRow({ project, onOpen }) {
  const rowRef = useRef(null);
  const imgRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.fromTo(
      rowRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: rowRef.current, start: "top 80%" },
      }
    );

    // Parallax scroll effect on project images
    const imgEl = imgRef.current?.querySelector("img");
    let parallax;
    if (imgEl) {
      parallax = gsap.fromTo(
        imgEl,
        { y: "-10%" },
        {
          y: "10%",
          ease: "none",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    return () => {
      animation.kill();
      if (parallax) parallax.kill();
    };
  }, []);

  const onEnter = () => {
    setHovered(true);
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.5, ease: "power2.out" });
  };

  const onLeave = () => {
    setHovered(false);
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
  };

  const openInNewTab = project.link?.startsWith("http");

  return (
    <article ref={rowRef} className={styles.row} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className={`${styles.imgWrap} cursor-view`} onClick={() => onOpen(project)}>
        <div ref={imgRef} className={styles.imgBg}>
          {project.imageUrl && (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className={styles.projectImg} 
            />
          )}
          <span className={styles.bgNum}>{project.index}</span>
          <div
            className={styles.viewBadge}
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.85)",
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            VIEW
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.infoTop}>
          <span className={styles.year}>{project.year}</span>
          <a
            href={project.link}
            className={`interactive ${styles.viewLink}`}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noreferrer" : undefined}
          >
            View Project
            <svg className={styles.arrow} width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 13L13 1M13 1H4M13 1V10"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <h3 className={`interactive ${styles.title}`} onClick={() => onOpen(project)} style={{ cursor: 'pointer' }}>
          {project.title}
        </h3>
        <p className={styles.tech}>{project.tech}</p>
        <p className={styles.desc}>{project.desc}</p>
      </div>
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (mounted && Array.isArray(data.items) && data.items.length > 0) {
          setProjects(data.items);
        }
      } catch {
        // Keep fallback defaults when API is unavailable.
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.fromTo(
      headRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section id="projects" className={styles.projects} ref={sectionRef}>
      <div className={styles.inner}>
        <div ref={headRef} className={styles.header}>
          <span className={styles.headerLabel}>Selected Works</span>
          <span className={styles.headerCount}>({projects.length})</span>
        </div>

        <div className={styles.list}>
          {projects.map((project) => (
            <ProjectRow 
              key={project.id ?? `${project.index}-${project.title}`} 
              project={project} 
              onOpen={setActiveProject}
            />
          ))}
        </div>
      </div>

      <ProjectModal 
        project={activeProject} 
        onClose={() => setActiveProject(null)} 
      />
    </section>
  );
}


