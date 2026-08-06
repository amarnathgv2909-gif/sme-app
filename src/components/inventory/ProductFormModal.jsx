import React, { useState } from "react";
import { Modal } from "../common/Modal.jsx";
import { Field, inputStyle } from "../common/Field.jsx";
import { Btn } from "../common/Button.jsx";
import { FramePreview } from "../common/FramePreview.jsx";
import { C, COLOUR_HEX } from "../../constants/colors.js";

export function ProductFormModal({ product, categories, onClose, onSave, canEditPrice }) {
  const [f, setF] = useState(product || {
    name: "", category: categories[0]?.id || "", material: "Wooden", colour: "Black", size: "8x10",
    sku: "", barcode: "", purchasePrice: 100, sellingPrice: 200, stock: 0, minStock: 5, status: "Active",
  });
  const set = (k, v) => setF({ ...f, [k]: v });
  return (
    <Modal title={product ? "Edit Product" : "Add Product"} onClose={onClose} width={480}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <FramePreview product={{ ...f, name: f.name || "Preview" }} size={90} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ gridColumn: "1/-1" }}><Field label="Product name"><input style={inputStyle} value={f.name} onChange={(e) => set("name", e.target.value)} /></Field></div>
        <Field label="Category">
          <select style={inputStyle} value={f.category} onChange={(e) => set("category", e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Material">
          <select style={inputStyle} value={f.material} onChange={(e) => set("material", e.target.value)}>
            {["Wooden", "MDF", "Acrylic", "Metal", "PVC", "Fiber"].map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Colour">
          <select style={inputStyle} value={f.colour} onChange={(e) => set("colour", e.target.value)}>
            {Object.keys(COLOUR_HEX).map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Size"><input style={inputStyle} value={f.size} onChange={(e) => set("size", e.target.value)} placeholder="e.g. 8x10" /></Field>
        <Field label="SKU"><input style={inputStyle} value={f.sku} onChange={(e) => set("sku", e.target.value)} /></Field>
        <Field label="Barcode"><input style={inputStyle} value={f.barcode} onChange={(e) => set("barcode", e.target.value)} /></Field>
        <Field label="Purchase price (₹)">
          <input style={{ ...inputStyle, ...(canEditPrice ? {} : { background: C.surfaceAlt, color: C.inkFaint }) }} type="number" value={f.purchasePrice} disabled={!canEditPrice} onChange={(e) => set("purchasePrice", Number(e.target.value))} />
        </Field>
        <Field label="Selling price (₹)">
          <input style={{ ...inputStyle, ...(canEditPrice ? {} : { background: C.surfaceAlt, color: C.inkFaint }) }} type="number" value={f.sellingPrice} disabled={!canEditPrice} onChange={(e) => set("sellingPrice", Number(e.target.value))} />
        </Field>
        <Field label="Opening / current stock"><input style={inputStyle} type="number" value={f.stock} onChange={(e) => set("stock", Number(e.target.value))} /></Field>
        <Field label="Minimum stock (low alert)"><input style={inputStyle} type="number" value={f.minStock} onChange={(e) => set("minStock", Number(e.target.value))} /></Field>
      </div>
      {!canEditPrice && <div style={{ fontSize: 11.5, color: C.inkFaint, marginBottom: 10 }}>Only Super Admin can change permanent prices. Adjust prices per-bill from the Billing screen instead.</div>}
      <Btn style={{ width: "100%", marginTop: 6 }} disabled={!f.name.trim()} onClick={() => onSave(f)}>
        {product ? "Save Changes" : "Add Product"}
      </Btn>
    </Modal>
  );
}
