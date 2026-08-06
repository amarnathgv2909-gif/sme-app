import { createTable } from "./db.js";

// Customer profile table. Purchase totals are NOT stored here — they're
// computed on demand from gstBillsDb + nonGstBillsDb so the numbers can
// never drift out of sync with the actual invoices.
export const customersDb = createTable("sme_customers_db");
