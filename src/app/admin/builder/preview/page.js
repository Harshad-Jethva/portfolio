"use client";

import { useEffect, useState } from "react";
import WidgetRenderer from "@/components/builder/WidgetRenderer";

export default function BuilderPreviewPage() {
  const [composition, setComposition] = useState(null);

  useEffect(() => {
    // Notify the parent builder shell that the preview frame is loaded and ready
    if (window.parent) {
      window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
    }

    const handleMessage = (event) => {
      if (event.data && event.data.type === "UPDATE_COMPOSITION") {
        setComposition(event.data.composition);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!composition) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", flexDirection: "column", gap: "1rem", color: "rgba(12, 12, 12, 0.4)" }}>
        <div style={{ width: "24px", height: "24px", border: "2px solid #ccc", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ fontSize: "0.9rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Connecting to Page Builder...</p>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const { page = {}, sections = [] } = composition;

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {sections.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", flexDirection: "column", border: "2px dashed rgba(12,12,12,0.1)", margin: "2rem", borderRadius: "1rem" }}>
          <p style={{ opacity: 0.5 }}>Empty Page. Drag or add a section from the widget library to get started.</p>
        </div>
      ) : (
        sections.map((sec, secIdx) => {
          if (sec.isHidden) return null;
          return (
            <section
              key={sec.id || `sec-${secIdx}`}
              id={`section-${sec.id}`}
              style={{
                position: "relative",
                border: "2px solid transparent",
                transition: "border 0.2s ease",
              }}
              className="builder-section"
            >
              {/* Widgets within the section */}
              {sec.widgets && sec.widgets.map((widget, widgetIdx) => (
                <div
                  key={widget.id || `widget-${widgetIdx}`}
                  id={`widget-${widget.id}`}
                  style={{ position: "relative" }}
                  className="builder-widget"
                >
                  <WidgetRenderer widget={widget} />
                </div>
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}
