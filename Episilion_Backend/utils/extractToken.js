/**
 * Extracts the JWT from an Authorization header.
 *
 * Historically the API used two different conventions at once:
 *   - `auth.js`               expected a bare token  -> "eyJhbGciOi..."
 *   - `verifyToken.js`        expected "Bearer <token>"
 *   - `verifyManagerToken.js` expected "Bearer <token>"
 *
 * That meant a client had to know, per route, which format to send — easy to
 * get wrong and impossible to change on the frontend without breaking
 * something. Everything now goes through this helper, which accepts both
 * forms, so the header format is no longer part of the API contract.
 */

/**
 * @param {import("express").Request} req
 * @returns {string|null} the raw token, or null when no usable token is present
 */
function extractToken(req) {
  const header = req.headers?.authorization;

  if (typeof header !== "string" || !header.trim()) {
    return null;
  }

  const value = header.trim();

  // "Bearer <token>" / "bearer <token>" / "Token <token>" — any scheme.
  const schemeMatch = value.match(/^([A-Za-z]+)\s+(.*)$/);
  if (schemeMatch) {
    const token = schemeMatch[2].trim();
    return token || null;
  }

  // A scheme with no token at all (e.g. "Bearer") is not a usable token.
  if (/^[A-Za-z]+$/.test(value)) {
    return null;
  }

  // Bare token.
  return value || null;
}

module.exports = extractToken;
