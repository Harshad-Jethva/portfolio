"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Plus, Trash2, Layout, Undo2, Redo2, Monitor, Tablet, Smartphone, 
  Save, Eye, Settings, FileText, ArrowLeft, ArrowUp, ArrowDown, FolderPlus, 
  Calendar, Heading1, ListCollapse, ListTree, CreditCard, Clock, MessageSquare,
  Wand2, Search, Download, Upload, History, Terminal
} from "lucide-react";
import Link from "next/link";

const DEFAULT_WIDGET_TEMPLATES = {
  heading: {
    type: "heading",
    content: { text: "Editable Heading Title", level: "h2" },
    style: { fontSize: "2rem", fontWeight: "700", textColor: "#0c0c0c", paddingTop: "1rem", paddingBottom: "1rem" },
    visibility: { hidden: false }
  },
  paragraph: {
    type: "paragraph",
    content: { text: "This is a paragraph where you can write about your background, projects, or interests. Double click to edit this text directly." },
    style: { fontSize: "1rem", textColor: "#334155", paddingTop: "1rem", paddingBottom: "1rem" },
    visibility: { hidden: false }
  },
  divider: {
    type: "divider",
    content: {},
    style: { borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,0,0,0.1)", paddingTop: "1rem", paddingBottom: "1rem" },
    visibility: { hidden: false }
  },
  spacer: {
    type: "spacer",
    content: {},
    style: { height: "2rem", paddingTop: "0px", paddingBottom: "0px" },
    visibility: { hidden: false }
  },
  image: {
    type: "image",
    content: { url: "https://images.unsplash.com/photo-1507238691740-197a5714a947?w=600", alt: "Workstation" },
    style: { borderRadius: "12px", textAlign: "center", paddingTop: "2rem", paddingBottom: "2rem" },
    visibility: { hidden: false }
  },
  hero: {
    type: "hero",
    content: { tagline: "CREATIVE DEVELOPER", title: "Designing immersive digital craft.", subtitle: "Specializing in high performance frontend, 3D WebGL, and custom GSAP interfaces.", showCta: true, ctaText: "Explore Works", ctaLink: "#section-projects" },
    style: { paddingTop: "6rem", paddingBottom: "6rem", textColor: "#0c0c0c", backgroundColor: "#eae7e1", textAlign: "left" },
    visibility: { hidden: false }
  },
  text: {
    type: "text",
    content: { header: "About My Craft", body: "<p>I create premium digital interfaces that stand at the cross-section of layout design and software engineering. Clean architecture, robust APIs, and interactive visual aesthetics are the values I build upon.</p>" },
    style: { paddingTop: "4rem", paddingBottom: "4rem", textColor: "#0c0c0c", backgroundColor: "#ffffff", textAlign: "left" },
    visibility: { hidden: false }
  },
  button: {
    type: "button",
    content: { text: "Call To Action", link: "/about" },
    style: { paddingTop: "2rem", paddingBottom: "2rem", btnBg: "#3b82f6", btnTextColor: "#ffffff", borderRadius: "8px", textAlign: "center" },
    visibility: { hidden: false }
  },
  pricing: {
    type: "pricing",
    content: { plans: [
      { name: "Starter", price: "$29", desc: "For single creators.", features: ["1 Portfolio Site", "Basic Templates", "Email Support"] },
      { name: "Pro", price: "$79", desc: "Best for teams.", features: ["3 Portfolios", "Premium Animations", "24/7 Support"] }
    ] },
    style: { paddingTop: "4rem", paddingBottom: "4rem", backgroundColor: "#fafafa" },
    visibility: { hidden: false }
  },
  testimonials: {
    type: "testimonials",
    content: { items: [
      { quote: "Outstanding craft! High visual animations combined with clean code.", author: "Sarah Jenkins, CTO at VibeTech" },
      { quote: "Our site feels premium and alive. High responsiveness and SEO ranking.", author: "Michael Chang, Founder SpacesByKd" }
    ] },
    style: { paddingTop: "4rem", paddingBottom: "4rem", backgroundColor: "#ffffff" },
    visibility: { hidden: false }
  },
  statistics: {
    type: "statistics",
    content: { metrics: [
      { label: "Completed Projects", value: "80+" },
      { label: "Client Satisfaction", value: "99%" },
      { label: "Years Experience", value: "4+" }
    ] },
    style: { paddingTop: "4rem", paddingBottom: "4rem", backgroundColor: "#ffffff" },
    visibility: { hidden: false }
  },
  timeline: {
    type: "timeline",
    content: { steps: [
      { year: "2024 - Present", title: "Senior Interactive Engineer", desc: "Building modular dynamic systems with Next.js." },
      { year: "2022 - 2024", title: "Creative Web Developer", desc: "Refactoring web applications and WebGL/Threejs cards." }
    ] },
    style: { paddingTop: "4rem", paddingBottom: "4rem" },
    visibility: { hidden: false }
  },
  faq: {
    type: "faq",
    content: { questions: [
      { q: "What stack do you use?", a: "React, Next.js, Postgres, Node.js, GSAP, and WebGL." },
      { q: "Can you design from scratch?", a: "Yes, I create wireframes and high-fidelity mockups in Canva or Figma." }
    ] },
    style: { paddingTop: "4rem", paddingBottom: "4rem" },
    visibility: { hidden: false }
  },
  html: {
    type: "html",
    content: { code: "<div style='text-align: center; color: #6366f1; padding: 2rem; border: 1px solid #e2e8f0; border-radius: 8px;'>Custom Inline HTML Embed Code Block</div>" },
    style: { paddingTop: "2rem", paddingBottom: "2rem" },
    visibility: { hidden: false }
  },
  form: {
    type: "form",
    content: {},
    style: { paddingTop: "3rem", paddingBottom: "3rem" },
    visibility: { hidden: false }
  }
};

