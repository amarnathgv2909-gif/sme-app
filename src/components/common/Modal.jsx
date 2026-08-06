import React from "react";
import { X } from "lucide-react";
import { C } from "../../constants/colors.js";

export function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(42,33,24,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rise-in scrollbar-thin" style={{ background: C.surface, borderRadius: 18, width, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(42,33,24,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, background: C.surface, borderRadius: "18px 18px 0 0" }}>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{title}</div>
          <button onClick={onClose} style={{ background: C.surfaceAlt, border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color={C.inkSoft} />
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}
