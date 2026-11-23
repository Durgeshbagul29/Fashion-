/**
 * AbracaDabra Fashion - Google Apps Script Order Management Webhook & Email Engine
 * Project: AbracaDabra Webhook Engine
 * Sheet: AbracaDabra Orders & Inventory
 */

// =============================================================================
// CONFIGURATION
// =============================================================================
// Set the Admin Notification Email address below.
// You can also override this anytime via Apps Script Project Settings -> Script Properties -> ADMIN_EMAIL
const ADMIN_EMAIL = 'abracadabratest003@gmail.com'; // Admin notification recipient

const FOLDER_NAME = 'AbracaDabra Custom Designs';
const PROOFS_FOLDER_NAME = 'AbracaDabra Payment Proofs';

/**
 * Returns the configured Admin Email address.
 * Checks Script Properties first (ADMIN_EMAIL), falling back to the ADMIN_EMAIL constant.
 */
function getAdminEmail() {
  try {
    const prop = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
    if (prop && prop.trim()) {
      return prop.trim();
    }
  } catch (err) {
    Logger.log('Notice: ScriptProperties lookup: ' + err.message);
  }
  return ADMIN_EMAIL;
}

/**
 * ONE-CLICK AUTHORIZATION & DIAGNOSTIC TEST FUNCTION:
 * Run this function directly from the Apps Script toolbar (Select "testEmailAuthorization" -> Click "Run").
 * This triggers Google's one-time "Authorization Required" popup so you can grant Gmail / MailApp permissions.
 * After granting permissions, it sends a confirmation test email to the configured admin email.
 */
function testEmailAuthorization() {
  Logger.log('=== [START testEmailAuthorization] ===');
  const recipient = getAdminEmail();
  Logger.log('Testing email authorization for admin: ' + recipient);

  const subject = 'Test Order Notification Authorization – Abracadabra Fashion';
  const htmlBody = '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;padding:24px;background:#f9f9f9;border-radius:8px;border:1px solid #e5e7eb;max-width:540px;margin:0 auto;">' +
    '<h2 style="color:#080808;margin:0 0 10px 0;letter-spacing:1px;text-transform:uppercase;">Abracadabra Fashion</h2>' +
    '<div style="background:#e8f5e9;border:1px solid #a5d6a7;padding:12px 16px;border-radius:6px;margin-bottom:16px;">' +
      '<strong style="color:#2e7d32;font-size:15px;">✓ Email Authorization Successful!</strong>' +
    '</div>' +
    '<p style="color:#374151;font-size:14px;line-height:1.5;">Your Google Apps Script now has full permissions to send automatic order notification emails to <strong>' + recipient + '</strong>.</p>' +
    '<p style="color:#6b7280;font-size:13px;">Future customer orders will automatically dispatch detailed email alerts to this inbox.</p>' +
    '<hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;">' +
    '<p style="color:#9ca3af;font-size:11.5px;margin:0;">Timestamp: ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + '</p>' +
    '</div>';

  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });
    Logger.log('✓ SUCCESS: Test authorization email sent via MailApp to ' + recipient);
    return { success: true, provider: 'MailApp', recipient: recipient };
  } catch (err) {
    Logger.log('MailApp failed (' + err.message + '). Attempting GmailApp fallback...');
    try {
      GmailApp.sendEmail(recipient, subject, '', { htmlBody: htmlBody });
      Logger.log('✓ SUCCESS: Test authorization email sent via GmailApp to ' + recipient);
      return { success: true, provider: 'GmailApp', recipient: recipient };
    } catch (gErr) {
      Logger.log('CRITICAL: Authorization needed. Error: ' + gErr.message);
      throw gErr;
    }
  }
}

function doGet(e) {
  Logger.log('GET request received');
  if (e && e.parameter && (e.parameter.test === '1' || e.parameter.test_email === '1')) {
    try {
      const testResult = testEmailAuthorization();
      return ContentService.createTextOutput(JSON.stringify(testResult)).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    message: 'AbracaDabra Fashion Order Processing Webhook is live & operational.',
    adminEmailConfigured: getAdminEmail(),
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    Logger.log('Created new tab: ' + sheetName);
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    // Format header row with black background and bold white text
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#080808')
               .setFontColor('#ffffff')
               .setFontWeight('bold')
               .setFontSize(10)
               .setHorizontalAlignment('center')
               .setWrap(true);
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 38);
    Logger.log('Formatted header row for tab: ' + sheetName);
  }
  return sheet;
}

function getOrCreateDriveFolder(folderName) {
  try {
    const folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      return folders.next();
    }
    const folder = DriveApp.createFolder(folderName);
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(e) {}
    Logger.log('Created Drive folder: ' + folderName);
    return folder;
  } catch (err) {
    Logger.log('Drive folder error (' + folderName + '): ' + err.message);
    try {
      return DriveApp.getRootFolder();
    } catch(e) {
      return null;
    }
  }
}

function saveBase64ArtworkToDrive(folder, base64Data, filename) {
  if (!base64Data || !folder) return '';
  try {
    let contentType = 'image/png';
    let rawData = base64Data;
    if (base64Data.indexOf(';base64,') !== -1) {
      const parts = base64Data.split(';base64,');
      contentType = parts[0].replace('data:', '').trim() || 'image/png';
      rawData = parts[1];
    }
    // Remove any accidental newlines or whitespace
    rawData = rawData.replace(/[\r\n\s]/g, '');
    const decoded = Utilities.base64Decode(rawData);
    const blob = Utilities.newBlob(decoded, contentType, filename);
    const file = folder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(e) {}
    const fileUrl = file.getUrl();
    Logger.log('Saved file to Drive: ' + filename + ' -> ' + fileUrl);
    return fileUrl;
  } catch (err) {
    Logger.log('Error saving file (' + filename + '): ' + err.toString());
    return 'Error saving: ' + err.message;
  }
}

