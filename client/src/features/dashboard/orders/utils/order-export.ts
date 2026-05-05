import type { OrderListItem } from "@/api/dashboard-management.service";

function csvEscape(value: string | number | undefined) {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function downloadOrdersCsv(orders: OrderListItem[], filenamePrefix = "orders") {
  const headers = [
    "Order ID",
    "Customer",
    "Phone",
    "Date",
    "Total",
    "Payment",
    "Status",
    "Address",
    "City",
  ];
  const rows = orders.map((o) => [
    o.trackingNumber ?? String(o._id),
    o.recipientName,
    o.recipientPhone ?? "",
    new Date(o.createdAt).toLocaleString(),
    o.totalAmount.toFixed(2),
    o.paymentStatus,
    o.status,
    o.shippingAddress ?? "",
    o.city ?? "",
  ]);
  const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function printOrdersShippingLabels(orders: OrderListItem[]): boolean {
  const w = window.open("", "_blank");
  if (!w) return false;
  const blocks = orders
    .map(
      (o) => `
      <div class="label">
        <div class="name">${escapeHtml(o.recipientName)}</div>
        <div class="addr">${escapeHtml(o.shippingAddress ?? "—")}</div>
        <div class="city">${escapeHtml(o.city ?? "")}</div>
        <div class="phone">${escapeHtml(o.recipientPhone ?? "—")}</div>
        <div class="meta">Order: ${escapeHtml(o.trackingNumber ?? String(o._id))} · ${escapeHtml(o.status)}</div>
      </div>`
    )
    .join("");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Shipping labels</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; color: #111; }
      .label { border: 1px solid #ccc; border-radius: 8px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
      .name { font-weight: 700; font-size: 16px; margin-bottom: 8px; }
      .addr, .city, .phone { font-size: 14px; line-height: 1.4; }
      .meta { font-size: 12px; color: #555; margin-top: 8px; }
    </style></head><body>${blocks}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
  return true;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
