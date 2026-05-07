import { PageHeader } from "../PageHeader/PageHeader";
//import profilePicture from "../assets/icons/user.png";
import "./UserProfile.css";
import CalenderImage from "../assets/icons/calendar.png";
import { getInitials } from "../UTILS/initials";
import dayjs from "dayjs";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import axios from "axios";
import { useEffect, useState } from "react";
import {FavoriteHostels } from './FavoriteHostels'
import { useNavigate } from "react-router-dom";

export function UserProfilePage({ isLoggedIn }) {
  const [favoriteHostelResponse, setFavoriteHostelResponse] = useState([])
  //THIS IS TO EXTRACT THE USER IMFORMATION FROM THE TOKEN
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  //const navigate = useNavigate();
  useEffect(() => {
    loadFavoriteHostel();
  }, []);

  if (!isLoggedIn) {
    console.log("User is not logged in. Redirecting...");
    return <p>Log in</p>
  }

  const loadFavoriteHostel = async () => {
    const response = await axios.get("http://localhost:3000/api/favorites/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("testing code", response.data.data);
    setFavoriteHostelResponse(response.data.data)
  };

  return (
    <>
      <title>Profile Page | Episilion Hostels</title>

      <div className="user-profile-container">
        <div className="user-profile-name-initials">
          {getInitials(user.name)}
        </div>

        <div>
          <p className="user-profile-name">{user.name}</p>
          <p className="user-profile-email">{user.email}</p>
          <div className="user-profile-joined">
            <img className="user-profile-icons" src={CalenderImage} alt="" />
            Joined{" "}
            <span className="user-joined-date-span">
              {dayjs(user.createdAt).format("MMMM D, YYYY")}
            </span>
          </div>
        </div>
      </div>

      <div className="user-favorites-title">Your Favorite Hostels ({favoriteHostelResponse.length})</div>

      <div className="user-favorites-container">
        <div className={`reviews-and-ratings-display `}>
          {favoriteHostelResponse.map((favoriteHostel) => (
            <FavoriteHostels key={favoriteHostel.hostel_id} favoriteHostel={favoriteHostel} loadFavoriteHostel={loadFavoriteHostel}></FavoriteHostels>
          ))}
        </div>
      </div>

      <SiteFooter></SiteFooter>
    </>
  );
}
