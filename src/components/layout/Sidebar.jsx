import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Boxes, Tags, Users, Settings as SettingsIcon,
  LogOut, Frame as FrameIcon,
} from "lucide-react";
import { C } from "../../constants/colors.js";
import { useAuth } from "../../hooks/useAuth.js";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, always: true },
  { to: "/billing", label: "Billing", icon: ShoppingCart, always: true },
  { to: "/inventory", label: "Inventory", icon: Boxes, always: true },
  { to: "/categories", label: "Categories", icon: Tags, always: true },
  { to: "/customers", label: "Customers", icon: Users, always: true },
  { to: "/settings", label: "Settings", icon: SettingsIcon, superOnly: true },
];

export function Sidebar() {
  const { user, logout, isSuper } = useAuth();

  return (
    <div style={{ width: 232, background: C.walnutDeep, color: "#EAE1D2", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "22px 20px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: C.brass, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FrameIcon size={18} color="#3A2314" />
        </div>
        <div>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.15 }}>Sri Maruthi</div>
          <div style={{ fontSize: 10.5, color: "#B7A88E", letterSpacing: 0.4 }}>ENTERPRISES</div>
        </div>
      </div>

      <div style={{ padding: "6px 12px", flex: 1 }}>
        {NAV_ITEMS.filter((it) => it.always || isSuper).map((it) => (
          <NavLink key={it.to} to={it.to}
            style={({ isActive }) => ({
              width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "10px 12px",
              borderRadius: 10, marginBottom: 3, textDecoration: "none",
              background: isActive ? "rgba(168,118,47,0.22)" : "transparent",
              color: isActive ? "#F1D9A6" : "#C9BCA5", fontWeight: isActive ? 700 : 500, fontSize: 13.5,
              borderLeft: isActive ? `3px solid ${C.brass}` : "3px solid transparent",
            })}>
            <it.icon size={17} />
            {it.label}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.brass, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#3A2314", flexShrink: 0 }}>
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F1E8D6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <div style={{ fontSize: 10.5, color: "#B7A88E" }}>{user.role}</div>
          </div>
        </div>
        <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "7px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "#D8CBB2", fontSize: 13, fontWeight: 600 }}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );
}
