import "./MoreDetailsPage.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Reviews } from "./ReviewsData.jsx";
import { Helmet } from "react-helmet-async";
import { extractHostelIdFromSlug } from "../UTILS/slugFunctions.js";
import { authHeaders } from "../UTILS/authHeaders";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage.jsx";
import { getDirectionsOnMap } from "../UTILS/mapFunctions.js";
import {
  ArrowRight,
  CheckCircleFill,
  Clock,
  Envelope,
  ExclamationTriangle,
  GeoAlt,
  Heart,
  InfoCircle,
  Person,
  Star,
  StarFill,
  Telephone,
  Whatsapp,
} from "react-bootstrap-icons";
import {
  cleanLabel,
  formatAmount,
  formatBillingPeriod,
  formatDistance,
  formatHostelType,
  formatPriceRange,
  formatRating,
  toTitleCase,
} from "../UTILS/hostelFormatters.js";

const FALLBACK_IMAGE =
  "https://episilionhostels.onrender.com/images/hostel-images/htc_towers.webp";

function getCoordinates(hostel) {
  const latitude = Number(hostel?.location?.latitude);
  const longitude = Number(hostel?.location?.longitude);

  if (
    hostel?.location?.latitude === null ||
    hostel?.location?.latitude === undefined ||
    hostel?.location?.latitude === "" ||
    hostel?.location?.longitude === null ||
    hostel?.location?.longitude === undefined ||
    hostel?.location?.longitude === "" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

function isInstallmentAllowed(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function getWhatsappUrl(phone) {
  const number = typeof phone === "string" ? phone.replace(/\D/g, "") : "";
  return number ? `https://wa.me/${number}` : null;
}

function HostelPhoto({ photo, className }) {
  return (
    <div className={className}>
      <img
        src={photo.url}
        alt={photo.alt}
        loading={photo.featured ? "eager" : "lazy"}
        onError={(event) => {
          if (!event.currentTarget.src.includes("htc_towers.webp")) {
            event.currentTarget.src = FALLBACK_IMAGE;
          }
        }}
      />
    </div>
  );
}

export function MoreDetailsPage({ originalHostelCardData }) {
  const [reviewTextValue, setReviewTextValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewsResponse, setReviewsResponse] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [maxReview, setMaxReview] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");

  const { slug } = useParams();
  const hostelId = extractHostelIdFromSlug(slug);
  const foundHostel = originalHostelCardData.find(
    (hostel) => hostel.id === hostelId,
  );
  const navigate = useNavigate();

  useEffect(() => {
    let isCurrent = true;

    async function loadingReviews() {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const response = await axios.get(`/api/reviews/${hostelId}`);
        if (isCurrent) {
          setReviewsResponse(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (isCurrent) {
          setReviewsError("Reviews could not be loaded right now.");
        }
        console.error(
          "Error retrieving reviews:",
          error.response?.data || error.message,
        );
      } finally {
        if (isCurrent) setReviewsLoading(false);
      }
    }

    if (hostelId) loadingReviews();
    return () => {
      isCurrent = false;
    };
  }, [hostelId, reviewRefresh]);

  if (!foundHostel) {
    return <NotFoundPage />;
  }

  const roomTypes = Array.isArray(foundHostel.rooms?.types)
    ? foundHostel.rooms.types
    : [];
  const amenities = Array.isArray(foundHostel.amenities)
    ? foundHostel.amenities
        .map((item) => toTitleCase(cleanLabel(item)))
        .filter(Boolean)
    : [];
  const furnishing = Array.isArray(foundHostel.furnishing)
    ? foundHostel.furnishing
        .map((item) => toTitleCase(cleanLabel(item)))
        .filter(Boolean)
    : [];
  const rules = Array.isArray(foundHostel.rules)
    ? foundHostel.rules.filter((rule) => typeof rule === "string" && rule.trim())
    : [];
  const minimumPrice = foundHostel.pricing?.priceMin;
  const price =
    minimumPrice === null || minimumPrice === undefined || minimumPrice === ""
      ? null
      : formatPriceRange(foundHostel.pricing);
  const billingPeriod = formatBillingPeriod(foundHostel.pricing);
  const coordinates = getCoordinates(foundHostel);
  const walkingMinutes = foundHostel.location?.distanceToCampusMinutes;
  const hasWalkingDistance =
    walkingMinutes !== null &&
    walkingMinutes !== undefined &&
    walkingMinutes !== "" &&
    Number.isFinite(Number(walkingMinutes)) &&
    Number(walkingMinutes) > 0;
  const distance =
    coordinates || hasWalkingDistance
      ? formatDistance(foundHostel)
      : { label: "Distance to campus unavailable" };
  const ratingSummary = formatRating(foundHostel.reviews);
  const hostelType = formatHostelType(foundHostel.type);
  const mapUrl = coordinates
    ? `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&hl=en&z=15&output=embed`
    : null;
  const mapLink = coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`
    : null;
  const displayPhotos = [
    {
      url: foundHostel.image || FALLBACK_IMAGE,
      alt: `${foundHostel.name} exterior`,
      featured: true,
    },
  ];
  const contact = foundHostel.contact || {};
  const whatsappUrl = getWhatsappUrl(contact.whatsapp || contact.phone);
  const installmentAllowed = isInstallmentAllowed(
    foundHostel.pricing?.installmentAllowed,
  );
  const reviewCount = reviewsResponse.length;
  const fees = [
    ["Utilities", foundHostel.pricing?.additionalFees?.utilities],
    ["Maintenance", foundHostel.pricing?.additionalFees?.maintenance],
    ["Caution deposit", foundHostel.pricing?.additionalFees?.cautionDeposit],
  ].filter(([, amount]) => Number.isFinite(Number(amount)) && Number(amount) > 0);
  const hostelDescription =
    cleanLabel(foundHostel.hostelPerks) ||
    "Explore the rooms, facilities, and practical details available at this student hostel.";

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const reviewText = reviewTextValue.trim();
    if (rating === 0) {
      setReviewMessage("Choose a star rating before submitting.");
      return;
    }
    if (reviewText.length < 10) {
      setReviewMessage("Please write at least 10 characters about your experience.");
      return;
    }

    setIsSubmitting(true);
    setReviewMessage("");

    try {
      await axios.post(
        "/api/reviews",
        {
          hostel_id: hostelId,
          rating,
          review_text: reviewText,
        },
        {
          headers: {
            ...authHeaders(),
          },
        },
      );
      setRating(0);
      setReviewTextValue("");
      setReviewMessage("Thanks for sharing your experience.");
      setReviewRefresh((current) => current + 1);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setReviewMessage(
          error.response?.data?.error ||
            "Your review could not be submitted. Please try again.",
        );
      }
      console.error(
        "Error submitting review:",
        error.response?.data || error.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function addHostelToFavorite() {
    if (isSavingFavorite || isFavorite) return;
    setFavoriteError("");

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setIsSavingFavorite(true);
    try {
      await axios.post(
        `/api/favorites/${hostelId}`,
        {},
        {
          headers: {
            ...authHeaders(),
          },
        },
      );
      setIsFavorite(true);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setFavoriteError("Could not save this hostel. Please try again.");
      }
      console.error(
        "Error saving hostel:",
        error.response?.data || error.message,
      );
    } finally {
      setIsSavingFavorite(false);
    }
  }

  function showAllReviews() {
    setMaxReview((current) => (current > 2 ? 2 : reviewCount));
  }

  const metadataDescription = `Explore ${foundHostel.name}, a ${hostelType || "student"} hostel with ${amenities.slice(0, 4).join(", ") || "student accommodation"} near UPSA.`;

  return (
    <>
      <Helmet>
        <title>{`${foundHostel.name} near UPSA | Episilion Hostels`}</title>
        <link
          rel="canonical"
          href={`https://www.episilionhostels.com/hostels/${slug}`}
        />
        <meta name="description" content={metadataDescription} />
        <meta property="og:title" content={`${foundHostel.name} | Episilion Hostels`} />
        <meta property="og:description" content={metadataDescription} />
        <meta property="og:image" content={foundHostel.image || FALLBACK_IMAGE} />
        <meta
          property="og:url"
          content={`https://www.episilionhostels.com/hostels/${slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: foundHostel.name,
            image: foundHostel.image || undefined,
            priceRange: price?.label || "Price on request",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Accra",
              addressRegion: "Greater Accra",
              addressCountry: "GH",
            },
            geo: coordinates
              ? {
                  "@type": "GeoCoordinates",
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                }
              : undefined,
            telephone: contact.phone,
            email: contact.email,
            url: `https://www.episilionhostels.com/hostels/${slug}`,
            description: metadataDescription,
          })}
        </script>
      </Helmet>

      <main className="hostel-detail-page">
        <nav className="hostel-detail-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Find a hostel</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{foundHostel.name}</span>
        </nav>

        <section
          className={`hostel-detail-gallery ${displayPhotos.length === 1 ? "hostel-detail-gallery--single" : ""}`}
          aria-label={`${foundHostel.name} photos`}
        >
          {displayPhotos.map((photo, index) => (
            <HostelPhoto
              key={photo.url}
              photo={photo}
              className={`hostel-detail-gallery__photo hostel-detail-gallery__photo--${index + 1}`}
            />
          ))}
        </section>

        <section className="hostel-detail-intro">
          <div className="hostel-detail-intro__copy">
            <div className="hostel-detail-badges">
              <span className="hostel-detail-badge">Student accommodation</span>
              {hostelType && (
                <span className="hostel-detail-badge hostel-detail-badge--muted">
                  {hostelType}
                </span>
              )}
            </div>
            <h1>{foundHostel.name}</h1>
            <div className="hostel-detail-meta">
              <span>
                <GeoAlt aria-hidden="true" />
                {distance.label}
              </span>
              <span>
                <StarFill aria-hidden="true" />
                {ratingSummary.hasRating
                  ? `${ratingSummary.label} (${ratingSummary.total} ${ratingSummary.total === 1 ? "review" : "reviews"})`
                  : "New listing"}
              </span>
              {roomTypes.length > 0 && (
                <span>
                  <CheckCircleFill aria-hidden="true" />
                  {roomTypes.length} room {roomTypes.length === 1 ? "option" : "options"}
                </span>
              )}
            </div>
          </div>
          <div className="hostel-detail-intro__actions">
            <button
              type="button"
              className={`hostel-detail-save-button ${isFavorite ? "is-saved" : ""}`}
              onClick={addHostelToFavorite}
              disabled={isSavingFavorite || isFavorite}
              aria-pressed={isFavorite}
            >
              <Heart aria-hidden="true" />
              {isSavingFavorite
                ? "Saving..."
                : isFavorite
                  ? "Saved"
                  : "Save hostel"}
            </button>
            {coordinates && (
              <button
                type="button"
                className="hostel-detail-directions-button"
                onClick={() =>
                  getDirectionsOnMap(originalHostelCardData, hostelId)
                }
              >
                Get directions
                <ArrowRight aria-hidden="true" />
              </button>
            )}
          </div>
        </section>
        {favoriteError && (
          <p className="hostel-detail-inline-error" role="alert">
            {favoriteError}
          </p>
        )}

        <div className="hostel-detail-layout">
          <div className="hostel-detail-content">
            <section className="hostel-detail-section hostel-detail-overview">
              <p className="hostel-detail-eyebrow">WELCOME IN</p>
              <h2>Get to know {foundHostel.name}</h2>
              <p>{hostelDescription}</p>
            </section>

            <section className="hostel-detail-section">
              <div className="hostel-detail-section-heading">
                <div>
                  <p className="hostel-detail-eyebrow">FIND YOUR FIT</p>
                  <h2>Room options</h2>
                </div>
                <span className="hostel-detail-section-count">
                  {roomTypes.length} listed
                </span>
              </div>
              {roomTypes.length ? (
                <div className="hostel-detail-room-grid">
                  {roomTypes.map((room, index) => (
                    <article className="hostel-detail-room-card" key={`${room.type}-${index}`}>
                      <span className="hostel-detail-room-icon">
                        <Person aria-hidden="true" />
                      </span>
                      <h3>{room.type || "Room type"}</h3>
                      <p className="hostel-detail-room-price">
                        {room.price !== null &&
                        room.price !== undefined &&
                        room.price !== "" &&
                        Number.isFinite(Number(room.price))
                          ? formatAmount(room.price)
                          : "Price on request"}
                        <span> / {billingPeriod}</span>
                      </p>
                      {room.availableRooms !== null &&
                        room.availableRooms !== undefined &&
                        Number.isFinite(Number(room.availableRooms)) && (
                          <p className="hostel-detail-room-availability">
                            {Number(room.availableRooms)}{" "}
                            {Number(room.availableRooms) === 1
                              ? "room listed"
                              : "rooms listed"}
                          </p>
                        )}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="hostel-detail-empty">
                  Room types have not been listed yet. Contact the manager for
                  current options.
                </p>
              )}
            </section>

            <section className="hostel-detail-section">
              <div className="hostel-detail-section-heading">
                <div>
                  <p className="hostel-detail-eyebrow">EVERYDAY COMFORT</p>
                  <h2>Facilities &amp; amenities</h2>
                </div>
              </div>
              {amenities.length ? (
                <ul className="hostel-detail-chip-list">
                  {amenities.map((amenity, index) => (
                    <li key={`${amenity}-${index}`}>
                      <CheckCircleFill aria-hidden="true" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="hostel-detail-empty">
                  No facilities have been added to this listing yet.
                </p>
              )}
              {furnishing.length > 0 && (
                <div className="hostel-detail-furnishing">
                  <h3>Included in the rooms</h3>
                  <ul className="hostel-detail-chip-list hostel-detail-chip-list--soft">
                    {furnishing.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section className="hostel-detail-section">
              <div className="hostel-detail-section-heading">
                <div>
                  <p className="hostel-detail-eyebrow">GETTING HERE</p>
                  <h2>Location &amp; directions</h2>
                </div>
              </div>
              <div className="hostel-detail-location-card">
                <div className="hostel-detail-location-copy">
                  <span className="hostel-detail-location-icon">
                    <GeoAlt aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{distance.label}</h3>
                    <p>
                      {foundHostel.location?.directions ||
                        "Use the map to see this hostel’s location and plan your route."}
                    </p>
                    {mapLink && (
                      <a
                        className="hostel-detail-map-link"
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open in Google Maps <ArrowRight aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
                {mapUrl ? (
                  <iframe
                    src={mapUrl}
                    className="hostel-detail-map"
                    title={`Map showing ${foundHostel.name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="hostel-detail-map-placeholder">
                    <InfoCircle aria-hidden="true" />
                    <span>Map location has not been added yet.</span>
                  </div>
                )}
              </div>
            </section>

            {rules.length > 0 && (
              <section className="hostel-detail-section">
                <div className="hostel-detail-section-heading">
                  <div>
                    <p className="hostel-detail-eyebrow">GOOD TO KNOW</p>
                    <h2>House rules</h2>
                  </div>
                </div>
                <ul className="hostel-detail-rules">
                  {rules.map((rule, index) => (
                    <li key={`${rule}-${index}`}>
                      <ExclamationTriangle aria-hidden="true" />
                      <span>{toTitleCase(cleanLabel(rule))}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="hostel-detail-section hostel-detail-reviews">
              <div className="hostel-detail-section-heading">
                <div>
                  <p className="hostel-detail-eyebrow">STUDENT EXPERIENCES</p>
                  <h2>Reviews</h2>
                </div>
                <div className="hostel-detail-review-summary">
                  <StarFill aria-hidden="true" />
                  <span>
                    {ratingSummary.hasRating
                      ? `${ratingSummary.label} · ${ratingSummary.total} ${ratingSummary.total === 1 ? "review" : "reviews"}`
                      : "Be the first to review"}
                  </span>
                </div>
              </div>

              <form className="hostel-detail-review-form" onSubmit={handleSubmit}>
                <label className="hostel-detail-form-label">Your rating</label>
                <div className="hostel-detail-rating-input" role="group" aria-label="Choose a star rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => {
                        setRating(star);
                        setReviewMessage("");
                      }}
                      aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                      aria-pressed={rating === star}
                    >
                      {star <= rating ? (
                        <StarFill aria-hidden="true" />
                      ) : (
                        <Star aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
                <label className="hostel-detail-form-label" htmlFor="hostel-review">
                  Share your experience
                </label>
                <textarea
                  id="hostel-review"
                  maxLength={100}
                  placeholder="What should another student know about this hostel?"
                  value={reviewTextValue}
                  onChange={(event) => {
                    setReviewTextValue(event.target.value);
                    setReviewMessage("");
                  }}
                />
                <div className="hostel-detail-review-form__footer">
                  <span>{reviewTextValue.length}/100 characters</span>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit review"}
                    {!isSubmitting && <ArrowRight aria-hidden="true" />}
                  </button>
                </div>
                {reviewMessage && (
                  <p className="hostel-detail-form-message" role="status">
                    {reviewMessage}
                  </p>
                )}
              </form>

              <div className="hostel-detail-review-list" aria-live="polite">
                {reviewsLoading ? (
                  <p className="hostel-detail-empty">Loading student reviews...</p>
                ) : reviewsError ? (
                  <p className="hostel-detail-empty" role="status">
                    {reviewsError}
                  </p>
                ) : reviewCount === 0 ? (
                  <p className="hostel-detail-empty">
                    No reviews yet. Your experience can help the next student.
                  </p>
                ) : (
                  <>
                    {reviewsResponse.slice(0, maxReview).map((item, index) => (
                      <Reviews
                        key={item.review_id ?? item.reviewId ?? index}
                        item={item}
                      />
                    ))}
                    {reviewCount > 2 && (
                      <button
                        type="button"
                        className="hostel-detail-show-reviews"
                        onClick={showAllReviews}
                      >
                        {maxReview > 2 ? "Show fewer reviews" : `See all ${reviewCount} reviews`}
                      </button>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>

          <aside className="hostel-detail-sidebar" aria-label="Pricing and contact">
            <section className="hostel-detail-price-card">
              <p className="hostel-detail-eyebrow">PLAN YOUR STAY</p>
              <h2>Room pricing</h2>
              {price ? (
                <>
                  <p className="hostel-detail-price">
                    {price.label}
                    <span> / {billingPeriod}</span>
                  </p>
                  <p className="hostel-detail-price-note">
                    Prices shown are provided by the hostel manager.
                  </p>
                </>
              ) : (
                <p className="hostel-detail-price-note">
                  Contact the manager for current room prices.
                </p>
              )}

              <div className="hostel-detail-payment">
                <span className="hostel-detail-payment-icon">
                  <InfoCircle aria-hidden="true" />
                </span>
                <div>
                  <strong>Payment plan</strong>
                  <p>
                    {installmentAllowed
                      ? "Installment payments are allowed"
                      : "Confirm payment options with the manager"}
                  </p>
                </div>
              </div>

              {fees.length > 0 && (
                <div className="hostel-detail-fees">
                  <h3>Additional fees</h3>
                  {fees.map(([label, amount]) => (
                    <div className="hostel-detail-fee-row" key={label}>
                      <span>{label}</span>
                      <strong>{formatAmount(amount)}</strong>
                    </div>
                  ))}
                </div>
              )}

              {foundHostel.pricing?.refundPolicy && (
                <div className="hostel-detail-refund">
                  <span>Refund policy</span>
                  <p>{foundHostel.pricing.refundPolicy}</p>
                </div>
              )}

              <div className="hostel-detail-contact-actions">
                {whatsappUrl && (
                  <a
                    className="hostel-detail-contact-button hostel-detail-contact-button--primary"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Whatsapp aria-hidden="true" />
                    Message on WhatsApp
                  </a>
                )}
                {contact.phone && (
                  <a
                    className="hostel-detail-contact-button"
                    href={`tel:${contact.phone}`}
                  >
                    <Telephone aria-hidden="true" />
                    Call the manager
                  </a>
                )}
                {contact.email && (
                  <a
                    className="hostel-detail-email-link"
                    href={`mailto:${contact.email}`}
                  >
                    <Envelope aria-hidden="true" />
                    Email {contact.managerName || "the manager"}
                  </a>
                )}
              </div>

              {contact.managerName && (
                <div className="hostel-detail-manager">
                  <span className="hostel-detail-manager-avatar">
                    <Person aria-hidden="true" />
                  </span>
                  <div>
                    <span>Hostel manager</span>
                    <strong>{contact.managerName}</strong>
                    {contact.officeHours && (
                      <small>
                        <Clock aria-hidden="true" />
                        {contact.officeHours}
                      </small>
                    )}
                  </div>
                </div>
              )}
            </section>
            <p className="hostel-detail-trust-note">
              <InfoCircle aria-hidden="true" />
              Confirm availability, fees, and payment terms directly with the
              hostel before making arrangements.
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}
