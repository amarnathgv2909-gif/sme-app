import { createTable } from "./db.js";

// A separate table for invoices without GST. Kept entirely apart from
// gstBillsDb so GST reporting/exports never need to filter mixed data.
export const nonGstBillsDb = createTable("sme_non_gst_bills_db");
