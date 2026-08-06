import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, IndianRupee, TrendingUp, Receipt, Users, AlertTriangle, Boxes } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Card } from "../../components/common/Card.jsx";
import { Badge } from "../../components/common/Badge.jsx";
import { Btn } from "../../components/common/Button.jsx";
import { TopBar } from "../../components/layout/TopBar.jsx";
import { FramePreview } from "../../components/common/FramePreview.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useCatalog } from "../../hooks/useCatalog.js";
import { useCustomers } from "../../hooks/useCustomers.js";
import { useSettings } from "../../hooks/useSettings.js";
import { getAllBills } from "../../services/billingService.js";
import { inr, todayStr, fmtDate, fmtTime } from "../../utils/format.js";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useCatalog();
  const { customers } = useCustomers();
  const { settings } = useSettings();

  const bills = useMemo(() => getAllBills(), []);

  const stats = useMemo(() => {
    const today = todayStr();
    const monthKey = today.slice(0, 7);
    const todayBills = bills.filter((b) => b.date.slice(0, 10) === today);
    const monthBills = bills.filter((b) => b.date.slice(0, 7) === monthKey);
    const todaySales = todayBills.reduce((s, b) => s + b.total, 0);
    const monthSales = monthBills.reduce((s, b) => s + b.total, 0);
    const lowStock = products.filter((p) => p.stock <= (p.minStock ?? settings.lowStockThreshold));
    const inventoryValue = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0);
    const qtyByProduct = {};
    bills.forEach((b) => b.items.forEach((it) => { qtyByProduct[it.productId] = (qtyByProduct[it.productId] || 0) + it.qty; }));
    const topSelling = Object.entries(qtyByProduct)
      .map(([pid, qty]) => ({ product: products.find((p) => p.id === pid), qty }))
      .filter((r) => r.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    const recentBills = [...bills].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    return { todaySales, monthSales, todayBillsCount: todayBills.length, lowStock, inventoryValue, topSelling, recentBills };
  }, [products, bills, settings]);

  const statCards = [
    { label: "Today's Sales", value: inr(stats.todaySales), icon: IndianRupee, tone: "brass" },
    { label: "Monthly Sales", value: inr(stats.monthSales), icon: TrendingUp, tone: "sage" },
    { label: "Bills Today", value: stats.todayBillsCount, icon: Receipt, tone: "neutral" },
    { label: "Total Customers", value: customers.length, icon: Users, tone: "neutral" },
    { label: "Low Stock Items", value: stats.lowStock.length, icon: AlertTriangle, tone: stats.lowStock.length ? "bad" : "good" },
    { label: "Inventory Value", value: inr(stats.inventoryValue), icon: Boxes, tone: "neutral" },
  ];
  const toneBg = { brass: "#F1E3C7", sage: C.sageBg, bad: C.rustBg, good: C.sageBg, neutral: C.surfaceAlt };
  const toneFg = { brass: "#7A5620", sage: C.sage, bad: C.rust, good: C.sage, neutral: C.walnut };

  return (
    <div>
      <TopBar title={`Welcome, ${user.name.split(" ")[0]}`} subtitle={`${settings.businessName} · ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`}
        right={<>
          <Btn icon={ShoppingCart} onClick={() => navigate("/billing")}>Quick Billing</Btn>
          <Btn variant="outline" icon={Plus} onClick={() => navigate("/inventory")}>Add Stock</Btn>
        </>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 22 }}>
        {statCards.map((s) => (
          <Card key={s.label} style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: toneBg[s.tone], display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={17} color={toneFg[s.tone]} />
              </div>
            </div>
            <div className="font-display" style={{ fontSize: 21, fontWeight: 700, color: C.ink }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12, color: C.ink }}>Recent Bills</div>
          {stats.recentBills.length === 0 && <div style={{ color: C.inkFaint, fontSize: 13 }}>No bills yet. Head to Billing to create the first one.</div>}
          {stats.recentBills.map((b) => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
                  {b.billNo} · {b.customerName} <Badge tone={b.billType === "GST" ? "brass" : "neutral"}>{b.billType}</Badge>
                </div>
                <div style={{ fontSize: 11.5, color: C.inkFaint }}>{fmtDate(b.date)} · {fmtTime(b.date)} · {b.items.length} items</div>
              </div>
              <div style={{ fontWeight: 700, color: C.walnut, fontFamily: "'JetBrains Mono', monospace" }}>{inr(b.total)}</div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12, color: C.ink }}>Top Selling Frames</div>
          {stats.topSelling.length === 0 && <div style={{ color: C.inkFaint, fontSize: 13 }}>No sales recorded yet.</div>}
          {stats.topSelling.map((r) => (
            <div key={r.product.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
              <FramePreview product={r.product} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.product.name}</div>
                <div style={{ fontSize: 11, color: C.inkFaint }}>{r.product.size} · {r.product.colour}</div>
              </div>
              <Badge tone="brass">{r.qty} sold</Badge>
            </div>
          ))}
        </Card>
      </div>

      {stats.lowStock.length > 0 && (
        <Card style={{ padding: 18, marginTop: 16, border: `1px solid ${C.rust}22` }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12, color: C.rust, display: "flex", alignItems: "center", gap: 7 }}>
            <AlertTriangle size={16} /> Low Stock Alert
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {stats.lowStock.slice(0, 8).map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, background: C.rustBg, borderRadius: 10, padding: "8px 10px" }}>
                <FramePreview product={p} size={30} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.rust }}>{p.stock} left · {p.size}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
