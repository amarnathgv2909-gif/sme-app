import React, { useRef, useState } from "react";
import { Printer, MessageCircle, Loader } from "lucide-react";
import { C } from "../../constants/colors.js";
import { Modal } from "../common/Modal.jsx";
import { Btn } from "../common/Button.jsx";
import { inr, fmtDate } from "../../utils/format.js";
import html2canvas from "html2canvas";

function normalizeWhatsAppNumber(number) {
  if (!number) return "";
  const digits = number.replace(/[^0-9]/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length > 10) return digits;
  return "";
}

function buildGstInvoiceHtml(billData) {
  const rows = billData.items
    .map(
      (it, idx) => `
      <tr>
        <td style="text-align:center; border:1px solid #000; padding:6px;">${idx + 1}</td>
        <td style="border:1px solid #000; padding:6px;">${it.name}</td>
        <td style="text-align:center; border:1px solid #000; padding:6px;">${it.hsn || ""}</td>
        <td style="text-align:center; border:1px solid #000; padding:6px;">${it.qty}</td>
        <td style="text-align:right; border:1px solid #000; padding:6px;">${inr(it.price)}</td>
        <td style="text-align:right; border:1px solid #000; padding:6px;">${inr(it.lineTotal)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div style="width:210mm; min-height:297mm; padding:12mm; box-sizing:border-box; font-family:'Inter',sans-serif; color:#121212; background:#fff;">
      <div style="border:1px solid #000; padding:12px;">
        <div style="text-align:center; margin-bottom:10px;">
          <div style="font-size:26px; font-weight:800; letter-spacing:1px;">SRI MARUTHI ENTERPRISES</div>
          <div style="font-size:10.5px; color:#4a4a4a; margin-top:4px;">11-36, Industrial Estate, Tirupathi, Renigunta Agraharam - 517 520, Chittoor Dt., A.P.</div>
          <div style="font-size:10.5px; color:#4a4a4a; margin-top:2px;">Cell : 99490 83778, 79818 27747</div>
          <div style="font-size:12px; font-weight:700; margin-top:6px;">GSTIN : 37AIPPV0829B1Z2</div>
        </div>
        <div style="text-align:center; font-size:14px; font-weight:700; margin-bottom:4px;">BILL OF SUPPLY</div>
        <div style="text-align:center; font-size:10.5px; color:#4a4a4a; margin-bottom:10px;">Composition Taxable person not eligible to collect tax on Suppliers</div>

        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:6px;">
          <div><strong>Serial No. :</strong> ${billData.billNo}</div>
          <div><strong>State :</strong> Andhra Pradesh</div>
          <div><strong>State Code :</strong> 37</div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:11px; margin-bottom:10px;">
          <div style="border:1px solid #000; padding:8px;">
            <div style="font-weight:700; margin-bottom:6px;">Details of Receiver Billed to</div>
            <div><strong>Name :</strong> ${billData.customerName}</div>
            <div style="margin-top:4px;"><strong>Address :</strong> ${billData.customerAddress || ""}</div>
            <div style="margin-top:4px;"><strong>GSTIN :</strong> ${billData.customerGst || ""}</div>
            <div style="margin-top:4px;"><strong>State :</strong> Andhra Pradesh</div>
          </div>
          <div style="border:1px solid #000; padding:8px;">
            <div style="font-weight:700; margin-bottom:6px;">Transport Details</div>
            <div><strong>Vehicle No :</strong></div>
            <div style="margin-top:4px;"><strong>Transporter Name :</strong></div>
            <div style="margin-top:4px;"><strong>LR No :</strong></div>
          </div>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr>
              <th style="border:1px solid #000; padding:6px; width:6%;">Sl. No.</th>
              <th style="border:1px solid #000; padding:6px; width:42%;">Description of Product / Service</th>
              <th style="border:1px solid #000; padding:6px; width:14%;">HSN ACS</th>
              <th style="border:1px solid #000; padding:6px; width:10%;">Qty.</th>
              <th style="border:1px solid #000; padding:6px; width:14%;">Rate</th>
              <th style="border:1px solid #000; padding:6px; width:14%;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end; margin-top:10px; font-size:12px; font-weight:700;">
          <div style="text-align:right; min-width:130px;">
            Total<br/>
            <span style="font-size:16px; display:block; margin-top:6px;">${inr(billData.total)}</span>
            ${billData.outstandingAmount > 0 ? `<div style="font-size:12px; margin-top:6px; color:#b12020;">Outstanding: ${inr(billData.outstandingAmount)}</div>` : ""}
            ${billData.outstandingAmount > 0 ? `<div style="font-size:16px; margin-top:6px;">${inr(billData.totalWithOutstanding)}</div>` : ""}
          </div>
        </div>

        <div style="margin-top:10px; font-size:11px; color:#4a4a4a;">Goods once sold will not be taken back.</div>
      </div>
    </div>
  `;
}

function buildOldInvoiceHtml(billData) {
  const rows = billData.items
    .map(
      (it, idx) => `
      <tr>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${idx + 1}</td>
        <td style="border:1px solid #000; padding:8px;">${it.name}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${it.qty}</td>
        <td style="border:1px solid #000; padding:8px; text-align:right;">${inr(it.price)}</td>
        <td style="border:1px solid #000; padding:8px; text-align:right;">${inr(it.lineTotal)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div style="width:210mm; min-height:297mm; padding:16mm; box-sizing:border-box; font-family:'Inter',sans-serif; color:#121212; background:#fff;">
      <div style="padding:18px; border:1px solid #000;">
        <div style="text-align:center; margin-bottom:16px;">
          <div style="font-size:20px; font-weight:700;">Sri Maruthi Enterprises</div>
          <div style="font-size:11px; color:#4a4a4a; margin-top:4px;">11-36, Industrial Estate, Tirupathi, Renigunta Agraharam - 517 520, Chittoor Dt., A.P.</div>
          <div style="font-size:13px; font-weight:700; margin-top:10px;">Bill</div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:10px;">
          <div><strong>Bill No.</strong> ${billData.billNo}</div>
          <div><strong>Date</strong> ${fmtDate(billData.date)}</div>
        </div>
        <div style="font-size:12px; margin-bottom:12px;"><strong>M/s.</strong> ${billData.customerName}</div>
        <table style="width:100%; border-collapse:collapse; font-size:12px; margin-top:6px;">
          <thead>
            <tr>
              <th style="border:1px solid #000; padding:8px; text-align:center; width:8%;">Sl. No.</th>
              <th style="border:1px solid #000; padding:8px; text-align:left; width:54%;">PARTICULARS</th>
              <th style="border:1px solid #000; padding:8px; text-align:center; width:12%;">Qty.</th>
              <th style="border:1px solid #000; padding:8px; text-align:right; width:13%;">Rate</th>
              <th style="border:1px solid #000; padding:8px; text-align:right; width:13%;">Value</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="border:1px solid #000; padding:8px; text-align:right; font-weight:700;">TOTAL</td>
              <td style="border:1px solid #000; padding:8px; text-align:right; font-weight:700;">${inr(billData.total)}</td>
            </tr>
            ${billData.outstandingAmount > 0 ? `
            <tr>
              <td colspan="4" style="border:1px solid #000; padding:8px; text-align:right; color:#b12020;">Outstanding</td>
              <td style="border:1px solid #000; padding:8px; text-align:right; color:#b12020;">${inr(billData.outstandingAmount)}</td>
            </tr>
            <tr>
              <td colspan="4" style="border:1px solid #000; padding:8px; text-align:right; font-weight:700;">Grand Total</td>
              <td style="border:1px solid #000; padding:8px; text-align:right; font-weight:700;">${inr(billData.totalWithOutstanding)}</td>
            </tr>
            ` : ""}
          </tfoot>
        </table>
        <div style="margin-top:10px; font-size:11px; color:#4a4a4a;">Goods once sold will not be taken back.</div>
      </div>
    </div>
  `;
}

function getInvoiceHtml(billData) {
  return billData.gstEnabled ? buildGstInvoiceHtml(billData) : buildOldInvoiceHtml(billData);
}

function renderGstPreview(bill) {
  return (
    <div style={{ border: `1px solid ${C.inkFaint}`, padding: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div className="font-display" style={{ fontSize: 26, fontWeight: 800, letterSpacing: 1 }}>SRI MARUTHI ENTERPRISES</div>
        <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 4 }}>11-36, Industrial Estate, Tirupathi, Renigunta Agraharam - 517 520, Chittoor Dt., A.P.</div>
        <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 2 }}>Cell : 99490 83778, 79818 27747</div>
        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>GSTIN : 37AIPPV0829B1Z2</div>
      </div>

      <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>BILL OF SUPPLY</div>
      <div style={{ textAlign: "center", fontSize: 10.5, color: C.inkFaint, marginBottom: 12 }}>Composition Taxable person not eligible to collect tax on Suppliers</div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 8 }}>
        <div><strong>Serial No. :</strong> {bill.billNo}</div>
        <div><strong>State :</strong> Andhra Pradesh</div>
        <div><strong>State Code :</strong> 37</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12, fontSize: 11 }}>
        <div style={{ border: `1px solid ${C.inkFaint}`, padding: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Details of Receiver Billed to</div>
          <div><strong>Name :</strong> {bill.customerName}</div>
          <div style={{ marginTop: 4 }}><strong>Address :</strong> {bill.customerAddress || ""}</div>
          <div style={{ marginTop: 4 }}><strong>GSTIN :</strong> {bill.customerGst || ""}</div>
          <div style={{ marginTop: 4 }}><strong>State :</strong> Andhra Pradesh</div>
        </div>
        <div style={{ border: `1px solid ${C.inkFaint}`, padding: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Transport Details</div>
          <div><strong>Vehicle No :</strong></div>
          <div style={{ marginTop: 4 }}><strong>Transporter Name :</strong></div>
          <div style={{ marginTop: 4 }}><strong>LR No :</strong></div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "6% 42% 14% 10% 14% 14%", background: C.surfaceAlt, fontSize: 11, fontWeight: 700, textTransform: "uppercase", textAlign: "center", padding: "8px 0", borderTop: `1px solid ${C.inkFaint}`, borderBottom: `1px solid ${C.inkFaint}` }}>
          <div>Sl. No.</div>
          <div>Description of Product / Service</div>
          <div>HSN ACS</div>
          <div>Qty.</div>
          <div>Rate</div>
          <div>Amount</div>
        </div>
        {bill.items.map((it, idx) => (
          <div key={`${it.productId || idx}-${idx}`} style={{ display: "grid", gridTemplateColumns: "6% 42% 14% 10% 14% 14%", fontSize: 11, padding: "8px 0", borderBottom: `1px solid ${C.inkFaint}` }}>
            <div style={{ textAlign: "center" }}>{idx + 1}</div>
            <div style={{ paddingLeft: 6 }}>{it.name}</div>
            <div style={{ textAlign: "center" }}>{it.hsn || ""}</div>
            <div style={{ textAlign: "center" }}>{it.qty}</div>
            <div className="font-mono" style={{ textAlign: "right", paddingRight: 6 }}>{inr(it.price)}</div>
            <div className="font-mono" style={{ textAlign: "right", paddingRight: 6 }}>{inr(it.lineTotal)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, fontSize: 12, fontWeight: 700 }}>
        <div style={{ textAlign: "right" }}>
          <div>Current Bill Total</div>
          <div style={{ fontSize: 16, marginTop: 6 }}>{inr(bill.total)}</div>
          {bill.outstandingAmount > 0 && (
            <div style={{ marginTop: 6, fontSize: 12, color: C.rust }}>
              Outstanding: {inr(bill.outstandingAmount)}
            </div>
          )}
          {bill.outstandingAmount > 0 && (
            <div style={{ fontSize: 16, marginTop: 6 }}>{inr(bill.totalWithOutstanding)}</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: C.inkFaint }}>Goods once sold will not be taken back.</div>
    </div>
  );
}

function renderOldPreview(bill) {
  return (
    <div style={{ border: `1px solid ${C.inkFaint}`, padding: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Sri Maruthi Enterprises</div>
        <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 4 }}>11-36, Industrial Estate, Tirupathi, Renigunta Agraharam - 517 520, Chittoor Dt., A.P.</div>
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10 }}>Bill</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}>
        <div><strong>Bill No.</strong> {bill.billNo}</div>
        <div><strong>Date</strong> {fmtDate(bill.date)}</div>
      </div>

      <div style={{ fontSize: 12, marginBottom: 12 }}><strong>M/r.</strong> {bill.customerName}</div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "8% 54% 12% 13% 13%", background: C.surfaceAlt, fontSize: 12, fontWeight: 700, textTransform: "uppercase", textAlign: "center", padding: "8px 0", borderTop: `1px solid ${C.inkFaint}`, borderBottom: `1px solid ${C.inkFaint}` }}>
          <div>Sl. No.</div>
          <div>PARTICULARS</div>
          <div>Qty.</div>
          <div>Rate</div>
          <div>Value</div>
        </div>
        {bill.items.map((it, idx) => (
          <div key={`${it.productId || idx}-${idx}`} style={{ display: "grid", gridTemplateColumns: "8% 54% 12% 13% 13%", fontSize: 12, padding: "8px 0", borderBottom: `1px solid ${C.inkFaint}` }}>
            <div style={{ textAlign: "center" }}>{idx + 1}</div>
            <div>{it.name}</div>
            <div style={{ textAlign: "center" }}>{it.qty}</div>
            <div style={{ textAlign: "right", paddingRight: 6 }}>{inr(it.price)}</div>
            <div style={{ textAlign: "right", paddingRight: 6 }}>{inr(it.lineTotal)}</div>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "8% 54% 12% 13% 13%", fontSize: 12, padding: "10px 0", fontWeight: 700 }}>
          <div />
          <div style={{ textAlign: "right" }}>TOTAL</div>
          <div />
          <div />
          <div style={{ textAlign: "right", paddingRight: 6 }}>{inr(bill.total)}</div>
        </div>
        {bill.outstandingAmount > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "8% 54% 12% 13% 13%", fontSize: 12, padding: "10px 0", color: C.rust }}>
            <div />
            <div style={{ textAlign: "right" }}>Outstanding</div>
            <div />
            <div />
            <div style={{ textAlign: "right", paddingRight: 6 }}>{inr(bill.outstandingAmount)}</div>
          </div>
        )}
        {bill.outstandingAmount > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "8% 54% 12% 13% 13%", fontSize: 12, padding: "10px 0", fontWeight: 700 }}>
            <div />
            <div style={{ textAlign: "right" }}>Grand Total</div>
            <div />
            <div />
            <div style={{ textAlign: "right", paddingRight: 6 }}>{inr(bill.totalWithOutstanding)}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: C.inkFaint }}>Goods once sold will not be taken back.</div>
    </div>
  );
}

