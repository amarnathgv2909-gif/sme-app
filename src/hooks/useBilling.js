import { useState, useEffect, useMemo } from "react";
import { effectivePrice, calculateTotals, completeBill, getBillCount } from "../services/billingService.js";
import { useSettings } from "./useSettings.js";

/**
 * Encapsulates the entire billing cart: adding items, direct-quantity entry
 * for bulk orders, per-line price overrides (Super Admin only, enforced by
 * the caller), discounts, GST toggle, and completing the sale — which
 * routes the invoice into the correct GST / Non-GST table.
 */
export function useBilling({ products, customer, user }) {
  const { settings } = useSettings();
  const [cart, setCart] = useState([]);
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [gstEnabled, setGstEnabled] = useState(settings.gstEnabled);

  // Re-price every line automatically when the customer changes.
  useEffect(() => {
    setCart((prev) => prev.map((item) => {
      const p = products.find((pr) => pr.id === item.productId);
      if (!p) return item;
      const price = effectivePrice(p, customer);
      return { ...item, price, defaultPrice: price };
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]);

  const addOne = (p) => {
    if (p.stock <= 0) return;
    const price = effectivePrice(p, customer);
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === p.id);
      if (idx >= 0) {
        if (prev[idx].qty >= p.stock) return prev;
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { productId: p.id, name: p.name, size: p.size, colour: p.colour, price, defaultPrice: price, qty: 1, maxStock: p.stock }];
    });
  };

  const setQtyDirect = (p, rawValue) => {
    const clamped = Math.max(0, Math.min(Number(rawValue) || 0, p.stock));
    const price = effectivePrice(p, customer);
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === p.id);
      if (clamped <= 0) {
        if (idx < 0) return prev;
        const next = [...prev]; next.splice(idx, 1); return next;
      }
      if (idx >= 0) {
        const next = [...prev]; next[idx] = { ...next[idx], qty: clamped }; return next;
      }
      return [...prev, { productId: p.id, name: p.name, size: p.size, colour: p.colour, price, defaultPrice: price, qty: clamped, maxStock: p.stock }];
    });
  };

  const changeQty = (idx, delta) => {
    setCart((prev) => {
      const next = [...prev];
      const item = next[idx];
      const newQty = item.qty + delta;
      if (newQty <= 0) { next.splice(idx, 1); return next; }
      if (newQty > item.maxStock) return prev;
      next[idx] = { ...item, qty: newQty };
      return next;
    });
  };

  const setLinePrice = (idx, price) => setCart((prev) => {
    const next = [...prev]; next[idx] = { ...next[idx], price }; return next;
  });

  const removeItem = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const totals = useMemo(
    () => calculateTotals({ cart, discountType, discountValue, gstEnabled, gstPercent: settings.gstPercent }),
    [cart, discountType, discountValue, gstEnabled, settings.gstPercent]
  );

  const finalizeBill = () => {
    if (cart.length === 0) return null;
    const bill = completeBill({
      cart, customer, discountType, discountValue, paymentMode,
      gstEnabled, gstPercent: settings.gstPercent, createdBy: user.name,
      billCounter: getBillCount(),
    });
    setCart([]); setDiscountValue(0); setDiscountType("percent"); setPaymentMode("Cash");
    return bill;
  };

  return {
    cart, discountType, setDiscountType, discountValue, setDiscountValue,
    paymentMode, setPaymentMode, gstEnabled, setGstEnabled,
    addOne, setQtyDirect, changeQty, setLinePrice, removeItem,
    totals, finalizeBill,
  };
}
