import "./PageHeader.css";
import HamburgerButton from "../assets/icons/hamburger-button-4.png";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
//import profilePicture from "../assets/icons/user.png";
import downArrow from "../assets/icons/down-arrow.png";
import userPopImage from "../assets/icons/user4.png";
//import userPopFavoriteImage from "../assets/icons/star-black-fivepointed-shape-symbol.png";
import userPopLogOutImage from "../assets/icons/logout.png";
import dashboardImage from "../assets/icons/dashboard.png";
import passwordImage from "../assets/icons/shield.png";
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
  showLogoutModal,
  setShowLogoutModal,
  showManagerLogoutModal,
  setShowManagerLogoutModal,
}) {
  const navigate = useNavigate();
  const [openUserPopUpMenu, setOpenUserPopUpMenu] = useState(false);
  const [openManangerPopUpMenu, setOenManangerPopUpMenu] = useState(false);

  const handleLogout = () => {
    console.log("logout clicked");
    navigate("/login");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    // your logout logic here (clear token, redirect, etc.)
  };

  function logOutHostelManager() {
    navigate("/login");
    localStorage.removeItem("managerToken");
    localStorage.removeItem("managerUser");
    setManagerIsLoggedIn(false);
    setShowManagerLogoutModal(false);
  }

  function resetValues() {
    sethostelsCardData(originalHostelCardData);
    setHostelFound(true);
  }

  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user)

  function handleDisplayUserPopUpMenu() {
    if (openUserPopUpMenu) {
      setOpenUserPopUpMenu(false);
    } else {
      setOpenUserPopUpMenu(true);
    }
  }
  useEffect(() => {
    function handleClick(event) {
      if (
        !event.target.closest(".user-option-pop-up-container") &&
        !event.target.closest(".header-section")
      ) {
        setOpenUserPopUpMenu(false);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [setOpenUserPopUpMenu]);

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
            <img src="/episilion_logo.svg" alt="" className="episilion-logo" />
            <p>EPISILION HOSTELS</p>
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
        </nav>

        {managerIsLoggedIn ? (
          <>
            <div className="hostel-manager-pill-container">
              <div
                className="hostel-manager-pill"
                onClick={handleManagerDisplayPopUpMenu}
              >
                <img loading="lazy" src={managerProfileIcon} alt="" />
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
                    src={passwordImage}
                    className="user-option-pop-up-images"
                  />
                  <Link
                    className="user-profile-page-link"
                    to="/changePasswordPage"
                  >
                    <p>Change Password</p>
                  </Link>
                </div>

                <div onClick={() => setShowManagerLogoutModal(true)}>
                  <img
                    src={userPopLogOutImage}
                    className="user-option-pop-up-images"
                  />
                  <p>Log Out</p>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {isLoggedIn ? (
          <div>
            <div
              className="user-button-pill-container"
              onClick={handleDisplayUserPopUpMenu}
            >
              <button className="user-button-pill">
                <div>
                  <div className="user-button-pill-initials">
                    {getInitials(user?.name)}
                  </div>
                </div>
                {user?.name}
                <img src={downArrow} alt="" className="user-pill-down-arrow" />
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
                <img src={userPopImage} className="user-option-pop-up-images" />
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
            <Link className="login-link" to="/login">
              <svg
                xmlns="http://w3.org"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="#006644"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="3" y1="12" x2="16" y2="12" />
                <polyline points="11 7 16 12 11 17" />

                <path d="M16 4h3v16h-3" />
              </svg>
              <p>Login</p>
            </Link>
            <Link to="/signup" className="signUp-link">
              Sign Up
            </Link>
          </div>
        )}

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
            onClick={() => setShowManagerLogoutModal(false)}
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
