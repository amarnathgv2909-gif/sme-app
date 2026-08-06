import React from "react";
import { C } from "../../constants/colors.js";

export const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 9, border: `1px solid ${C.line}`,
  fontSize: 14, color: C.ink, outline: "none", background: "#FEFCF8", boxSizing: "border-box",
};

export function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      {children}
    </label>
  );
}
