import { getDistance } from "geolib";
import { useEffect, useState } from "react";
import "./HostelCard.css";
import { kilometersToMeters } from "../UTILS/kilometerConvertor";
import { Link } from "react-router-dom";
import { buildHostelSlug } from "../UTILS/slugFunctions.js";

export function HostelCard({ hostel }) {
  //THIS IS THE URL FOR THE BACKEND, THIS IS USED TO ACCESS THE IMAGES IN THE PUBLIC FOLDER OF THE BACKEND
  //const url = "https://episilion-backend-2lt0.onrender.com"
  const url = "https://episilion-backend-2lt0.onrender.com";

  //const navigate = useNavigate();
  // function showHostelId(parameter){
  //     window.location.href = `moreDetails?hostelId=${parameter}`;
  // }
  // function showHostelId(parameter) {
  //   navigate(`/moreDetails?hostelId=${parameter}`);
  // }

  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    setAmenities(hostel.amenities.slice(1, 4)); // first 3 amenities
  }, [hostel]);


  return (
    <div className="hostel-card">
      <div className="image-container">
        <img
          id="hostel-card-image"
          src={url + hostel.image}
          alt= {`${hostel.name}-image`}
        ></img>
        <div className="hostel-rating-text">
          <svg xmlns="http://w3.org" viewBox="0 0 24 24">
            <polygon
              points="12 1.5 15.4 8.5 23 9.6 17.5 15 18.8 22.5 12 19 5.2 22.5 6.5 15 1 9.6 8.6 8.5"
              fill="#ffffff"
              stroke="#ffffff"
              stroke-width="1"
              stroke-linejoin="miter"
            />
          </svg>

          <p>{hostel?.reviews?.averageRating}</p>
        </div>
        {/* <div className="hostel-type-text">
          <span className="overlay-text-hostel-type">{hostel?.type}</span>
        </div> */}
      </div>
      {/* <table border="3" width="100%">
        <tr width="20px">
          <td className="td-vetical">
            <p id="hostel-name">{hostel.name}</p>
          </td>
          <td className="td-vetical">
            <p id="hostel-price">₵{hostel.pricing.priceMin}</p>
          </td>
        </tr>
        <tr width="20px">
          <td colSpan="2" className="td-vetical">
            <p id="hostel-distace">
              {kilometersToMeters(
                getDistance(
                  { latitude: 5.660969, longitude: -0.166374 },
                  {
                    latitude: hostel.location.latitude,
                    longitude: hostel.location.longitude,
                  },
                ) / 1000,
              ).toFixed(0)}
              m from campus
            </p>
          </td>
        </tr>
        <tr className="amenities-homepage">
          <td colSpan="2">
            <div id="hostel-perks">
              {amenities.slice(0, 2).map((amenity, index) => (
                <span key={index} className="amenity">
                  {amenity}
                </span>
              ))}
            </div>
          </td>
        </tr>
      </table> */}
      {/* <p className="view-more-details">
        <Link
          to={`/moreDetails?hostelId=${hostel?.id}`}
          className="view-more-details-link js-view-more-details"
        >
          View Details
        </Link>
      </p> */}

      <div className="hostel-card-info">
        <div className="hostel-name-and-price">
          <p id="hostel-name">{hostel.name}</p>
          <p id="hostel-price">₵{hostel.pricing.priceMin}</p>
        </div>
        <p id="hostel-distace">
          <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="15" height="15">
            <path
              d="M12 3c-3.87 0-7 3.13-7 7 0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z"
              fill="none"
              stroke="#555555"
              stroke-width="2"
              stroke-linejoin="round"
            />

            <circle cx="12" cy="10" r="2" fill="#555555" />
          </svg>
          {kilometersToMeters(
            getDistance(
              { latitude: 5.660969, longitude: -0.166374 },
              {
                latitude: hostel.location.latitude,
                longitude: hostel.location.longitude,
              },
            ) / 1000,
          ).toFixed(0)}
          m from campus
        </p>
        <div id="hostel-perks">
          {amenities.slice(0, 2).map((amenity, index) => (
            <span key={index} className="amenity">
              {amenity}
            </span>
          ))}
        </div>
        <p className="view-more-details">
          <Link
  to={`/hostels/${buildHostelSlug(hostel)}`}
  className="view-more-details-link js-view-more-details"
>
  View Details
</Link>
        </p>
      </div>
    </div>
  );
}
("ea7ae95e-7dd1-4bb7-acff-4ada2022ed2a");

// UPDATE rooms
// SET price_min = 3700,
//     price_max = 12000,
//     billing_period = 'Per Semester',
//     installment_allowed = 0,
//     utilities_fee=0,
//     maintenance_fee=0,
//     caution_deposit= 500,
//     refund_policy= 'No Refunds'
// WHERE hostel_id = '141c9727-155b-472c-b75e-27715725f27c';

// update pricing
// set price_min = 3000,
// 	price_max = '5000',
//     billing_period =  'Per Semester',
//     installment_allowed = 0 ,
//     utilities_fee = 0,
//     maintenance_fee = 0,
//     caution_deposit = 0,
//     refund_policy = 'No refunds'
// where hostel_id = '4ff107e9-6493-4d32-ad4f-a50dc864d0a5'
