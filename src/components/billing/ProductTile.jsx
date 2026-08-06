import React from "react";
import { Badge } from "../common/Badge.jsx";
import { FramePreview } from "../common/FramePreview.jsx";
import { inputStyle } from "../common/Field.jsx";
import { C } from "../../constants/colors.js";
import { inr } from "../../utils/format.js";

export function ProductTile({ product: p, price, cartQty, onTapAdd, onQtyChange }) {
  const low = p.stock <= p.minStock;
  const priceIsCustom = price !== p.sellingPrice;
  return (
    <div className="frame-tile corner-mark" style={{
      textAlign: "left", background: C.surface, border: `1px solid ${cartQty ? C.brass : C.line}`,
      borderRadius: 14, padding: 10, boxShadow: "0 6px 16px -10px rgba(42,33,24,0.4)", opacity: p.stock > 0 ? 1 : 0.5,
    }}>
      <div onClick={() => p.stock > 0 && onTapAdd(p)} style={{ display: "flex", justifyContent: "center", marginBottom: 8, cursor: p.stock > 0 ? "pointer" : "not-allowed" }} title="Tap to add 1">
        <FramePreview product={p} size={92} />
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, lineHeight: 1.25, minHeight: 30 }}>{p.name}</div>
      <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 2 }}>{p.size} · {p.colour}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
        <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: priceIsCustom ? C.sage : C.walnut }}>{inr(price)}</span>
        <Badge tone={p.stock <= 0 ? "bad" : low ? "bad" : "good"}>{p.stock <= 0 ? "Out" : `${p.stock} in stock`}</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
        <input
          type="number" min={0} max={p.stock} disabled={p.stock <= 0}
          value={cartQty || ""} placeholder="Qty"
          onChange={(e) => onQtyChange(p, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          style={{ ...inputStyle, padding: "6px 8px", fontSize: 13, textAlign: "center", flex: 1 }}
        />
        <span style={{ fontSize: 11, color: C.inkFaint }}>pcs</span>
      </div>
      {cartQty > 0 && <div style={{ marginTop: 6, textAlign: "center", background: C.brass, color: "#fff", borderRadius: 6, fontSize: 11, fontWeight: 700, padding: "3px 0" }}>In order · {cartQty}</div>}
    </div>
  );
}
