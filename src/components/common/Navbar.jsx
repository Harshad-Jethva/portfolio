"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Skills",   href: "#skills"   },
  { label: "Awards",   href: "#awards"   },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact"  },
];

const socialLinks = [
  { label: "GitHub",   href: "https://github.com/harshadjethva", target: "_blank" },
  { label: "LinkedIn", href: "https://linkedin.com/in/", target: "_blank" },
];

export default function Navbar() {
  const navRef  = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth anchor click
  const handleClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      {/* Left — page links */}
      <ul className={styles.links}>
        {navLinks.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className={`interactive ${styles.link}`}
              onClick={(e) => handleClick(e, href)}
            >
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Center — logo */}
      <div className={styles.logo}>HJ</div>

      {/* Right — socials */}
      <ul className={`${styles.links} ${styles.right}`}>
        {socialLinks.map(({ label, href, target }) => (
          <li key={label}>
            <a
              href={href}
              target={target}
              rel="noreferrer"
              className={`interactive ${styles.link}`}
            >
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
