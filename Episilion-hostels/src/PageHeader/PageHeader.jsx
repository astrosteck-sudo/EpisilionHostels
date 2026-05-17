import "./PageHeader.css";
import HamburgerButton from "../assets/icons/hamburger-button-4.png";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
//import profilePicture from "../assets/icons/user.png";
import downArrow from "../assets/icons/down-arrow.png";
import userPopImage from "../assets/icons/user4.png";
//import userPopFavoriteImage from "../assets/icons/star-black-fivepointed-shape-symbol.png";
import userPopLogOutImage from "../assets/icons/logout.png";
import dashboardImage from "../assets/icons/dashboard.png";
import managerProfileIcon from "../assets/icons/user-profile-icon.png";
import { getInitials } from "../UTILS/initials";

export function PageHeader({
  navlink,
  setNavLink,
  originalHostelCardData,
  sethostelsCardData,
  setHostelFound,
  isLoggedIn,
  setIsLoggedIn,
  managerIsLoggedIn,
  setManagerIsLoggedIn,
}) {
  const navigate = useNavigate();
  // const [navlink, setNavLink] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showManagerLogoutModal, setShowManagerLogoutModal] = useState(false)
  const [openUserPopUpMenu, setOpenUserPopUpMenu] = useState(false);
  const [openManangerPopUpMenu, setOenManangerPopUpMenu] = useState(false);

  function renderHamburgerMenu() {
    if (!navlink) {
      setNavLink(true);
    } else {
      setNavLink(false);
    }
  }
  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    // your logout logic here (clear token, redirect, etc.)
  };

  function logOutHostelManager() {
    navigate("/login");
    localStorage.removeItem("managerToken");
    localStorage.removeItem("managerUser")
    setManagerIsLoggedIn(false);
    setShowManagerLogoutModal(false)
  }

  //THIS WILL CHECK IF THE TARGET IS NOT THE HAMBURGER
  // BUTTON, NAVLINKS MENU, AND IF THE NAVLINKS IS OPEN,
  // IF THE CONDIOTIONS A TRUE , THE IF THE DOCUMENT IS
  // CLICKED THE NAVLINK MEMU IS REMOVED
  document.addEventListener("click", (event) => {
    if (
      navlink &&
      !event.target.closest(".navigation-links") &&
      !event.target.closest(".hamburger-button")
    )
      setNavLink(false);
  });
  function resetValues() {
    sethostelsCardData(originalHostelCardData);
    setHostelFound(true);
  }

  const user = JSON.parse(localStorage.getItem("user"));

  function handleDisplayUserPopUpMenu() {
    if (openUserPopUpMenu) {
      setOpenUserPopUpMenu(false);
    } else {
      setOpenUserPopUpMenu(true);
    }
  }
  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".user-option-pop-up-container") &&
      !event.target.closest(".header-section")
    )
      setOpenUserPopUpMenu(false);
  });

  function handleManagerDisplayPopUpMenu() {
    if (openManangerPopUpMenu) {
      setOenManangerPopUpMenu(false);
    } else {
      setOenManangerPopUpMenu(true);
    }
  }

  //onClick={() => setShowLogoutModal(true)}
  return (
    <>
      <section className="header-section">
        <Link className="episilion" to="/" onClick={resetValues}>
          <div className="episilion-container">
            <p>
              {" "}
              <img
                src="/episilion_logo.svg"
                alt=""
                className="episilion-logo"
              />
              Episilion <div>Hostels</div>
            </p>
          </div>
        </Link>
        <nav className={`navigation-links ${navlink ? "active" : ""}`}>
          <div className="navigation-links-pages">
            <NavLink className="link about-us-link" to="/">
              Home
            </NavLink>
            <NavLink className="link about-us-link" to="/aboutus">
              About Us
            </NavLink>
            <NavLink className="link ask-episilion" to="/askepisilion">
              Ask Episilion
            </NavLink>
            <NavLink className="link more-from-us" to="/morefromus">
              More From Us
            </NavLink>
          </div>

          {managerIsLoggedIn ? (
            <>
              <div className="hostel-manager-pill-container">
                <div
                  className="hostel-manager-pill"
                  onClick={handleManagerDisplayPopUpMenu}
                >
                  <img src={managerProfileIcon} alt="" />
                  <p>Manager</p>
                </div>

                <div
                  className={`manager-option-pop-up ${openManangerPopUpMenu ? "open" : "close"}`}
                >
                  <div>
                    <img
                      src={dashboardImage}
                      className="user-option-pop-up-images"
                    />
                    <Link
                      className="user-profile-page-link"
                      to="/hostelManagerPage"
                    >
                      <p>Manager dashboard</p>
                    </Link>
                  </div>

                  <div>
                    <img
                      src={dashboardImage}
                      className="user-option-pop-up-images"
                    />
                    <Link
                      className="user-profile-page-link"
                      to="/hostelManagerPage"
                    >
                      <p>Change Password</p>
                    </Link>
                  </div>

                  <div  onClick={() => setShowManagerLogoutModal(true)}>
                    <img
                      src={userPopLogOutImage}
                      className="user-option-pop-up-images"
                    />
                    <p>Log Out</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          {isLoggedIn ? (
            <div>
              <div
                className="user-button-pill-container"
                onClick={handleDisplayUserPopUpMenu}
              >
                <button className="user-button-pill">
                  <div>
                    <div className="user-button-pill-initials">
                      {getInitials(user.name)}
                    </div>
                  </div>
                  {user.name}
                  <img
                    src={downArrow}
                    alt=""
                    className="user-pill-down-arrow"
                  />
                </button>
              </div>

              <div
                className={`user-option-pop-up-container ${openUserPopUpMenu ? "open" : "close"}`}
              >
                <div className="user-option-pop-up-name-and-email-container">
                  <p>{user.name}</p>
                  <p className="user-option-pop-up-email">{user.email}</p>
                </div>
                <div className="user-option-pop-up-profile-container">
                  <img
                    src={userPopImage}
                    className="user-option-pop-up-images"
                  />
                  <Link className="user-profile-page-link" to="userProfilePage">
                    <p>My Profile</p>
                  </Link>
                </div>
                {/* <div className="user-option-pop-up-favorite-container">
                  <img
                    src={userPopFavoriteImage}
                    className="user-option-pop-up-images"
                  />
                  <p>My Favorites</p>
                </div> */}
                <div
                  className="user-option-pop-up-logout-container logout"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <img
                    src={userPopLogOutImage}
                    className="user-option-pop-up-images"
                  />
                  <p>Log Out </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`login-systems ${managerIsLoggedIn ? "close-login-sytems" : ""}`}
            >
              <Link to="/login">LOGIN</Link>
              <Link to="/signup">SIGN UP</Link>
            </div>
          )}
        </nav>

        <button
          className="hamburger-button"
          aria-label="Menu"
          onClick={renderHamburgerMenu}
        >
          <img src={HamburgerButton} alt="Menu"></img>
        </button>

        {showLogoutModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowLogoutModal(false)}
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Log Out</h3>
              <p className="modal-message">Are you sure you want to log out?</p>
              <div className="modal-buttons">
                <button
                  className="modal-cancel"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button className="modal-confirm" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {showManagerLogoutModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowLogoutModal(false)}
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Log Out</h3>
              <p className="modal-message">Are you sure you want to log out?</p>
              <div className="modal-buttons">
                <button
                  className="modal-cancel"
                  onClick={() => setShowManagerLogoutModal(false)}
                >
                  Cancel
                </button>
                <button className="modal-confirm" onClick={logOutHostelManager}>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
