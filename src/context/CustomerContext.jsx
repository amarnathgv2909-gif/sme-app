import React, { createContext, useState, useCallback } from "react";
import * as customerService from "../services/customerService.js";

export const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(() => customerService.listCustomers());

  const refresh = useCallback(() => setCustomers(customerService.listCustomers()), []);

  const addCustomer = useCallback((fields) => {
    const c = customerService.addCustomer(fields);
    refresh();
    return c;
  }, [refresh]);

  const updateCustomer = useCallback((id, patch) => {
    customerService.updateCustomer(id, patch);
    refresh();
  }, [refresh]);

  const setPriceList = useCallback((id, customPrices) => {
    customerService.setCustomerPriceList(id, customPrices);
    refresh();
  }, [refresh]);

  const removeCustomer = useCallback((id) => {
    customerService.removeCustomer(id);
    refresh();
  }, [refresh]);

  const value = {
    customers, refresh, addCustomer, updateCustomer, setPriceList, removeCustomer,
    getPurchaseHistory: customerService.getPurchaseHistory,
    getCustomerStats: customerService.getCustomerStats,
  };
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}
