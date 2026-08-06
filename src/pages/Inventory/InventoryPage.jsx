import React, { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Card } from "../../components/common/Card.jsx";
import { Badge } from "../../components/common/Badge.jsx";
import { Btn } from "../../components/common/Button.jsx";
import { Modal } from "../../components/common/Modal.jsx";
import { inputStyle } from "../../components/common/Field.jsx";
import { FramePreview } from "../../components/common/FramePreview.jsx";
import { TopBar } from "../../components/layout/TopBar.jsx";
import { StockAdjustModal } from "../../components/inventory/StockAdjustModal.jsx";
import { ProductFormModal } from "../../components/inventory/ProductFormModal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useCatalog } from "../../hooks/useCatalog.js";
import { inr } from "../../utils/format.js";

export default function InventoryPage() {
  const { isSuper } = useAuth();
  const { products, categories, saveProduct, deleteProduct, adjustStock } = useCatalog();
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [stockModal, setStockModal] = useState(null);
  const [formModal, setFormModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => products.filter((p) => {
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [p.name, p.sku, p.barcode, p.colour, p.size].join(" ").toLowerCase().includes(q);
  }), [products, catFilter, query]);

  const catName = (id) => categories.find((c) => c.id === id)?.name || "—";

  return (
    <div>
      <TopBar title="Inventory" subtitle={`${products.length} product variations tracked separately by size & colour`}
        right={isSuper && <Btn icon={Plus} onClick={() => setFormModal("new")}>Add Product</Btn>} />

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search size={16} color={C.inkFaint} style={{ position: "absolute", left: 12, top: 12 }} />
          <input style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select style={{ ...inputStyle, width: 200 }} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <Card style={{ overflow: "hidden" }}>
        <div className="scrollbar-thin" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr style={{ background: C.surfaceAlt, textAlign: "left" }}>
                {["", "Product", "Category", "SKU", "Purchase", "Selling", "Stock", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: 0.3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const low = p.stock <= p.minStock;
                return (
                  <tr key={p.id} style={{ borderTop: `1px solid ${C.line}` }}>
                    <td style={{ padding: "8px 12px" }}><FramePreview product={p} size={40} /></td>
                    <td style={{ padding: "8px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{p.name}</div>
                      <div style={{ fontSize: 11.5, color: C.inkFaint }}>{p.size} · {p.colour} · {p.material}</div>
                    </td>
                    <td style={{ padding: "8px 12px", fontSize: 12.5, color: C.inkSoft }}>{catName(p.category)}</td>
                    <td className="font-mono" style={{ padding: "8px 12px", fontSize: 12, color: C.inkSoft }}>{p.sku}</td>
                    <td className="font-mono" style={{ padding: "8px 12px", fontSize: 13 }}>{inr(p.purchasePrice)}</td>
                    <td className="font-mono" style={{ padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>{inr(p.sellingPrice)}</td>
                    <td style={{ padding: "8px 12px" }}><Badge tone={low ? "bad" : "good"}>{p.stock} pcs</Badge></td>
                    <td style={{ padding: "8px 12px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn size="sm" variant="subtle" onClick={() => setStockModal(p)}>Adjust</Btn>
                        {isSuper && <Btn size="sm" variant="ghost" icon={Pencil} onClick={() => setFormModal(p)} />}
                        {isSuper && <Btn size="sm" variant="ghost" icon={Trash2} style={{ color: C.rust }} onClick={() => setConfirmDelete(p)} />}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 30, textAlign: "center", color: C.inkFaint, fontSize: 13 }}>No products match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {stockModal && (
        <StockAdjustModal product={stockModal} onClose={() => setStockModal(null)}
          onSave={(delta) => { adjustStock(stockModal.id, delta); setStockModal(null); }} />
      )}
      {formModal && (
        <ProductFormModal product={formModal === "new" ? null : formModal} categories={categories} canEditPrice={isSuper}
          onClose={() => setFormModal(null)} onSave={(p) => { saveProduct(p); setFormModal(null); }} />
      )}
      {confirmDelete && (
        <Modal title="Delete Product?" onClose={() => setConfirmDelete(null)} width={360}>
          <div style={{ fontSize: 13.5, color: C.inkSoft, marginBottom: 16 }}>
            This will permanently remove <b style={{ color: C.ink }}>{confirmDelete.name} ({confirmDelete.size}, {confirmDelete.colour})</b> from inventory. This can't be undone.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" style={{ flex: 1 }} onClick={() => setConfirmDelete(null)}>Cancel</Btn>
            <Btn variant="danger" style={{ flex: 1 }} onClick={() => { deleteProduct(confirmDelete.id); setConfirmDelete(null); }}>Delete</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
