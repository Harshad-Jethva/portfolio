"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              HARSHAD JETHVA
            </Link>
            <p className={styles.tagline}>
              Crafting premium interactive digital experiences at the intersection of visual design and robust engineering.
            </p>
            <div className={styles.status}>
              <span className={styles.pulseDot} />
              Available for Freelance & Contracts
            </div>
          </div>

          {/* Sitemap Navigation */}
          <div>
            <h4 className={styles.colHead}>Sitemap</h4>
            <ul className={styles.linksList}>
              <li className={styles.linkItem}>
                <Link href="/">Home</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/about">About</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/skills">Skills</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/projects">Projects</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className={styles.colHead}>Socials</h4>
            <ul className={styles.linksList}>
              <li className={styles.linkItem}>
                <a href="https://github.com/harshadjethva" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                  Twitter / X
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className={styles.colHead}>Get In Touch</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <strong>Email</strong>
                <a href="mailto:harshadjethva@gmail.com">harshadjethva@gmail.com</a>
              </div>
              <div className={styles.contactItem}>
                <strong>Location</strong>
                Gujarat, India
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Harshad Jethva. All rights reserved.</span>
          <span>Classic & Professional Design</span>
        </div>
      </div>
    </footer>
  );
}
