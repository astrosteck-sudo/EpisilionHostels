import "./MoreDetailsPage.css";
import { PageHeader } from "../PageHeader/PageHeader";
import { Link } from "react-router-dom";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import emptyStar from "../assets/icons/empty-star.png";
import fullStar from "../assets/icons/star.png";
import { useState, useEffect } from "react";
import { getDirectionsOnMap } from "../UTILS/mapFunctions.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Reviews } from "./ReviewsData.jsx";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { extractHostelIdFromSlug } from "../UTILS/slugFunctions.js";
import { getDistance } from "geolib";
import { kilometersToMeters } from "../UTILS/kilometerConvertor";

import {
  CheckCircleFill,
  InfoCircle,
  ExclamationTriangle,
  Telephone,
  Whatsapp,
  Envelope,
  Person,
} from "react-bootstrap-icons";

export function MoreDetailsPage({ originalHostelCardData }) {
  // const [close, setClose] = useState(true); //THIS CONTROLS THE THE IFRAME, OPENING AND CLOSING IT
  // const [activate, setActivate] = useState(false); //THIS CONTROLS THE DARK BACKGROUND WHEN THE LOCATIONS BUTTONS ARE CLICKED
  const [reviewTextValue, setReviewTextValue] = useState(""); //THIS CONTROLS WHAT THE USER TYPOES IN THE TEXT AREA
  const [isSubmitting, setIsSubmitting] = useState(false); // THIS CONTROLLS SUBMIT BUTTON SO FREEZE WHEN SUBMITTING
  //const [toggleReview, setToggleReview] = useState('close');//THIS CONTROLLS THE SHOWING AND HIDING OF THE SUBMITTED REVIEWS
  const [reviewsResponse, setReviewsResponse] = useState([]); //THIS STATE VARIABLE STORES THE RESPONSE FROM THE BACKEND WHEN WE RETRIEVE THE REVIEWS FOR A PARTICULAR HOSTEL
  const [rating, setRating] = useState(0); //THIS CONTROLS HOW THE STARS SELECTED BEHAVE
  const [maxReview, setMaxReview] = useState(2); //THIS CONTROLLS THE NUMBER OF REVIEWS SHOWN
  const [isFavorite, setIsFavorite] = useState(false); //THIS CONTROLS THE FAVORITE BUTTON TO SHOW IF THE HOSTEL IS IN THE FAVORITES OR NOT

  const url = "https://episilion-backend-2lt0.onrender.com"; //THIS IS THE URL FOR THE BACKEND, THIS IS USED TO ACCESS THE IMAGES IN THE PUBLIC FOLDER OF THE BACKEND

  const { slug } = useParams();
  const hostelId = extractHostelIdFromSlug(slug);
  //let foundHostel = null;

  const foundHostel = originalHostelCardData.find(
    (hostel) => hostel.id === hostelId,
  );
  console.log("Found hostel:", foundHostel); // Debugging log to check the found hostel

  // const [googleMapSrc, setGoogleMapSrc] = useState("");

  // function closeMap() {
  //   if (!close) {
  //     setActivate(false);
  //     setClose(true);
  //   } else {
  //     setClose(false);
  //   }
  // }

  const navigate = useNavigate();
  // function comapareHostels(parameter) {
  //   navigate(`/comparehostels?hostelId=${parameter}`);
  // }

  //THIS USEEFFECT WILL CHECK IF THE HOSTEL DATA HAS BEEN LOADED, IF IT HAS THEN IT WILL CLOSE THE LOADING ANIMATION

  function handleStarClick(value) {
    if (rating === value) {
      setRating(0);
    } else {
      setRating(value);
    }
  }
  function userTypedReview(event) {
    setReviewTextValue(event.target.value);
  }
  function listenForEnterKey(event) {
    if (event.key === "Enter") {
      event.preventDefault(); //this stops a new line appearing when the enter key is pressed
      handleSubmit();
    }
  }

  //THIS FUNCTION WILL HANDLE THE SUBMISSION OF THE REVIEW, IT WILL SEND A POST REQUEST TO THE BACKEND WITH THE RATING AND THE REVIEW TEXT, IT ALSO CHECKS IF THE USER IS LOGGED IN BY CHECKING IF THERE IS A TOKEN IN THE LOCAL STORAGE, IF THERE IS NO TOKEN IT WILL REDIRECT THE USER TO THE LOGIN PAGE
  async function handleSubmit() {
    //THIS WILL STOP ANY FURTHER SUBMITTING WHEN SUBMITTING
    if (isSubmitting) {
      return;
    }
    if (rating === 0 || reviewTextValue === "" || reviewTextValue.length < 10) {
      //alert("Please select a rating first");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        "/api/reviews",
        {
          hostel_id: hostelId,
          rating: rating,
          review_text: reviewTextValue,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );
      setRating(0);
      setReviewTextValue("");
      setIsSubmitting(false);
      loadingReviews(hostelId); //THIS FUNCTION WILL RELOAD THE REVIEWS TO SHOW THE NEWLY ADDED REVIEW
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      console.log(
        "Error submitting review:",
        error.response?.data || error.message,
      );
    }
  }
  //THIS FUNCTION WILL LOAD THE REVIEWS FOR A PARTICULAR HOSTEL, THIS FUNCTION IS CALLED IN THE USEEFFECT BELOW TO LOAD THE REVIEWS WHEN THE PAGE LOADS
  async function loadingReviews(hostelId) {
    try {
      const response = await axios.get(`/api/reviews/${hostelId}`);
      //console.log("Response from reviews API:", response.data); // Debugging log to check the response from the API
      if (response.data.length === 0) {
        setReviewsResponse(["no reviews"]);
        return;
      }
      setReviewsResponse(response.data);
    } catch (error) {
      console.log(
        "Error Retrieving review:",
        error.response?.data || error.message,
      );
    }
  }

  useEffect(() => {
    loadingReviews(hostelId);
  }, []);

  //THIS FUNCTION WILL TOGGLE THE DISPLAY OF THE REVIEWS WHEN THE "SHOW REVIEWS" BUTTON IS CLICKED
  function showAllReviews() {
    setMaxReview(reviewsResponse.length);
    console.log("clicked");
    if (maxReview > 2) {
      setMaxReview(2);
    } else {
      setMaxReview(reviewsResponse.length);
    }
  }

  const addHostelToFavorite = async () => {
    try {
      setIsFavorite(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.post(
        "/api/favorites/" + hostelId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  //http://localhost:5173/moreDetails?hostelId=d3582f55-470e-49d9-bd94-39dab2ba0cab

  return (
    <>
      <Helmet>
        <title>{`${foundHostel?.name || "Hostel"} near UPSA | Hostel Finder`}</title>

        <link
          rel="canonical"
          href={`https://www.episilionhostels.com/hostels/${slug}`}
        />
        <meta
          name="description"
          content={`Affordable ${foundHostel?.rooms?.types?.map((r) => r.type).join(", ")} hostel near UPSA with ${foundHostel?.amenities?.join(", ")}. Rooms from GHS ${foundHostel?.pricing?.priceMin} - GHS ${foundHostel?.pricing?.priceMax} per semester.`}
        />
        <meta property="og:title" content={foundHostel?.name} />
        <meta
          property="og:description"
          content={`Check out ${foundHostel?.name} near UPSA.`}
        />
        <meta property="og:image" content={foundHostel?.image} />
        <meta
          property="og:url"
          content={`https://www.episilionhostels.com/hostels/${slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: foundHostel?.name,
            image: foundHostel?.image,
            priceRange: foundHostel?.pricing?.priceMin
              ? `GHS ${foundHostel.pricing.priceMin} - GHS ${foundHostel.pricing.priceMax}`
              : "Price not available",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                foundHostel?.location?.latitude &&
                foundHostel?.location?.longitude
                  ? `Latitude: ${foundHostel.location.latitude}, Longitude: ${foundHostel.location.longitude}`
                  : "Address not available",
              addressLocality: "Accra",
              addressCountry: "GH",
            },
            telephone: foundHostel?.contact?.phone,
            email: foundHostel?.contact?.email,
            url: `https://www.episilionhostels.com/hostels/${slug}`,
            description: `Affordable ${foundHostel?.rooms?.types?.map((r) => r.type).join(", ")} hostel near UPSA with ${foundHostel?.amenities?.join(", ")}.`,
          })}
        </script>
      </Helmet>

      {originalHostelCardData.map((hostel) => {
        if (hostel.id === hostelId) {
          return (
            <>
              <section className="more-details-main-container">
                <div className="scrollable-side-bar">
                  <div className="more-details-hostel-image">
                    <img
                      src={url + hostel.image}
                      alt={`${hostel.name} image`}
                    ></img>
                  </div>

                  <h2 className="more-details-hostel-name">{hostel.name}</h2>

                  <h2 className="sub-headings">
                    Hostel Facilities & Amenities
                  </h2>
                  <div className="facilities-and-amenities-container">
                    {hostel.amenities.map((amenity) => {
                      return (
                        <div className="facilities-and-amenities">
                          <CheckCircleFill className="more-details-room-types-icon" />
                          <p>{amenity}</p>
                        </div>
                      );
                    })}
                  </div>

                  <h2 className="sub-headings">How to get here</h2>
                  <div className="locations-directions-container">
                    <p>{hostel.location.directions}</p>
                  </div>

                  <div className="directions-and-favorite-container">
                    <button
                      className="favorite-button"
                      onClick={addHostelToFavorite}
                    >
                      <p>
                        {isFavorite ? "Added to favorite" : "Add to favorite"}
                      </p>
                    </button>

                    <button
                      className="view-location-button"
                      onClick={() =>
                        getDirectionsOnMap(originalHostelCardData, hostelId)
                      }
                    >
                      Get Directions
                    </button>
                  </div>

                  <iframe
                    src={`https://www.google.com/maps?q=${hostel.location.latitude},${hostel.location.longitude}&hl=en&z=15&output=embed`}
                    frameborder="0"
                    className="hostel-map-location"
                  ></iframe>

                  <div className="rules-and-contact-container">
                    <div>
                      <h2 className="sub-headings">Rules & Regulations</h2>

                      {hostel.rules.map((rule) => {
                        return (
                          <div className="rules-container">
                            <ExclamationTriangle className="rules-icon" />
                            <p>{rule}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <h2 className="sub-headings">Contact Details</h2>

                      <div className="more-details-contact">
                        <Telephone className="more-details-contact-icon" />
                        <p>{hostel.contact.phone}</p>
                      </div>
                      <div className="more-details-contact">
                        <Envelope className="more-details-contact-icon" />
                        <p>{hostel.contact.email}</p>
                      </div>
                      <div className="more-details-contact">
                        <Whatsapp className="more-details-contact-icon" />
                        <p>{hostel.contact.whatsapp}</p>
                      </div>
                      <div className="more-details-contact">
                        <Person className="more-details-contact-icon" />
                        <p>{hostel.contact.managerName}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="sub-headings">Leave a Review</h2>

                    <div className="review-container">
                      <h1>Your Rating</h1>
                      <div className="star-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <img
                            key={star}
                            value={star}
                            className="star"
                            src={star <= rating ? fullStar : emptyStar}
                            alt={`star-${star}`}
                            onClick={() => handleStarClick(star)}
                          />
                        ))}
                      </div>
                      <h1>Share your experience</h1>
                      <textarea
                        className="more-details-text-area"
                        maxLength={100}
                        placeholder="Share your honest experience - what did you love? What could be improved"
                        onChange={userTypedReview}
                        value={reviewTextValue}
                        onKeyDown={listenForEnterKey}
                      ></textarea>

                      <button
                        onClick={handleSubmit}
                        className={`review-submit-button  ${!isSubmitting ? "notSubmitting" : "submitting"}`}
                      >
                        {!isSubmitting ? "Submit Review" : "Submitting Review"}
                      </button>
                    </div>

                    <div
                      className="see-more-reviews-text"
                      onClick={showAllReviews}
                    >
                      <p>
                        {maxReview > 2
                          ? "Show less reviews"
                          : "See all reviews"}
                      </p>
                    </div>

                    <div className={`reviews-and-ratings-display `}>
                      {reviewsResponse.slice(0, maxReview).map((item) => (
                        <Reviews key={item.reviewId} item={item}></Reviews>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sticky-side-Bar-container">
                  <div className="more-details-price-container">
                    <p className="more-details-prices">
                      {hostel.pricing.priceMin} - {hostel.pricing.priceMax}
                    </p>
                    <p className="more-details-ghs">GHS / semester</p>
                    <div className="more-details-info-container">
                      <h2>PAYMENT MODE</h2>
                      <p>{`${hostel.pricing.installmentAllowed ? "Installment Is Allowed" : "Installment Is Not Allowed"}`}</p>
                    </div>

                    <div className="more-details-info-container">
                      <h2>ROOM TYPE</h2>
                      {hostel.rooms.types.map((room) => {
                        return (
                          <div className="more-details-room-types">
                            <CheckCircleFill className="more-details-room-types-icon" />
                            <p>
                              {room.type} - GHS {room.price}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {getDistance(
                    { latitude: 5.660969, longitude: -0.166374 },
                    {
                      latitude: hostel.location.latitude,
                      longitude: hostel.location.longitude,
                    },
                  ) < 500 ? (
                    <div className="more-details-caution-text">
                      <div className="more-details-caution-header">
                        <InfoCircle />
                        <p>Quick Note </p>
                      </div>
                      <p className="more-details-caution">
                        This hostel is highly sought after due to its proximity
                        to Legon campus. We recommend reserving at least 1 month
                        before the semester begins.
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </section>
            </>
          );
        }
      })}
    </>
  );
}
