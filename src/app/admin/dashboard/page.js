"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Code2, Mail, Trophy, RefreshCcw, ExternalLink } from "lucide-react";

const EMPTY_STATS = {
  projects: 0,
  skills: 0,
  achievements: 0,
  messages: 0,
};

function StatCard({ title, value, icon: Icon, color, softColor }) {
  return (
    <div className="stat-card" style={{ '--accent-color': color, '--accent-soft': softColor }}>
      <div className="stat-info">
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const recentMessages = useMemo(() => messages.slice(0, 5), [messages]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, messagesResponse] = await Promise.all([
        fetch("/api/stats", { cache: "no-store" }),
        fetch("/api/messages", { cache: "no-store" }),
      ]);

      if (statsResponse.ok) {
        const nextStats = await statsResponse.json();
        setStats(nextStats);
      }

      if (messagesResponse.ok) {
        const payload = await messagesResponse.json();
        setMessages(Array.isArray(payload.items) ? payload.items : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="dashboard-content">
      <header className="section-header">
        <div>
          <h1>Admin Overview</h1>
          <p>Control portfolio content and review contact messages in one place.</p>
        </div>

        <button onClick={loadDashboardData} className="btn-premium">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </header>

      <div className="stats-grid">
        <StatCard 
          title="Total Projects" 
          value={stats.projects} 
          icon={Briefcase} 
          color="#0ea5e9" 
          softColor="rgba(14, 165, 233, 0.1)" 
        />
        <StatCard 
          title="Skills Mastered" 
          value={stats.skills} 
          icon={Code2} 
          color="#6366f1" 
          softColor="rgba(99, 102, 241, 0.1)" 
        />
        <StatCard 
          title="Achievements" 
          value={stats.achievements} 
          icon={Trophy} 
          color="#f59e0b" 
          softColor="rgba(245, 158, 11, 0.1)" 
        />
        <StatCard 
          title="Messages" 
          value={stats.messages} 
          icon={Mail} 
          color="#10b981" 
          softColor="rgba(16, 185, 129, 0.1)" 
        />
      </div>

      <section className="recent-activity">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Recent Messages</h2>
        </div>

        <div className="data-table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              <RefreshCcw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
              <p>Fetching latest updates...</p>
            </div>
          ) : recentMessages.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <Mail size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No messages found in your inbox.</p>
            </div>
          ) : (
            <div>
              {recentMessages.map((message) => (
                <div key={message.id} className="message-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>
                        {message.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>{message.name}</span>
                    </div>
                    <time style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(message.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem', paddingLeft: '2.75rem' }}>{message.email}</p>
                  <p style={{ fontSize: '0.925rem', color: '#334155', paddingLeft: '2.75rem', lineHeight: '1.5' }}>{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
