import React, { useState } from "react";
import { Check } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Card } from "../../components/common/Card.jsx";
import { Field, inputStyle } from "../../components/common/Field.jsx";
import { Btn } from "../../components/common/Button.jsx";
import { TopBar } from "../../components/layout/TopBar.jsx";
import { useSettings } from "../../hooks/useSettings.js";

export default function SettingsPage() {
  const { settings, saveSettings } = useSettings();
  const [f, setF] = useState(settings);

  return (
    <div>
      <TopBar title="Settings" subtitle="Business profile, tax, and printing defaults" />
      <Card style={{ padding: 20, maxWidth: 480 }}>
        <Field label="Business name"><input style={inputStyle} value={f.businessName} onChange={(e) => setF({ ...f, businessName: e.target.value })} /></Field>
        <Field label="Tagline"><input style={inputStyle} value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} /></Field>
        <Field label="Low stock threshold (default)"><input style={inputStyle} type="number" value={f.lowStockThreshold} onChange={(e) => setF({ ...f, lowStockThreshold: Number(e.target.value) })} /></Field>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Default GST on new bills</div>
            <div style={{ fontSize: 11.5, color: C.inkFaint }}>Staff can still toggle it per bill in Billing</div>
          </div>
          <button onClick={() => setF({ ...f, gstEnabled: !f.gstEnabled })}
            style={{ width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", background: f.gstEnabled ? C.sage : C.line, position: "relative" }}>
            <span style={{ position: "absolute", top: 3, left: f.gstEnabled ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
          </button>
        </div>
        {f.gstEnabled && (
          <Field label="GST %"><input style={inputStyle} type="number" value={f.gstPercent} onChange={(e) => setF({ ...f, gstPercent: Number(e.target.value) })} /></Field>
        )}
        <Btn style={{ width: "100%", marginTop: 8 }} icon={Check} onClick={() => saveSettings(f)}>Save Settings</Btn>
      </Card>
      <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 14, maxWidth: 480, lineHeight: 1.6 }}>
        Data is stored in this browser via <code>src/database/</code> — customers, products, categories, settings, and
        two separate bill tables (GST and Non-GST). See the project README for how to migrate this to a real embedded SQLite database.
      </div>
    </div>
  );
}
