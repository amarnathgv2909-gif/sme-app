import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { C, COLOUR_HEX } from "../../constants/colors.js";
import { gradFor } from "../../utils/frameVisuals.js";

export function FramePreview({ product, size = 100 }) {
  const border = COLOUR_HEX[product.colour] || C.walnut;
  const thickness = product.material === "Acrylic" ? Math.round(size * 0.05) : product.material === "Metal" ? Math.round(size * 0.06) : Math.round(size * 0.11);
  const [g1, g2] = gradFor(product.name + product.colour);
  return (
    <div style={{ width: size, height: size, background: border, borderRadius: 8, padding: thickness, boxSizing: "border-box", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 2px 6px rgba(0,0,0,0.35)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 3, background: C.surfaceAlt, padding: Math.max(3, thickness * 0.3), boxSizing: "border-box" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 2, background: `linear-gradient(135deg, ${g1}, ${g2})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ImageIcon size={Math.max(14, size * 0.22)} color="rgba(255,255,255,0.55)" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
