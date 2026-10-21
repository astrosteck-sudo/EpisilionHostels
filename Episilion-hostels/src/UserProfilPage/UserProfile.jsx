import { PageHeader } from "../PageHeader/PageHeader";
//import profilePicture from "../assets/icons/user.png";
import "./UserProfile.css";
import CalenderImage from "../assets/icons/calendar.png";
import { getInitials } from "../UTILS/initials";
import dayjs from "dayjs";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import axios from "axios";
import { useEffect, useState } from "react";
import { FavoriteHostels } from "./FavoriteHostels";
import { Envelope, Calendar, BoxArrowRight, Person } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { authHeaders } from "../UTILS/authHeaders";
//import { useNavigate } from "react-router-dom";

export function UserProfilePage({ isLoggedIn, setShowLogoutModal }) {
  const [favoriteHostelResponse, setFavoriteHostelResponse] = useState([]);

  const loadFavoriteHostel = async () => {
    try {
      const response = await axios.get("/api/favorites/", {
        headers: {
          ...authHeaders(),
        },
      });
      setFavoriteHostelResponse(response.data.data);
    } catch (error) {
      console.error("Failed to load favourite hostels:", error);
      setFavoriteHostelResponse([]);
    }
  };

  // Hooks must run on every render, so this sits above the early return below.
  useEffect(() => {
    if (isLoggedIn) {
      loadFavoriteHostel();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    console.log("User is not logged in. Redirecting...");
    return (
      <p className="login-To-see-this-page">
        Log in as student to see this page
      </p>
    );
  }
  //THIS IS TO EXTRACT THE USER IMFORMATION FROM THE TOKEN
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  //const navigate = useNavigate();

  return (
    <>
      <title>Profile Page | Episilion Hostels</title>

      <div className="user-favorite-page">
        <div className="user-profile-container">
          <div className="user-profile-name-initials">
            {getInitials(user.name)}
          </div>

          <div className="user-profile-info">
            <p className="user-profile-name">{user.name}</p>
            <p className="user-profile-email">
              <Envelope />
              <span>{user.email}</span>
            </p>
            <div className="user-profile-joined">
              <Calendar/>
              <span>Joined {dayjs(user.createdAt).format("MMMM D, YYYY")}</span>
            </div>
          </div>

          <div className="user-profile-actions">
            <Link to="/" className="user-profile-action-button">
              <Person />
              <span>Back to Home</span>
            </Link>
            <button 
              className="user-profile-action-button logout"
              onClick={() => setShowLogoutModal(true)}
            >
              <BoxArrowRight />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        <div className="user-favorites-title">
          Your Favorite Hostels ({favoriteHostelResponse.length})
        </div>

        <div className="user-favorites-container">
          <div className={`reviews-and-ratings-display `}>
            {favoriteHostelResponse.map((favoriteHostel) => (
              <FavoriteHostels
                key={favoriteHostel.hostel_id}
                favoriteHostel={favoriteHostel}
                loadFavoriteHostel={loadFavoriteHostel}
              ></FavoriteHostels>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
