import React from "react";
import { C } from "../../constants/colors.js";

export function Card({ children, style, className = "" }) {
  return (
    <div className={className} style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.line}`, ...style }}>
      {children}
    </div>
  );
}
