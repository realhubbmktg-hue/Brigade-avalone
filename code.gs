/**
 * Google Apps Script for Brigade Avalon Landing Page Form Submission
 * 
 * Instructions:
 * 1. Open Google Sheets (create a new sheet or use an existing one).
 * 2. Click on Extensions -> Apps Script.
 * 3. Delete any code in the editor and paste this code.
 * 4. Click Save (disk icon).
 * 5. Click "Deploy" -> "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Set Description (e.g., "Brigade Avalon Form Submission").
 * 8. Under "Execute as", select "Me (your-email@gmail.com)".
 * 9. Under "Who has access", select "Anyone". (This is critical, otherwise the script will reject external POSTs).
 * 10. Click "Deploy". You may need to authorize permissions.
 * 11. Copy the "Web app URL" and paste it into SCRIPT_URL in the index (1).html file.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If the sheet is empty, initialize headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Form Source"]);
      
      // Style headers: bold, light gray background, freeze header row
      sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#f3f3f3");
      sheet.setFrozenRows(1);
    }
    
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    var timestamp = new Date();
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var phone = data.phone || "N/A";
    var source = data.source || "Unknown";
    
    // Prepend a single quote if the phone number starts with '+' to prevent Google Sheets from parsing it as a formula
    if (phone.toString().trim().indexOf('+') === 0) {
      phone = "'" + phone.toString().trim();
    }
    
    // Append the row to Google Sheets
    sheet.appendRow([timestamp, name, email, phone, source]);
    
    // Return a success JSON response
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    // Return error message if something goes wrong
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Add support for GET request test
function doGet(e) {
  return ContentService.createTextOutput("Web App is running! Use POST to submit form data.");
}
