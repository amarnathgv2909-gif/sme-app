import React from "react";
import { C } from "../../constants/colors.js";

export function Btn({ children, onClick, variant = "solid", size = "md", disabled, icon: Icon, style, type = "button" }) {
  const sizes = { sm: { padding: "7px 12px", fontSize: 13 }, md: { padding: "10px 16px", fontSize: 14 }, lg: { padding: "14px 22px", fontSize: 16 } };
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
    borderRadius: 10, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent", transition: "filter .12s ease, transform .05s ease",
    opacity: disabled ? 0.5 : 1, ...sizes[size], ...style,
  };
  const variants = {
    solid: { background: C.walnut, color: "#FBF6EC" },
    brass: { background: C.brass, color: "#FBF6EC" },
    outline: { background: "transparent", color: C.walnut, border: `1px solid ${C.line}` },
    ghost: { background: "transparent", color: C.inkSoft },
    danger: { background: C.rustBg, color: C.rust },
    subtle: { background: C.surfaceAlt, color: C.ink },
  };
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
      {Icon && <Icon size={size === "lg" ? 18 : 16} />}
      {children}
    </button>
  );
}
