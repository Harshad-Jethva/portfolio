"use client";

import { useEffect, useState } from "react";
import { Palette, Save, RefreshCw } from "lucide-react";

export default function ThemeBuilderPage() {
  const [theme, setTheme] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#6366f1",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    fontFamily: "var(--font-inter), sans-serif",
    darkMode: false,
    borderRadius: "8px",
    buttonPadding: "0.8rem 2rem"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchThemeSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.theme_variables) {
          setTheme(data.theme_variables);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme_variables: theme
        })
      });
      if (res.ok) {
        alert("Global theme settings saved successfully!");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
        <p>Loading theme builder configuration...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <header className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1>Global Theme Builder</h1>
          <p>Configure typography, design structures, buttons, and colors applied across the entire website.</p>
        </div>

        <button onClick={handleSave} className="btn-premium" style={{ background: "#0c0c0c", color: "white" }} disabled={saving}>
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          Save Theme
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem", background: "white", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        
        {/* Colors Section */}
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#3b82f6" }}>
            <Palette size={18} /> Color Tokens
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Primary Accent Color</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="color" value={theme.primaryColor} onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })} style={{ border: "none", width: "40px", height: "40px", cursor: "pointer" }} />
                <input className="admin-input" type="text" value={theme.primaryColor} onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Secondary Accent Color</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="color" value={theme.secondaryColor} onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })} style={{ border: "none", width: "40px", height: "40px", cursor: "pointer" }} />
                <input className="admin-input" type="text" value={theme.secondaryColor} onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Global Background</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="color" value={theme.backgroundColor} onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })} style={{ border: "none", width: "40px", height: "40px", cursor: "pointer" }} />
                <input className="admin-input" type="text" value={theme.backgroundColor} onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Global Body Text</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="color" value={theme.textColor} onChange={(e) => setTheme({ ...theme, textColor: e.target.value })} style={{ border: "none", width: "40px", height: "40px", cursor: "pointer" }} />
                <input className="admin-input" type="text" value={theme.textColor} onChange={(e) => setTheme({ ...theme, textColor: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Layout & Typography */}
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#3b82f6" }}>
            <Palette size={18} /> Layout & Typography
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Font Family</label>
              <select className="admin-input" value={theme.fontFamily} onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}>
                <option value="var(--font-inter), sans-serif">Inter (Modern & Neutral)</option>
                <option value="var(--font-bricolage), sans-serif">Bricolage Grotesque (Bold & Editorial)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Border Radius (e.g. 8px, 1rem)</label>
              <input className="admin-input" type="text" value={theme.borderRadius} onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Default Button Padding</label>
              <input className="admin-input" type="text" value={theme.buttonPadding} onChange={(e) => setTheme({ ...theme, buttonPadding: e.target.value })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
              <input type="checkbox" id="darkModeToggle" checked={theme.darkMode} onChange={(e) => setTheme({ ...theme, darkMode: e.target.checked })} />
              <label htmlFor="darkModeToggle" style={{ fontSize: "0.85rem", fontWeight: "700" }}>Enable Dark Mode Default Theme</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
