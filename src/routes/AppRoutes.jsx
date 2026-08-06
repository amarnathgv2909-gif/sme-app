import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { C } from "../constants/colors.js";

const LoginPage = lazy(() => import("../pages/Login/LoginPage.jsx"));
const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage.jsx"));
const BillingPage = lazy(() => import("../pages/Billing/BillingPage.jsx"));
const InventoryPage = lazy(() => import("../pages/Inventory/InventoryPage.jsx"));
const CategoriesPage = lazy(() => import("../pages/Categories/CategoriesPage.jsx"));
const CustomersPage = lazy(() => import("../pages/Customers/CustomersPage.jsx"));
const SettingsPage = lazy(() => import("../pages/Settings/SettingsPage.jsx"));

function PageFallback() {
  return <div style={{ padding: 40, color: C.inkSoft, fontSize: 14 }}>Loading…</div>;
}

function AppShell() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex" }}>
      <Sidebar />
      <div className="scrollbar-thin" style={{ flex: 1, padding: 24, overflowY: "auto", maxHeight: "100vh" }}>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

function RequireAuth() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <AppShell />;
}

function RequireSuper() {
  const { isSuper } = useAuth();
  if (!isSuper) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function AppRoutes() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route element={<RequireSuper />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Suspense>
  );
}
