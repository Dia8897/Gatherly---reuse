import { sendEmail } from "./email.js";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const fullName = (...parts) => parts.filter(Boolean).join(" ").trim();

const formatDateTime = (value) => {
  if (!value) return "Not specified";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const sendHostApprovalEmail = (host) => {
  const name = fullName(host?.fName, host?.lName) || "there";
  const text = [
    `Hi ${name},`,
    "",
    "Good news: your Gatherly host account has been approved.",
    "You can now sign in, browse accepted events, and apply for host opportunities.",
    "",
    "Best,",
    "The Gatherly Admin Team",
  ].join("\n");

  const html = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Good news: your Gatherly host account has been approved.</p>
    <p>You can now sign in, browse accepted events, and apply for host opportunities.</p>
    <p>Best,<br>The Gatherly Admin Team</p>
  `;

  return sendEmail({
    to: host?.email,
    subject: "Your Gatherly host account was approved",
    text,
    html,
  });
};

export const sendEventApprovalEmail = (event) => {
  const clientName = fullName(event?.clientFirstName, event?.clientLastName) || "there";
  const eventTitle = event?.title || event?.type || "your event";
  const startsAt = formatDateTime(event?.startsAt);
  const endsAt = formatDateTime(event?.endsAt);
  const location = event?.location || "Not specified";

  const text = [
    `Hi ${clientName},`,
    "",
    `Your event request "${eventTitle}" has been accepted by Gatherly.`,
    "",
    `Location: ${location}`,
    `Starts: ${startsAt}`,
    `Ends: ${endsAt}`,
    "",
    "Our team will continue preparing the hosting details.",
    "",
    "Best,",
    "The Gatherly Admin Team",
  ].join("\n");

  const html = `
    <p>Hi ${escapeHtml(clientName)},</p>
    <p>Your event request <strong>${escapeHtml(eventTitle)}</strong> has been accepted by Gatherly.</p>
    <ul>
      <li><strong>Location:</strong> ${escapeHtml(location)}</li>
      <li><strong>Starts:</strong> ${escapeHtml(startsAt)}</li>
      <li><strong>Ends:</strong> ${escapeHtml(endsAt)}</li>
    </ul>
    <p>Our team will continue preparing the hosting details.</p>
    <p>Best,<br>The Gatherly Admin Team</p>
  `;

  return sendEmail({
    to: event?.clientEmail,
    subject: `Your Gatherly event was accepted: ${eventTitle}`,
    text,
    html,
  });
};
