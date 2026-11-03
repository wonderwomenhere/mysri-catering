# mysri catering Invoice Book

A free, offline-first invoice web app styled with the warm gold and brown Deepavali palette from the supplied menu.

## Included
- Invoice create/edit, client/phone/event/date, line items, quantities, rates, discount.
- 2026 sweets/savouries menu and 250 g / 500 g / 1 kg pricing.
- Advance, full payment, no-payment options; later payments; Unpaid / Partial / Paid status.
- Dashboard totals, date/status filters, search.
- Invoice preview, copy, WhatsApp message, print / Save as PDF.
- UPI ID and balance payment QR in invoice preview when a UPI ID is configured. QR image generation uses an online QR service; the invoice itself still works offline, but the QR image needs internet.
- JSON backup/restore, dark mode, local storage, PWA service worker.
- Optional Google Sheets sync endpoint.

## Quick start
1. Unzip this folder.
2. Open `index.html` in a desktop/mobile browser to use the basic local app. Data stays in that browser on that device.
3. For installable/offline PWA behavior, serve this folder over HTTPS (or localhost). A free static host such as GitHub Pages can host the files. In Chrome use menu → Install app / Add to Home screen.
4. In Settings, set your UPI ID. It is printed with the balance and used to form a UPI payment QR.

## PDF and WhatsApp
Open an invoice → Print / Save PDF → choose “Save as PDF” in the browser print dialog. WhatsApp opens a pre-filled text message; attach the saved PDF manually. Browser web apps cannot silently attach a generated PDF to WhatsApp without a user action. The “Share PDF” control opens the print flow so you can save it first.

## Google Sheets one-time setup
1. Create a Google Sheet in the Google account where you want to keep invoice records.
2. In that Sheet choose Extensions → Apps Script.
3. Copy `GoogleAppsScript.gs` into the script editor and save.
4. Deploy → New deployment → Web app. Execute as **Me**. Set access to **Anyone** (required for a simple no-login endpoint); review the privacy implications before doing this.
5. Copy the deployed `/exec` URL into Settings → Google Sheets Web App URL and Save.
6. Create/edit an invoice or record a payment, then press “Sync pending to Sheet”. The script maintains one row per invoice ID and updates it on upsert; delete removes its row. Offline changes are queued on this device until online.
7. Check the Sheet’s `Invoices` tab. Each invoice is one row; line items and payment history are stored as JSON cells.

**Important sync limitation:** this lightweight free endpoint uses browser `no-cors` POST, so the app cannot read a success response from Google. The UI can confirm that a send was attempted, but you should verify the row in Sheets after first setup. It is not a conflict-safe multi-user database. Use one main device/account or reconcile simultaneous edits carefully. Keep regular JSON backups.

## Menu rates (per pack)
- Special Laddoo ₹195 per 250 g; ₹390 per 500 g; ₹780 per 1 kg
- Adirasam ₹200; ₹400; ₹800
- Wheat Halwa ₹200; ₹400; ₹800
- Mysore Pak ₹175; ₹350; ₹700
- Special Mixture ₹175; ₹350; ₹700
- Ribbon Pakoda ₹150; ₹300; ₹600
- Kai Murukku ₹175; ₹350; ₹700
- Oma Podi ₹150; ₹300; ₹600
- Sweet Somas (3 pieces) ₹100; Deepavali Legiyam (50 gram) ₹100

## Data & privacy
Invoices are stored in browser localStorage, not encrypted. Anyone using the same browser profile may be able to access them. Export backups and protect the device. Clearing browser site data can erase local invoices. Google Sheets is optional and must be configured by you. This is a starter app, not a hosted multi-user service.
