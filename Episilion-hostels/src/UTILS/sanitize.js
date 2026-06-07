// src/utils/sanitize.js
import DOMPurify from "dompurify";

export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty, {
    FORBID_ATTR: ["style", "onerror", "onclick"], // extra hardening
    FORBID_TAGS: ["script", "iframe"],            // block dangerous tags
  });
}
