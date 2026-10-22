import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building,
  Clock,
  GeoAlt,
  StarFill,
} from "react-bootstrap-icons";
import { buildHostelSlug } from "../UTILS/slugFunctions.js";
import {
  formatBillingPeriod,
  formatDistance,
  formatHostelType,
  formatPriceRange,
  formatRating,
  selectAmenities,
} from "../UTILS/hostelFormatters.js";
import "./HostelCard.css";

const FALLBACK_IMAGE =
  "https://episilionhostels.onrender.com/images/hostel-images/htc_towers.webp";

export function HostelCard({ hostel }) {
  const price = formatPriceRange(hostel?.pricing);
  const rating = formatRating(hostel?.reviews);
  const distance = formatDistance(hostel);
  const billingPeriod = formatBillingPeriod(hostel?.pricing);
  const typeLabel = formatHostelType(hostel?.type);
  const amenities = selectAmenities(hostel?.amenities, 2);

  const hostelName = hostel?.name || "Hostel";
  const imageSrc = hostel?.image || FALLBACK_IMAGE;

  return (
    <article className="hostel-card">
      <div className="hostel-card__media">
        <img
          className="hostel-card__image"
          src={imageSrc}
          alt={`${hostelName} exterior`}
          loading="lazy"
          onError={(event) => {
            if (event.currentTarget.src !== FALLBACK_IMAGE) {
              event.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
        />

        <div className="hostel-card__overlay" aria-hidden="true" />

        <div className="hostel-card__badges">
          {typeLabel && (
            <span className="hostel-card__badge hostel-card__badge--type">
              <Building aria-hidden="true" />
              {typeLabel}
            </span>
          )}

          {rating.hasRating ? (
            <span
              className="hostel-card__badge hostel-card__badge--rating"
              title={rating.tooltip}
            >
              <StarFill aria-hidden="true" />
              {rating.label}
            </span>
          ) : (
            <span
              className="hostel-card__badge hostel-card__badge--new"
              title={rating.tooltip}
            >
              {rating.label}
            </span>
          )}
        </div>
      </div>

      <div className="hostel-card__body">
        <div className="hostel-card__heading">
          <h3 className="hostel-card__name">{hostelName}</h3>

          {price && (
            <p className="hostel-card__price">
              <span className="hostel-card__price-value">{price.label}</span>
              {billingPeriod && (
                <span className="hostel-card__price-period">
                  per {billingPeriod}
                </span>
              )}
            </p>
          )}
        </div>

        <p className="hostel-card__meta">
          {distance.kind === "walk" ? (
            <Clock aria-hidden="true" className="hostel-card__meta-icon" />
          ) : (
            <GeoAlt aria-hidden="true" className="hostel-card__meta-icon" />
          )}
          <span>{distance.label}</span>
        </p>

        <ul className="hostel-card__amenities">
          {amenities.map((amenity) => (
            <li key={amenity} className="hostel-card__amenity">
              {amenity}
            </li>
          ))}
        </ul>

        <Link
          to={`/hostels/${buildHostelSlug(hostel)}`}
          className="hostel-card__cta js-view-more-details"
        >
          <span>View Details</span>
          <ArrowRight aria-hidden="true" className="hostel-card__cta-icon" />
        </Link>
      </div>
    </article>
  );
}