/**
 * Escapes characters for safe inclusion in HTML templates.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats numbers into Indian currency style (e.g., 1,499).
 */
function formatInr(num) {
  const n = Math.round(Number(num) || 0);
  return n.toLocaleString('en-IN');
}

/**
 * Builds the responsive, elegant HTML template for admin order notification emails.
 */
function buildOrderEmailTemplate(data) {
  const orderId = escapeHtml(data.orderId);
  const orderDate = escapeHtml(data.orderDate);
  const c = data.customer || {};
  const customerName = escapeHtml(c.name || 'N/A');
  const customerMobile = escapeHtml(c.mobile || 'N/A');
  const customerEmail = escapeHtml(c.email || '');
  const streetAddress = escapeHtml(c.address || '');
  const landmark = escapeHtml(c.landmark || '');
  const city = escapeHtml(c.city || '');
  const state = escapeHtml(c.state || '');
  const pin = escapeHtml(c.pin || '');
  const paymentMode = escapeHtml(data.paymentMode || 'Cash on Delivery (COD)');
  const upiUtr = escapeHtml(data.upiUtr || 'N/A');
  const paymentStatus = escapeHtml(data.paymentStatus || 'Pending');
  const orderStatus = escapeHtml(data.orderStatus || 'New');
  const paymentProofUrl = data.paymentProofUrl || '';
  const items = data.items || [];
  const frontArtworkLinks = data.frontArtworkLinks || [];
  const backArtworkLinks = data.backArtworkLinks || [];

  const subtotalFormatted = formatInr(data.subtotal);
  const shippingVal = Number(data.shipping) || 0;
  const shippingText = shippingVal === 0 ? '<span style="color:#16a34a;font-weight:700;">FREE Delivery</span>' : ('₹' + formatInr(shippingVal));
  const totalFormatted = formatInr(data.total);

  // Generate Item Rows HTML
  const itemsRowsHtml = items.map(function(item, idx) {
    const isCustom = !!item.custom || !!item.design || (item.id && String(item.id).toLowerCase().indexOf('custom') !== -1);
    const d = item.design || {};
    const qty = Number(item.qty) || 1;
    const price = Number(item.price) || 0;
    const itemTotal = qty * price;

    const type = item.type || (isCustom ? 'Custom T-Shirt' : 'Standard');
    const size = item.size || 'Free Size';
    const color = item.colorName || item.color || 'Standard';
    const placement = d.printTitle || d.print || (isCustom ? 'Custom Print' : '');

    let customDetailsHtml = '';
    if (isCustom) {
      const artLinks = [];
      if (item._frontDriveUrl && String(item._frontDriveUrl).indexOf('http') === 0) {
        artLinks.push('<a href="' + escapeHtml(item._frontDriveUrl) + '" target="_blank" style="color:#b45309;font-weight:700;text-decoration:underline;">Front Artwork (Drive Link)</a>');
      } else if (d.frontName) {
        artLinks.push('Front: ' + escapeHtml(d.frontName));
      }

      if (item._backDriveUrl && String(item._backDriveUrl).indexOf('http') === 0) {
        artLinks.push('<a href="' + escapeHtml(item._backDriveUrl) + '" target="_blank" style="color:#b45309;font-weight:700;text-decoration:underline;">Back Artwork (Drive Link)</a>');
      } else if (d.backName) {
        artLinks.push('Back: ' + escapeHtml(d.backName));
      }

      customDetailsHtml = '<div style="margin-top:6px;padding:8px 10px;background-color:#fefce8;border:1px solid #fef08a;border-radius:4px;font-size:11px;color:#713f12;line-height:1.4;">' +
        '<strong>🎨 Custom Design Info:</strong> ' + escapeHtml(placement) +
        (artLinks.length > 0 ? '<br><span style="margin-top:3px;display:inline-block;">' + artLinks.join(' &bull; ') + '</span>' : '') +
        '</div>';
    }

    return '<tr>' +
      '<td style="padding:14px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;vertical-align:top;">' +
        '<div style="font-weight:700;color:#111827;font-size:14px;line-height:1.3;">' + (idx + 1) + '. ' + escapeHtml(item.name || 'Product Item') + '</div>' +
        '<div style="color:#4b5563;font-size:12px;margin-top:4px;line-height:1.4;">' +
          '<span>Type: <b>' + escapeHtml(type) + '</b></span> &bull; ' +
          '<span>Size: <b>' + escapeHtml(size) + '</b></span> &bull; ' +
          '<span>Colour: <b>' + escapeHtml(color) + '</b></span>' +
        '</div>' +
        customDetailsHtml +
      '</td>' +
      '<td style="padding:14px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;vertical-align:top;font-weight:600;color:#111827;">' + qty + '</td>' +
      '<td style="padding:14px 10px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;vertical-align:top;color:#4b5563;">₹' + formatInr(price) + '</td>' +
      '<td style="padding:14px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;vertical-align:top;font-weight:700;color:#111827;">₹' + formatInr(itemTotal) + '</td>' +
    '</tr>';
  }).join('');

  // Front & Back Artwork Dedicated Drive Links (if available)
  let artworkSectionHtml = '';
  const hasArtworks = (frontArtworkLinks && frontArtworkLinks.length > 0) || (backArtworkLinks && backArtworkLinks.length > 0);
  if (hasArtworks) {
    const frontButtons = (frontArtworkLinks || []).map(function(url, i) {
      return '<a href="' + escapeHtml(url) + '" target="_blank" style="display:inline-block;margin:3px 6px 3px 0;padding:6px 12px;background-color:#080808;color:#ffffff;text-decoration:none;font-size:11px;font-weight:600;border-radius:4px;">📂 View Front Artwork #' + (i + 1) + ' &rarr;</a>';
    }).join(' ');

    const backButtons = (backArtworkLinks || []).map(function(url, i) {
      return '<a href="' + escapeHtml(url) + '" target="_blank" style="display:inline-block;margin:3px 6px 3px 0;padding:6px 12px;background-color:#080808;color:#ffffff;text-decoration:none;font-size:11px;font-weight:600;border-radius:4px;">📂 View Back Artwork #' + (i + 1) + ' &rarr;</a>';
    }).join(' ');

    artworkSectionHtml = '<tr>' +
      '<td style="padding:0 24px 20px 24px;">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #fef08a;background-color:#fefce8;border-radius:6px;overflow:hidden;">' +
          '<tr>' +
            '<td style="background-color:#fef9c3;padding:10px 16px;border-bottom:1px solid #fef08a;">' +
              '<strong style="font-size:12px;color:#713f12;text-transform:uppercase;letter-spacing:0.5px;">🎨 Custom Artwork Files Uploaded to Google Drive</strong>' +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding:14px 16px;font-size:13px;line-height:1.6;">' +
              (frontButtons ? '<div style="margin-bottom:8px;"><strong>Front Artworks:</strong><br>' + frontButtons + '</div>' : '') +
              (backButtons ? '<div><strong>Back Artworks:</strong><br>' + backButtons + '</div>' : '') +
            '</td>' +
          '</tr>' +
        '</table>' +
      '</td>' +
    '</tr>';
  }

  // Payment Proof Screenshot Link (if available)
  let paymentProofRowHtml = '';
  if (paymentProofUrl && paymentProofUrl !== 'N/A' && String(paymentProofUrl).indexOf('http') === 0) {
    paymentProofRowHtml = '<tr>' +
      '<td style="color:#6b7280;padding-bottom:6px;vertical-align:top;">Payment Proof Screenshot:</td>' +
      '<td style="padding-bottom:6px;vertical-align:top;">' +
        '<a href="' + escapeHtml(paymentProofUrl) + '" target="_blank" style="display:inline-block;padding:6px 12px;background-color:#080808;color:#ffffff;text-decoration:none;font-size:11px;font-weight:600;border-radius:4px;">' +
          '🧾 View Payment Proof Screenshot (Google Drive) &rarr;' +
        '</a>' +
      '</td>' +
    '</tr>';
  }

  // Return full HTML email template
  return '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
      '<meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<title>New Order Received - Abracadabra Fashion</title>' +
    '</head>' +
    '<body style="margin:0;padding:24px 0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;line-height:1.5;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;">' +
        '<tr>' +
          '<td align="center" style="padding:0 12px;">' +
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">' +

              '<!-- Brand Header -->' +
              '<tr>' +
                '<td style="background-color:#080808;padding:26px 28px;text-align:center;">' +
                  '<h1 style="margin:0;font-size:22px;letter-spacing:2.5px;font-weight:700;color:#ffffff;text-transform:uppercase;">Abracadabra Fashion</h1>' +
                  '<p style="margin:4px 0 0 0;font-size:12px;letter-spacing:2px;color:#d4af37;text-transform:uppercase;font-weight:600;">Wear Your Magic</p>' +
                '</td>' +
              '</tr>' +

              '<!-- Banner Title -->' +
              '<tr>' +
                '<td style="padding:22px 24px 14px 24px;background-color:#fafaf9;border-bottom:1px solid #f0f0ee;">' +
                  '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
                    '<tr>' +
                      '<td style="vertical-align:middle;">' +
                        '<span style="display:inline-block;padding:3px 8px;background-color:#d4af37;color:#080808;font-size:10.5px;font-weight:700;letter-spacing:1px;border-radius:3px;text-transform:uppercase;">Order Alert</span>' +
                        '<h2 style="margin:8px 0 4px 0;font-size:20px;color:#111827;font-weight:700;">New Order Received</h2>' +
                        '<p style="margin:0;font-size:12.5px;color:#6b7280;">A customer successfully placed an order. Order details saved in Google Sheets.</p>' +
                      '</td>' +
                      '<td align="right" valign="top" style="text-align:right;vertical-align:middle;">' +
                        '<div style="font-size:11.5px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Grand Total</div>' +
                        '<div style="font-size:22px;font-weight:800;color:#080808;">₹' + totalFormatted + '</div>' +
                      '</td>' +
                    '</tr>' +
                  '</table>' +
                '</td>' +
              '</tr>' +

              '<!-- Order Meta Summary -->' +
              '<tr>' +
                '<td style="padding:18px 24px;">' +
                  '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 14px;">' +
                    '<tr>' +
                      '<td width="50%" style="padding:6px 8px;font-size:13px;vertical-align:top;">' +
                        '<strong style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Order ID</strong><br>' +
                        '<span style="font-size:15px;font-weight:700;color:#111827;font-family:monospace;">#' + orderId + '</span>' +
                      '</td>' +
                      '<td width="50%" style="padding:6px 8px;font-size:13px;vertical-align:top;">' +
                        '<strong style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Order Date & Time</strong><br>' +
                        '<span style="font-size:13px;color:#111827;font-weight:500;">' + orderDate + '</span>' +
                      '</td>' +
                    '</tr>' +
                    '<tr>' +
                      '<td width="50%" style="padding:6px 8px;font-size:13px;vertical-align:top;">' +
                        '<strong style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Order Status</strong><br>' +
                        '<span style="display:inline-block;margin-top:2px;padding:2px 8px;background-color:#e0f2fe;color:#0369a1;font-size:11px;font-weight:700;border-radius:3px;">' + orderStatus + '</span>' +
                      '</td>' +
                      '<td width="50%" style="padding:6px 8px;font-size:13px;vertical-align:top;">' +
                        '<strong style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Payment Mode</strong><br>' +
                        '<span style="font-size:13px;font-weight:600;color:#111827;">' + paymentMode + '</span>' +
                      '</td>' +
                    '</tr>' +
                  '</table>' +
                '</td>' +
              '</tr>' +

              '<!-- Customer & Delivery Details -->' +
              '<tr>' +
                '<td style="padding:0 24px 18px 24px;">' +
                  '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">' +
                    '<tr>' +
                      '<td style="background-color:#f3f4f6;padding:10px 14px;border-bottom:1px solid #e5e7eb;">' +
                        '<strong style="font-size:12px;color:#111827;text-transform:uppercase;letter-spacing:0.5px;">👤 Customer &amp; Delivery Information</strong>' +
                      '</td>' +
                    '</tr>' +
                    '<tr>' +
                      '<td style="padding:14px;font-size:13px;line-height:1.6;color:#374151;">' +
                        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
                          '<tr>' +
                            '<td width="32%" style="color:#6b7280;padding-bottom:6px;vertical-align:top;">Customer Name:</td>' +
                            '<td style="color:#111827;font-weight:700;padding-bottom:6px;vertical-align:top;">' + customerName + '</td>' +
                          '</tr>' +
                          '<tr>' +
                            '<td style="color:#6b7280;padding-bottom:6px;vertical-align:top;">Mobile Number:</td>' +
                            '<td style="padding-bottom:6px;vertical-align:top;"><a href="tel:' + customerMobile + '" style="color:#2563eb;text-decoration:none;font-weight:600;">' + customerMobile + '</a></td>' +
                          '</tr>' +
                          (customerEmail ? '<tr>' +
                            '<td style="color:#6b7280;padding-bottom:6px;vertical-align:top;">Email:</td>' +
                            '<td style="padding-bottom:6px;vertical-align:top;"><a href="mailto:' + customerEmail + '" style="color:#2563eb;text-decoration:none;">' + customerEmail + '</a></td>' +
                          '</tr>' : '') +
                          '<tr>' +
                            '<td style="color:#6b7280;padding-bottom:6px;vertical-align:top;">Street Address:</td>' +
                            '<td style="color:#111827;padding-bottom:6px;vertical-align:top;">' + streetAddress + (landmark ? ' (Landmark: ' + landmark + ')' : '') + '</td>' +
                          '</tr>' +
                          '<tr>' +
                            '<td style="color:#6b7280;padding-bottom:6px;vertical-align:top;">City &amp; State:</td>' +
                            '<td style="color:#111827;padding-bottom:6px;vertical-align:top;">' + city + ', ' + state + '</td>' +
                          '</tr>' +
                          '<tr>' +
                            '<td style="color:#6b7280;vertical-align:top;">PIN Code:</td>' +
                            '<td style="color:#111827;font-weight:700;vertical-align:top;">' + pin + '</td>' +
                          '</tr>' +
                        '</table>' +
                      '</td>' +
                    '</tr>' +
                  '</table>' +
                '</td>' +
              '</tr>' +

              '<!-- Payment Details -->' +
              '<tr>' +
                '<td style="padding:0 24px 18px 24px;">' +
                  '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">' +
                    '<tr>' +
                      '<td style="background-color:#f3f4f6;padding:10px 14px;border-bottom:1px solid #e5e7eb;">' +
                        '<strong style="font-size:12px;color:#111827;text-transform:uppercase;letter-spacing:0.5px;">💳 Payment Details</strong>' +
                      '</td>' +
                    '</tr>' +
                    '<tr>' +
                      '<td style="padding:14px;font-size:13px;line-height:1.6;color:#374151;">' +
                        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
                          '<tr>' +
                            '<td width="32%" style="color:#6b7280;padding-bottom:6px;vertical-align:top;">Payment Mode:</td>' +
                            '<td style="color:#111827;font-weight:700;padding-bottom:6px;vertical-align:top;">' + paymentMode + '</td>' +
                          '</tr>' +
                          '<tr>' +
                            '<td style="color:#6b7280;padding-bottom:6px;vertical-align:top;">Payment Status:</td>' +
                            '<td style="padding-bottom:6px;vertical-align:top;"><span style="display:inline-block;padding:2px 8px;background-color:#fef3c7;color:#92400e;font-size:11px;font-weight:700;border-radius:3px;">' + paymentStatus + '</span></td>' +
                          '</tr>' +
                          (upiUtr && upiUtr !== 'N/A' && upiUtr !== 'N/A (COD)' ? '<tr>' +
                            '<td style="color:#6b7280;padding-bottom:6px;vertical-align:top;">UPI UTR / Ref No:</td>' +
                            '<td style="color:#111827;font-weight:700;font-family:monospace;font-size:13px;padding-bottom:6px;vertical-align:top;">' + upiUtr + '</td>' +
                          '</tr>' : '') +
                          paymentProofRowHtml +
                        '</table>' +
                      '</td>' +
                    '</tr>' +
                  '</table>' +
                '</td>' +
              '</tr>' +

              '<!-- Order Items Breakdown Table -->' +
              '<tr>' +
                '<td style="padding:0 24px 20px 24px;">' +
                  '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">' +
                    '<thead>' +
                      '<tr style="background-color:#080808;color:#ffffff;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">' +
                        '<th align="left" style="padding:10px 12px;">Product Details</th>' +
                        '<th align="center" style="padding:10px 8px;width:45px;">Qty</th>' +
                        '<th align="right" style="padding:10px 10px;width:75px;">Unit Price</th>' +
                        '<th align="right" style="padding:10px 12px;width:80px;">Item Total</th>' +
                      '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                      itemsRowsHtml +
                      '<!-- Financial Totals -->' +
                      '<tr style="background-color:#fafafa;border-top:1px solid #e5e7eb;font-size:12.5px;">' +
                        '<td colspan="3" align="right" style="padding:9px 12px;color:#6b7280;">Items Subtotal:</td>' +
                        '<td align="right" style="padding:9px 12px;color:#111827;font-weight:600;">₹' + subtotalFormatted + '</td>' +
                      '</tr>' +
                      '<tr style="background-color:#fafafa;font-size:12.5px;">' +
                        '<td colspan="3" align="right" style="padding:9px 12px;color:#6b7280;">Shipping &amp; Delivery:</td>' +
                        '<td align="right" style="padding:9px 12px;color:#111827;font-weight:600;">' + shippingText + '</td>' +
                      '</tr>' +
                      '<tr style="background-color:#f3f4f6;border-top:2px solid #e5e7eb;font-size:14px;">' +
                        '<td colspan="3" align="right" style="padding:12px;color:#080808;font-weight:700;">Grand Total:</td>' +
                        '<td align="right" style="padding:12px;color:#080808;font-weight:800;font-size:16px;">₹' + totalFormatted + '</td>' +
                      '</tr>' +
                    '</tbody>' +
                  '</table>' +
                '</td>' +
              '</tr>' +

              artworkSectionHtml +

              '<!-- Footer -->' +
              '<tr>' +
                '<td style="background-color:#fafaf9;padding:18px 24px;text-align:center;border-top:1px solid #f0f0ee;font-size:11.5px;color:#9ca3af;line-height:1.5;">' +
                  '<p style="margin:0 0 4px 0;">This is an automated notification from <strong>Abracadabra Fashion</strong> Order Management Engine.</p>' +
                  '<p style="margin:0;">Order data has been safely recorded across <em>Orders</em> and <em>Order Items</em> tabs in Google Sheets.</p>' +
                '</td>' +
              '</tr>' +

            '</table>' +
          '</td>' +
        '</tr>' +
      '</table>' +
    '</body>' +
    '</html>';
}

