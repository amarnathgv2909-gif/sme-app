import React, { useState } from "react";
import { Modal } from "../common/Modal.jsx";
import { Field, inputStyle } from "../common/Field.jsx";
import { Btn } from "../common/Button.jsx";

export function CustomerFormModal({ customer, onClose, onSave }) {
  const [f, setF] = useState(customer || { name: "", phone: "", whatsapp: "", address: "", gstNumber: "", notes: "" });
  return (
    <Modal title={customer ? "Edit Customer" : "Add Customer"} onClose={onClose} width={400}>
      <Field label="Name"><input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Phone"><input style={inputStyle} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
      <Field label="WhatsApp number"><input style={inputStyle} value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} /></Field>
      <Field label="Address"><input style={inputStyle} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></Field>
      <Field label="GST number (optional)"><input style={inputStyle} value={f.gstNumber || ""} onChange={(e) => setF({ ...f, gstNumber: e.target.value })} placeholder="29ABCDE1234F1Z5" /></Field>
      <Field label="Notes"><input style={inputStyle} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field>
      <Btn style={{ width: "100%" }} disabled={!f.name.trim()} onClick={() => onSave(f)}>
        {customer ? "Save Changes" : "Add Customer"}
      </Btn>
    </Modal>
  );
}
