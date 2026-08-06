import React, { useState } from "react";
import { Modal } from "../common/Modal.jsx";
import { Field, inputStyle } from "../common/Field.jsx";
import { Btn } from "../common/Button.jsx";
import { FramePreview } from "../common/FramePreview.jsx";

export function StockAdjustModal({ product, onClose, onSave }) {
  const [type, setType] = useState("Purchase Entry");
  const [qty, setQty] = useState(1);
  const types = ["Purchase Entry", "Stock Adjustment (+)", "Stock Adjustment (−)", "Damaged Stock", "Returned Stock"];
  const isAdd = type === "Purchase Entry" || type === "Stock Adjustment (+)" || type === "Returned Stock";
  return (
    <Modal title={`Update Stock — ${product.name}`} onClose={onClose} width={380}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <FramePreview product={product} size={48} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{product.size} · {product.colour}</div>
          <div style={{ fontSize: 12, color: "#A79A88" }}>Current stock: <b>{product.stock}</b></div>
        </div>
      </div>
      <Field label="Adjustment type">
        <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Quantity">
        <input style={inputStyle} type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
      </Field>
      <div style={{ fontSize: 12.5, color: "#786A5A", marginBottom: 14 }}>
        New stock will be <b>{Math.max(0, product.stock + (isAdd ? Number(qty) || 0 : -(Number(qty) || 0)))}</b>
      </div>
      <Btn style={{ width: "100%" }} onClick={() => onSave(isAdd ? Number(qty) || 0 : -(Number(qty) || 0))}>Save</Btn>
    </Modal>
  );
}