/**
 * Sends a high-priority, professionally styled HTML email notification to the store admin.
 * Uses MailApp with fallback to GmailApp.
 *
 * @param {Object} order The full order payload or order data object
 * @param {Object} [context] Supplementary processed data (Drive links, formatted items, etc.)
 * @return {Object} Status of email dispatch { success: boolean, recipient: string, provider: string }
 */
function sendAdminOrderNotification(order, context) {
  const ctx = context || {};
  const adminEmail = getAdminEmail();
  if (!adminEmail || adminEmail === 'admin@abracadabrafashion.com' && !adminEmail.includes('@')) {
    Logger.log('WARNING: Admin email is set to default placeholder: ' + adminEmail);
  }

  const orderId = ctx.orderId || order.orderId || ('AD-' + Date.now());
  const subject = `New Order Received – ${orderId} | Abracadabra Fashion`;

  const htmlBody = buildOrderEmailTemplate({
    orderId: orderId,
    orderDate: ctx.orderDate || order.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    customer: ctx.customer || order.customer || {},
    fullAddress: ctx.fullAddress || order.deliveryAddressCombined || '',
    items: ctx.items || order.items || [],
    subtotal: order.subtotal || 0,
    shipping: order.shipping || 0,
    total: order.total || 0,
    paymentMode: order.payment || 'Cash on Delivery (COD)',
    upiUtr: order.upiUtr || 'N/A',
    paymentStatus: order.paymentStatus || 'Pending',
    orderStatus: order.orderStatus || 'New',
    paymentProofUrl: ctx.paymentProofUrl || order.paymentProofUrl || '',
    frontArtworkLinks: ctx.frontArtworkLinks || order.frontArtworkLinks || [],
    backArtworkLinks: ctx.backArtworkLinks || order.backArtworkLinks || []
  });

  try {
    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      htmlBody: htmlBody
    });
    Logger.log('SUCCESS: Admin order notification email sent via MailApp to ' + adminEmail + ' for Order ' + orderId);
    return { success: true, recipient: adminEmail, provider: 'MailApp' };
  } catch (mailErr) {
    Logger.log('MailApp.sendEmail failed (' + mailErr.message + '). Attempting fallback with GmailApp...');
    try {
      GmailApp.sendEmail(adminEmail, subject, '', {
        htmlBody: htmlBody
      });
      Logger.log('SUCCESS: Admin order notification email sent via GmailApp to ' + adminEmail + ' for Order ' + orderId);
      return { success: true, recipient: adminEmail, provider: 'GmailApp' };
    } catch (gmailErr) {
      Logger.log('CRITICAL: Both MailApp and GmailApp failed to send email: ' + gmailErr.message);
      throw gmailErr;
    }
  }
}

