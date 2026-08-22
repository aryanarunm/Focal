/**
 * Focal — link to QR code generator
 * -------------------------------------
 * All logic lives in this one file so it's easy to read top-to-bottom.
 *
 * Flow:
 *   1. User submits the form with a URL.
 *   2. We validate the input.
 *   3. We hand the string to the QRCode library, which draws it onto
 *      the #qrcode element as a <canvas> (or <img> fallback).
 *   4. We reveal the "actions" row so the user can download or copy.
 */

// Grab the DOM elements we need once, up front.
const form = document.getElementById("qr-form");
const input = document.getElementById("url-input");
const errorMsg = document.getElementById("error-msg");
const viewfinder = document.getElementById("viewfinder");
const qrContainer = document.getElementById("qrcode");
const actions = document.getElementById("actions");
const downloadBtn = document.getElementById("download-btn");
const copyBtn = document.getElementById("copy-btn");
const themeToggle = document.getElementById("theme-toggle");

// --- Theme toggle -----------------------------------------------
// The actual theme was already applied before first paint by the
// inline script in index.html (so there's no flash of the wrong
// theme). This just wires up the button to flip it afterwards.
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("focal-theme", nextTheme);
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
});

// Set the correct initial aria-label/pressed state on load.
(function initThemeButtonState() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
})();


// Keep a single QRCode instance so we can call .clear() + .makeCode()
// instead of re-creating the object (and re-appending canvases) every time.
let qrInstance = null;
let currentLink = "";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleGenerate();
});

downloadBtn.addEventListener("click", handleDownload);
copyBtn.addEventListener("click", handleCopyLink);

function handleGenerate() {
  const rawValue = input.value.trim();
  errorMsg.textContent = "";

  if (!rawValue) {
    errorMsg.textContent = "Enter a link first.";
    return;
  }

  // Normalize: if the user forgot "https://", add it so the QR
  // still opens as a clickable link when scanned.
  const normalizedLink = normalizeUrl(rawValue);

  if (!isLikelyValidUrl(normalizedLink)) {
    errorMsg.textContent = "That doesn't look like a valid link.";
    return;
  }

  currentLink = normalizedLink;
  renderQrCode(normalizedLink);
}

function normalizeUrl(value) {
  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);
  return hasProtocol ? value : `https://${value}`;
}

function isLikelyValidUrl(value) {
  try {
    // The built-in URL constructor throws on anything malformed.
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function renderQrCode(link) {
  // Clear any previously rendered code before drawing a new one.
  qrContainer.innerHTML = "";

  qrInstance = new QRCode(qrContainer, {
    text: link,
    width: 180,
    height: 180,
    colorDark: "#15171c",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M,
  });

  viewfinder.classList.add("is-focused");
  actions.hidden = false;
}

function handleDownload() {
  // qrcode.js renders onto a <canvas> inside the container.
  const canvas = qrContainer.querySelector("canvas");
  if (!canvas) return;

  const link = document.createElement("a");
  link.download = "qr-code.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function handleCopyLink() {
  if (!currentLink) return;

  try {
    await navigator.clipboard.writeText(currentLink);
    flashButtonLabel(copyBtn, "Copied!");
  } catch {
    // Clipboard API can fail (e.g. insecure context) — fail quietly.
    flashButtonLabel(copyBtn, "Couldn't copy");
  }
}

function flashButtonLabel(button, tempLabel) {
  const original = button.textContent;
  button.textContent = tempLabel;
  setTimeout(() => {
    button.textContent = original;
  }, 1500);
}
