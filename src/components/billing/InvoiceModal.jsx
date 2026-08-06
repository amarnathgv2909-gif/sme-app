import React, { useRef, useState } from "react";
import { Check, Printer, MessageCircle, Loader } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Modal } from "../common/Modal.jsx";
import { Card } from "../common/Card.jsx";
import { Btn } from "../common/Button.jsx";
import { Badge } from "../common/Badge.jsx";
import { inr, fmtDate, fmtTime } from "../../utils/format.js";
import html2canvas from "html2canvas";

function normalizeWhatsAppNumber(number) {
  if (!number) return "";
  const digits = number.replace(/[^0-9]/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length > 10) return digits;
  return "";
}

export function InvoiceModal({ bill, onClose }) {
  const invoiceRef = useRef(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const whatsappNumber = normalizeWhatsAppNumber(bill.customerWhatsApp || bill.customerPhone);
  const canSendWhatsApp = Boolean(whatsappNumber);

  const handleSendWhatsAppImage = async () => {
    if (!canSendWhatsApp || !invoiceRef.current) return;
    setIsSendingWhatsApp(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `invoice-${bill.billNo}.png`;
      link.click();
      
      // Open WhatsApp Web (user will manually attach the image)
      const text = encodeURIComponent("Here is your invoice");
      const url = `https://wa.me/${whatsappNumber}?text=${text}`;
      setTimeout(() => window.open(url, "_blank"), 500);
    } catch (err) {
      console.error("Failed to capture invoice:", err);
      alert("Failed to generate invoice image. Please try again.");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  return (
    <Modal title="Bill Complete" onClose={onClose} width={420}>
      <div ref={invoiceRef} style={{ backgroundColor: "white", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ textAlign: "center", padding: 20, marginBottom: 0 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.sageBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <Check size={22} color={C.sage} />
          </div>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>{bill.billNo}</div>
          <div style={{ fontSize: 12.5, color: C.inkFaint }}>{fmtDate(bill.date)} · {fmtTime(bill.date)}</div>
          <div style={{ marginTop: 6 }}><Badge tone={bill.billType === "GST" ? "brass" : "neutral"}>{bill.billType} Invoice</Badge></div>
        </div>
        <Card style={{ padding: 14, background: C.surfaceAlt, border: "none", margin: 0 }}>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 8 }}>Bill to: <b style={{ color: C.ink }}>{bill.customerName}</b></div>
        {bill.items.map((it) => (
          <div key={it.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
            <span style={{ color: C.ink }}>{it.name} × {it.qty}</span>
            <span className="font-mono">{inr(it.lineTotal)}</span>
          </div>
        ))}
        {bill.gstEnabled && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 4, color: C.inkSoft }}>
            <span>GST ({bill.gstPercent}%)</span><span className="font-mono">{inr(bill.gstAmount)}</span>
          </div>
        )}
        <div style={{ borderTop: `1px dashed ${C.line}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <span>Current Bill Total</span><span className="font-mono">{inr(bill.total)}</span>
        </div>
        {bill.outstandingAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: C.rust, marginTop: 8 }}>
            <span>Outstanding Balance</span><span className="font-mono">{inr(bill.outstandingAmount)}</span>
          </div>
        )}
        {bill.outstandingAmount > 0 && (
          <div style={{ borderTop: `1px dashed ${C.line}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, color: C.walnut, fontSize: 15 }}>
            <span>Grand Total</span><span className="font-mono">{inr(bill.totalWithOutstanding)}</span>
          </div>
        )}
        </Card>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="outline" style={{ flex: 1 }} icon={Printer} onClick={() => window.print()}>Print</Btn>
        <Btn variant="outline" style={{ flex: 1 }} icon={isSendingWhatsApp ? Loader : MessageCircle} onClick={handleSendWhatsAppImage} disabled={!canSendWhatsApp || isSendingWhatsApp}>
          {isSendingWhatsApp ? "Preparing..." : canSendWhatsApp ? "Send Image" : "No WhatsApp"}
        </Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Btn style={{ flex: 1 }} onClick={onClose}>New Bill</Btn>
      </div>
      <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 10, textAlign: "center" }}>
        Invoice image will be downloaded and WhatsApp will open for you to send it.
      </div>
    </Modal>
  );
}
