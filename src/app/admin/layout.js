import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin Dashboard | Portfolio",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-content-card animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
