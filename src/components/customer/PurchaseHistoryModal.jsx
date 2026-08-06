import React from "react";
import { Modal } from "../common/Modal.jsx";
import { Card } from "../common/Card.jsx";
import { Badge } from "../common/Badge.jsx";
import { C } from "../../constants/colors.js";
import { inr, fmtDate, fmtTime } from "../../utils/format.js";

// Shows every invoice for one customer, pulled from both the GST and
// Non-GST tables via customerService.getPurchaseHistory().
export function PurchaseHistoryModal({ customer, history, stats, onClose }) {
  return (
    <Modal title={`Purchase History — ${customer.name}`} onClose={onClose} width={520}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        <Card style={{ padding: 12, border: "none", background: C.surfaceAlt }}>
          <div style={{ fontSize: 10.5, color: C.inkFaint, fontWeight: 700, textTransform: "uppercase" }}>Total</div>
          <div className="font-mono" style={{ fontSize: 15, fontWeight: 700, color: C.walnut }}>{inr(stats.totalPurchases)}</div>
        </Card>
        <Card style={{ padding: 12, border: "none", background: "#F1E3C7" }}>
          <div style={{ fontSize: 10.5, color: "#7A5620", fontWeight: 700, textTransform: "uppercase" }}>GST Bills</div>
          <div className="font-mono" style={{ fontSize: 15, fontWeight: 700, color: "#7A5620" }}>{inr(stats.gstPurchases)}</div>
        </Card>
        <Card style={{ padding: 12, border: "none", background: C.sageBg }}>
          <div style={{ fontSize: 10.5, color: C.sage, fontWeight: 700, textTransform: "uppercase" }}>Non-GST Bills</div>
          <div className="font-mono" style={{ fontSize: 15, fontWeight: 700, color: C.sage }}>{inr(stats.nonGstPurchases)}</div>
        </Card>
      </div>

      <div className="scrollbar-thin" style={{ maxHeight: 400, overflowY: "auto" }}>
        {history.length === 0 && <div style={{ color: C.inkFaint, fontSize: 13, textAlign: "center", padding: 30 }}>No purchases recorded yet.</div>}
        {history.map((b) => (
          <Card key={b.id} style={{ padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{b.billNo}</div>
                <div style={{ fontSize: 11.5, color: C.inkFaint }}>{fmtDate(b.date)} · {fmtTime(b.date)} · {b.paymentMode}</div>
              </div>
              <Badge tone={b.billType === "GST" ? "brass" : "neutral"}>{b.billType}</Badge>
            </div>
            {b.items.map((it) => (
              <div key={it.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.inkSoft }}>
                <span>{it.name} × {it.qty}</span><span className="font-mono">{inr(it.lineTotal)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, marginTop: 6, paddingTop: 6, borderTop: `1px dashed ${C.line}` }}>
              <span>Total</span><span className="font-mono">{inr(b.total)}</span>
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
}
