import React, { useState } from "react";
import { Lock, Frame as FrameIcon } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Card } from "../../components/common/Card.jsx";
import { Field, inputStyle } from "../../components/common/Field.jsx";
import { Btn } from "../../components/common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useSettings } from "../../hooks/useSettings.js";
import { getDemoPasscode } from "../../services/authService.js";

export default function LoginPage() {
  const { login } = useAuth();
  const { settings } = useSettings();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    const result = login(username, password);
    if (!result.ok) setErr(result.error);
    else setErr("");
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 20% 20%, #EFE3C9 0%, ${C.bg} 55%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="rise-in" style={{ width: 400, maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: C.walnut, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 10px 24px rgba(92,58,33,0.35)" }}>
            <FrameIcon size={26} color={C.brassSoft} />
          </div>
          <div className="font-display" style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{settings.businessName}</div>
          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 4 }}>{settings.tagline}</div>
        </div>

        <Card style={{ padding: 22 }}>
          <div>
            <Field label="Username">
              <input style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="e.g. superadmin" />
            </Field>
            <Field label="Password">
              <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" />
            </Field>
            {err && <div style={{ background: C.rustBg, color: C.rust, fontSize: 12.5, padding: "8px 10px", borderRadius: 8, marginBottom: 12 }}>{err}</div>}
            <Btn onClick={submit} style={{ width: "100%" }} size="lg" icon={Lock}>Sign in</Btn>
          </div>
          <div style={{ marginTop: 14, fontSize: 11.5, color: C.inkFaint, textAlign: "center", lineHeight: 1.5 }}>
            Prototype login — usernames and passwords are shown for demo only.<br />
            superadmin: <b>{getDemoPasscode("superadmin")}</b> · admin: <b>{getDemoPasscode("admin")}</b>
          </div>
        </Card>
      </div>
    </div>
  );
}
