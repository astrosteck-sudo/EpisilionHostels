import "./SiteFooter.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChatDots,
  ChatDotsFill,
  HouseDoor,
  HouseDoorFill,
  InfoCircle,
  InfoCircleFill,
  Person,
  PersonFill,
  Stars,
} from "react-bootstrap-icons";

export function MobileNavButtons() {
  const token = localStorage.getItem("token");
  const managerToken = localStorage.getItem("managerToken");
  const navigate = useNavigate();
  const profileLink = managerToken ? "/hostelManagerPage" : "/userProfilePage";

  function handleProfileClick(event) {
    if (!token && !managerToken) {
      event.preventDefault();
      navigate("/login");
    }
  }

  return (
    <nav className="mobile-nav-buttons" aria-label="Mobile primary navigation">

      <NavLink className="mobile-nav-button" to="/" end>
        {({ isActive }) => (
          <>
            <span className="mobile-nav-button__icon" aria-hidden="true">
              {isActive ? <HouseDoorFill /> : <HouseDoor />}
            </span>
            <span className="mobile-nav-button__label">Home</span>
          </>
        )}
      </NavLink>

      <NavLink className="mobile-nav-button" to="/aboutus" end>
        {({ isActive }) => (
          <>
            <span className="mobile-nav-button__icon" aria-hidden="true">
              {isActive ? <InfoCircleFill /> : <InfoCircle />}
            </span>
            <span className="mobile-nav-button__label">About Us</span>
          </>
        )}
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `mobile-nav-button mobile-nav-button--profile${isActive ? " active" : ""}`
        }
        to={profileLink}
        onClick={handleProfileClick}
        end
        aria-label="Profile"
      >
        {({ isActive }) => (
          <>
            <span className="mobile-nav-profile-icon" aria-hidden="true">
              {isActive ? <PersonFill /> : <Person />}
            </span>
            <span className="mobile-nav-button__label">Profile</span>
          </>
        )}
      </NavLink>

      <NavLink className="mobile-nav-button" to="/askepisilion" end>
        {({ isActive }) => (
          <>
            <span className="mobile-nav-button__icon" aria-hidden="true">
              {isActive ? <ChatDotsFill /> : <ChatDots />}
            </span>
            <span className="mobile-nav-button__label">Ask Episilion</span>
          </>
        )}
      </NavLink>

      <NavLink className="mobile-nav-button" to="/morefromus" end>
        {() => (
          <>
            <span className="mobile-nav-button__icon" aria-hidden="true">
              <Stars />
            </span>
            <span className="mobile-nav-button__label">More From Us</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}
