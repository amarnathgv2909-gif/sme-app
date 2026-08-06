import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Card } from "../../components/common/Card.jsx";
import { Btn } from "../../components/common/Button.jsx";
import { Modal } from "../../components/common/Modal.jsx";
import { inputStyle } from "../../components/common/Field.jsx";
import { TopBar } from "../../components/layout/TopBar.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useCatalog } from "../../hooks/useCatalog.js";

export default function CategoriesPage() {
  const { isSuper } = useAuth();
  const { categories, products, addCategory, renameCategory, deleteCategory } = useCatalog();
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const countFor = (id) => products.filter((p) => p.category === id).length;

  const add = () => {
    if (!newName.trim()) return;
    addCategory(newName.trim());
    setNewName("");
  };

  return (
    <div>
      <TopBar title="Categories" subtitle={`${categories.length} categories · used across billing filters and product forms`} />
      {isSuper && (
        <Card style={{ padding: 14, marginBottom: 16, display: "flex", gap: 8 }}>
          <input style={inputStyle} placeholder="New category name, e.g. Baby Frames" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <Btn icon={Plus} onClick={add}>Add Category</Btn>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
        {categories.map((c) => (
          <Card key={c.id} style={{ padding: 14 }}>
            {editing === c.id ? (
              <input autoFocus style={inputStyle} defaultValue={c.name}
                onKeyDown={(e) => e.key === "Enter" && (renameCategory(c.id, e.target.value), setEditing(null))}
                onBlur={(e) => { renameCategory(c.id, e.target.value); setEditing(null); }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 2 }}>{countFor(c.id)} products</div>
                </div>
                {isSuper && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <Btn size="sm" variant="ghost" icon={Pencil} onClick={() => setEditing(c.id)} />
                    <Btn size="sm" variant="ghost" icon={Trash2} style={{ color: C.rust }} onClick={() => setConfirmDelete(c)} />
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
      {confirmDelete && (
        <Modal title="Delete Category?" onClose={() => setConfirmDelete(null)} width={360}>
          <div style={{ fontSize: 13.5, color: C.inkSoft, marginBottom: 16 }}>
            {countFor(confirmDelete.id) > 0
              ? <>This category still has <b>{countFor(confirmDelete.id)} products</b> assigned. Reassign them first, or they'll show as uncategorised.</>
              : "This category has no products. It's safe to remove."}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" style={{ flex: 1 }} onClick={() => setConfirmDelete(null)}>Cancel</Btn>
            <Btn variant="danger" style={{ flex: 1 }} onClick={() => { deleteCategory(confirmDelete.id); setConfirmDelete(null); }}>Delete Anyway</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
