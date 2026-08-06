import React, { useState } from "react";
import { Check } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Btn } from "../common/Button.jsx";
import { inputStyle } from "../common/Field.jsx";

export function PriceEditPopover({ item, onSave, onClose }) {
  const [price, setPrice] = useState(item.price);
  return (
    <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 6, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, boxShadow: "0 12px 30px rgba(42,33,24,0.2)", zIndex: 20, width: 190 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>PRICE FOR THIS BILL ONLY</div>
      <input autoFocus type="number" style={inputStyle} value={price} onChange={(e) => setPrice(e.target.value)} />
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <Btn size="sm" style={{ flex: 1 }} onClick={() => { onSave(Number(price) || 0); onClose(); }} icon={Check}>Apply</Btn>
        <Btn size="sm" variant="ghost" onClick={onClose}>Cancel</Btn>
      </div>
    </div>
  );
}
