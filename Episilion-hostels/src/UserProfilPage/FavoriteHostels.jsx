import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function FavoriteHostels({ favoriteHostel, loadFavoriteHostel }) {
  const url = "http://localhost:3000";
  const navigate = useNavigate();
  console.log(favoriteHostel.amenities[0].name);

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
        <p className="user-favorite-hostel-distance">15.1 km from campus</p>
        <div className="user-favorite-hostel-amenities">
          {favoriteHostel.amenities.map((amenity) => {
            return <p>{amenity.name}</p>;
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
        <p className="user-favorite-hostel-remove" onClick={() => removeFavorite(favoriteHostel.hostel_id)}>
          Remove
        </p>
      </div>
    </div>
  );
}
