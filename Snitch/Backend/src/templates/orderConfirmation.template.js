/**
 * Noirvayn Atelier Order Confirmation Email Template
 * 
 * Design Standards:
 * - Anti-AI-slop brutalist luxury editorial architecture
 * - 100% email client compatible (Gmail, Apple Mail, Outlook, Yahoo)
 * - Strict inline CSS with table-based layout
 * - High-contrast palette: Obsidian (#141518), Off-White (#F4F3ED), Crimson (#CC171C)
 * - Includes both HTML and plain-text alternatives for 100% deliverability
 */

export function generateOrderConfirmationEmail({ user, payment, frontendUrl = "http://localhost:5173" }) {
  const orderId = payment?.Razorpay?.orderId || payment?._id || "NV-ARCHIVE";
  const paymentId = payment?.Razorpay?.paymentId || "VERIFIED";
  const orderDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalAmount = Number(payment?.price?.amount || 0).toLocaleString("en-IN");
  const currency = payment?.price?.currency || "INR";
  const currencySymbol = currency === "INR" ? "₹" : currency;

  const items = Array.isArray(payment?.orderItems) ? payment.orderItems : [];

  // Determine primary delivery address
  const address = user?.addresses?.[0] || {};
  const recipientName = address.fullName || user?.fullName || "Noirvayn Collector";
  const recipientPhone = address.phone || user?.contact || "";
  const street = address.street || "";
  const city = address.city || "";
  const state = address.state || "";
  const pincode = address.pincode || "";

  const addressFormatted = [street, city, state, pincode].filter(Boolean).join(", ") || "Delivery details on file";

  const orderUrl = `${frontendUrl}/order-success?order_id=${encodeURIComponent(orderId)}`;

  // ── HTML Template ────────────────────────────────────────────────────────
  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Noirvayn Atelier // Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ECEAE2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #141518;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ECEAE2; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (600px standard) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #F8F7F2; border: 2px solid #141518; box-shadow: 6px 6px 0px #141518;">
          
          <!-- Top Header Strip with Monogram & Serial -->
          <tr>
            <td style="background-color: #141518; padding: 22px 28px; border-bottom: 2px solid #141518;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 18px; font-weight: 900; letter-spacing: 0.3em; color: #FFFFFF; text-transform: uppercase;">
                      NOIRVAYN
                    </span>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 9px; letter-spacing: 0.25em; color: #8E8D8A; margin-top: 3px; text-transform: uppercase;">
                      ATELIER ARCHIVE // DEL // EST. 2026
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #CC171C; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; background-color: #27272A; padding: 4px 8px; border: 1px solid #3F3F46;">
                      CONFIRMED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Editorial Lead Banner -->
          <tr>
            <td style="padding: 32px 28px 24px 28px; border-bottom: 1px solid #D9D6CE;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family: 'Courier New', Courier, monospace; font-size: 10px; letter-spacing: 0.2em; color: #71717A; text-transform: uppercase; padding-bottom: 8px;">
                    <span style="display: inline-block; width: 6px; height: 6px; background-color: #CC171C; margin-right: 6px;"></span>
                    ORDER ALLOCATION DISPATCHED
                  </td>
                </tr>
                <tr>
                  <td style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 800; color: #141518; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.2;">
                    YOUR ARCHIVE IS SECURED.
                  </td>
                </tr>
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #52525B; line-height: 1.6; padding-top: 10px;">
                    Salutations, <strong>${recipientName}</strong>. Your payment has been verified and your curated selection has been allocated in the Noirvayn Atelier queue. Preparation for archival dispatch has begun.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Technical Metadata Strip -->
          <tr>
            <td style="background-color: #EFECE3; padding: 16px 28px; border-bottom: 1px solid #D9D6CE;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" valign="top" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #71717A; text-transform: uppercase; line-height: 1.5;">
                    ORDER REFERENCE:<br />
                    <strong style="color: #141518; font-size: 12px; letter-spacing: 0.05em;">#${orderId}</strong>
                  </td>
                  <td width="50%" align="right" valign="top" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #71717A; text-transform: uppercase; line-height: 1.5;">
                    DATE ALLOCATED:<br />
                    <strong style="color: #141518; font-size: 11px;">${orderDate}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Manifest -->
          <tr>
            <td style="padding: 24px 28px 16px 28px;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #141518; letter-spacing: 0.15em; text-transform: uppercase; padding-bottom: 12px; border-bottom: 2px solid #141518;">
                MANIFEST SPECIFICATIONS // ${items.length} ${items.length === 1 ? "PIECE" : "PIECES"}
              </div>

              <!-- Product Line Items -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                ${items
                  .map((item, idx) => {
                    const itemTitle = item.title || "Curated Garment";
                    const itemQty = item.quantity || 1;
                    const itemPrice = Number(item.price?.amount || 0).toLocaleString("en-IN");
                    
                    // Resilient image extraction across all schema structures
                    let rawImg = "";
                    if (Array.isArray(item.images) && item.images.length > 0) {
                      const first = item.images[0];
                      rawImg = typeof first === "string" ? first : (first?.url || "");
                    } else if (typeof item.image === "string") {
                      rawImg = item.image;
                    }

                    // Email client image optimization (ImageKit auto-resize)
                    let itemImg = rawImg;
                    if (itemImg && itemImg.includes("ik.imagekit.io") && !itemImg.includes("?tr=")) {
                      itemImg = `${itemImg}?tr=w-160,h-200,cm-pad_resize,bg-F8F7F2`;
                    }

                    return `
                    <tr>
                      <td style="padding: 16px 0; border-bottom: 1px solid #E2E0D8;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            ${
                              itemImg
                                ? `
                            <td width="64" valign="middle" style="padding-right: 14px;">
                              <img src="${itemImg}" alt="${itemTitle}" width="64" height="80" border="0" style="display: block; width: 64px; max-width: 64px; height: 80px; border: 1px solid #D9D6CE; background-color: #E7E5DC; outline: none; text-decoration: none;" />
                            </td>`
                                : ""
                            }
                            <td valign="middle">
                              <span style="font-family: 'Courier New', Courier, monospace; font-size: 9px; color: #CC171C; font-weight: bold;">[SPEC 0${idx + 1}]</span>
                              <div style="font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; color: #141518; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">
                                ${itemTitle}
                              </div>
                              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #71717A; margin-top: 3px;">
                                QTY: <strong>${itemQty}</strong> &bull; ARTISANAL FINISH
                              </div>
                            </td>
                            <td align="right" valign="middle" style="font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: bold; color: #141518; white-space: nowrap;">
                              ${currencySymbol}${itemPrice}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    `;
                  })
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- Financial Calculation Breakdown -->
          <tr>
            <td style="padding: 10px 28px 24px 28px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #EFECE3; border: 1px solid #D9D6CE; padding: 16px 18px;">
                <tr>
                  <td style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #71717A; text-transform: uppercase; padding-bottom: 6px;">
                    SUBTOTAL
                  </td>
                  <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #141518; font-weight: bold; padding-bottom: 6px;">
                    ${currencySymbol}${totalAmount}
                  </td>
                </tr>
                <tr>
                  <td style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #71717A; text-transform: uppercase; padding-bottom: 10px;">
                    ATELIER DISPATCH // COURIER
                  </td>
                  <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #15803D; font-weight: bold; padding-bottom: 10px;">
                    COMPLIMENTARY
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 1px solid #D9D6CE; padding-top: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 800; color: #141518; text-transform: uppercase; letter-spacing: 0.05em;">
                          TOTAL CHARGED
                        </td>
                        <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 16px; font-weight: 900; color: #141518;">
                          ${currencySymbol}${totalAmount}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 6px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 9px; color: #71717A; text-transform: uppercase;">
                      PAYMENT TRANSACTION ID: ${paymentId} &bull; RAZORPAY VERIFIED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dispatch Destination & Logistics Box -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #D9D6CE; background-color: #FFFFFF; padding: 18px;">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 12px; border-right: 1px solid #EFECE3;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: bold; color: #71717A; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                      SHIPPING RECIPIENT
                    </div>
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: bold; color: #141518;">
                      ${recipientName}
                    </div>
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #52525B; line-height: 1.5; margin-top: 3px;">
                      ${addressFormatted}
                    </div>
                    ${
                      recipientPhone
                        ? `
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #71717A; margin-top: 4px;">
                      TEL: ${recipientPhone}
                    </div>`
                        : ""
                    }
                  </td>
                  <td width="50%" valign="top" style="padding-left: 16px;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: bold; color: #71717A; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                      DISPATCH DISCIPLINE
                    </div>
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #52525B; line-height: 1.5;">
                      All garments undergo strict tactile quality inspection. Dispatched in archival matte shielding within 24&ndash;48 hrs.
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #CC171C; font-weight: bold; margin-top: 6px; text-transform: uppercase;">
                      ESTIMATED: 3&ndash;5 BUSINESS DAYS
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary Interactive CTA Button -->
          <tr>
            <td align="center" style="padding: 0 28px 36px 28px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #141518; border: 1px solid #141518; box-shadow: 4px 4px 0px #CC171C;">
                    <a href="${orderUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: bold; color: #FFFFFF; text-decoration: none; letter-spacing: 0.15em; text-transform: uppercase;">
                      VIEW ORDER ARCHIVE &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #141518; color: #A1A1AA; padding: 24px 28px; border-top: 2px solid #141518;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="font-family: 'Courier New', Courier, monospace; font-size: 9px; line-height: 1.6; text-transform: uppercase;">
                    <strong>NOIRVAYN TECHNICAL STREETWEAR & ATELIER</strong><br />
                    Architectural Discipline &bull; Garments For Permanence<br />
                    Concierge Inquiries: <a href="mailto:concierge@noirvayn.com" style="color: #FFFFFF; text-decoration: underline;">concierge@noirvayn.com</a>
                  </td>
                  <td align="right" valign="bottom" style="font-family: 'Courier New', Courier, monospace; font-size: 9px; color: #71717A;">
                    &copy; 2026 NOIRVAYN.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // ── Plain-Text Alternative (Ensures 100% spam filter compliance) ──────────
  const text = `
NOIRVAYN ATELIER // ORDER CONFIRMATION
===============================================
ORDER REFERENCE: #${orderId}
DATE: ${orderDate}
PAYMENT: ${paymentId} (Razorpay Verified)

Dear ${recipientName},

Your payment has been successfully confirmed and your curated archival selection is locked in for dispatch.

MANIFEST:
${items
  .map(
    (item, idx) =>
      `[${idx + 1}] ${item.title || "Curated Piece"} x${item.quantity || 1} — ${currencySymbol}${Number(item.price?.amount || 0).toLocaleString("en-IN")}`
  )
  .join("\n")}

FINANCIAL BREAKDOWN:
- Subtotal: ${currencySymbol}${totalAmount}
- Shipping: COMPLIMENTARY (FREE)
- Total Charged: ${currencySymbol}${totalAmount}

DISPATCH ADDRESS:
${recipientName}
${addressFormatted}
Tel: ${recipientPhone}

DISPATCH TIMELINE:
Dispatched within 24-48 hours in archival packaging. Estimated delivery: 3-5 business days.

View your order online:
${orderUrl}

Concierge: concierge@noirvayn.com
(C) 2026 NOIRVAYN ATELIER. ALL RIGHTS RESERVED.
`.trim();

  return { html, text };
}

