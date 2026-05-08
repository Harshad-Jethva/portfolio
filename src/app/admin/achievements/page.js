"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, RefreshCcw, Award, MapPin, Calendar, Globe, Upload, Image as ImageIcon } from "lucide-react";

const INITIAL_FORM = {
  imageUrl: "",
  title: "",
  organizer: "",
  year: "",
  category: "",
  details: "",
  location: "",
  sortOrder: "",
};

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const loadAchievements = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/achievements", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load achievements.");

      const data = await response.json();
      setAchievements(Array.isArray(data.items) ? data.items : []);
    } catch (nextError) {
      setError(nextError.message || "Failed to load achievements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || "Upload failed.");
      }

      const data = await response.json();
      setForm((current) => ({
        ...current,
        imageUrl: data.url,
      }));
    } catch (nextError) {
      setError(nextError.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  const handleEdit = (achievement) => {
    setEditingId(achievement.id);
    setForm({
      imageUrl: achievement.imageUrl || "",
      title: achievement.title || "",
      organizer: achievement.organizer || "",
      year: achievement.year || "",
      category: achievement.category || "",
      details: achievement.details || "",
      location: achievement.location || "",
      sortOrder: String(achievement.sortOrder ?? ""),
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
      imageUrl: form.imageUrl.trim(),
      title: form.title.trim(),
      organizer: form.organizer.trim(),
      year: form.year.trim(),
      category: form.category.trim(),
      details: form.details.trim(),
      location: form.location.trim(),
      sortOrder: form.sortOrder === "" ? undefined : Number.parseInt(form.sortOrder, 10),
    };

    try {
      const response = await fetch(editingId ? `/api/achievements/${editingId}` : "/api/achievements", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save achievement.");
      }

      await loadAchievements();
      resetForm();
    } catch (nextError) {
      setError(nextError.message || "Failed to save achievement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this achievement?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete achievement.");
      }
      await loadAchievements();
      if (editingId === id) resetForm();
    } catch (nextError) {
      setError(nextError.message || "Failed to delete achievement.");
    }
  };

  return (
    <div className="achievements-admin">
      <header className="section-header">
        <div>
          <h1>Recognition & Awards</h1>
          <p>Highlight your professional milestones and certificates.</p>
        </div>
        <button onClick={loadAchievements} className="btn-premium" style={{ background: 'white', color: '#1e293b', border: '1px solid #e2e8f0' }}>
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <div className="admin-content-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>
          {editingId ? "Update Achievement" : "Add New Achievement"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          <div className="admin-input-group">
            <label>Achievement Title</label>
            <input value={form.title} onChange={handleChange("title")} placeholder="e.g. Best Developer Award" className="admin-input" required />
          </div>
          <div className="admin-input-group">
            <label>Organizer / Issuer</label>
            <input value={form.organizer} onChange={handleChange("organizer")} placeholder="e.g. Google Cloud" className="admin-input" required />
          </div>
          <div className="admin-input-group">
            <label>Year</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={form.year} onChange={handleChange("year")} placeholder="e.g. 2024" className="admin-input" style={{ paddingLeft: '2.5rem' }} required />
            </div>
          </div>
          <div className="admin-input-group">
            <label>Category</label>
            <div style={{ position: 'relative' }}>
              <Award size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={form.category} onChange={handleChange("category")} placeholder="e.g. Certification" className="admin-input" style={{ paddingLeft: '2.5rem' }} required />
            </div>
          </div>
          <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
            <label>Achievement Image</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div 
                onClick={handleFileBrowse}
                style={{ 
                  flex: 1, 
                  height: '44px', 
                  border: '2px dashed #e2e8f0', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 1rem', 
                  cursor: 'pointer',
                  background: '#f8fafc',
                  transition: 'border-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <ImageIcon size={18} style={{ color: '#94a3b8', marginRight: '0.75rem' }} />
                <span style={{ color: form.imageUrl ? '#1e293b' : '#94a3b8', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {uploading ? "Uploading image..." : form.imageUrl ? "Image selected successfully" : "Click to upload achievement image"}
                </span>
                {form.imageUrl && <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <button type="button" onClick={handleFileBrowse} disabled={uploading} className="btn-premium" style={{ height: '44px', whiteSpace: 'nowrap' }}>
                <Upload size={16} />
                {uploading ? "..." : "Browse"}
              </button>
            </div>
            <input type="hidden" value={form.imageUrl} required />
          </div>

          <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
            <label>Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={form.location} onChange={handleChange("location")} placeholder="e.g. Mountain View, CA" className="admin-input" style={{ paddingLeft: '2.5rem' }} required />
            </div>
          </div>
          <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
            <label>Details / Description</label>
            <textarea value={form.details} onChange={handleChange("details")} placeholder="Tell us more about this recognition..." rows={4} className="admin-input" style={{ resize: 'vertical' }} required />
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
            <button type="submit" disabled={submitting} className="btn-premium" style={{ minWidth: '180px', justifyContent: 'center' }}>
              {submitting ? "Processing..." : editingId ? "Update Award" : "Save Achievement"}
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
            <p>Retrieving your accolades...</p>
          </div>
        ) : achievements.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: '#64748b' }}>
            <Award size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>No achievements documented yet.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Organizer</th>
                <th>Year</th>
                <th>Sort Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((achievement) => (
                <tr key={achievement.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9' }}>
                        <img src={achievement.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { 
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(achievement.title)}&background=f1f5f9&color=475569`;
                        }} />
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', color: '#1e293b', display: 'block' }}>{achievement.title}</span>
                        <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{achievement.category}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>{achievement.organizer}</td>
                  <td>{achievement.year}</td>
                  <td>
                    <span className="badge badge-gray">{achievement.sortOrder}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(achievement)} className="btn-icon" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(achievement.id)} className="btn-icon delete" title="Delete">
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
