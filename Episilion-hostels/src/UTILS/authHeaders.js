/**
 * Builds the Authorization header for an authenticated request.
 *
 * The backend accepts the token with or without a "Bearer " prefix, but the
 * prefixed form is the standard, so every call site uses this helper to stay
 * consistent.
 *
 * @param {string|null} [token] - the token to send. Defaults to the signed-in student's token.
 * @returns {Record<string, string>} the header object to spread into `headers`
 */
export function authHeaders(token) {
  const value = token ?? localStorage.getItem("token");

  if (!value) return {};

  return { Authorization: `Bearer ${value}` };
}

/**
 * Builds the Authorization header for a hostel manager request.
 */
export function managerAuthHeaders(token) {
  const value = token ?? localStorage.getItem("managerToken");

  if (!value) return {};

  return { Authorization: `Bearer ${value}` };
}
