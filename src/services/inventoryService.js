import { productsDb, categoriesDb } from "../database/index.js";
import { uid } from "../utils/format.js";

export function listProducts() {
  return productsDb.getAll();
}

export function listCategories() {
  return categoriesDb.getAll();
}

export function saveProduct(product) {
  const withId = { ...product, id: product.id || uid("prd"), createdAt: product.createdAt || new Date().toISOString() };
  return productsDb.upsert(withId);
}

export function deleteProduct(id) {
  productsDb.remove(id);
}

export function adjustStock(productId, delta) {
  const product = productsDb.findById(productId);
  if (!product) return null;
  return productsDb.update(productId, { stock: Math.max(0, product.stock + delta) });
}

export function deductStockForItems(items) {
  items.forEach((item) => adjustStock(item.productId, -item.qty));
}

export function addCategory(name) {
  return categoriesDb.insert({ id: uid("cat"), name });
}

export function renameCategory(id, name) {
  return categoriesDb.update(id, { name });
}

export function deleteCategory(id) {
  categoriesDb.remove(id);
}