export function InvoiceModal({ bill, onClose }) {
  const invoiceRef = useRef(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const whatsappNumber = normalizeWhatsAppNumber(bill.customerWhatsApp || bill.customerPhone);
  const canSendWhatsApp = Boolean(whatsappNumber);

  const handleSendWhatsApp = async () => {
    if (!canSendWhatsApp) return;
    setIsSendingWhatsApp(true);

    try {
      if (invoiceRef.current) {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${bill.billNo}.png`;
        link.click();
      }

      const url = `https://wa.me/${whatsappNumber}`;
      setTimeout(() => window.open(url, "_blank"), 500);
    } catch (err) {
      console.error("Failed to prepare WhatsApp message:", err);
      alert("Failed to prepare the bill. Please try again.");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "-10000px";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const invoiceHtml = getInvoiceHtml(bill);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${bill.billNo} - Invoice</title>
          <meta charset="utf-8" />
          <style>
            body { margin: 0; }
            @page { size: A4 portrait; margin: 10mm; }
          </style>
        </head>
        <body>${invoiceHtml}</body>
      </html>
    `);
    doc.close();

    const printWhenReady = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch {
        setTimeout(printWhenReady, 250);
      }
    };

    iframe.onload = printWhenReady;
    setTimeout(printWhenReady, 500);
    setTimeout(() => document.body.removeChild(iframe), 2000);
  };

  return (
    <Modal title="Bill Complete" onClose={onClose} width={420}>
      <div ref={invoiceRef} className="invoice-print-page" style={{ backgroundColor: "white", borderRadius: 8, overflow: "visible", border: `1px solid ${C.inkFaint}`, width: "100%", maxWidth: 740, margin: "0 auto" }}>
        {bill.gstEnabled ? renderGstPreview(bill) : renderOldPreview(bill)}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Btn variant="outline" style={{ flex: 1 }} icon={Printer} onClick={handlePrint}>Print</Btn>
        <Btn variant="outline" style={{ flex: 1 }} icon={isSendingWhatsApp ? Loader : MessageCircle} onClick={handleSendWhatsApp} disabled={!canSendWhatsApp || isSendingWhatsApp}>
          {isSendingWhatsApp ? "Preparing..." : canSendWhatsApp ? "Send Image" : "No WhatsApp"}
        </Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Btn style={{ flex: 1 }} onClick={onClose}>New Bill</Btn>
      </div>
      <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 10, textAlign: "center" }}>
        Invoice image will download and WhatsApp will open for you to send it.
      </div>
    </Modal>
  );
}