// Backward-compatibility alias
function sendAdminOrderEmail(order, context) {
  return sendAdminOrderNotification(order, context);
}

/**
 * Safe retry mechanism to resend the order notification email without duplicating
 * order submissions or modifying Google Sheets rows.
 *
 * Can be executed directly from Google Apps Script editor (run retryOrderEmail),
 * or invoked programmatically with an orderId. If no orderId is passed, it resends
 * the email for the most recent order recorded in the "Orders" sheet.
 *
 * @param {string} [targetOrderId] Optional Order ID to retry (e.g. "ADL9XYZ123").
 * @return {Object} Result of retry operation.
 */
function retryOrderEmail(targetOrderId) {
  Logger.log('=== [START retryOrderEmail] ===');
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ordersSheet = ss.getSheetByName('Orders');
    if (!ordersSheet) {
      throw new Error('Orders sheet tab not found.');
    }

    const lastRow = ordersSheet.getLastRow();
    if (lastRow < 2) {
      throw new Error('No orders found in Orders tab.');
    }

    // Headers are in Row 1. Find the target order row.
    const data = ordersSheet.getRange(2, 1, lastRow - 1, 25).getValues();
    let orderRow = null;
    let foundOrderId = targetOrderId;

    if (targetOrderId) {
      const cleanTarget = String(targetOrderId).trim().toUpperCase();
      for (let i = data.length - 1; i >= 0; i--) {
        if (String(data[i][0]).trim().toUpperCase() === cleanTarget) {
          orderRow = data[i];
          foundOrderId = data[i][0];
          break;
        }
      }
      if (!orderRow) {
        throw new Error('Order ID "' + targetOrderId + '" not found in Orders tab.');
      }
    } else {
      // Default to the most recent order
      orderRow = data[data.length - 1];
      foundOrderId = orderRow[0];
      Logger.log('No targetOrderId specified; using latest order from sheet: ' + foundOrderId);
    }

    Logger.log('Reconstructing order data for retry: ' + foundOrderId);

    const c = {
      name: orderRow[2],
      mobile: orderRow[3],
      email: orderRow[4],
      address: orderRow[5],
      landmark: orderRow[6],
      city: orderRow[7],
      state: orderRow[8],
      pin: orderRow[9]
    };

    // Reconstruct item list from "Order Items" tab if available
    let items = [];
    const itemsSheet = ss.getSheetByName('Order Items');
    if (itemsSheet && itemsSheet.getLastRow() >= 2) {
      const itemsData = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 23).getValues();
      for (let j = 0; j < itemsData.length; j++) {
        if (String(itemsData[j][0]).trim().toUpperCase() === String(foundOrderId).trim().toUpperCase()) {
          items.push({
            id: itemsData[j][7],
            name: itemsData[j][8],
            type: itemsData[j][9],
            size: itemsData[j][10],
            colorName: itemsData[j][11],
            qty: itemsData[j][12],
            price: itemsData[j][13],
            custom: itemsData[j][15] === 'Yes',
            design: {
              printTitle: itemsData[j][16]
            },
            _frontDriveUrl: itemsData[j][17] !== 'N/A' ? itemsData[j][17] : '',
            _backDriveUrl: itemsData[j][18] !== 'N/A' ? itemsData[j][18] : ''
          });
        }
      }
    }

    // Fallback if no item rows found in Order Items tab
    if (items.length === 0) {
      items.push({
        name: orderRow[12] || 'Order Products',
        qty: orderRow[14] || 1,
        price: orderRow[15] || orderRow[17] || 0
      });
    }

    const frontLinks = orderRow[23] && orderRow[23] !== 'N/A' ? String(orderRow[23]).split('\n').filter(Boolean) : [];
    const backLinks = orderRow[24] && orderRow[24] !== 'N/A' ? String(orderRow[24]).split('\n').filter(Boolean) : [];
    const paymentProofLink = orderRow[20] && orderRow[20] !== 'N/A' ? orderRow[20] : '';

    const orderObj = {
      orderId: foundOrderId,
      date: orderRow[1],
      customer: c,
      deliveryAddressCombined: orderRow[10],
      subtotal: orderRow[15],
      shipping: orderRow[16],
      total: orderRow[17],
      payment: orderRow[18],
      upiUtr: orderRow[19],
      paymentStatus: orderRow[21],
      orderStatus: orderRow[22],
      items: items
    };

    const context = {
      orderId: foundOrderId,
      orderDate: orderRow[1],
      customer: c,
      fullAddress: orderRow[10],
      items: items,
      paymentProofUrl: paymentProofLink,
      frontArtworkLinks: frontLinks,
      backArtworkLinks: backLinks
    };

    const result = sendAdminOrderNotification(orderObj, context);
    Logger.log('SUCCESS: retryOrderEmail completed for ' + foundOrderId);
    return {
      status: 'success',
      orderId: foundOrderId,
      recipient: result.recipient,
      message: 'Email resent successfully without creating duplicate order'
    };

  } catch (err) {
    Logger.log('ERROR in retryOrderEmail: ' + err.toString());
    return {
      status: 'error',
      message: err.toString()
    };
  }
}

