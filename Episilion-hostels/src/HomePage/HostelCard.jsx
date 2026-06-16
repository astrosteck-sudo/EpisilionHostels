import { getDistance } from "geolib";
import { useEffect, useState } from "react";
import "./HostelCard.css";
import { kilometersToMeters } from "../UTILS/kilometerConvertor";
import { Link } from "react-router-dom";

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

  // console.log("hostel data in hostel card", hostel)

  return (
    <div className="hostel-card">
      <div className="image-container">
        <img
          id="hostel-card-image"
          src={url + hostel.image}
          alt="hostel-image"
        ></img>
        <div className="hostel-rating-text">
          <span className="overlay-text-hostel-rating">
            {hostel?.reviews?.averageRating}({hostel?.reviews?.totalReviews})
          </span>
          <br></br>
        </div>
        <div className="hostel-type-text">
          <span className="overlay-text-hostel-type">{hostel?.type}</span>
        </div>
      </div>
      <table border="0" width="100%">
        <tr width="20px">
          <td className="td-vetical">
            <p id="hostel-name">{hostel.name}</p>
          </td>
          <td className="td-vetical">
            <p id="hostel-price">{hostel.pricing.priceMin}</p>
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
              {amenities.map((amenity, index) => (
                <span key={index} className="amenity">
                  {amenity}
                  {index < amenities.length - 1 ? " • " : ""}
                </span>
              ))}
            </div>
          </td>
        </tr>
      </table>
      <p className="view-more-details">
        <Link
          to={`/moreDetails?hostelId=${hostel?.id}`}
          className="view-more-details-link js-view-more-details"
        >
          View Details
        </Link>
      </p>
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
