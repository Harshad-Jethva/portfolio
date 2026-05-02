"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Mail,
  Trophy,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Skills", href: "/admin/skills", icon: Code2 },
  { name: "Achievements", href: "/admin/achievements", icon: Trophy },
  { name: "Messages", href: "/admin/messages", icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="admin-logo-icon" />
        <div className="admin-logo-text">
          <h2>Admin</h2>
          <span>Portfolio Panel</span>
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <div className="icon-container">
                <Icon size={20} />
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          window.location.href = "/login";
        }}
        className="btn-premium"
        style={{ marginTop: '1.5rem', background: 'transparent', color: '#e11d48', border: '1px solid #fecdd3' }}
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
