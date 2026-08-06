import React, { useState } from "react";
import { Modal } from "../common/Modal.jsx";
import { Field, inputStyle } from "../common/Field.jsx";
import { Btn } from "../common/Button.jsx";

export function QuickCustomerModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  return (
    <Modal title="Add Customer" onClose={onClose} width={380}>
      <Field label="Name"><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" /></Field>
      <Field label="Phone / WhatsApp"><input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" /></Field>
      <Field label="Address"><input style={inputStyle} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Optional" /></Field>
      <Btn style={{ width: "100%" }} disabled={!form.name.trim()} onClick={() => onAdd({ name: form.name.trim(), phone: form.phone, whatsapp: form.phone, address: form.address, notes: "", gstNumber: "" })}>
        Add & Select
      </Btn>
    </Modal>
  );
}