function doPost(e) {
  Logger.log('=== [START doPost] New Order Webhook Triggered ===');
  try {
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('ERROR: No payload contents received');
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No payload received' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    Logger.log('Raw Payload Length: ' + e.postData.contents.length + ' characters');
    const order = JSON.parse(e.postData.contents);

    // Support safe email retry action without modifying sheet rows
    if (order.action === 'retry_email' || order.action === 'resend_email') {
      Logger.log('Action: retry_email requested for order: ' + (order.orderId || 'latest'));
      const retryResult = retryOrderEmail(order.orderId);
      return ContentService.createTextOutput(JSON.stringify(retryResult))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const c = order.customer || {};
    const items = order.items || [];
    const orderId = order.orderId || ('AD-' + Date.now());
    const orderDate = order.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    Logger.log('Processing Order ID: ' + orderId + ' | Customer: ' + (c.name || 'N/A') + ' | Items: ' + items.length);

    // Delivery address components in separate columns + combined
    const streetAddress = c.address || '';
    const city = c.city || '';
    const state = c.state || '';
    const pin = c.pin || '';
    const landmark = c.landmark || '';
    const fullAddress = order.deliveryAddressCombined || [streetAddress, landmark ? ('Landmark: ' + landmark) : '', city, state, pin].filter(Boolean).join(', ');

    // Aggregate Product Info
    const productIdsList = items.map(i => i.id || 'N/A').join(', ');
    const productNamesList = items.map(i => i.name || 'N/A').join(', ');
    const productsSummary = items.map(i => {
      const details = [];
      if (i.size) details.push('Size: ' + i.size);
      if (i.colorName || i.color) details.push('Col: ' + (i.colorName || i.color));
      if (i.design && i.design.printTitle) details.push(i.design.printTitle);
      return `[${i.qty}x] ${i.name} (${details.join(', ')}) @ ₹${i.price}`;
    }).join(' | ');
    const totalQty = items.reduce((acc, i) => acc + (Number(i.qty) || 1), 0);

    // 1. Process custom artworks (if any) and upload to Drive
    const driveFolder = getOrCreateDriveFolder(FOLDER_NAME);
    let orderFrontArtworkLinks = [];
    let orderBackArtworkLinks = [];

    items.forEach((item, index) => {
      const isCustomItem = !!item.custom || !!item.design || (item.id && String(item.id).toLowerCase().indexOf('custom') !== -1);
      Logger.log('Checking item [' + (index+1) + ']: ' + item.name + ' | isCustom: ' + isCustomItem);
      
      if (item.design || isCustomItem) {
        const d = item.design || {};
        if (d.front) {
          Logger.log('Uploading Front Artwork for item ' + (index+1));
          const frontUrl = saveBase64ArtworkToDrive(driveFolder, d.front, `${orderId}-Item${index + 1}-front.png`);
          item._frontDriveUrl = frontUrl;
          if (frontUrl) orderFrontArtworkLinks.push(frontUrl);
        } else if (d.frontName) {
          item._frontDriveUrl = d.frontName;
        }

        if (d.back) {
          Logger.log('Uploading Back Artwork for item ' + (index+1));
          const backUrl = saveBase64ArtworkToDrive(driveFolder, d.back, `${orderId}-Item${index + 1}-back.png`);
          item._backDriveUrl = backUrl;
          if (backUrl) orderBackArtworkLinks.push(backUrl);
        } else if (d.backName) {
          item._backDriveUrl = d.backName;
        }
      }
    });

    const frontArtworkCol = orderFrontArtworkLinks.join('\n') || 'N/A';
    const backArtworkCol = orderBackArtworkLinks.join('\n') || 'N/A';

    // 2. Save Payment Proof Screenshot to Google Drive
    let paymentProofUrl = '';
    if (order.paymentProof) {
      Logger.log('Uploading payment proof for Order ' + orderId);
      const proofsFolder = getOrCreateDriveFolder(PROOFS_FOLDER_NAME);
      const proofExt = (order.paymentProofName && order.paymentProofName.includes('.')) 
        ? order.paymentProofName.split('.').pop() 
        : 'png';
      paymentProofUrl = saveBase64ArtworkToDrive(proofsFolder, order.paymentProof, `${orderId}-payment-proof.${proofExt}`);
    }

    // -------------------------------------------------------------
    // TAB 1: "Orders" (Master summary per order)
    // -------------------------------------------------------------
    const ordersHeaders = [
      'Order ID',
      'Date & Time',
      'Customer Name',
      'Mobile Number',
      'Email',
      'Street Address',
      'Landmark',
      'City',
      'State',
      'PIN Code',
      'Full Delivery Address',
      'Product IDs',
      'Product Names',
      'Products Summary',
      'Total Items Qty',
      'Subtotal (₹)',
      'Delivery Charges (₹)',
      'Grand Total (₹)',
      'Payment Mode',
      'UPI UTR / Ref No',
      'Payment Proof (Drive Link)',
      'Payment Status',
      'Order Status',
      'Front Artwork Files (Drive)',
      'Back Artwork Files (Drive)'
    ];

    const ordersSheet = getOrCreateSheet('Orders', ordersHeaders);
    ordersSheet.appendRow([
      orderId,
      orderDate,
      c.name || '',
      c.mobile || '',
      c.email || '',
      streetAddress,
      landmark,
      city,
      state,
      pin,
      fullAddress,
      productIdsList,
      productNamesList,
      productsSummary,
      totalQty,
      order.subtotal || 0,
      order.shipping || 0,
      order.total || 0,
      order.payment || 'COD',
      order.upiUtr || 'N/A',
      paymentProofUrl || 'N/A',
      order.paymentStatus || 'Pending',
      order.orderStatus || 'New',
      frontArtworkCol,
      backArtworkCol
    ]);
    Logger.log('SUCCESS: Written row to "Orders" tab');

    // -------------------------------------------------------------
    // TAB 2: "Order Items" (Item-level fulfillment breakdown)
    // -------------------------------------------------------------
    const itemsHeaders = [
      'Order ID',
      'Date & Time',
      'Customer Name',
      'Mobile Number',
      'City',
      'State',
      'PIN Code',
      'Product ID',
      'Product Name',
      'Product Type',
      'Size',
      'Colour',
      'Quantity',
      'Unit Price (₹)',
      'Item Total (₹)',
      'Is Custom Design',
      'Print Placement',
      'Front Artwork Drive Link',
      'Back Artwork Drive Link',
      'Payment Mode',
      'UPI UTR / Ref No',
      'Payment Proof Link',
      'Order Status'
    ];

    const itemsSheet = getOrCreateSheet('Order Items', itemsHeaders);
    items.forEach(item => {
      const isCustom = !!item.custom || !!item.design || (item.id && String(item.id).toLowerCase().indexOf('custom') !== -1);
      const d = item.design || {};
      itemsSheet.appendRow([
        orderId,
        orderDate,
        c.name || '',
        c.mobile || '',
        city,
        state,
        pin,
        item.id || '',
        item.name || '',
        item.type || (isCustom ? 'Custom T-Shirt' : 'Standard'),
        item.size || '',
        item.colorName || item.color || '',
        item.qty || 1,
        item.price || 0,
        (Number(item.qty) || 1) * (Number(item.price) || 0),
        isCustom ? 'Yes' : 'No',
        d.printTitle || d.print || (isCustom ? 'Custom Print' : 'N/A'),
        item._frontDriveUrl || (d.frontName || 'N/A'),
        item._backDriveUrl || (d.backName || 'N/A'),
        order.payment || 'COD',
        order.upiUtr || 'N/A',
        paymentProofUrl || 'N/A',
        order.orderStatus || 'New'
      ]);
    });
    Logger.log('SUCCESS: Written ' + items.length + ' rows to "Order Items" tab');

    // -------------------------------------------------------------
    // TAB 3: "Custom Designs" (ALWAYS write if any custom item is present!)
    // -------------------------------------------------------------
    const customItems = items.filter(i => {
      const isCust = !!i.custom || !!i.design;
      const idStr = String(i.id || '').toLowerCase();
      const catStr = String(i.cat || '').toLowerCase();
      const nameStr = String(i.name || '').toLowerCase();
      return isCust || idStr.indexOf('custom') !== -1 || catStr.indexOf('custom') !== -1 || nameStr.indexOf('custom') !== -1;
    });

    Logger.log('Found ' + customItems.length + ' custom items to record in "Custom Designs" tab');

    if (customItems.length > 0) {
      const artworkHeaders = [
        'Order ID',
        'Date & Time',
        'Customer Name',
        'Customer Mobile',
        'Product ID',
        'Product Name',
        'Print Placement',
        'Sizes & Qty',
        'T-Shirt Colour',
        'Front Artwork File Name',
        'Front Artwork Drive URL',
        'Back Artwork File Name',
        'Back Artwork Drive URL'
      ];
      
      const artworkSheet = getOrCreateSheet('Custom Designs', artworkHeaders);
      
      customItems.forEach(item => {
        const d = item.design || {};
        const placement = d.printTitle || d.print || 'Custom Print';
        const frontFileName = d.frontName || (item._frontDriveUrl ? 'front-artwork.png' : 'None');
        const backFileName = d.backName || (item._backDriveUrl ? 'back-artwork.png' : 'None');
        const frontLink = item._frontDriveUrl || (d.front ? 'Processing Artwork' : 'No front artwork');
        const backLink = item._backDriveUrl || (d.back ? 'Processing Artwork' : 'No back artwork');
        
        artworkSheet.appendRow([
          orderId,
          orderDate,
          c.name || '',
          c.mobile || '',
          item.id || 'custom-item',
          item.name || 'Custom Printed T-Shirt',
          placement,
          item.size || '',
          item.colorName || item.color || '',
          frontFileName,
          frontLink,
          backFileName,
          backLink
        ]);
        Logger.log('SUCCESS: Logged custom design row for: ' + item.name);
      });
    }

    // -------------------------------------------------------------
    // AUTOMATIC ADMIN EMAIL NOTIFICATION
    // Sent ONLY after Google Sheets data has been successfully saved.
    // Wrapped in a safe try/catch so any email quota or delivery error
    // will NEVER break or abort the successful order placement.
    // -------------------------------------------------------------
    let emailStatusResult = { sent: false, error: null };
    try {
      Logger.log('Sending automatic admin email notification for Order ' + orderId + '...');
      const emailRes = sendAdminOrderNotification(order, {
        orderId: orderId,
        orderDate: orderDate,
        customer: c,
        fullAddress: fullAddress,
        items: items,
        paymentProofUrl: paymentProofUrl,
        frontArtworkLinks: orderFrontArtworkLinks,
        backArtworkLinks: orderBackArtworkLinks
      });
      emailStatusResult.sent = true;
      emailStatusResult.recipient = emailRes.recipient;
      Logger.log('SUCCESS: Admin notification email dispatched to ' + emailRes.recipient);
    } catch (emailErr) {
      emailStatusResult.sent = false;
      emailStatusResult.error = emailErr.message || emailErr.toString();
      Logger.log('WARNING: Admin email notification failed for Order ' + orderId + ': ' + emailStatusResult.error);
      Logger.log('Note: Order has been successfully recorded in Google Sheets despite email issue.');
    }

    Logger.log('=== [END doPost] Order ' + orderId + ' Successfully Recorded ===');

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      orderId: orderId,
      customItemsRecorded: customItems.length,
      emailNotification: emailStatusResult,
      message: 'Order saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('CRITICAL ERROR in doPost: ' + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
