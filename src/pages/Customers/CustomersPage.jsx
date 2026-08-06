import React, { useState } from "react";
import { Search, Plus, Pencil, IndianRupee, History, Trash2 } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Card } from "../../components/common/Card.jsx";
import { Btn } from "../../components/common/Button.jsx";
import { inputStyle } from "../../components/common/Field.jsx";
import { TopBar } from "../../components/layout/TopBar.jsx";
import { CustomerFormModal } from "../../components/customer/CustomerFormModal.jsx";
import { CustomerPricingModal } from "../../components/customer/CustomerPricingModal.jsx";
import { PurchaseHistoryModal } from "../../components/customer/PurchaseHistoryModal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useCatalog } from "../../hooks/useCatalog.js";
import { useCustomers } from "../../hooks/useCustomers.js";
import { inr } from "../../utils/format.js";
export default function CustomersPage() {
  const { isSuper } = useAuth();
  const { products } = useCatalog();
  const { customers, addCustomer, updateCustomer, setPriceList, removeCustomer, getCustomerStats, getPurchaseHistory } = useCustomers();
  const [query, setQuery] = useState("");
  const [formModal, setFormModal] = useState(null);
  const [pricingModal, setPricingModal] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);

  const filtered = customers.filter((c) => !query.trim() || [c.name, c.phone].join(" ").toLowerCase().includes(query.toLowerCase()));

  const saveCustomer = (fields) => {
    if (fields.id) updateCustomer(fields.id, fields);
    else addCustomer(fields);
    setFormModal(null);
  };

  return (
    <div>
      <TopBar title="Customers" subtitle={`${customers.length} customers on file`} right={<Btn icon={Plus} onClick={() => setFormModal("new")}>Add Customer</Btn>} />
      <div style={{ position: "relative", marginBottom: 14, maxWidth: 340 }}>
        <Search size={16} color={C.inkFaint} style={{ position: "absolute", left: 12, top: 12 }} />
        <input style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Search by name or phone…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map((c) => {
          const stats = getCustomerStats(c.id);
          return (
            <Card key={c.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 2 }}>{c.phone || "No phone on file"}</div>
                  {c.gstNumber && <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 1 }}>GSTIN: {c.gstNumber}</div>}
                </div>
                <Btn size="sm" variant="ghost" icon={Pencil} onClick={() => setFormModal(c)} />
              </div>
              {c.address && <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 8 }}>{c.address}</div>}
              {c.customPrices && Object.keys(c.customPrices).length > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "#7A5620", background: "#F1E3C7", display: "inline-block", padding: "2px 8px", borderRadius: 999 }}>
                  {Object.keys(c.customPrices).length} custom prices
                </div>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10.5, color: C.inkFaint, fontWeight: 700, textTransform: "uppercase" }}>Total Purchases</div>
                  <div className="font-mono" style={{ fontSize: 13.5, fontWeight: 700, color: C.walnut }}>{inr(stats.totalPurchases)}</div>
                </div>
                {c.outstanding > 0 && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, color: C.inkFaint, fontWeight: 700, textTransform: "uppercase" }}>Outstanding</div>
                    <div className="font-mono" style={{ fontSize: 13.5, fontWeight: 700, color: C.rust }}>{inr(c.outstanding)}</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <Btn size="sm" variant="subtle" icon={History} style={{ flex: 1 }} onClick={() => setHistoryModal(c)}>History</Btn>
                {isSuper && <Btn size="sm" variant="subtle" icon={IndianRupee} style={{ flex: 1 }} onClick={() => setPricingModal(c)}>Prices</Btn>}
                {isSuper && <Btn size="sm" variant="danger" icon={Trash2} style={{ flex: 1 }} onClick={() => {
                  if (window.confirm(`Delete customer ${c.name}? This cannot be undone.`)) removeCustomer(c.id);
                }}>Delete</Btn>}
              </div>
            </Card>
          );
        })}
      </div>

      {formModal && <CustomerFormModal customer={formModal === "new" ? null : formModal} onClose={() => setFormModal(null)} onSave={saveCustomer} />}
      {pricingModal && (
        <CustomerPricingModal customer={pricingModal} products={products}
          onClose={() => setPricingModal(null)}
          onSave={(prices) => { setPriceList(pricingModal.id, prices); setPricingModal(null); }} />
      )}
      {historyModal && (
        <PurchaseHistoryModal customer={historyModal}
          history={getPurchaseHistory(historyModal.id)}
          stats={getCustomerStats(historyModal.id)}
          onClose={() => setHistoryModal(null)} />
      )}
    </div>
  );
}
