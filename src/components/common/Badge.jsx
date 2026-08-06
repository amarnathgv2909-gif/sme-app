import React from "react";
import { C } from "../../constants/colors.js";

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: C.surfaceAlt, fg: C.inkSoft },
    good: { bg: C.sageBg, fg: C.sage },
    bad: { bg: C.rustBg, fg: C.rust },
    brass: { bg: "#F1E3C7", fg: "#7A5620" },
  };
  const t = tones[tone];
  return (
    <span style={{ background: t.bg, color: t.fg, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, letterSpacing: 0.3, textTransform: "uppercase" }}>
      {children}
    </span>
  );
}