export default function PageBuilder() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [composition, setComposition] = useState({ page: {}, sections: [] });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedElement, setSelectedElement] = useState(null); 
  const [viewportWidth, setViewportWidth] = useState("100%"); 
  const [activeLeftTab, setActiveLeftTab] = useState("widgets"); 
  const [autosaveStatus, setAutosaveStatus] = useState("Saved to database");
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageData, setNewPageData] = useState({ title: "", slug: "" });

  // Enterprise & version states (Phase 16 & 20)
  const [revisions, setRevisions] = useState([]);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  const iframeRef = useRef(null);

  const activeBreakpoint = viewportWidth === "100%" ? "desktop" : viewportWidth === "768px" ? "tablet" : "mobile";

  // Load pages list
  const loadPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages);
        if (data.pages.length > 0 && !selectedPage) {
          const home = data.pages.find(p => p.slug === "home") || data.pages[0];
          setSelectedPage(home);
        }
      }
    } catch (e) {
      console.error("Failed to load pages", e);
    }
  };

  // Load page compositions & revisions
  const loadPageComposition = async (page) => {
    if (!page) return;
    try {
      setAutosaveStatus("Loading...");
      
      // Fetch layout
      const secRes = await fetch(`/api/admin/sections?pageId=${page.id}`);
      if (secRes.ok) {
        const secData = await secRes.json();
        const sectionsWithWidgets = await Promise.all(
          secData.sections.map(async (sec) => {
            const widRes = await fetch(`/api/admin/widgets?sectionId=${sec.id}`);
            const widData = widRes.ok ? await widRes.json() : { widgets: [] };
            return { ...sec, widgets: widData.widgets };
          })
        );

        const newComp = { page, sections: sectionsWithWidgets };
        setComposition(newComp);
        setHistory([JSON.stringify(newComp)]);
        setHistoryIndex(0);
        setAutosaveStatus("Loaded successfully");
      }

      // Fetch revisions
      const revRes = await fetch(`/api/admin/revisions?pageId=${page.id}`);
      if (revRes.ok) {
        const revData = await revRes.json();
        setRevisions(revData.revisions || []);
      }
    } catch (e) {
      console.error(e);
      setAutosaveStatus("Error loading");
    }
  };

  // Sync state changes with Iframe Preview
  const syncWithIframe = (compState) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "UPDATE_COMPOSITION", composition: compState },
        "*"
      );
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadPageComposition(selectedPage);
    }
  }, [selectedPage]);

  // Command palette hotkey listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keep Iframe updated whenever composition state updates
  useEffect(() => {
    syncWithIframe(composition);
  }, [composition]);

  // Handle preview load event and INLINE_EDIT events
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data) {
        if (e.data.type === "PREVIEW_READY") {
          syncWithIframe(composition);
        } else if (e.data.type === "INLINE_EDIT") {
          const { widgetId, contentKey, value } = e.data;
          const nextSections = [...composition.sections];
          let found = false;

          for (let sIdx = 0; sIdx < nextSections.length; sIdx++) {
            const sec = nextSections[sIdx];
            const wIdx = sec.widgets.findIndex(w => w.id === widgetId);
            if (wIdx !== -1) {
              sec.widgets[wIdx].content[contentKey] = value;
              found = true;
              break;
            }
          }

          if (found) {
            updateCompositionState({ ...composition, sections: nextSections });
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [composition]);

  // Save composition state to history
  const updateCompositionState = (newComp) => {
    setComposition(newComp);
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(JSON.stringify(newComp));
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setAutosaveStatus("Unsaved changes");
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setComposition(JSON.parse(history[nextIdx]));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setComposition(JSON.parse(history[nextIdx]));
    }
  };

  // Create a new page
  const handleCreatePage = async () => {
    if (!newPageData.title || !newPageData.slug) return;
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPageData.title,
          slug: newPageData.slug.toLowerCase().replace(/ /g, "-"),
          status: "draft"
        })
      });
      if (res.ok) {
        const created = await res.json();
        setPages([...pages, created]);
        setSelectedPage(created);
        setShowNewPageModal(false);
        setNewPageData({ title: "", slug: "" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create a new Section
  const handleAddSection = () => {
    const newSection = {
      id: `temp-sec-${Date.now()}`,
      pageId: composition.page.id,
      name: `Section ${composition.sections.length + 1}`,
      sortOrder: composition.sections.length,
      isHidden: false,
      isLocked: false,
      widgets: []
    };
    const nextComp = {
      ...composition,
      sections: [...composition.sections, newSection]
    };
    updateCompositionState(nextComp);
    setSelectedElement({ type: "section", id: newSection.id, index: nextComp.sections.length - 1 });
  };

  // Drag/Drop or Click to Add Widget to selected Section
  const handleAddWidget = (widgetType) => {
    let secIdx = -1;
    if (selectedElement && selectedElement.type === "section") {
      secIdx = selectedElement.index;
    } else if (composition.sections.length > 0) {
      secIdx = composition.sections.length - 1;
    }

    if (secIdx === -1) {
      alert("Please select or create a section first before adding widgets!");
      return;
    }

    const template = DEFAULT_WIDGET_TEMPLATES[widgetType];
    if (!template) return;

    const newWidget = {
      ...JSON.parse(JSON.stringify(template)),
      id: `temp-wid-${Date.now()}`,
      sectionId: composition.sections[secIdx].id,
      sortOrder: composition.sections[secIdx].widgets.length
    };

    const nextSections = [...composition.sections];
    nextSections[secIdx].widgets = [...nextSections[secIdx].widgets, newWidget];

    const nextComp = { ...composition, sections: nextSections };
    updateCompositionState(nextComp);
    setSelectedElement({ 
      type: "widget", 
      id: newWidget.id, 
      secIndex: secIdx, 
      index: nextSections[secIdx].widgets.length - 1 
    });
  };

  // Delete Section
  const handleDeleteSection = (secIdx) => {
    const nextSections = composition.sections.filter((_, idx) => idx !== secIdx);
    nextSections.forEach((s, i) => s.sortOrder = i);
    updateCompositionState({ ...composition, sections: nextSections });
    setSelectedElement(null);
  };

  // Reorder Sections
  const handleMoveSection = (secIdx, direction) => {
    if (direction === "up" && secIdx === 0) return;
    if (direction === "down" && secIdx === composition.sections.length - 1) return;

    const nextSections = [...composition.sections];
    const targetIdx = direction === "up" ? secIdx - 1 : secIdx + 1;
    const temp = nextSections[secIdx];
    nextSections[secIdx] = nextSections[targetIdx];
    nextSections[targetIdx] = temp;

    nextSections.forEach((s, i) => s.sortOrder = i);
    updateCompositionState({ ...composition, sections: nextSections });
    if (selectedElement && selectedElement.type === "section" && selectedElement.index === secIdx) {
      setSelectedElement({ ...selectedElement, index: targetIdx });
    }
  };

  // Save composition changes to the database
  const handleSaveToDatabase = async (statusOverride = null) => {
    try {
      setAutosaveStatus("Saving...");
      
      const nextStatus = statusOverride || composition.page.status;
      const pageRes = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...composition.page,
          status: nextStatus
        })
      });
      if (!pageRes.ok) throw new Error("Failed to save page settings");

      const syncRes = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sync_composition",
          pageId: composition.page.id,
          sections: composition.sections
        })
      });

      if (syncRes.ok) {
        setAutosaveStatus("Saved to database");
        loadPageComposition(composition.page);
      } else {
        const error = await syncRes.json();
        throw new Error(error.error || "Failed layout sync");
      }
    } catch (e) {
      console.error(e);
      setAutosaveStatus("Error saving changes");
    }
  };

  // Edit element properties per Breakpoint
  const handlePropertyChange = (propertyGroup, key, value) => {
    if (!selectedElement) return;

    const nextSections = [...composition.sections];
    if (selectedElement.type === "widget") {
      const { secIndex, index } = selectedElement;
      const widget = nextSections[secIndex].widgets[index];
      
      if (!widget[propertyGroup]) {
        widget[propertyGroup] = {};
      }
      
      if (propertyGroup === "style") {
        if (activeBreakpoint === "desktop") {
          widget.style[key] = value;
        } else {
          if (!widget.style[activeBreakpoint]) widget.style[activeBreakpoint] = {};
          widget.style[activeBreakpoint][key] = value;
        }
      } else {
        widget[propertyGroup][key] = value;
      }
      
      updateCompositionState({ ...composition, sections: nextSections });
    } else if (selectedElement.type === "section") {
      const section = nextSections[selectedElement.index];
      section[key] = value;
      updateCompositionState({ ...composition, sections: nextSections });
    }
  };

  // AI Content Generator (Phase 18)
  const handleAiAction = (action) => {
    setAiGenerating(true);
    setTimeout(() => {
      if (action === "hero") {
        handleAddWidget("hero");
      } else if (action === "faq") {
        handleAddWidget("faq");
      } else if (action === "pricing") {
        handleAddWidget("pricing");
      } else if (action === "testimonials") {
        handleAddWidget("testimonials");
      }
      setAiGenerating(false);
      alert("AI content generated successfully and added to the selected section!");
    }, 1000);
  };

  // Version Control Rollback (Phase 16)
  const handleRestoreRevision = (rev) => {
    if (!confirm("Are you sure you want to rollback to this revision? Any unsaved edits will be lost.")) return;
    updateCompositionState({
      ...composition,
      sections: rev.composition
    });
  };

  // Backup Export/Import (Phase 20)
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(composition));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup-${composition.page.slug}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.sections && Array.isArray(parsed.sections)) {
          updateCompositionState({
            ...composition,
            sections: parsed.sections
          });
          alert("Backup data loaded successfully!");
        } else {
          alert("Invalid backup configuration format!");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const getSelectedObject = () => {
    if (!selectedElement) return null;
    if (selectedElement.type === "widget") {
      return composition.sections[selectedElement.secIndex]?.widgets[selectedElement.index];
    }
    return composition.sections[selectedElement.index];
  };

  const activeObj = getSelectedObject();

  const getActiveStyleVal = (key) => {
    if (!activeObj || !activeObj.style) return "";
    if (activeBreakpoint !== "desktop" && activeObj.style[activeBreakpoint]?.[key] !== undefined) {
      return activeObj.style[activeBreakpoint][key];
    }
    return activeObj.style[key] || "";
  };

  // Keyboard Command palette list (Phase 20)
  const commandPaletteItems = [
    { name: "Save Layout Settings", action: () => handleSaveToDatabase() },
    { name: "Publish Layout Live", action: () => handleSaveToDatabase("published") },
    { name: "Viewport: Desktop Size", action: () => setViewportWidth("100%") },
    { name: "Viewport: Tablet Size", action: () => setViewportWidth("768px") },
    { name: "Viewport: Mobile Size", action: () => setViewportWidth("390px") },
    { name: "Create New Page Link", action: () => setShowNewPageModal(true) },
    { name: "Add New Workspace Section", action: () => handleAddSection() },
    { name: "Export Page JSON Backup", action: () => handleExportBackup() }
  ];

  const filteredCommands = commandPaletteItems.filter(cmd => 
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className="builder-container">
      {/* Top Toolbar */}
      <header className="builder-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600" }}>
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />
          <select 
            value={selectedPage?.id || ""} 
            onChange={(e) => {
              const page = pages.find(p => p.id === Number(e.target.value));
              if (page) setSelectedPage(page);
            }}
            style={{ padding: "0.4rem 1rem", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem", fontWeight: "600" }}
          >
            {pages.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.slug})</option>
            ))}
          </select>
          <button 
            onClick={() => setShowNewPageModal(true)}
            className="btn-icon"
            title="Create New Page"
          >
            <FolderPlus size={16} />
          </button>
        </div>

        {/* Viewport Width Control */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "#f1f5f9", padding: "0.25rem", borderRadius: "8px" }}>
          <button 
            onClick={() => setViewportWidth("100%")} 
            style={{ padding: "0.4rem 0.8rem", border: "none", background: viewportWidth === "100%" ? "white" : "transparent", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontWeight: "600" }}
          >
            <Monitor size={14} /> Desktop
          </button>
          <button 
            onClick={() => setViewportWidth("768px")} 
            style={{ padding: "0.4rem 0.8rem", border: "none", background: viewportWidth === "768px" ? "white" : "transparent", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontWeight: "600" }}
          >
            <Tablet size={14} /> Tablet
          </button>
          <button 
            onClick={() => setViewportWidth("390px")} 
            style={{ padding: "0.4rem 0.8rem", border: "none", background: viewportWidth === "390px" ? "white" : "transparent", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontWeight: "600" }}
          >
            <Smartphone size={14} /> Mobile
          </button>
        </div>

        {/* Action Triggers */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button 
            onClick={handleUndo} 
            disabled={historyIndex <= 0}
            className="btn-icon" 
            style={{ opacity: historyIndex <= 0 ? 0.4 : 1 }}
          >
            <Undo2 size={16} />
          </button>
          <button 
            onClick={handleRedo} 
            disabled={historyIndex >= history.length - 1}
            className="btn-icon"
            style={{ opacity: historyIndex >= history.length - 1 ? 0.4 : 1 }}
          >
            <Redo2 size={16} />
          </button>

          <button onClick={() => setShowCommandPalette(true)} className="btn-icon" title="Terminal Command Palette (Ctrl+K)">
            <Terminal size={16} />
          </button>
          
          <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />

          <button 
            onClick={() => handleSaveToDatabase()} 
            className="btn-premium" 
            style={{ background: "#0c0c0c", color: "white", padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <Save size={16} />
            Save Draft
          </button>

          <button 
            onClick={() => handleSaveToDatabase("published")} 
            className="btn-premium" 
            style={{ background: "#22c55e", color: "white", padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            Publish Page
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="builder-workspace">
        
        {/* Left Side: Widgets and Layers tree */}
        <div className="builder-sidebar-left">
          <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
            <div 
              onClick={() => setActiveLeftTab("widgets")} 
              className={`builder-tab ${activeLeftTab === "widgets" ? "active" : ""}`}
              style={{ flex: 1, textAlign: "center" }}
            >
              Widgets
            </div>
            <div 
              onClick={() => setActiveLeftTab("sections")} 
              className={`builder-tab ${activeLeftTab === "sections" ? "active" : ""}`}
              style={{ flex: 1, textAlign: "center" }}
            >
              Navigator
            </div>
            <div 
              onClick={() => setActiveLeftTab("settings")} 
              className={`builder-tab ${activeLeftTab === "settings" ? "active" : ""}`}
              style={{ flex: 1, textAlign: "center" }}
            >
              Settings
            </div>
            <div 
              onClick={() => setActiveLeftTab("ai")} 
              className={`builder-tab ${activeLeftTab === "ai" ? "active" : ""}`}
              style={{ flex: 1, textAlign: "center" }}
            >
              AI
            </div>
          </div>

          <div style={{ padding: "1.25rem", flex: 1, overflowY: "auto" }}>
            {activeLeftTab === "widgets" && (
              <div>
                <h3 style={{ fontSize: "0.875rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "1rem" }}>
                  Components Library
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                  <div onClick={() => handleAddWidget("heading")} className="widget-library-item">
                    <Heading1 size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Heading</span>
                  </div>
                  <div onClick={() => handleAddWidget("paragraph")} className="widget-library-item">
                    <FileText size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Paragraph</span>
                  </div>
                  <div onClick={() => handleAddWidget("image")} className="widget-library-item">
                    <Layout size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Image</span>
                  </div>
                  <div onClick={() => handleAddWidget("divider")} className="widget-library-item">
                    <MinusIcon size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Divider</span>
                  </div>
                  <div onClick={() => handleAddWidget("spacer")} className="widget-library-item">
                    <Plus size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Spacer</span>
                  </div>
                  <div onClick={() => handleAddWidget("hero")} className="widget-library-item">
                    <Layout size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Hero Section</span>
                  </div>
                  <div onClick={() => handleAddWidget("text")} className="widget-library-item">
                    <FileText size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Rich Text</span>
                  </div>
                  <div onClick={() => handleAddWidget("button")} className="widget-library-item">
                    <Settings size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>CTA Button</span>
                  </div>
                  <div onClick={() => handleAddWidget("pricing")} className="widget-library-item">
                    <CreditCard size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Pricing Card</span>
                  </div>
                  <div onClick={() => handleAddWidget("testimonials")} className="widget-library-item">
                    <MessageSquare size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Testimonials</span>
                  </div>
                  <div onClick={() => handleAddWidget("statistics")} className="widget-library-item">
                    <ListCollapse size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Statistics</span>
                  </div>
                  <div onClick={() => handleAddWidget("timeline")} className="widget-library-item">
                    <Clock size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Timeline</span>
                  </div>
                  <div onClick={() => handleAddWidget("faq")} className="widget-library-item">
                    <ListTree size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>FAQ</span>
                  </div>
                  <div onClick={() => handleAddWidget("html")} className="widget-library-item">
                    <Plus size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>HTML Embed</span>
                  </div>
                  <div onClick={() => handleAddWidget("form")} className="widget-library-item">
                    <Mail size={20} style={{ marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Feedback Form</span>
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === "sections" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                    Sections Outline
                  </h3>
                  <button 
                    onClick={handleAddSection} 
                    className="btn-premium" 
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}
                  >
                    <Plus size={14} /> Add Section
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {composition.sections.map((sec, secIdx) => (
                    <div 
                      key={sec.id} 
                      style={{ 
                        border: "1px solid #e2e8f0", 
                        borderRadius: "8px", 
                        background: selectedElement?.type === "section" && selectedElement.id === sec.id ? "#eff6ff" : "white",
                        borderColor: selectedElement?.type === "section" && selectedElement.id === sec.id ? "#3b82f6" : "#e2e8f0"
                      }}
                    >
                      <div 
                        onClick={() => setSelectedElement({ type: "section", id: sec.id, index: secIdx })}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", cursor: "pointer" }}
                      >
                        <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>{sec.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <button onClick={(e) => { e.stopPropagation(); handleMoveSection(secIdx, "up"); }} className="btn-icon" style={{ width: "24px", height: "24px" }}><ArrowUp size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleMoveSection(secIdx, "down"); }} className="btn-icon" style={{ width: "24px", height: "24px" }}><ArrowDown size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSection(secIdx); }} className="btn-icon delete" style={{ width: "24px", height: "24px" }}><Trash2 size={12} /></button>
                        </div>
                      </div>

                      {/* Render nested widgets */}
                      <div style={{ padding: "0.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
                        {sec.widgets && sec.widgets.map((wid, widIdx) => (
                          <div 
                            key={wid.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement({ type: "widget", id: wid.id, secIndex: secIdx, index: widIdx });
                            }}
                            style={{ 
                              padding: "0.5rem", 
                              fontSize: "0.75rem", 
                              fontWeight: "500", 
                              borderRadius: "4px", 
                              cursor: "pointer", 
                              background: selectedElement?.type === "widget" && selectedElement.id === wid.id ? "#3b82f6" : "transparent",
                              color: selectedElement?.type === "widget" && selectedElement.id === wid.id ? "white" : "inherit",
                              marginBottom: "0.25rem"
                            }}
                          >
                            🎨 {wid.type.toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLeftTab === "settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  Page SEO Metadata
                </h3>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>SEO Page Title Override</label>
                  <input className="admin-input" type="text" value={composition.page.metaTitle || ""} onChange={(e) => setComposition({ ...composition, page: { ...composition.page, metaTitle: e.target.value } })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Meta Description</label>
                  <textarea className="admin-input" rows={3} value={composition.page.metaDescription || ""} onChange={(e) => setComposition({ ...composition, page: { ...composition.page, metaDescription: e.target.value } })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Keywords (Comma Separated)</label>
                  <input className="admin-input" type="text" value={composition.page.keywords || ""} onChange={(e) => setComposition({ ...composition, page: { ...composition.page, keywords: e.target.value } })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Canonical URL Target</label>
                  <input className="admin-input" type="text" value={composition.page.canonicalUrl || ""} onChange={(e) => setComposition({ ...composition, page: { ...composition.page, canonicalUrl: e.target.value } })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Social OG Share Image</label>
                  <input className="admin-input" type="text" value={composition.page.ogImage || ""} onChange={(e) => setComposition({ ...composition, page: { ...composition.page, ogImage: e.target.value } })} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Search Robots Tags</label>
                  <select className="admin-input" value={composition.page.robotsMeta || "index, follow"} onChange={(e) => setComposition({ ...composition, page: { ...composition.page, robotsMeta: e.target.value } })}>
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                  </select>
                </div>

                <div style={{ height: "1px", background: "#e2e8f0", margin: "1rem 0" }} />
                
                {/* Backups Export/Import (Phase 20) */}
                <h3 style={{ fontSize: "0.875rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  Workspace Backups
                </h3>
                <button onClick={handleExportBackup} className="btn-icon" style={{ width: "100%", height: "40px", display: "flex", gap: "0.5rem", fontSize: "0.8rem", fontWeight: "600" }}>
                  <Download size={14} /> Export JSON Config
                </button>
                <label className="btn-icon" style={{ width: "100%", height: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer" }}>
                  <Upload size={14} /> Import JSON Config
                  <input type="file" style={{ display: "none" }} onChange={handleImportBackup} />
                </label>

                <div style={{ height: "1px", background: "#e2e8f0", margin: "1rem 0" }} />

                {/* Revision History UI (Phase 16) */}
                <h3 style={{ fontSize: "0.875rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <History size={14} /> Revisions Log
                </h3>
                {revisions.length === 0 ? (
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>No revisions recorded yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
                    {revisions.map((rev) => (
                      <div key={rev.id} style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.5rem", background: "#f8fafc" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>Revision #{rev.id}</p>
                        <time style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{new Date(rev.createdAt).toLocaleString()}</time>
                        <button onClick={() => handleRestoreRevision(rev)} className="btn-premium" style={{ width: "100%", fontSize: "0.65rem", padding: "0.2rem", marginTop: "0.4rem" }}>Restore Version</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === "ai" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Wand2 size={16} /> AI Layout Assistant
                </h3>
                <p style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: "1.5" }}>
                  Let the dynamic assistant construct visual blocks, testimonials, pricing plans, and outline cards instantly.
                </p>

                <textarea 
                  className="admin-input" 
                  rows={4} 
                  placeholder="Describe what content you'd like to build (e.g. Generate a dark-mode pricing list widget...)"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <button onClick={() => handleAiAction("hero")} className="btn-premium" style={{ background: "#3b82f6", color: "white", fontSize: "0.8rem" }} disabled={aiGenerating}>
                    {aiGenerating ? "Generating..." : "Generate Hero Content"}
                  </button>
                  <button onClick={() => handleAiAction("pricing")} className="btn-premium" style={{ background: "#10b981", color: "white", fontSize: "0.8rem" }} disabled={aiGenerating}>
                    {aiGenerating ? "Generating..." : "Generate Pricing Section"}
                  </button>
                  <button onClick={() => handleAiAction("testimonials")} className="btn-premium" style={{ background: "#6366f1", color: "white", fontSize: "0.8rem" }} disabled={aiGenerating}>
                    {aiGenerating ? "Generating..." : "Generate Testimonial Block"}
                  </button>
                  <button onClick={() => handleAiAction("faq")} className="btn-premium" style={{ background: "#f59e0b", color: "white", fontSize: "0.8rem" }} disabled={aiGenerating}>
                    {aiGenerating ? "Generating..." : "Generate Q&A FAQ Widget"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Iframe Workspace */}
        <div className="builder-preview-area">
          <div className="builder-iframe-container" style={{ width: viewportWidth }}>
            <iframe 
              ref={iframeRef}
              src="/admin/builder/preview" 
              className="builder-iframe"
            />
          </div>
        </div>

        {/* Right Side: Properties Panel */}
        <div className="builder-sidebar-right">
          <div style={{ padding: "1.25rem", borderBottom: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Properties Manager</h3>
            <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
              Editing Breakpoint: <span style={{ color: "#3b82f6", fontWeight: "700", textTransform: "uppercase" }}>{activeBreakpoint}</span>
            </p>
          </div>

          {activeObj && (
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* If Widget, Render Custom Content Inputs */}
              {selectedElement.type === "widget" && (
                <div>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "0.75rem" }}>Content Parameters</h4>
                  
                  {activeObj.type === "heading" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div>
                        <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Level</label>
                        <select className="admin-input" value={activeObj.content.level || "h2"} onChange={(e) => handlePropertyChange("content", "level", e.target.value)}>
                          <option value="h1">H1</option>
                          <option value="h2">H2</option>
                          <option value="h3">H3</option>
                          <option value="h4">H4</option>
                          <option value="h5">H5</option>
                          <option value="h6">H6</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Heading Text</label>
                        <input className="admin-input" type="text" value={activeObj.content.text || ""} onChange={(e) => handlePropertyChange("content", "text", e.target.value)} />
                      </div>
                    </div>
                  )}

                  {activeObj.type === "image" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div>
                        <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Image URL</label>
                        <input className="admin-input" type="text" value={activeObj.content.url || ""} onChange={(e) => handlePropertyChange("content", "url", e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Alt Text</label>
                        <input className="admin-input" type="text" value={activeObj.content.alt || ""} onChange={(e) => handlePropertyChange("content", "alt", e.target.value)} />
                      </div>
                    </div>
                  )}

                  {activeObj.type === "html" && (
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Custom HTML Code</label>
                      <textarea className="admin-input" rows={5} value={activeObj.content.code || ""} onChange={(e) => handlePropertyChange("content", "code", e.target.value)} />
                    </div>
                  )}
                </div>
              )}

              {/* Style Overrides */}
              <div>
                <h4 style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "0.75rem" }}>Styling Options</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Text Align</label>
                    <select className="admin-input" value={getActiveStyleVal("textAlign") || "left"} onChange={(e) => handlePropertyChange("style", "textAlign", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Font Size (e.g. 1rem, 24px)</label>
                    <input className="admin-input" type="text" value={getActiveStyleVal("fontSize")} onChange={(e) => handlePropertyChange("style", "fontSize", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Font Weight</label>
                    <input className="admin-input" type="text" placeholder="e.g. 700" value={getActiveStyleVal("fontWeight")} onChange={(e) => handlePropertyChange("style", "fontWeight", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Padding Top</label>
                    <input className="admin-input" type="text" placeholder="e.g. 2rem" value={getActiveStyleVal("paddingTop")} onChange={(e) => handlePropertyChange("style", "paddingTop", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Padding Bottom</label>
                    <input className="admin-input" type="text" placeholder="e.g. 2rem" value={getActiveStyleVal("paddingBottom")} onChange={(e) => handlePropertyChange("style", "paddingBottom", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Background Color</label>
                    <input className="admin-input" type="color" value={getActiveStyleVal("backgroundColor") || "#ffffff"} onChange={(e) => handlePropertyChange("style", "backgroundColor", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Visibility and Scheduling (Phase 8) */}
              <div>
                <h4 style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "0.75rem" }}>Visibility & Scheduler</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="hiddenToggle" checked={activeObj.visibility?.hidden || false} onChange={(e) => handlePropertyChange("visibility", "hidden", e.target.checked)} />
                    <label htmlFor="hiddenToggle" style={{ fontSize: "0.75rem", fontWeight: "600" }}>Hide Element</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="desktopOnlyToggle" checked={activeObj.visibility?.desktopOnly || false} onChange={(e) => handlePropertyChange("visibility", "desktopOnly", e.target.checked)} />
                    <label htmlFor="desktopOnlyToggle" style={{ fontSize: "0.75rem", fontWeight: "600" }}>Desktop Only</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="mobileOnlyToggle" checked={activeObj.visibility?.mobileOnly || false} onChange={(e) => handlePropertyChange("visibility", "mobileOnly", e.target.checked)} />
                    <label htmlFor="mobileOnlyToggle" style={{ fontSize: "0.75rem", fontWeight: "600" }}>Mobile Only</label>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem", color: "#64748b" }}>
                      <Calendar size={12} style={{ display: "inline", marginRight: "3px" }} /> Schedule Publish Date
                    </label>
                    <input 
                      type="datetime-local" 
                      className="admin-input" 
                      value={activeObj.visibility?.scheduleStart || ""} 
                      onChange={(e) => handlePropertyChange("visibility", "scheduleStart", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem", color: "#64748b" }}>
                      <Calendar size={12} style={{ display: "inline", marginRight: "3px" }} /> Schedule Expiry Date
                    </label>
                    <input 
                      type="datetime-local" 
                      className="admin-input" 
                      value={activeObj.visibility?.scheduleEnd || ""} 
                      onChange={(e) => handlePropertyChange("visibility", "scheduleEnd", e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Statusbar */}
      <footer className="builder-statusbar">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Status: <strong>{autosaveStatus}</strong></span>
          <span>•</span>
          <span>Device: <strong>{viewportWidth === "100%" ? "Desktop" : viewportWidth === "768px" ? "Tablet" : "Mobile"}</strong></span>
        </div>
        <div>
          <span>Selected Element ID: <strong>{selectedElement ? selectedElement.id : "None"}</strong></span>
        </div>
      </footer>

      {/* Ctrl+K Command Palette Modal (Phase 20) */}
      {showCommandPalette && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100001 }} onClick={() => setShowCommandPalette(false)}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", width: "500px", maxWidth: "90%", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
              <Search size={18} style={{ color: "#64748b" }} />
              <input 
                type="text" 
                placeholder="Type a shortcut or page builder command..." 
                style={{ border: "none", outline: "none", width: "100%", fontSize: "0.95rem" }}
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", maxHeight: "250px", overflowY: "auto" }}>
              {filteredCommands.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "#64748b", textAlign: "center", padding: "1rem" }}>No matching commands found.</p>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { cmd.action(); setShowCommandPalette(false); }}
                    style={{ padding: "0.75rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600", hover: { background: "#f1f5f9" } }}
                    onMouseEnter={(e) => e.target.style.background = "#f1f5f9"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    ⚡ {cmd.name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Page Dialog Modal */}
      {showNewPageModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100000 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>Create New Page</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Page Title</label>
                <input className="admin-input" type="text" placeholder="e.g. Landing Page" value={newPageData.title} onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>URL Slug Path</label>
                <input className="admin-input" type="text" placeholder="e.g. landing-intro" value={newPageData.slug} onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={() => setShowNewPageModal(false)} className="btn-icon" style={{ padding: "0.5rem 1rem", width: "auto" }}>Cancel</button>
              <button onClick={handleCreatePage} className="btn-premium" style={{ background: "#3b82f6", color: "white" }}>Create Page</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Helper Lucide Icon
function MinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function Mail(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
