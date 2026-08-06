import { customersDb, gstBillsDb, nonGstBillsDb } from "../database/index.js";
import { uid } from "../utils/format.js";

export function listCustomers() {
  return customersDb.getAll();
}

export function addCustomer(fields) {
  return customersDb.insert({
    id: uid("cus"),
    outstanding: 0,
    customPrices: {},
    createdAt: new Date().toISOString(),
    ...fields,
  });
}

export function updateCustomer(id, patch) {
  return customersDb.update(id, patch);
}

export function setCustomerPriceList(id, customPrices) {
  return customersDb.update(id, { customPrices });
}

export function removeCustomer(id) {
  customersDb.remove(id);
}

/**
 * The core of "purchase history stored per customer": pulls every invoice
 * for this customer from BOTH the GST and Non-GST tables, tags each with
 * its bill type, and returns them newest-first.
 */
export function getPurchaseHistory(customerId) {
  const gst = gstBillsDb.query((b) => b.customerId === customerId).map((b) => ({ ...b, billType: "GST" }));
  const nonGst = nonGstBillsDb.query((b) => b.customerId === customerId).map((b) => ({ ...b, billType: "Non-GST" }));
  return [...gst, ...nonGst].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getCustomerStats(customerId) {
  const history = getPurchaseHistory(customerId);
  const totalPurchases = history.reduce((s, b) => s + b.total, 0);
  const gstPurchases = history.filter((b) => b.billType === "GST").reduce((s, b) => s + b.total, 0);
  const nonGstPurchases = history.filter((b) => b.billType === "Non-GST").reduce((s, b) => s + b.total, 0);
  return {
    orderCount: history.length,
    totalPurchases,
    gstPurchases,
    nonGstPurchases,
    lastPurchaseDate: history[0]?.date || null,
  };
}
