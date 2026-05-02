"use client";

import { useEffect, useState } from "react";
import { Trash2, RefreshCcw, Mail, Calendar, User } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/messages", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load messages.");

      const data = await response.json();
      setMessages(Array.isArray(data.items) ? data.items : []);
    } catch (nextError) {
      setError(nextError.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete message.");
      }
      await loadMessages();
    } catch (nextError) {
      setError(nextError.message || "Failed to delete message.");
    }
  };

  return (
    <div className="messages-admin">
      <header className="section-header">
        <div>
          <h1>Inbound Messages</h1>
          <p>Read and manage inquiries from your portfolio visitors.</p>
        </div>
        <button onClick={loadMessages} className="btn-premium">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div className="data-table-container">
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCcw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            <p>Scanning for new messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: '#64748b' }}>
            <Mail size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>Your inbox is currently empty.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className="message-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>{message.name}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{message.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600' }}>
                      <Calendar size={14} />
                      {new Date(message.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button onClick={() => handleDelete(message.id)} className="btn-icon delete" title="Delete Message">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', color: '#334155', fontSize: '0.925rem', lineHeight: '1.6', border: '1px solid #f1f5f9' }}>
                  {message.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
