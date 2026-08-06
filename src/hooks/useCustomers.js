import { useContext } from "react";
import { CustomerContext } from "../context/CustomerContext.jsx";

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomers must be used within CustomerProvider");
  return ctx;
}
