import { createTable } from "./db.js";

// A separate table (separate storage key = separate "database file") for
// every invoice that has GST applied. Never mixed with non-GST invoices.
export const gstBillsDb = createTable("sme_gst_bills_db");
