"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const dotRef      = useRef(null);
  const ringRef     = useRef(null);
  const textRef     = useRef(null);
  const posRef      = useRef({ x: -100, y: -100 });
  const ringPos     = useRef({ x: -100, y: -100 });
  const rafRef      = useRef(null);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Mouse move — dot snaps instantly
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);

    // Ring lerp loop
    const loop = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12;
      gsap.set(ring, { x: ringPos.current.x, y: ringPos.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    // ── Hover effects ──────────────────────────────────────────
    const onLinkEnter = () => {
      gsap.to(ring, { scale: 1.8, borderColor: "#ffffff", duration: 0.35, ease: "power2.out" });
      gsap.to(dot,  { scale: 0, duration: 0.2 });
    };
    const onLinkLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: "#ffffff", duration: 0.35, ease: "power2.out" });
      gsap.to(dot,  { scale: 1, duration: 0.2 });
    };

    // "VIEW" mode — project image hover
    const onViewEnter = (e) => {
      setCursorText("VIEW");
      gsap.to(ring, { scale: 3.5, background: "#ffffff", borderColor: "transparent", duration: 0.4, ease: "power2.out" });
      gsap.to(dot,  { scale: 0, duration: 0.2 });
    };
    const onViewLeave = () => {
      setCursorText("");
      gsap.to(ring, { scale: 1, background: "transparent", borderColor: "#ffffff", duration: 0.4, ease: "power2.out" });
      gsap.to(dot,  { scale: 1, duration: 0.2 });
    };

    const attachListeners = () => {
      document.querySelectorAll("a, button, .interactive").forEach(el => {
        el.addEventListener("mouseenter", onLinkEnter);
        el.addEventListener("mouseleave", onLinkLeave);
      });
      document.querySelectorAll(".cursor-view").forEach(el => {
        el.addEventListener("mouseenter", onViewEnter);
        el.addEventListener("mouseleave", onViewLeave);
      });
    };

    attachListeners();

    // Re-attach after dynamic renders
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className={styles.dot}  aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true">
        {cursorText && (
          <span ref={textRef} className={styles.cursorText}>{cursorText}</span>
        )}
      </div>
    </>
  );
}
