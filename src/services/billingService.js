import { gstBillsDb, nonGstBillsDb } from "../database/index.js";
import { deductStockForItems } from "./inventoryService.js";
import { uid } from "../utils/format.js";

export function effectivePrice(product, customer) {
  const override = customer?.customPrices?.[product.id];
  return override != null ? override : product.sellingPrice;
}

export function calculateTotals({ cart, discountType, discountValue, gstEnabled, gstPercent }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount =
    discountType === "percent"
      ? Math.round((subtotal * (Number(discountValue) || 0)) / 100)
      : Math.min(Number(discountValue) || 0, subtotal);
  const gstAmount = gstEnabled ? Math.round(((subtotal - discountAmount) * gstPercent) / 100) : 0;
  const total = subtotal - discountAmount + gstAmount;
  return { subtotal, discountAmount, gstAmount, total };
}

/**
 * Saves a completed bill into the correct table — gstBillsDb when GST was
 * applied, nonGstBillsDb otherwise — deducts stock, and returns the saved
 * bill (with its billType) for the invoice preview.
 */
export function completeBill({ cart, customer, discountType, discountValue, paymentMode, gstEnabled, gstPercent, createdBy, billCounter }) {
  const { subtotal, discountAmount, gstAmount, total } = calculateTotals({ cart, discountType, discountValue, gstEnabled, gstPercent });
  const table = gstEnabled ? gstBillsDb : nonGstBillsDb;
  const prefix = gstEnabled ? "GST" : "SME";
  
  // Add outstanding balance to total
  const outstandingAmount = customer?.outstanding || 0;
  const totalWithOutstanding = total + outstandingAmount;

  const bill = {
    id: uid("bill"),
    billNo: `${prefix}-${1000 + billCounter + Math.floor(Math.random() * 90)}`,
    date: new Date().toISOString(),
    customerId: customer?.id || null,
    customerName: customer?.name || "Walk-in Customer",
    customerPhone: customer?.phone || "",
    customerWhatsApp: customer?.whatsapp || customer?.phone || "",
    items: cart.map((i) => ({ productId: i.productId, name: i.name, size: i.size, colour: i.colour, price: i.price, qty: i.qty, lineTotal: i.price * i.qty })),
    subtotal,
    discountType,
    discountValue: Number(discountValue) || 0,
    discountAmount,
    gstEnabled,
    gstPercent: gstEnabled ? gstPercent : 0,
    gstAmount,
    roundOff: 0,
    outstandingAmount,
    total,
    totalWithOutstanding,
    paymentMode,
    createdBy,
  };

  table.insert(bill);
  deductStockForItems(cart);

  return { ...bill, billType: gstEnabled ? "GST" : "Non-GST" };
}

export function getAllBills() {
  const gst = gstBillsDb.getAll().map((b) => ({ ...b, billType: "GST" }));
  const nonGst = nonGstBillsDb.getAll().map((b) => ({ ...b, billType: "Non-GST" }));
  return [...gst, ...nonGst];
}

export function getBillCount() {
  return gstBillsDb.getAll().length + nonGstBillsDb.getAll().length;
}
