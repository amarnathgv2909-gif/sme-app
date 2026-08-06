import React, { useState } from "react";
import { Check, Search } from "lucide-react";
import { Modal } from "../common/Modal.jsx";
import { inputStyle } from "../common/Field.jsx";
import { Btn } from "../common/Button.jsx";
import { FramePreview } from "../common/FramePreview.jsx";
import { C } from "../../constants/colors.js";
import { inr } from "../../utils/format.js";

export function CustomerPricingModal({ customer, products, onClose, onSave }) {
  const [prices, setPrices] = useState(customer.customPrices || {});
  const [query, setQuery] = useState("");
  const filtered = products.filter((p) => !query.trim() || [p.name, p.size, p.colour].join(" ").toLowerCase().includes(query.toLowerCase()));
  const setPrice = (id, val) => setPrices((prev) => {
    const next = { ...prev };
    if (val === "" || val == null) delete next[id];
    else next[id] = Number(val);
    return next;
  });
  const activeCount = Object.keys(prices).length;
  return (
    <Modal title={`Price List — ${customer.name}`} onClose={onClose} width={480}>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 12, lineHeight: 1.5 }}>
        Set a fixed price per product for this customer. Billing will apply it automatically and Admin won't be able to change it — leave blank to use the standard selling price.
      </div>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={15} color={C.inkFaint} style={{ position: "absolute", left: 11, top: 10 }} />
        <input style={{ ...inputStyle, paddingLeft: 32 }} placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="scrollbar-thin" style={{ maxHeight: 340, overflowY: "auto", marginBottom: 14 }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
            <FramePreview product={p} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.inkFaint }}>{p.size} · {p.colour} · std {inr(p.sellingPrice)}</div>
            </div>
            <input type="number" placeholder={String(p.sellingPrice)} value={prices[p.id] ?? ""} onChange={(e) => setPrice(p.id, e.target.value)}
              style={{ ...inputStyle, width: 90, padding: "6px 8px", fontSize: 13, textAlign: "right" }} />
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: C.inkFaint, fontSize: 13, padding: 20, textAlign: "center" }}>No products match.</div>}
      </div>
      <div style={{ fontSize: 11.5, color: C.inkFaint, marginBottom: 10 }}>{activeCount} custom price{activeCount === 1 ? "" : "s"} set</div>
      <Btn style={{ width: "100%" }} icon={Check} onClick={() => onSave(prices)}>Save Price List</Btn>
    </Modal>
  );
}
