"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Home",     href: "/"         },
  { label: "About",    href: "/about"    },
  { label: "Skills",   href: "/skills"   },
  { label: "Projects", href: "/projects" },
  { label: "Contact",  href: "/contact"  },
];

const socialLinks = [
  { label: "GitHub",   href: "https://github.com/harshadjethva", target: "_blank" },
  { label: "LinkedIn", href: "https://linkedin.com/in/", target: "_blank" },
];

export default function Navbar() {
  const navRef  = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      {/* Left — page links */}
      <ul className={styles.links}>
        {navLinks.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`interactive ${styles.link} ${isActive ? styles.active : ""}`}
              >
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Center — logo */}
      <Link href="/" className={styles.logo}>HJ</Link>

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

