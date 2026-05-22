/**
 * Frontend document generation for UKEN.
 * - Branded PDFs (jsPDF + autotable) built from backend DTOs.
 * - Lightweight CSV exporter for dashboard tables.
 *
 * Brand palette (mirrors styles.css tokens, kept literal because jsPDF
 * doesn't read CSS): terracotta #b8553a, charcoal #1f1a17, cream #f5efe5,
 * ink-muted #6f6660.
 */
import jsPDF from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import { formatGBP } from "@/lib/cart";
import type { OrderDto } from "@/services/orderService";

const BRAND = {
  terracotta: "#b8553a",
  charcoal: "#1f1a17",
  cream: "#f5efe5",
  muted: "#6f6660",
  border: "#e6dfd3",
};

const BRAND_FOOTER = {
  line1: "UKEN · Earth & gold threads",
  line2: "hello@ukena.co.uk · ukena.co.uk",
  line3:
    "UKEN is a curated home for Kenyan makers. Receipts are issued in GBP. " +
    "For refunds see ukena.co.uk/refunds. Data handled under the Kenya Data Protection Act (2019).",
};

/* ───────────────────────── primitives ───────────────────────── */

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function brandedHeader(doc: jsPDF, eyebrow: string, title: string, meta?: string) {
  const w = doc.internal.pageSize.getWidth();
  // Terracotta accent bar
  doc.setFillColor(BRAND.terracotta);
  doc.rect(0, 0, w, 6, "F");

  // Wordmark
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(BRAND.charcoal);
  doc.text("UKEN", 40, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.muted);
  doc.text("Earth & gold threads.", 40, 56);

  // Eyebrow + title (right side)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.terracotta);
  doc.text(eyebrow.toUpperCase(), w - 40, 38, { align: "right", charSpace: 1.4 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(BRAND.charcoal);
  doc.text(title, w - 40, 56, { align: "right" });

  if (meta) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.muted);
    doc.text(meta, w - 40, 70, { align: "right" });
  }

  // Divider
  doc.setDrawColor(BRAND.border);
  doc.setLineWidth(0.6);
  doc.line(40, 86, w - 40, 86);
}

function brandedFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(BRAND.border);
    doc.setLineWidth(0.4);
    doc.line(40, h - 60, w - 40, h - 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.charcoal);
    doc.text(BRAND_FOOTER.line1, 40, h - 46);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(BRAND.muted);
    doc.text(BRAND_FOOTER.line2, 40, h - 34);
    // wrap KRA-friendly note
    const wrapped = doc.splitTextToSize(BRAND_FOOTER.line3, w - 200);
    doc.text(wrapped, 40, h - 22);
    doc.text(`Page ${i} of ${pageCount}`, w - 40, h - 22, { align: "right" });
  }
}

function triggerDownload(doc: jsPDF, filename: string) {
  doc.save(filename);
}

/* ───────────────────────── receipt ───────────────────────── */

