import { categoriesDb } from "./categoriesDb.js";
import { productsDb } from "./productsDb.js";
import { customersDb } from "./customersDb.js";
import { gstBillsDb } from "./gstBillsDb.js";
import { nonGstBillsDb } from "./nonGstBillsDb.js";
import { settingsDb } from "./settingsDb.js";
import { CATEGORY_SEED, PRODUCT_SEED, CUSTOMER_SEED, BILL_SEED, DEFAULT_SETTINGS } from "../constants/seedData.js";

/**
 * Populates every table with demo data the first time the app runs.
 * Safe to call on every startup — it only writes to tables that are empty.
 */
export function seedDatabaseIfEmpty() {
  if (categoriesDb.isEmpty()) categoriesDb.replaceAll(CATEGORY_SEED);
  if (productsDb.isEmpty()) productsDb.replaceAll(PRODUCT_SEED);
  if (customersDb.isEmpty()) customersDb.replaceAll(CUSTOMER_SEED);
  if (gstBillsDb.isEmpty()) gstBillsDb.replaceAll(BILL_SEED.gst);
  if (nonGstBillsDb.isEmpty()) nonGstBillsDb.replaceAll(BILL_SEED.nonGst);
  const existingSettings = localStorage.getItem("sme_settings_db");
  if (!existingSettings) settingsDb.set(DEFAULT_SETTINGS);
}
