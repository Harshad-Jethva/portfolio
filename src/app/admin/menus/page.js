"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Save, Menu as MenuIcon, ArrowUp, ArrowDown } from "lucide-react";

export default function MenusBuilderPage() {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemData, setItemData] = useState({ label: "", url: "", badgeText: "", icon: "", parentId: "" });
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [newMenuData, setNewMenuData] = useState({ name: "", location: "header" });

  const fetchMenus = async () => {
    const res = await fetch("/api/admin/menus");
    if (res.ok) {
      const data = await res.json();
      setMenus(data.menus || []);
      if (data.menus.length > 0 && !selectedMenu) {
        setSelectedMenu(data.menus[0]);
      }
    }
  };

  const fetchMenuItems = async (menuId) => {
    if (!menuId) return;
    const res = await fetch(`/api/admin/menus?menuId=${menuId}`);
    if (res.ok) {
      const data = await res.json();
      setMenuItems(data.items || []);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (selectedMenu) {
      fetchMenuItems(selectedMenu.id);
    }
  }, [selectedMenu]);

  const handleCreateMenu = async () => {
    if (!newMenuData.name) return;
    const res = await fetch("/api/admin/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMenuData)
    });
    if (res.ok) {
      const menu = await res.json();
      setMenus([...menus, menu]);
      setSelectedMenu(menu);
      setShowMenuModal(false);
      setNewMenuData({ name: "", location: "header" });
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!confirm("Delete this menu? All items will be deleted.")) return;
    const res = await fetch(`/api/admin/menus?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      const remaining = menus.filter(m => m.id !== id);
      setMenus(remaining);
      setSelectedMenu(remaining.length > 0 ? remaining[0] : null);
      if (remaining.length === 0) setMenuItems([]);
    }
  };

  const handleOpenItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setItemData({
        label: item.label,
        url: item.url,
        badgeText: item.badgeText || "",
        icon: item.icon || "",
        parentId: item.parentId || ""
      });
    } else {
      setEditingItem(null);
      setItemData({ label: "", url: "", badgeText: "", icon: "", parentId: "" });
    }
    setShowItemModal(true);
  };

  const handleSaveItem = async () => {
    if (!itemData.label || !itemData.url) return;
    const payload = {
      ...itemData,
      menuId: selectedMenu.id,
      type: "item",
      parentId: itemData.parentId ? Number(itemData.parentId) : null
    };

    if (editingItem) {
      const res = await fetch("/api/admin/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingItem.id })
      });
      if (res.ok) {
        fetchMenuItems(selectedMenu.id);
        setShowItemModal(false);
      }
    } else {
      const res = await fetch("/api/admin/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchMenuItems(selectedMenu.id);
        setShowItemModal(false);
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this menu link?")) return;
    const res = await fetch(`/api/admin/menus?id=${itemId}&type=item`, { method: "DELETE" });
    if (res.ok) {
      fetchMenuItems(selectedMenu.id);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <header className="section-header" style={{ display: "flex", justifyBetween: "center", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1>Visual Navigation Menu Builder</h1>
          <p>Configure links, badge markers, and visual drop-down selectors for your layout headers.</p>
        </div>

        <button onClick={() => setShowMenuModal(true)} className="btn-premium" style={{ background: "#0c0c0c", color: "white" }}>
          <Plus size={18} /> New Menu Configuration
        </button>
      </header>

      {/* Select Menu Dropdown */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center" }}>
        <select 
          value={selectedMenu?.id || ""} 
          onChange={(e) => {
            const m = menus.find(x => x.id === Number(e.target.value));
            if (m) setSelectedMenu(m);
          }}
          style={{ padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600" }}
        >
          {menus.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.location || "no location"})</option>
          ))}
        </select>
        {selectedMenu && (
          <button onClick={() => handleDeleteMenu(selectedMenu.id)} className="btn-icon delete" title="Delete Active Menu">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {selectedMenu ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem" }}>
          
          {/* Menu Items List */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Menu Links Hierarchy</h3>
              <button onClick={() => handleOpenItemModal(null)} className="btn-premium" style={{ fontSize: "0.75rem", padding: "0.4rem 1rem" }}>
                <Plus size={14} /> Add Link Item
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {menuItems.length === 0 ? (
                <p style={{ color: "#64748b", fontStyle: "italic", textAlign: "center", padding: "2rem" }}>No items added to this menu structure.</p>
              ) : (
                menuItems.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      padding: "0.75rem 1rem", 
                      border: "1px solid #e2e8f0", 
                      borderRadius: "8px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      marginLeft: item.parentId ? "2rem" : "0",
                      background: item.parentId ? "#f8fafc" : "white"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <MenuIcon size={16} style={{ color: "#94a3b8" }} />
                      <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>{item.label}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{item.url}</span>
                      {item.badgeText && <span style={{ padding: "0.1rem 0.5rem", borderRadius: "4px", background: "#3b82f6", color: "white", fontSize: "0.65rem", fontWeight: "700" }}>{item.badgeText}</span>}
                    </div>

                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button onClick={() => handleOpenItemModal(item)} className="btn-icon" style={{ width: "28px", height: "28px" }}><Edit size={12} /></button>
                      <button onClick={() => handleDeleteItem(item.id)} className="btn-icon delete" style={{ width: "28px", height: "28px" }}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Guidance Info Panel */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", height: "fit-content" }}>
            <h4 style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "0.75rem" }}>Layout Placement</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.5" }}>
              To assign a menu structure, define the location key as <strong>header</strong> or <strong>footer</strong>. The page templates will automatically pick up the menu structure for those designated zones!
            </p>
          </div>
        </div>
      ) : null}

      {/* Item Create / Edit Modal */}
      {showItemModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100000 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.25rem" }}>{editingItem ? "Edit Link Item" : "Add Menu Link Item"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Link Label</label>
                <input className="admin-input" type="text" value={itemData.label} onChange={(e) => setItemData({ ...itemData, label: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>URL Destination (slug or external)</label>
                <input className="admin-input" type="text" value={itemData.url} onChange={(e) => setItemData({ ...itemData, url: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Badge Text Annotation (Optional)</label>
                <input className="admin-input" type="text" placeholder="e.g. New, Hot" value={itemData.badgeText} onChange={(e) => setItemData({ ...itemData, badgeText: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Parent Link Item (For dropdown sub-menus)</label>
                <select className="admin-input" value={itemData.parentId} onChange={(e) => setItemData({ ...itemData, parentId: e.target.value })}>
                  <option value="">None (Top Level)</option>
                  {menuItems.filter(x => !x.parentId && (!editingItem || x.id !== editingItem.id)).map(x => (
                    <option key={x.id} value={x.id}>{x.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={() => setShowItemModal(false)} className="btn-icon" style={{ padding: "0.5rem 1rem", width: "auto" }}>Cancel</button>
              <button onClick={handleSaveItem} className="btn-premium" style={{ background: "#3b82f6", color: "white" }}>Save Link</button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Create Modal */}
      {showMenuModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100000 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>Create New Navigation Menu</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Menu Name</label>
                <input className="admin-input" type="text" placeholder="e.g. Header Main Menu" value={newMenuData.name} onChange={(e) => setNewMenuData({ ...newMenuData, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Location Placement</label>
                <select className="admin-input" value={newMenuData.location} onChange={(e) => setNewMenuData({ ...newMenuData, location: e.target.value })}>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={() => setShowMenuModal(false)} className="btn-icon" style={{ padding: "0.5rem 1rem", width: "auto" }}>Cancel</button>
              <button onClick={handleCreateMenu} className="btn-premium" style={{ background: "#3b82f6", color: "white" }}>Create Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
