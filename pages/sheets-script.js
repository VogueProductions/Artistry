// ============================================================
// ARTISTRY UNISEX SALON — AGRA
// Google Apps Script — Paste this into Extensions → Apps Script
// in your Google Sheet, then deploy as a Web App.
//
// SETUP STEPS:
// 1. Open your Google Sheet (create one if needed)
// 2. Go to Extensions → Apps Script
// 3. Delete any existing code and paste ALL of this file
// 4. Click "Save" (floppy disk icon)
// 5. Click "Deploy" → "New deployment"
// 6. Type: Web app | Execute as: Me | Access: Anyone
// 7. Click Deploy → Authorize → Copy the Web App URL
// 8. Paste the URL into js/booking.js → GOOGLE_SHEET_SCRIPT_URL
// ============================================================

const SHEET_NAME = 'Bookings';

// Column headers for the sheet
const HEADERS = [
  'Timestamp',
  'Name',
  'WhatsApp',
  'Service',
  'Gender',
  'Preferred Date',
  'Time Slot',
  'Notes',
  'Status'
];

/**
 * Handle POST requests from the booking form
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendToSheet(data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Booking received' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing the endpoint is live)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Artistry Salon Booking API is live ✦' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Write booking data to the Google Sheet
 */
function appendToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet and headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);

    // Style header row
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#0E0E0E');
    headerRange.setFontColor('#C8A97E');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    sheet.setFrozenRows(1);

    // Set column widths
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 150); // Name
    sheet.setColumnWidth(3, 140); // WhatsApp
    sheet.setColumnWidth(4, 200); // Service
    sheet.setColumnWidth(5, 90);  // Gender
    sheet.setColumnWidth(6, 120); // Date
    sheet.setColumnWidth(7, 100); // Slot
    sheet.setColumnWidth(8, 220); // Notes
    sheet.setColumnWidth(9, 140); // Status
  }

  // Check if headers row exists; if not, add it
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  // Append the booking row
  const row = [
    data.timestamp   || new Date().toLocaleString('en-IN'),
    data.name        || '',
    data.whatsapp    || '',
    data.service     || '',
    data.gender      || '',
    data.date        || '',
    data.slot        || '',
    data.notes       || '',
    data.status      || 'New Lead'
  ];

  sheet.appendRow(row);

  // Style the new row
  const lastRow = sheet.getLastRow();
  const newRowRange = sheet.getRange(lastRow, 1, 1, HEADERS.length);
  newRowRange.setFontSize(11);

  // Color the Status cell based on value
  const statusCell = sheet.getRange(lastRow, 9);
  switch ((data.status || '').toLowerCase()) {
    case 'new lead':
      statusCell.setBackground('#e8f4fd');
      statusCell.setFontColor('#1a6496');
      break;
    case 'confirmed':
      statusCell.setBackground('#eafaf1');
      statusCell.setFontColor('#1e8449');
      break;
    case 'follow-up pending':
      statusCell.setBackground('#fef9e7');
      statusCell.setFontColor('#b7770d');
      break;
    case 'visited':
      statusCell.setBackground('#e8e8e8');
      statusCell.setFontColor('#555');
      break;
    case 'cancelled':
      statusCell.setBackground('#fcebeb');
      statusCell.setFontColor('#a32d2d');
      break;
  }

  // Alternate row background
  if (lastRow % 2 === 0) {
    const range = sheet.getRange(lastRow, 1, 1, HEADERS.length - 1);
    range.setBackground('#fafafa');
  }

  // Optional: Send email notification to salon owner
  sendEmailNotification(data);
}

/**
 * Send email notification to salon owner when booking arrives
 * Update EMAIL_RECIPIENT with the salon owner's email address
 */
function sendEmailNotification(data) {
  const EMAIL_RECIPIENT = 'artistryunisexsalon@gmail.com'; // ← UPDATE THIS

  const subject = `New Booking: ${data.service} — ${data.name}`;
  const body = `
New appointment booking received at Artistry Unisex Salon!

─────────────────────────────
BOOKING DETAILS
─────────────────────────────
Name:        ${data.name}
WhatsApp:    ${data.whatsapp}
Service:     ${data.service}
Gender:      ${data.gender}
Date:        ${data.date}
Time Slot:   ${data.slot}
Notes:       ${data.notes || 'None'}
Received:    ${data.timestamp}
─────────────────────────────

Please confirm this booking on WhatsApp: https://wa.me/${data.whatsapp.replace(/\D/g, '')}

View all bookings: https://docs.google.com/spreadsheets/d/${SpreadsheetApp.getActiveSpreadsheet().getId()}

─────────────────────────────
Artistry Unisex Salon · Agra
`;

  try {
    MailApp.sendEmail(EMAIL_RECIPIENT, subject, body);
  } catch (err) {
    // Email sending failed — data is still saved in sheet
    console.log('Email notification failed:', err);
  }
}

/**
 * TEST FUNCTION — Run this manually from Apps Script editor
 * to verify your sheet setup is working
 */
function testBooking() {
  const testData = {
    timestamp: new Date().toLocaleString('en-IN'),
    name: 'Test Client',
    whatsapp: '+91 98765 43210',
    service: 'Bridal Makeup',
    gender: 'Women',
    date: '2026-05-20',
    slot: '11:00 AM',
    notes: 'Test booking — please ignore',
    status: 'New Lead'
  };
  appendToSheet(testData);
  Logger.log('Test booking added successfully!');
}
