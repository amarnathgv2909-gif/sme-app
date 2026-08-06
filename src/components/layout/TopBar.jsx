import React from "react";
import { C } from "../../constants/colors.js";

export function TopBar({ title, subtitle, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
      <div>
        <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>{right}</div>
    </div>
  );
}
