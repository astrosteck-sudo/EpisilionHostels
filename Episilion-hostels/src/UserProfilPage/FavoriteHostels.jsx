import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDistance } from "geolib";
import { kilometersToMeters } from "../UTILS/kilometerConvertor";


export function FavoriteHostels({ favoriteHostel, loadFavoriteHostel }) {
  const url = "https://episilion-backend-2lt0.onrender.com";
  const navigate = useNavigate();

  function showHostelId(parameter) {
    navigate(`/moreDetails?hostelId=${parameter}`);
  }

  const removeFavorite = async (hostelId) => {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `/api/favorites/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    await loadFavoriteHostel(); // Refresh the list of favorite hostels
    return response.data;
  };

  return (
    <div className="user-favorite-hostel">
      <img
        src={url + favoriteHostel.main_image}
        alt="Profile"
        className="user-favorite-hostel-image"
      />
      <div className="user-favorite-hostel-info">
        <p className="user-favorite-hostel-name">{favoriteHostel.name}</p>
        <p className="user-favorite-hostel-distance">
          {kilometersToMeters(
            getDistance(
              { latitude: 5.660969, longitude: -0.166374 },
              {
                latitude: favoriteHostel.latitude,
                longitude: favoriteHostel.longitude,
              },
            ) / 1000,
          ).toFixed(0)}
          m from campus
        </p>
        <div className="user-favorite-hostel-amenities">
          {favoriteHostel.amenities.map((amenity) => {
            return <p key={amenity.name}>{amenity.name}</p>;
          })}
        </div>
      </div>
      <div className="user-favorite-hostel-price-and-button">
        <p className="user-favorite-hostel-price">
          {favoriteHostel.price_min}/sem
        </p>
        <button
          className="user-favorite-hostel-button"
          onClick={() => showHostelId(favoriteHostel.hostel_id)}
        >
          View
        </button>
        <p
          className="user-favorite-hostel-remove"
          onClick={() => removeFavorite(favoriteHostel.hostel_id)}
        >
          Remove
        </p>
      </div>
    </div>
  );
}
