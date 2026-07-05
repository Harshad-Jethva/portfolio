"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Copy, Search, FileText, Image as ImageIcon, Link2 } from "lucide-react";

export default function MediaManagerPage() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        fetchAssets();
      } else {
        const error = await res.json();
        alert(error.error || "Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Public URL copied to clipboard!");
  };

  const filteredAssets = assets.filter(a => 
    a.fileName.toLowerCase().includes(search.toLowerCase()) || 
    (a.fileType && a.fileType.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: "2rem" }}>
      <header className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1>Media Asset Library</h1>
          <p>Central management for icons, images, documents, and visual items.</p>
        </div>

        <label className="btn-premium" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", background: "#0c0c0c", color: "white" }}>
          <Upload size={18} />
          {uploading ? "Uploading..." : "Upload Asset"}
          <input type="file" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
        </label>
      </header>

      {/* Search Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.6rem 1rem", maxWidth: "400px", marginBottom: "2.5rem" }}>
        <Search size={18} style={{ color: "#64748b" }} />
        <input 
          type="text" 
          placeholder="Search by file name or type..." 
          style={{ border: "none", outline: "none", width: "100%", fontSize: "0.9rem" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
          <p>Loading media library assets...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div style={{ padding: "5rem", textAlign: "center", border: "2px dashed #e2e8f0", borderRadius: "16px", color: "#64748b" }}>
          <ImageIcon size={48} style={{ opacity: 0.3, margin: "0 auto 1.5rem" }} />
          <p>No media files found. Upload a file to get started.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {filteredAssets.map((asset) => {
            const isImg = asset.fileType && asset.fileType.startsWith("image/");
            return (
              <div key={asset.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <div style={{ height: "140px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderBottom: "1px solid #e2e8f0", position: "relative" }}>
                  {isImg ? (
                    <img src={asset.publicUrl} alt={asset.fileName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <FileText size={48} style={{ color: "#94a3b8" }} />
                  )}
                </div>
                <div style={{ padding: "1rem", flexGrow: 1, display: "flex", flexDirection: "column", justifyBetween: "center" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", color: "#1e293b", marginBottom: "0.25rem" }} title={asset.fileName}>
                    {asset.fileName}
                  </p>
                  <span style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>
                    {(asset.fileSize / 1024).toFixed(1)} KB • {asset.fileType ? asset.fileType.split("/")[1] : "FILE"}
                  </span>
                  
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button 
                      onClick={() => copyToClipboard(asset.publicUrl)} 
                      className="btn-icon" 
                      style={{ flex: 1, height: "36px", display: "flex", gap: "0.25rem", fontSize: "0.75rem", fontWeight: "600" }}
                      title="Copy URL"
                    >
                      <Copy size={14} /> Copy Link
                    </button>
                    <button 
                      onClick={() => handleDelete(asset.id)} 
                      className="btn-icon delete" 
                      style={{ width: "36px", height: "36px" }}
                      title="Delete Asset"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
