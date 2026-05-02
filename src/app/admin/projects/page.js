"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, RefreshCcw, ExternalLink, Hash, Calendar, Layers, Image as ImageIcon, Upload, Link as LinkIcon } from "lucide-react";

const INITIAL_FORM = {
  index: "",
  title: "",
  tech: "",
  desc: "",
  year: "",
  link: "",
  imageUrl: "",
  sortOrder: "",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load projects.");

      const data = await response.json();
      setProjects(Array.isArray(data.items) ? data.items : []);
    } catch (nextError) {
      setError(nextError.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleFileBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed.");

      const data = await response.json();
      setForm((current) => ({
        ...current,
        imageUrl: data.url,
      }));
    } catch (nextError) {
      setError(nextError.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      // Reset input value to allow selecting the same file again
      if (event.target) event.target.value = "";
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      index: project.index || "",
      title: project.title || "",
      tech: project.tech || "",
      desc: project.desc || "",
      year: project.year || "",
      link: project.link || "",
      imageUrl: project.imageUrl || "",
      sortOrder: String(project.sortOrder ?? ""),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      index: form.index.trim(),
      title: form.title.trim(),
      tech: form.tech.trim(),
      desc: form.desc.trim(),
      year: form.year.trim(),
      link: form.link.trim(),
      imageUrl: form.imageUrl.trim(),
      sortOrder: form.sortOrder === "" ? undefined : Number.parseInt(form.sortOrder, 10),
    };

    try {
      const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save project.");
      }

      await loadProjects();
      resetForm();
    } catch (nextError) {
      setError(nextError.message || "Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete project.");
      }
      await loadProjects();
      if (editingId === id) resetForm();
    } catch (nextError) {
      setError(nextError.message || "Failed to delete project.");
    }
  };

  return (
    <div className="projects-admin">
      <header className="section-header">
        <div>
          <h1>Portfolio Projects</h1>
          <p>Showcase your best work and manage project details.</p>
        </div>
        <button onClick={loadProjects} className="btn-premium" style={{ background: 'white', color: '#1e293b', border: '1px solid #e2e8f0' }}>
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <div className="admin-content-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>
          {editingId ? "Update Project" : "Add New Project"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          <div className="admin-input-group">
            <label>Project Index</label>
            <div style={{ position: 'relative' }}>
              <Hash size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={form.index} onChange={handleChange("index")} placeholder="e.g. 01" className="admin-input" style={{ paddingLeft: '2.5rem' }} required />
            </div>
          </div>
          <div className="admin-input-group">
            <label>Project Title</label>
            <input value={form.title} onChange={handleChange("title")} placeholder="e.g. Modern Dashboard" className="admin-input" required />
          </div>
          <div className="admin-input-group">
            <label>Year</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={form.year} onChange={handleChange("year")} placeholder="e.g. 2024" className="admin-input" style={{ paddingLeft: '2.5rem' }} required />
            </div>
          </div>
          
          <div className="admin-input-group">
            <label>Project Image</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <ImageIcon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input value={form.imageUrl} onChange={handleChange("imageUrl")} placeholder="Image URL (Drive/Web)" className="admin-input" style={{ paddingLeft: '2.5rem' }} required />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <button type="button" onClick={handleFileBrowse} disabled={uploading} className="btn-premium" style={{ height: '44px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                <Upload size={16} />
                {uploading ? "..." : "Local"}
              </button>
            </div>
          </div>

          <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
            <label>Tech Stack</label>
            <input value={form.tech} onChange={handleChange("tech")} placeholder="e.g. Next.js, TypeScript, Tailwind" className="admin-input" required />
          </div>
          <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
            <label>Project Link</label>
            <input value={form.link} onChange={handleChange("link")} placeholder="https://..." className="admin-input" required />
          </div>
          <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
            <label>Description</label>
            <textarea value={form.desc} onChange={handleChange("desc")} placeholder="Write a brief overview of the project..." rows={4} className="admin-input" style={{ resize: 'vertical' }} required />
          </div>
          <div className="admin-input-group">
            <label>Sort Order</label>
            <input value={form.sortOrder} onChange={handleChange("sortOrder")} type="number" placeholder="0" className="admin-input" />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn-premium" style={{ background: '#f1f5f9', color: '#475569' }}>
                Cancel
              </button>
            )}
            <button type="submit" disabled={submitting} className="btn-premium" style={{ minWidth: '160px', justifyContent: 'center' }}>
              {submitting ? "Processing..." : editingId ? "Update Details" : "Create Project"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #fecdd3' }}>
          {error}
        </div>
      )}

      <div className="data-table-container">
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCcw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            <p>Gathering project data...</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: '#64748b' }}>
            <Layers size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>No projects showcased yet.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Index</th>
                <th>Preview</th>
                <th>Project Title</th>
                <th>Year</th>
                <th>Sort Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <span style={{ fontWeight: '700', color: '#64748b' }}>{project.index}</span>
                  </td>
                  <td>
                    <div style={{ width: '60px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{project.title}</span>
                  </td>
                  <td>{project.year}</td>
                  <td>
                    <span className="badge badge-gray">{project.sortOrder}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-icon" title="View Project">
                        <ExternalLink size={14} />
                      </a>
                      <button onClick={() => handleEdit(project)} className="btn-icon" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="btn-icon delete" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
