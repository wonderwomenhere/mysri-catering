/**
 * mysri catering Google Sheets sync endpoint
 * 1. Create a Google Sheet.
 * 2. Extensions -> Apps Script, paste this file.
 * 3. Deploy -> New deployment -> Web app; Execute as: Me; access: Anyone.
 * 4. Copy the Web app URL into app Settings.
 *
 * Security note: "Anyone" makes this endpoint public. Do not put sensitive data
 * in invoices; use an organization-controlled account and rotate the deployment
 * URL if it is shared unintentionally.
 */
const SHEET_NAME = "Invoices";
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    const headers = ["Invoice ID","Invoice No","Client","Client Phone","Event","Invoice Date","Event Date","Items JSON","Subtotal","Discount","Total","Received","Balance","Status","UPI ID","Payments JSON","Updated At"];
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);
    const id = String(data.id || (data.invoice && data.invoice.id) || "");
    if (data.action === "delete") {
      if (id) {
        const rows = sheet.getDataRange().getValues();
        for (let r = rows.length - 1; r >= 1; r--) if (String(rows[r][0]) === id) sheet.deleteRow(r + 1);
      }
      return output({ok:true,action:"delete",id:id});
    }
    if (data.action !== "upsert" || !data.invoice) return output({ok:false,error:"Expected upsert or delete"});
    const i = data.invoice;
    const row = [i.id || "",i.invoiceNo || "",i.client || "",i.phone || "",i.event || "",i.date || "",i.eventDate || "",JSON.stringify(i.items || []),i.subtotal || 0,i.discount || 0,i.total || 0,i.received || 0,i.balance || 0,i.status || "",i.upi || "",JSON.stringify(i.payments || []),new Date()];
    const rows = sheet.getDataRange().getValues();
    let found = 0;
    for (let r = 1; r < rows.length; r++) if (String(rows[r][0]) === String(i.id)) { found = r + 1; break; }
    if (found) sheet.getRange(found,1,1,row.length).setValues([row]); else sheet.appendRow(row);
    return output({ok:true,action:"upsert",id:i.id});
  } catch (err) { return output({ok:false,error:String(err)}); }
}
function doGet() { return output({ok:true,service:"mysri catering invoice sync",sheet:SHEET_NAME}); }
function output(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }