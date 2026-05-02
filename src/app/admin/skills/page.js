"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCcw, Search } from "lucide-react";

const INITIAL_FORM = {
  category: "",
  name: "",
  sortOrder: "",
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadSkills = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/skills", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load skills.");

      const data = await response.json();
      setSkills(Array.isArray(data.items) ? data.items : []);
    } catch (nextError) {
      setError(nextError.message || "Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setForm({
      category: skill.category || "",
      name: skill.name || "",
      sortOrder: String(skill.sortOrder ?? ""),
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
      category: form.category.trim(),
      name: form.name.trim(),
      sortOrder: form.sortOrder === "" ? undefined : Number.parseInt(form.sortOrder, 10),
    };

    try {
      const response = await fetch(editingId ? `/api/skills/${editingId}` : "/api/skills", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save skill.");
      }

      await loadSkills();
      resetForm();
    } catch (nextError) {
      setError(nextError.message || "Failed to save skill.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this skill?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete skill.");
      }
      await loadSkills();
      if (editingId === id) resetForm();
    } catch (nextError) {
      setError(nextError.message || "Failed to delete skill.");
    }
  };

  return (
    <div className="skills-admin">
      <header className="section-header">
        <div>
          <h1>Manage Skills</h1>
          <p>Organize and showcase your technical expertise.</p>
        </div>
        <button onClick={loadSkills} className="btn-premium" style={{ background: 'white', color: '#1e293b', border: '1px solid #e2e8f0' }}>
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <form onSubmit={handleSubmit} className="admin-form-container">
        <div className="admin-input-group">
          <label>Category</label>
          <input
            value={form.category}
            onChange={handleChange("category")}
            placeholder="e.g. Frontend"
            className="admin-input"
            required
          />
        </div>
        <div className="admin-input-group">
          <label>Skill Name</label>
          <input
            value={form.name}
            onChange={handleChange("name")}
            placeholder="e.g. React"
            className="admin-input"
            required
          />
        </div>
        <div className="admin-input-group">
          <label>Sort Order</label>
          <input
            value={form.sortOrder}
            onChange={handleChange("sortOrder")}
            placeholder="0"
            type="number"
            className="admin-input"
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" disabled={submitting} className="btn-premium" style={{ flex: 1, justifyContent: 'center' }}>
            {submitting ? "..." : editingId ? <><Pencil size={16} /> Update</> : <><Plus size={18} /> Add Skill</>}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-premium" style={{ background: '#f1f5f9', color: '#475569' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #fecaa3' }}>
          {error}
        </div>
      )}

      <div className="data-table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCcw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            <p>Loading your skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <p>No skills added yet. Start by adding one above!</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Skill Name</th>
                <th>Sort Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id}>
                  <td>
                    <span className="badge badge-blue">{skill.category}</span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#1e293b' }}>{skill.name}</td>
                  <td>
                    <span className="badge badge-gray">{skill.sortOrder}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(skill)} className="btn-icon" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(skill.id)} className="btn-icon delete" title="Delete">
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
