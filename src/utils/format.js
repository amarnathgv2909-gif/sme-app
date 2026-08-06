export const uid = (p = "id") => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
export const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
export const todayStr = () => new Date().toISOString().slice(0, 10);
export const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
export const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
