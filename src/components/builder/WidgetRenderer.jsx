"use client";

import { useEffect, useState } from "react";

export default function WidgetRenderer({ widget }) {
  const { id, type, content = {}, style = {}, visibility = {} } = widget;

  const isPreviewPath = typeof window !== "undefined" && window.location.pathname.includes("/admin/builder/preview");

  const isHidden = visibility.hidden;
  const isDesktopRestricted = visibility.desktopOnly && typeof window !== "undefined" && window.innerWidth < 768;
  const isMobileRestricted = visibility.mobileOnly && typeof window !== "undefined" && window.innerWidth >= 768;
  const isRestricted = isHidden || isDesktopRestricted || isMobileRestricted;

  // Schedule check (Phase 8)
  const isScheduledOut = (() => {
    if (isPreviewPath) return false; // Show in builder regardless of schedule
    if (visibility.scheduleStart) {
      const start = new Date(visibility.scheduleStart).getTime();
      if (Date.now() < start) return true;
    }
    if (visibility.scheduleEnd) {
      const end = new Date(visibility.scheduleEnd).getTime();
      if (Date.now() > end) return true;
    }
    return false;
  })();

  if ((isRestricted || isScheduledOut) && !isPreviewPath) return null;

  // Breakpoint style helper (Phase 10)
  const getStyle = (key, fallback = "") => {
    if (typeof window === "undefined") return style[key] || fallback;
    const width = window.innerWidth;
    const device = width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";

    if (style[device] && style[device][key] !== undefined && style[device][key] !== "") {
      return style[device][key];
    }
    return style[key] !== undefined && style[key] !== "" ? style[key] : fallback;
  };

  const containerStyle = {
    paddingTop: getStyle("paddingTop", "2rem"),
    paddingBottom: getStyle("paddingBottom", "2rem"),
    paddingLeft: getStyle("paddingLeft", "5%"),
    paddingRight: getStyle("paddingRight", "5%"),
    marginTop: getStyle("marginTop", "0"),
    marginBottom: getStyle("marginBottom", "0"),
    backgroundColor: getStyle("backgroundColor", "transparent"),
    backgroundImage: getStyle("gradient") 
      ? `linear-gradient(${getStyle("gradientAngle", "135deg")}, ${getStyle("gradientStart", "#ffffff")}, ${getStyle("gradientEnd", "#000000")})` 
      : "none",
    color: getStyle("textColor", "inherit"),
    textAlign: getStyle("textAlign", "left"),
    borderRadius: getStyle("borderRadius", "0"),
    border: isRestricted ? "2px dashed #f43f5e" : getStyle("border", "none"),
    opacity: isRestricted ? 0.55 : 1,
    position: "relative",
    fontFamily: getStyle("fontFamily", "var(--font-inter), sans-serif"),
    transition: "all 0.3s ease",
  };

  // Inline editable text wrapper (Phase 7)
  const InlineEditable = ({ tag: Tag = "span", contentKey, defaultValue, style: inlineStyle }) => {
    if (!isPreviewPath) {
      return <Tag style={inlineStyle} dangerouslySetInnerHTML={{ __html: defaultValue }} />;
    }
    return (
      <Tag
        style={{ ...inlineStyle, outline: "none", border: "1px dashed rgba(59,130,246,0.35)", minWidth: "20px", display: Tag === "div" ? "block" : "inline-block" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const val = e.target.innerHTML;
          window.parent.postMessage({
            type: "INLINE_EDIT",
            widgetId: id,
            contentKey,
            value: val
          }, "*");
        }}
        dangerouslySetInnerHTML={{ __html: defaultValue }}
      />
    );
  };

  const indicatorBadge = isRestricted && isPreviewPath ? (
    <div style={{
      position: "absolute",
      top: "0.5rem",
      right: "0.5rem",
      background: "#f43f5e",
      color: "white",
      padding: "0.25rem 0.6rem",
      fontSize: "0.65rem",
      fontWeight: "700",
      borderRadius: "4px",
      zIndex: 99,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      pointerEvents: "none"
    }}>
      {isHidden ? "Hidden" : isDesktopRestricted ? "Desktop Only" : "Mobile Only"}
    </div>
  ) : null;

  const renderWidget = () => {
    switch (type) {
      case "heading":
        return (
          <InlineEditable 
            tag={content.level || "h2"} 
            contentKey="text" 
            defaultValue={content.text || "Heading Title"} 
            style={{ fontSize: getStyle("fontSize", "2rem"), fontWeight: getStyle("fontWeight", "700"), fontFamily: "var(--font-bricolage), sans-serif" }} 
          />
        );

      case "paragraph":
        return (
          <InlineEditable 
            tag="p" 
            contentKey="text" 
            defaultValue={content.text || "This is a paragraph text block."} 
            style={{ fontSize: getStyle("fontSize", "1rem"), lineHeight: "1.7", opacity: 0.9 }} 
          />
        );

      case "divider":
        return (
          <hr style={{ border: "none", borderTop: `${getStyle("borderWidth", "1px")} ${getStyle("borderStyle", "solid")} ${getStyle("borderColor", "rgba(0,0,0,0.1)")}` }} />
        );

      case "spacer":
        return (
          <div style={{ height: getStyle("height", "2rem") }} />
        );

      case "image":
        return (
          <div style={{ display: "flex", justifyContent: getStyle("textAlign", "center") }}>
            <img 
              src={content.url || "https://images.unsplash.com/photo-1507238691740-197a5714a947?w=600"} 
              alt={content.alt || ""} 
              loading="lazy"
              style={{ maxWidth: "100%", height: "auto", borderRadius: getStyle("borderRadius", "8px"), boxShadow: getStyle("boxShadow", "none") }} 
            />
          </div>
        );

      case "hero":
        return (
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.2em", color: "#3b82f6", marginBottom: "1rem", display: "block" }}>
              <InlineEditable contentKey="tagline" defaultValue={content.tagline || "WELCOME"} />
            </span>
            <h1 style={{ fontSize: getStyle("titleSize", "clamp(2.5rem, 6vw, 4.5rem)"), fontWeight: "800", lineHeight: "1.1", marginBottom: "1.5rem", fontFamily: "var(--font-bricolage), sans-serif" }}>
              <InlineEditable contentKey="title" defaultValue={content.title || "Crafting Digital Art"} />
            </h1>
            <div style={{ fontSize: getStyle("subtitleSize", "1.25rem"), opacity: 0.8, maxWidth: "600px", marginBottom: "2rem" }}>
              <InlineEditable tag="div" contentKey="subtitle" defaultValue={content.subtitle || "Modern design and engineering."} />
            </div>
            {content.showCta && (
              <a href={content.ctaLink || "#"} style={{ display: "inline-block", background: "#0c0c0c", color: "white", padding: "1rem 2.5rem", borderRadius: "2rem", fontWeight: "600", textDecoration: "none" }}>
                <InlineEditable contentKey="ctaText" defaultValue={content.ctaText || "Get In Touch"} />
              </a>
            )}
          </div>
        );

      case "text":
        return (
          <div style={{ maxWidth: "800px", margin: getStyle("textAlign") === "center" ? "0 auto" : "0" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>
              <InlineEditable contentKey="header" defaultValue={content.header || "About Section"} />
            </h2>
            <div style={{ fontSize: "1rem", lineHeight: "1.8", opacity: 0.9 }}>
              <InlineEditable tag="div" contentKey="body" defaultValue={content.body || "Content body details..."} />
            </div>
          </div>
        );

      case "pricing":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            {(content.plans || [
              { name: "Starter", price: "$29", desc: "For single creators.", features: ["1 Portfolio Site", "Basic Templates", "Email Support"] },
              { name: "Pro", price: "$79", desc: "Best for teams.", features: ["3 Portfolios", "Premium Animations", "24/7 Support"] }
            ]).map((plan, idx) => (
              <div key={idx} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "1rem", padding: "2.5rem", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>{plan.name}</h3>
                <h4 style={{ fontSize: "2.5rem", fontWeight: "800", margin: "1rem 0" }}>{plan.price}</h4>
                <p style={{ opacity: 0.7, fontSize: "0.9rem", marginBottom: "1.5rem" }}>{plan.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem", textAlign: "left", fontSize: "0.9rem" }}>
                  {plan.features.map((f, i) => <li key={i} style={{ padding: "0.4rem 0" }}>✓ {f}</li>)}
                </ul>
                <button style={{ width: "100%", padding: "0.8rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "600" }}>Choose Plan</button>
              </div>
            ))}
          </div>
        );

      case "testimonials":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            {(content.items || [
              { quote: "Outstanding craft! High visual animations combined with clean code.", author: "Sarah Jenkins, CTO at VibeTech" },
              { quote: "Our site feels premium and alive. High responsiveness and SEO ranking.", author: "Michael Chang, Founder SpacesByKd" }
            ]).map((t, idx) => (
              <div key={idx} style={{ border: "1px solid rgba(0,0,0,0.05)", background: "rgba(255,255,255,0.02)", padding: "2rem", borderRadius: "1rem" }}>
                <p style={{ fontStyle: "italic", fontSize: "1.1rem", marginBottom: "1.25rem", lineHeight: "1.6" }}>"{t.quote}"</p>
                <h5 style={{ fontWeight: "700", color: "#3b82f6" }}>— {t.author}</h5>
              </div>
            ))}
          </div>
        );

      case "statistics":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
            {(content.metrics || [
              { label: "Completed Projects", value: "80+" },
              { label: "Client Satisfaction", value: "99%" },
              { label: "Years Experience", value: "4+" }
            ]).map((stat, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: "3rem", fontWeight: "800", color: "#3b82f6" }}>{stat.value}</h3>
                <p style={{ opacity: 0.7, fontSize: "0.95rem", fontWeight: "500", marginTop: "0.5rem" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        );

      case "timeline":
        return (
          <div style={{ maxWidth: "800px", margin: "0 auto", borderLeft: "2px solid #e2e8f0", paddingLeft: "2rem" }}>
            {(content.steps || [
              { year: "2024 - Present", title: "Senior Interactive Engineer", desc: "Building modular dynamic systems with Next.js." },
              { year: "2022 - 2024", title: "Creative Web Developer", desc: "Refactoring web applications and WebGL/Threejs cards." }
            ]).map((step, idx) => (
              <div key={idx} style={{ position: "relative", marginBottom: "2.5rem" }}>
                <div style={{ position: "absolute", left: "-2.6rem", top: "0.2rem", width: "16px", height: "16px", borderRadius: "50%", background: "#3b82f6", border: "4px solid white" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#3b82f6" }}>{step.year}</span>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700", margin: "0.3rem 0" }}>{step.title}</h4>
                <p style={{ opacity: 0.7, fontSize: "0.95rem", lineHeight: "1.5" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        );

      case "faq":
        return (
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {(content.questions || [
              { q: "What stack do you use?", a: "React, Next.js, Postgres, Node.js, GSAP, and WebGL." },
              { q: "Can you design from scratch?", a: "Yes, I create wireframes and high-fidelity mockups in Canva or Figma." }
            ]).map((faq, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "1rem" }}>
                <h4 style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{faq.q}</h4>
                <p style={{ opacity: 0.7, fontSize: "0.95rem", lineHeight: "1.6" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        );

      case "html":
        return (
          <div dangerouslySetInnerHTML={{ __html: content.code || "<p>Render custom HTML here...</p>" }} />
        );

      case "form":
        return (
          <form style={{ maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={(e) => e.preventDefault()}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Name</label>
              <input type="text" style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Email</label>
              <input type="email" style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Message</label>
              <textarea rows={4} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }} />
            </div>
            <button type="submit" style={{ padding: "0.8rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Send Message</button>
          </form>
        );

      case "project-grid":
        return (
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {content.title && <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>{content.title}</h2>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {(content.projects || []).map((proj, idx) => (
                <div key={idx} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "1rem", padding: "1.5rem" }}>
                  {proj.imageUrl && <img src={proj.imageUrl} alt={proj.title} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "1rem" }} />}
                  <span style={{ fontSize: "0.8rem", color: "#3b82f6", fontWeight: "600" }}>{proj.tech}</span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "700", margin: "0.5rem 0" }}>{proj.title}</h3>
                  <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>{proj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "skills-list":
        return (
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {content.title && <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>{content.title}</h2>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
              {(content.groups || []).map((group, idx) => (
                <div key={idx}>
                  <h4 style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "1rem", color: "#3b82f6" }}>{group.cat}</h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {group.items.map((item, i) => (
                      <li key={i} style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case "service-grid":
        return (
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {content.title && <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>{content.title}</h2>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
              {(content.services || []).map((srv, idx) => (
                <div key={idx} style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "1rem", padding: "2rem" }}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.75rem" }}>{srv.title}</h4>
                  <p style={{ opacity: 0.7, fontSize: "0.95rem", lineHeight: "1.6" }}>{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div style={{ padding: "2rem", border: "1px dashed #ccc", textAlign: "center" }}>
            Widget: <strong>{type.toUpperCase()}</strong>
          </div>
        );
    }
  };

  return (
    <div style={containerStyle}>
      {indicatorBadge}
      {renderWidget()}
    </div>
  );
}
