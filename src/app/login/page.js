"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, Github, Twitter } from "lucide-react";
import styles from "./login.module.css";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.scene}>
        {/* Left Side - Image Panel */}
        <section className={styles.leftSide}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/assets/user_photo.jpg" 
              alt="Admin Portfolio" 
              fill 
              priority
              className={styles.profileImg}
            />
            <div className={styles.imageOverlay}></div>
            <div className={styles.imageContent}>
              <h2>Master Your Portfolio.</h2>
              <p>Welcome back, Harshad. Your creative dashboard awaits your next masterpiece.</p>
            </div>
          </div>
        </section>

        {/* Right Side - Login Panel */}
        <section className={styles.rightSide}>
          <div className={styles.wrapper}>
            <header className={styles.header}>
              <ShieldCheck className={styles.logoIcon} />
              <h1 className={styles.brandName}>
                Admin<span>Pro</span>
              </h1>
              <p className={styles.tagline}>Secure Gateway to your Portfolio Control Panel</p>
            </header>

            <form onSubmit={handleLogin} className={styles.form}>
              {error && <div className={styles.errorAlert}>{error}</div>}

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Username</label>
                <div className={styles.inputWrap}>
                  <User className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrap}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.spinner}></div>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight className={styles.btnArrow} />
                  </>
                )}
              </button>
            </form>

            <footer className={styles.footer}>
              <p>Authorized personnel only. <span>Need help?</span></p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
