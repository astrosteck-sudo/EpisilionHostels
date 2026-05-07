import { PageHeader } from "../PageHeader/PageHeader";
//import profilePicture from "../assets/icons/user.png";
import "./UserProfile.css";
import CalenderImage from "../assets/icons/calendar.png";
import { getInitials } from "../UTILS/initials";
import dayjs from "dayjs";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import  axios  from "axios";
import { useEffect } from "react";

export function UserProfilePage({ isLoggedIn }) {
  //THIS IS TO EXTRACT THE USER IMFORMATION FROM THE TOKEN
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  useEffect(() => {
    loadFavoriteHostel();
  }, []);
  

  if (!isLoggedIn) {
    return (
      <div className="user-profile-container">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const loadFavoriteHostel = async () => {
    const response = await axios.get("http://localhost:3000/api/favorites/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("testing code", response.data);
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

      <SiteFooter></SiteFooter>
    </>
  );
}
