/**
 * Choice Credit & Rental Solutions — Google Apps Script Email Handler
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file into Code.gs
 * 3. Update ADMIN_EMAIL below to your notification email address
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and save it as the GAS_EMAIL_URL environment
 *    variable in your Replit project (api-server secrets)
 */

var ADMIN_EMAIL = "your-email@example.com";
var APP_NAME = "Choice Credit & Rental Solutions";

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    handleNotification(payload);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("Error: " + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleNotification(payload) {
  var subject = "[" + APP_NAME + "] " + payload.subject;
  var body = payload.body;

  switch (payload.type) {
    case "new_lead":
      sendAdminEmail(subject, body);
      sendLeadConfirmation(payload.data);
      break;
    case "new_contact":
      sendAdminEmail(subject, body);
      sendContactConfirmation(payload.data);
      break;
    case "payment_selected":
      sendAdminEmail(subject, body);
      break;
    case "document_uploaded":
      sendAdminEmail(subject, body);
      break;
    default:
      sendAdminEmail(subject, body);
  }
}

function sendAdminEmail(subject, body) {
  GmailApp.sendEmail(ADMIN_EMAIL, subject, body, {
    name: APP_NAME + " Notifications"
  });
}

function sendLeadConfirmation(data) {
  if (!data || !data.email) return;

  var subject = "We received your consultation request — " + APP_NAME;
  var body = [
    "Hi " + data.fullName + ",",
    "",
    "Thank you for submitting a consultation request with Choice Credit & Rental Solutions.",
    "",
    "We've received your information and an advisor will reach out to you within 24 hours to discuss your situation and the best path forward.",
    "",
    "Here's what you shared with us:",
    "  Situation: " + data.situation,
    "  Preferred Time: " + (data.preferredTime || "Not specified"),
    "",
    "If you have any immediate questions, reply to this email or call us directly.",
    "",
    "Looking forward to helping you get approved,",
    "The Choice Credit & Rental Solutions Team"
  ].join("\n");

  GmailApp.sendEmail(data.email, subject, body, {
    name: APP_NAME,
    replyTo: ADMIN_EMAIL
  });
}

function sendContactConfirmation(data) {
  if (!data || !data.email) return;

  var subject = "We got your message — " + APP_NAME;
  var body = [
    "Hi " + data.fullName + ",",
    "",
    "Thanks for reaching out to Choice Credit & Rental Solutions!",
    "",
    "We received your message and will get back to you within 1 business day.",
    "",
    "Your message:",
    "\"" + data.message + "\"",
    "",
    "Talk soon,",
    "The Choice Credit & Rental Solutions Team"
  ].join("\n");

  GmailApp.sendEmail(data.email, subject, body, {
    name: APP_NAME,
    replyTo: ADMIN_EMAIL
  });
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", app: APP_NAME }))
    .setMimeType(ContentService.MimeType.JSON);
}
