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
import { Envelope, Calendar } from "react-bootstrap-icons";
//import { useNavigate } from "react-router-dom";

export function UserProfilePage({ isLoggedIn, setShowLogoutModal }) {
  const [favoriteHostelResponse, setFavoriteHostelResponse] = useState([]);
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
  useEffect(() => {
    loadFavoriteHostel();
  }, []);

  const loadFavoriteHostel = async () => {
    const response = await axios.get("/api/favorites/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setFavoriteHostelResponse(response.data.data);
  };

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
              <p>{user.email}</p>
            </p>
            <div className="user-profile-joined">
              <Calendar/>
              <p>Joined</p>
              <span className="user-joined-date-span">
                {dayjs(user.createdAt).format("MMMM D, YYYY")}
              </span>
            </div>
          </div>

          <div
            className="user-profile-log-out"
            onClick={() => setShowLogoutModal(true)}
          >
            <p>Log Out</p>
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
