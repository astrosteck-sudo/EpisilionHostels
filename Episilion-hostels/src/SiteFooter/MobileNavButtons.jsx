import "./SiteFooter.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  HouseFill,

  Person,
  PersonFill,

  People,
  PeopleFill,
  
  Robot,
} from "react-bootstrap-icons";

export function MobileNavButtons() {
  const token = localStorage.getItem("token");
  const managerToken = localStorage.getItem("managerToken");
  const navigate = useNavigate();
  const profileLink = managerToken ? "/hostelManagerPage" : "/userProfilePage";
  function handleUserLoggedIn(e) {
    e.preventDefault();
    if (token) {
      navigate("/userProfilePage");
      return;
    } else if (managerToken) {
      navigate("/hostelManagerPage");
      return;
    }
    if (!token || !managerToken) {
      navigate("/login");
      return;
    }
  }
  // Custom Solid Robot component
  function RobotFill({ className }) {
    return (
      <svg
        xmlns="http://w3.org"
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor" /* Inherits your CSS color instantly */
        width="24"
        height="24"
      >
        <path d="M12 2C7.5 2 6 5.5 6 10c0 4.5 1.5 8 6 10s6-3.5 6-8c0-4.5-1.5-8-6-8z" />

        <circle cx="9.5" cy="9.5" r="1.5" fill="#ffffff" />
        <circle cx="14.5" cy="9.5" r="1.5" fill="#ffffff" />

        <path d="M9 14h6v1.5H9z" fill="#ffffff" />
      </svg>
    );
  }
  return (
    <>
      <section className="mobile-nav-buttons">
        <NavLink className="mobile-nav-button" to="/">
          {({ isActive }) => (
            <>
              {/* 2. Swap the component instantly based on active route state */}
              {isActive ? (
                <HouseFill className="nav-icon active-style" />
              ) : (
                <House className="nav-icon" />
              )}

              <p>About Us</p>
            </>
          )}
        </NavLink>

        <NavLink className="mobile-nav-button" to="/aboutus">
          {({ isActive }) => (
            <>
              {/* 2. Swap the component instantly based on active route state */}
              {isActive ? (
                <PeopleFill className="nav-icon active-style" />
              ) : (
                <People className="nav-icon" />
              )}

              <p>About Us</p>
            </>
          )}
        </NavLink>

        <NavLink className="mobile-nav-button" to="/askepisilion">
          {({ isActive }) => (
            <>
              {/* 2. Swap the component instantly based on active route state */}
              {isActive ? (
                <Robot className="nav-icon active-style" />
              ) : (
                <Robot className="nav-icon" />
              )}

              <p>About Us</p>
            </>
          )}
        </NavLink>

        <NavLink
          className="mobile-nav-button"
          onClick={handleUserLoggedIn}
          to={profileLink}
        >
          {({ isActive }) => (
            <>
              {/* 2. Swap the component instantly based on active route state */}
              {isActive ? (
                <PersonFill className="nav-icon active-style" />
              ) : (
                <Person className="nav-icon" />
              )}

              <p>Profile</p>
            </>
          )}
        </NavLink>
      </section>
    </>
  );
}
