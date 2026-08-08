import React, { useState, useMemo } from "react";
import { ShoppingCart, Search, Plus, Minus, X, Pencil, Receipt, Lock } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Card } from "../../components/common/Card.jsx";
import { Btn } from "../../components/common/Button.jsx";
import { inputStyle } from "../../components/common/Field.jsx";
import { TopBar } from "../../components/layout/TopBar.jsx";
import { ProductTile } from "../../components/billing/ProductTile.jsx";
import { PriceEditPopover } from "../../components/billing/PriceEditPopover.jsx";
import { QuickCustomerModal } from "../../components/billing/QuickCustomerModal.jsx";
import { InvoiceModal } from "../../components/billing/InvoiceModal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useCatalog } from "../../hooks/useCatalog.js";
import { useCustomers } from "../../hooks/useCustomers.js";
import { useBilling } from "../../hooks/useBilling.js";
import { effectivePrice } from "../../services/billingService.js";
import { inr } from "../../utils/format.js";

export default function BillingPage() {
  const { user, isSuper } = useAuth();
  const { products, categories } = useCatalog();
  const { customers, addCustomer, updateCustomer } = useCustomers();

  const [catFilter, setCatFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerId, setCustomerId] = useState(customers[customers.length - 1]?.id || "");
  const [editingIdx, setEditingIdx] = useState(null);
  const [quickCustOpen, setQuickCustOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const customer = customers.find((c) => c.id === customerId) || null;
  const selectedCustomer = customers.find((c) => c.id === customerId) || null;
  const filteredCustomers = useMemo(() => {
    const q = customerQuery.trim().toLowerCase();
    const matches = q
      ? customers.filter((c) => [c.name, c.phone].join(" ").toLowerCase().includes(q))
      : customers;
    if (selectedCustomer && !matches.some((c) => c.id === selectedCustomer.id)) {
      return [selectedCustomer, ...matches];
    }
    return matches;
  }, [customers, customerQuery, selectedCustomer]);

  const billing = useBilling({ products, customer, user });
  const {
    cart, discountType, setDiscountType, discountValue, setDiscountValue,
    paymentMode, setPaymentMode, gstEnabled, setGstEnabled,
    addOne, setQtyDirect, changeQty, setLinePrice, removeItem, totals, finalizeBill,
  } = billing;

  const filtered = useMemo(() => products.filter((p) => {
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [p.name, p.sku, p.barcode, p.colour, p.size, p.material].join(" ").toLowerCase().includes(q);
  }), [products, catFilter, query]);

  const handleCompleteBill = () => {
    const bill = finalizeBill();
    if (!bill) return;

    if (customer?.id && paymentMode === "Credit") {
      updateCustomer(customer.id, {
        outstanding: (customer.outstanding || 0) + bill.total,
      });
    }

    setInvoice(bill);
  };

  const handleAddQuickCustomer = (fields) => {
    const c = addCustomer(fields);
    setCustomerId(c.id);
    setQuickCustOpen(false);
  };

  return (
    <div>
      <TopBar title="Billing" subtitle="Tap a frame to add one, or type the quantity for bulk orders — prices auto-apply from the customer's price list." />
      <div className="billing-grid">
        {/* Product grid */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 220px" }}>
              <Search size={16} color={C.inkFaint} style={{ position: "absolute", left: 12, top: 12 }} />
              <input style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Search by name, size, colour, SKU, barcode…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
            <button onClick={() => setCatFilter("all")} style={catTabStyle(catFilter === "all")}>All</button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCatFilter(c.id)} style={catTabStyle(catFilter === c.id)}>{c.name}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
            {filtered.map((p) => {
              const inCart = cart.find((i) => i.productId === p.id);
              return (
                <ProductTile key={p.id} product={p} price={effectivePrice(p, customer)} cartQty={inCart?.qty || 0}
                  onTapAdd={addOne} onQtyChange={setQtyDirect} />
              );
            })}
            {filtered.length === 0 && <div style={{ color: C.inkFaint, fontSize: 13, gridColumn: "1/-1", padding: 30, textAlign: "center" }}>No products match your search.</div>}
          </div>
        </div>

        {/* Cart */}
        <Card className="billing-sidebar" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
            <ShoppingCart size={16} /> Current Bill
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, marginBottom: 5 }}>CUSTOMER</div>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <Search size={16} color={C.inkFaint} style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                style={{ ...inputStyle, paddingLeft: 34 }}
                placeholder="Search customer name or phone…"
                value={customerQuery}
                onChange={(e) => setCustomerQuery(e.target.value)}
              />
            </div>
            <div className="customer-search-row" style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
              <select style={{ ...inputStyle, flex: 1 }} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                {filteredCustomers.length === 0 && <option value="">No matching customer</option>}
                {filteredCustomers.map((c) => <option key={c.id} value={c.id}>{c.name}{c.phone ? ` ${c.phone}` : ""}</option>)}
              </select>
              <Btn variant="outline" size="sm" icon={Plus} onClick={() => setQuickCustOpen(true)} style={{ flex: "0 0 auto" }}>New</Btn>
            </div>
            {customer?.outstanding > 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: C.rustBg, color: C.rust, borderRadius: 10, fontSize: 12 }}>
                <span>Outstanding balance will be added to this bill</span>
                <span className="font-mono">{inr(customer.outstanding)}</span>
              </div>
            )}
          </div>

          <div className="scrollbar-thin" style={{ maxHeight: 260, overflowY: "auto", marginBottom: 10, borderTop: `1px solid ${C.line}`, borderBottom: cart.length ? `1px solid ${C.line}` : "none" }}>
            {cart.length === 0 && <div style={{ color: C.inkFaint, fontSize: 13, padding: "18px 0", textAlign: "center" }}>Tap a frame to start the bill.</div>}
            {cart.map((item, idx) => (
              <div key={item.productId} style={{ padding: "10px 0", borderBottom: idx < cart.length - 1 ? `1px solid ${C.line}` : "none", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: C.inkFaint }}>{item.size} · {item.colour}</div>
                  </div>
                  <button onClick={() => removeItem(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkFaint, flexShrink: 0 }}><X size={15} /></button>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => changeQty(idx, -1)} style={qtyBtnStyle}><Minus size={13} /></button>
                    <span style={{ fontSize: 13, fontWeight: 700, width: 18, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => changeQty(idx, 1)} style={qtyBtnStyle}><Plus size={13} /></button>
                  </div>
                  <div style={{ position: "relative" }}>
                    {isSuper ? (
                      <button onClick={() => setEditingIdx(editingIdx === idx ? null : idx)} className="font-mono" style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: item.price !== item.defaultPrice ? C.rust : C.walnut, fontSize: 13.5, display: "flex", alignItems: "center", gap: 3 }}>
                        {inr(item.price * item.qty)} <Pencil size={11} />
                      </button>
                    ) : (
                      <span className="font-mono" style={{ fontWeight: 700, color: C.walnut, fontSize: 13.5, display: "flex", alignItems: "center", gap: 4 }}>
                        {inr(item.price * item.qty)} <Lock size={11} color={C.inkFaint} />
                      </span>
                    )}
                    {isSuper && editingIdx === idx && (
                      <PriceEditPopover item={item} onClose={() => setEditingIdx(null)} onSave={(price) => setLinePrice(idx, price)} />
                    )}
                  </div>
                </div>
                {item.price !== item.defaultPrice && <div style={{ fontSize: 10.5, color: C.rust, marginTop: 2 }}>Custom price · default {inr(item.defaultPrice)}</div>}
                {item.price === item.defaultPrice && customer?.customPrices?.[item.productId] != null && <div style={{ fontSize: 10.5, color: C.sage, marginTop: 2 }}>Customer price list applied</div>}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <select style={{ ...inputStyle, flex: "0 0 90px" }} value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="percent">% off</option>
              <option value="flat">₹ off</option>
            </select>
            <input style={inputStyle} type="number" min="0" placeholder="Discount" value={discountValue || ""} onChange={(e) => setDiscountValue(e.target.value)} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: C.surfaceAlt, borderRadius: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>GST Bill</div>
              <div style={{ fontSize: 10.5, color: C.inkFaint }}>Saves to the GST invoice table</div>
            </div>
            <button onClick={() => setGstEnabled(!gstEnabled)}
              style={{ width: 40, height: 22, borderRadius: 999, border: "none", cursor: "pointer", background: gstEnabled ? C.sage : C.line, position: "relative", flexShrink: 0 }}>
              <span style={{ position: "absolute", top: 3, left: gstEnabled ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {["Cash", "UPI", "Card", "Credit"].map((m) => (
              <button key={m} onClick={() => setPaymentMode(m)} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${paymentMode === m ? C.walnut : C.line}`,
                background: paymentMode === m ? C.walnut : "transparent", color: paymentMode === m ? "#fff" : C.inkSoft,
              }}>{m}</button>
            ))}
          </div>

          <div style={{ fontSize: 13, color: C.inkSoft, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>Subtotal</span><span className="font-mono">{inr(totals.subtotal)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div style={{ fontSize: 13, color: C.rust, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>Discount</span><span className="font-mono">−{inr(totals.discountAmount)}</span>
            </div>
          )}
          {gstEnabled && (
            <div style={{ fontSize: 13, color: C.inkSoft, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>GST</span><span className="font-mono">{inr(totals.gstAmount)}</span>
            </div>
          )}
          <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, display: "flex", justifyContent: "space-between", margin: "8px 0 14px", paddingTop: 8, borderTop: `1px dashed ${C.line}` }}>
            <span className="font-display">Total</span><span className="font-mono">{inr(totals.total)}</span>
          </div>

          <Btn size="lg" style={{ width: "100%" }} icon={Receipt} disabled={cart.length === 0} onClick={handleCompleteBill}>
            Complete Bill
          </Btn>
        </Card>
      </div>

      {quickCustOpen && <QuickCustomerModal onClose={() => setQuickCustOpen(false)} onAdd={handleAddQuickCustomer} />}
      {invoice && <InvoiceModal bill={invoice} onClose={() => setInvoice(null)} />}
    </div>
  );
}

const catTabStyle = (active) => ({
  padding: "7px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer",
  border: `1px solid ${active ? C.walnut : C.line}`, background: active ? C.walnut : "transparent", color: active ? "#fff" : C.inkSoft,
});
const qtyBtnStyle = { width: 22, height: 22, borderRadius: 6, border: `1px solid ${C.line}`, background: C.surfaceAlt, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
