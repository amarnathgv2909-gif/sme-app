import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CatalogProvider } from "./context/CatalogContext.jsx";
import { CustomerProvider } from "./context/CustomerContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { seedDatabaseIfEmpty } from "./database/index.js";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { C } from "./constants/colors.js";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedDatabaseIfEmpty();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.inkSoft, fontSize: 14 }}>Loading Sri Maruthi Enterprises…</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <CatalogProvider>
            <CustomerProvider>
              <AppRoutes />
            </CustomerProvider>
          </CatalogProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