export function downloadOrderReceiptPdf(order: OrderDto) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  brandedHeader(
    doc,
    "Receipt",
    `Order ${order.displayId}`,
    fmtDate(order.createdAt),
  );

  // Buyer + delivery columns
  let y = 110;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(BRAND.muted);
  doc.text("BILLED TO", 40, y);
  doc.text("DELIVERY ADDRESS", w / 2, y);

  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(BRAND.charcoal);
  doc.text(order.buyer.fullName, 40, y);
  doc.text(order.delivery.fullName, w / 2, y);

  y += 13;
  doc.setTextColor(BRAND.muted);
  doc.text(order.buyer.email, 40, y);
  doc.text(order.delivery.addressLine1, w / 2, y);
  y += 13;
  if (order.delivery.addressLine2) {
    doc.text(order.delivery.addressLine2, w / 2, y);
    y += 13;
  }
  doc.text(`${order.delivery.city}, ${order.delivery.postcode}`, w / 2, y);
  y += 13;
  doc.text(order.delivery.country, w / 2, y);

  // Items table
  const tableStart = Math.max(y, 200) + 16;
  autoTable(doc, {
    startY: tableStart,
    head: [["Piece", "Maker", "Qty", "Unit", "Line total"]],
    body: order.items.map((i) => [
      i.name,
      `${i.creator.fullName} · ${i.creator.region}`,
      String(i.quantity),
      formatGBP(i.pricePence),
      formatGBP(i.pricePence * i.quantity),
    ]) as RowInput[],
    styles: { font: "helvetica", fontSize: 9, cellPadding: 8, textColor: BRAND.charcoal },
    headStyles: {
      fillColor: BRAND.cream,
      textColor: BRAND.charcoal,
      fontStyle: "bold",
      lineWidth: 0,
    },
    alternateRowStyles: { fillColor: "#fbf8f3" },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    margin: { left: 40, right: 40 },
    theme: "plain",
  });

  // Totals
  const endY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18;
  const labelX = w - 200;
  const valueX = w - 40;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(BRAND.muted);
  doc.text("Subtotal", labelX, endY);
  doc.setTextColor(BRAND.charcoal);
  doc.text(formatGBP(order.productsTotalPence), valueX, endY, { align: "right" });

  doc.setTextColor(BRAND.muted);
  doc.text("Shipping", labelX, endY + 16);
  doc.setTextColor(BRAND.charcoal);
  doc.text(
    order.shippingPence === 0 ? "Free" : formatGBP(order.shippingPence),
    valueX,
    endY + 16,
    { align: "right" },
  );

  doc.setDrawColor(BRAND.border);
  doc.line(labelX, endY + 26, valueX, endY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(BRAND.terracotta);
  doc.text("Total paid", labelX, endY + 44);
  doc.text(formatGBP(order.totalPence), valueX, endY + 44, { align: "right" });

  // Thank-you band
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(BRAND.muted);
  const note = doc.splitTextToSize(
    `Thank you, ${order.buyer.fullName.split(" ")[0]}. Each piece in this order was made by hand by a Kenyan maker. ` +
      `Status: ${order.status.toLowerCase()}. Track at ukena.co.uk/orders/track.`,
    w - 80,
  );
  doc.text(note, 40, endY + 80);

  brandedFooter(doc);
  triggerDownload(doc, `UKEN-receipt-${order.displayId}.pdf`);
}

/* ───────────────────────── generic table report ───────────────────────── */

export interface TableReportOptions {
  /** Filename (no extension). */
  filename: string;
  /** Eyebrow shown on the PDF header. */
  eyebrow: string;
  /** Title shown on the PDF header. */
  title: string;
  /** Optional meta line (e.g. date range, generated by …). */
  meta?: string;
  /** Column header labels. */
  columns: string[];
  /** Row data, in the same order as columns. */
  rows: (string | number)[][];
}

export function downloadTableReportPdf(opts: TableReportOptions) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  brandedHeader(
    doc,
    opts.eyebrow,
    opts.title,
    opts.meta ?? `Generated ${fmtDate(new Date().toISOString())}`,
  );

  autoTable(doc, {
    startY: 104,
    head: [opts.columns],
    body: opts.rows as RowInput[],
    styles: { font: "helvetica", fontSize: 9, cellPadding: 6, textColor: BRAND.charcoal },
    headStyles: { fillColor: BRAND.terracotta, textColor: "#ffffff", fontStyle: "bold" },
    alternateRowStyles: { fillColor: "#fbf8f3" },
    margin: { left: 40, right: 40, bottom: 80 },
    theme: "striped",
  });

  brandedFooter(doc);
  triggerDownload(doc, `${opts.filename}.pdf`);
}

/* ───────────────────────── CSV ───────────────────────── */

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function downloadCsv(
  filename: string,
  columns: string[],
  rows: (string | number | null | undefined)[][],
) {
  const lines = [
    columns.map(csvEscape).join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ];
  // BOM so Excel reads UTF-8 correctly.
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
