// Builds a URL-friendly slug from the hostel name + appends the raw UUID
export function buildHostelSlug(hostel) {
  if (!hostel?.name || !hostel?.id) return "";
  const namePart = hostel.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${namePart}-${hostel.id}`;
}

// Pulls the UUID back out of a slug, regardless of how the name portion is formatted
const UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function extractHostelIdFromSlug(slug) {
  if (!slug) return null;
  const match = slug.match(UUID_PATTERN);
  return match ? match[0] : null;
}