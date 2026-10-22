/**
 * Display formatters for the hostel card.
 *
 * The API returns values that are not safe to render directly:
 *  - review averages arrive as strings ("0.0"), and most hostels have no reviews
 *  - price ranges can be inverted (priceMin > priceMax) or collapsed (priceMin === priceMax)
 *  - the walking distance is null for some hostels, so a straight-line fallback is needed
 *  - amenity labels carry stray whitespace and Unicode variation selectors
 *
 * Everything the card renders is normalised here so the component markup can
 * stay declarative and every card ends up the same height.
 */

import { getDistance } from "geolib";

/** UPSA main campus — the reference point for every distance shown on a card. */
export const CAMPUS_COORDINATES = {
  latitude: 5.660969,
  longitude: -0.166374,
};

/** Cedi sign, written as an escape so the source file stays pure ASCII. */
const CURRENCY_SIGN = "\u20B5";

/** Words that stay lowercase when a label is title-cased. */
const MINOR_WORDS = new Set([
  "and",
  "or",
  "of",
  "the",
  "per",
  "in",
  "on",
  "to",
  "for",
  "with",
]);

/** Brand and industry terms that should not be title-cased naively. */
const ACRONYMS = {
  cctv: "CCTV",
  dstv: "DSTV",
  tv: "TV",
  wifi: "WiFi",
};

/** Hostel types that are meaningful to a student looking at a card. */
const HOSTEL_TYPE_LABELS = {
  mixed: "Mixed",
  girls: "Girls",
  boys: "Boys",
};

/** Every hostel on the platform is priced per semester. */
const DEFAULT_BILLING_PERIOD = "semester";

/**
 * Strip invisible characters that break label rendering.
 * U+FE0E/U+FE0F are variation selectors, U+200B-U+200D are zero-width marks.
 */
export function cleanLabel(raw) {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/[\uFE00-\uFE0F]/g, "")
    .replace(/[\u200B-\u200D\u2060]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Title-case a single label while keeping acronyms and measured tokens intact.
 */
export function toTitleCase(text) {
  if (!text) return "";

  return text
    .split(" ")
    .map((word, index) => {
      if (!word) return word;
      if (index > 0 && MINOR_WORDS.has(word.toLowerCase())) {
        return word.toLowerCase();
      }
      const lower = word.toLowerCase();
      if (ACRONYMS[lower]) return ACRONYMS[lower];
      // Keep tokens such as "5kg" or "24/7" exactly as they were written.
      if (/\d/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Pick the amenities shown on a card.
 * Cleans, de-duplicates and title-cases them so the chips look identical
 * across every card in the grid.
 */
export function selectAmenities(amenities, limit = 2) {
  if (!Array.isArray(amenities)) return [];

  const seen = new Set();
  const selected = [];

  for (const raw of amenities) {
    const cleaned = cleanLabel(raw);
    if (!cleaned) continue;

    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    selected.push(toTitleCase(cleaned));
    if (selected.length >= limit) break;
  }

  return selected;
}

/**
 * Format an amount of money, e.g. 12000 -> "₵12,000".
 */
export function formatAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return `${CURRENCY_SIGN}${amount.toLocaleString("en-US")}`;
}

/**
 * Build the price label for a card.
 * Handles collapsed ranges (single price) and inverted ranges (min > max).
 */
export function formatPriceRange(pricing) {
  const min = Number(pricing?.priceMin);
  const max = Number(pricing?.priceMax);

  if (!Number.isFinite(min)) return null;

  if (!Number.isFinite(max) || min === max) {
    return { min, max: min, isRange: false, label: formatAmount(min) };
  }

  const low = Math.min(min, max);
  const high = Math.max(min, max);

  return {
    min: low,
    max: high,
    isRange: true,
    label: `${formatAmount(low)} – ${formatAmount(high)}`,
  };
}

/**
 * Normalise the billing period, e.g. "Per Semester" -> "semester".
 *
 * Every hostel on the platform is priced per semester — the same assumption
 * the details page and the site copy make — so an empty billing field falls
 * back to that default instead of leaving a hole in the card.
 */
export function formatBillingPeriod(pricing) {
  const period =
    typeof pricing?.billingPeriod === "string" ? pricing.billingPeriod.trim() : "";

  if (!period) return DEFAULT_BILLING_PERIOD;

  return period.replace(/^per\s+/i, "").toLowerCase();
}

/**
 * Straight-line distance from campus in metres, or null when the hostel
 * has no usable coordinates.
 */
export function getMetersFromCampus(hostel) {
  const latitude = Number(hostel?.location?.latitude);
  const longitude = Number(hostel?.location?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const meters = getDistance(CAMPUS_COORDINATES, {
    latitude,
    longitude,
  });

  return Number.isFinite(meters) ? Math.round(meters) : null;
}

/**
 * Build the distance label for a card.
 * The manager-entered walking time is preferred because it reflects the real
 * route; the straight-line distance is only a fallback.
 *
 * A walking time of 0 is treated as "not recorded" rather than "next door" —
 * the manager form stores an unset field as 0, and a hostel 1.3 km away
 * should never be advertised as being right next to campus.
 */
export function formatDistance(hostel) {
  const rawMinutes = hostel?.location?.distanceToCampusMinutes;
  const minutes =
    rawMinutes === null || rawMinutes === undefined || rawMinutes === ""
      ? NaN
      : Number(rawMinutes);

  if (Number.isFinite(minutes) && minutes > 0) {
    return {
      kind: "walk",
      label: `${minutes} min walk from campus`,
    };
  }

  const meters = getMetersFromCampus(hostel);
  if (meters === null) {
    return { kind: "unknown", label: "Distance to campus unavailable" };
  }

  return {
    kind: "distance",
    label: `${meters.toLocaleString("en-US")} m from campus`,
  };
}

/**
 * Build the rating label for a card.
 * A hostel with no reviews is shown as "New" instead of a broken "0.0" star.
 */
export function formatRating(reviews) {
  const total = Number(reviews?.totalReviews);
  const average = Number(reviews?.averageRating);
  const reviewCount = Number.isFinite(total) ? total : 0;

  if (reviewCount > 0 && Number.isFinite(average) && average > 0) {
    const label = average.toFixed(1);
    return {
      hasRating: true,
      value: average,
      label,
      total: reviewCount,
      tooltip: `Rated ${label} out of 5 from ${reviewCount} review${reviewCount === 1 ? "" : "s"}`,
    };
  }

  if (reviewCount > 0) {
    return {
      hasRating: false,
      value: null,
      label: "No rating",
      total: reviewCount,
      tooltip: "This hostel has reviews but no rating yet",
    };
  }

  return {
    hasRating: false,
    value: null,
    label: "New",
    total: 0,
    tooltip: "No reviews yet",
  };
}

/**
 * Map a hostel type to a label worth showing on the card.
 * Unknown types (the API also returns a generic "Hostel" value) are omitted.
 */
export function formatHostelType(type) {
  if (typeof type !== "string") return null;
  return HOSTEL_TYPE_LABELS[type.trim().toLowerCase()] ?? null;
}
