import React, { createContext, useState, useCallback } from "react";
import * as inventoryService from "../services/inventoryService.js";

export const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(() => inventoryService.listProducts());
  const [categories, setCategories] = useState(() => inventoryService.listCategories());

  const refreshProducts = useCallback(() => setProducts(inventoryService.listProducts()), []);
  const refreshCategories = useCallback(() => setCategories(inventoryService.listCategories()), []);

  const saveProduct = useCallback((product) => {
    inventoryService.saveProduct(product);
    refreshProducts();
  }, [refreshProducts]);

  const deleteProduct = useCallback((id) => {
    inventoryService.deleteProduct(id);
    refreshProducts();
  }, [refreshProducts]);

  const adjustStock = useCallback((id, delta) => {
    inventoryService.adjustStock(id, delta);
    refreshProducts();
  }, [refreshProducts]);

  const addCategory = useCallback((name) => {
    inventoryService.addCategory(name);
    refreshCategories();
  }, [refreshCategories]);

  const renameCategory = useCallback((id, name) => {
    inventoryService.renameCategory(id, name);
    refreshCategories();
  }, [refreshCategories]);

  const deleteCategory = useCallback((id) => {
    inventoryService.deleteCategory(id);
    refreshCategories();
  }, [refreshCategories]);

  const value = {
    products, categories,
    refreshProducts, saveProduct, deleteProduct, adjustStock,
    addCategory, renameCategory, deleteCategory,
  };
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
