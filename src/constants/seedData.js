import { uid } from "../utils/format.js";

export const CATEGORY_SEED = [
  "Wooden Frames", "MDF Frames", "Acrylic Frames", "Metal Frames",
  "Wedding Frames", "Certificate Frames", "Collage Frames", "Religious Frames",
].map((name) => ({ id: uid("cat"), name }));

const catId = (name) => CATEGORY_SEED.find((c) => c.name === name)?.id;

function makeProducts() {
  const rows = [];
  const push = (name, category, material, colour, sizes, purchase, selling, sku) => {
    sizes.forEach((size, i) => {
      rows.push({
        id: uid("prd"),
        name, category: catId(category), material, colour, size,
        sku: `${sku}-${size.replace(/[^A-Za-z0-9]/g, "")}`,
        barcode: String(890000000000 + rows.length * 37 + i),
        purchasePrice: purchase + i * 40,
        sellingPrice: selling + i * 60,
        stock: 6 + ((rows.length * 3) % 14),
        minStock: 5,
        status: "Active",
        createdAt: new Date(Date.now() - (30 - rows.length) * 86400000).toISOString(),
      });
    });
  };
  push("Classic Walnut Frame", "Wooden Frames", "Wooden", "Walnut", ["5x7", "8x10", "10x12"], 140, 260, "WWF");
  push("Black Wooden Frame", "Wooden Frames", "Wooden", "Black", ["8x10", "10x12"], 150, 280, "BWF");
  push("MDF Photo Frame Basic", "MDF Frames", "MDF", "Brown", ["4x6", "5x7"], 60, 130, "MDB");
  push("Premium MDF Frame", "MDF Frames", "MDF", "White", ["8x10"], 120, 240, "MDP");
  push("Clear Acrylic Block Frame", "Acrylic Frames", "Acrylic", "Clear", ["4x6", "5x7"], 90, 190, "ACB");
  push("Rose Gold Metal Frame", "Metal Frames", "Metal", "Gold", ["5x7", "8x10"], 160, 320, "RGM");
  push("Silver Metal Frame", "Metal Frames", "Metal", "Silver", ["6x8"], 150, 300, "SVM");
  push("Wedding Collage Frame", "Wedding Frames", "Wooden", "White", ["12x18"], 380, 720, "WCF");
  push("Wedding Heart Frame", "Wedding Frames", "Metal", "Gold", ["8x10"], 220, 420, "WHF");
  push("Certificate A4 Frame", "Certificate Frames", "MDF", "Black", ["A4"], 110, 210, "CA4");
  push("Certificate A3 Frame", "Certificate Frames", "Wooden", "Walnut", ["A3"], 180, 340, "CA3");
  push("Collage 5-Photo Frame", "Collage Frames", "Wooden", "Brown", ["Multi"], 260, 480, "CL5");
  push("God Frame Teak", "Religious Frames", "Wooden", "Teak", ["12x15"], 240, 460, "GFT");
  push("God Frame Antique Gold", "Religious Frames", "Metal", "Antique Gold", ["10x14"], 210, 400, "GFA");
  return rows;
}
export const PRODUCT_SEED = makeProducts();

export const CUSTOMER_SEED = [
  { id: uid("cus"), name: "Ramesh Photo Studio", phone: "9845012345", whatsapp: "9845012345", address: "Jayanagar, Bengaluru", gstNumber: "29ABCDE1234F1Z5", notes: "Regular wholesale buyer", outstanding: 0, customPrices: {}, createdAt: new Date().toISOString() },
  { id: uid("cus"), name: "Lakshmi Kalyana Mantapa", phone: "9900123456", whatsapp: "9900123456", address: "Malleshwaram, Bengaluru", gstNumber: "", notes: "Wedding frame bulk orders", outstanding: 1200, customPrices: {}, createdAt: new Date().toISOString() },
  { id: uid("cus"), name: "Walk-in Customer", phone: "", whatsapp: "", address: "", gstNumber: "", notes: "Default counter customer", outstanding: 0, customPrices: {}, createdAt: new Date().toISOString() },
];

function makeBillSeed(products, customers) {
  const pick = (i) => products[i % products.length];
  let gstCounter = 0;
  let nonGstCounter = 0;

  const mk = (dayOffset, itemsIdx, custIdx, mode, gst) => {
    const items = itemsIdx.map((idx) => {
      const p = pick(idx);
      const qty = 1 + (idx % 2);
      return { productId: p.id, name: p.name, size: p.size, colour: p.colour, price: p.sellingPrice, qty, lineTotal: p.sellingPrice * qty };
    });
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const discountAmount = Math.round(subtotal * 0.03);
    const gstAmount = gst ? Math.round((subtotal - discountAmount) * 0.18) : 0;
    const total = subtotal - discountAmount + gstAmount;
    const d = new Date(Date.now() - dayOffset * 86400000);
    const sequence = gst ? ++gstCounter : ++nonGstCounter;
    return {
      id: uid("bill"),
      billNo: `${gst ? "GST" : "SME"}-${String(sequence).padStart(3, "0")}`,
      date: d.toISOString(),
      customerId: customers[custIdx].id,
      customerName: customers[custIdx].name,
      items, subtotal, discountType: "percent", discountValue: 3, discountAmount,
      gstEnabled: gst, gstPercent: gst ? 18 : 0, gstAmount, roundOff: 0, total,
      paymentMode: mode, createdBy: "Super Admin",
    };
  };
  return {
    gst: [mk(0, [0, 3], 0, "UPI", true), mk(1, [1, 2, 8], 2, "Card", true)],
    nonGst: [mk(0, [5], 1, "Cash", false), mk(3, [9], 1, "UPI", false)],
  };
}
export const BILL_SEED = makeBillSeed(PRODUCT_SEED, CUSTOMER_SEED);

export const DEFAULT_SETTINGS = {
  businessName: "Sri Maruthi Enterprises",
  tagline: "Photo Frame Manufacturing, Wholesale & Retail",
  currency: "₹",
  gstEnabled: false,
  gstPercent: 18,
  lowStockThreshold: 5,
};
