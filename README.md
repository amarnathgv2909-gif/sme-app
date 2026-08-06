# Sri Maruthi Enterprises — Billing, Inventory & Customer Management

## Run locally
npm install
npm run dev

## Build
npm run build

## Data storage (important)
This is a browser-based prototype. All data (customers, products, bills) is
stored in your browser's localStorage through the modules in `src/database/`.

Bills are split into two separate stores that behave like separate database
tables — `src/database/gstBillsDb.js` and `src/database/nonGstBillsDb.js` —
so GST and Non-GST invoices are never mixed, while both stay linked to the
customer via `customerId`. Customer purchase history is computed by
`customerService.getPurchaseHistory()`, which reads from both stores.

To migrate to a real embedded SQLite database (as in the original spec), keep
the same function signatures in `src/database/*.js` and swap the localStorage
calls for SQLite queries (e.g. via `better-sqlite3` in an Electron main
process) — nothing above the database layer needs to change.
