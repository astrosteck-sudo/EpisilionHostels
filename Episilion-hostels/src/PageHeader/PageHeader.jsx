import "./PageHeader.css";
import { Link } from "react-router-dom";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronDown } from "react-bootstrap-icons";
import userPopImage from "../assets/icons/user4.png";
import userPopLogOutImage from "../assets/icons/logout.png";
import dashboardImage from "../assets/icons/dashboard.png";
import passwordImage from "../assets/icons/shield.png";
import { getInitials } from "../UTILS/initials";

export function PageHeader({
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
  const location = useLocation();
  const [openUserPopUpMenu, setOpenUserPopUpMenu] = useState(false);
  const [openManangerPopUpMenu, setOenManangerPopUpMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

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


  function handleDisplayUserPopUpMenu() {
    setOpenUserPopUpMenu((isOpen) => !isOpen);
  }
  useEffect(() => {
    function handleClick(event) {
      if (
        !event.target.closest(".user-option-pop-up-container") &&
        !event.target.closest(".user-button-pill-container")
      ) {
        setOpenUserPopUpMenu(false);
      }
      if (
        !event.target.closest(".manager-option-pop-up") &&
        !event.target.closest(".hostel-manager-pill-container")
      ) {
        setOenManangerPopUpMenu(false);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function handleManagerDisplayPopUpMenu() {
    setOenManangerPopUpMenu((isOpen) => !isOpen);
  }

  const closeNavigation = useCallback(() => {
    setOpenUserPopUpMenu(false);
    setOenManangerPopUpMenu(false);
  }, []);

  useEffect(() => {
    closeNavigation();
  }, [location.pathname, closeNavigation]);

  // Use a ref instead of state to track scroll position across renders
  // without triggering listener rebuilds
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Background opacity fade-in
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // 2. Hide/Show header depending on scroll direction
      // Added a safety check (currentScrollY > 0) to prevent iOS bounce-scroll glitching
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true); // Scrolling Down
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false); // Scrolling Up
      }

      // Update the ref value instantly without forcing a re-render
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty array ensures this listener only runs once on mount

  //onClick={() => setShowLogoutModal(true)}
  return (
    <>
      <header
        className={`header-section ${scrolled ? "scrolled" : ""} ${
          hidden ? "hidden" : ""
        }`}
      >
        <div className="header-shell">
          <Link
            className="episilion"
            to="/"
            onClick={() => {
              resetValues();
              closeNavigation();
            }}
            aria-label="Episilion Hostels home"
          >
            <span className="episilion-logo-wrap">
              <img src="/episilion_logo.svg" alt="" className="episilion-logo" />
            </span>
            <span className="episilion-wordmark">
              <strong>EPISILION</strong>
              <small>HOSTELS NEAR UPSA</small>
            </span>
          </Link>

          <nav
            className="navigation-links"
            id="primary-navigation"
            aria-label="Main navigation"
          >
            <div className="navigation-links-pages">
              <NavLink
                className="link about-us-link"
                to="/"
                end
                onClick={closeNavigation}
              >
                Home
              </NavLink>
              <NavLink
                className="link about-us-link"
                to="/aboutus"
                onClick={closeNavigation}
              >
                About Us
              </NavLink>
              <NavLink
                className="link ask-episilion"
                to="/askepisilion"
                onClick={closeNavigation}
              >
                Ask Episilion
              </NavLink>
              <NavLink
                className="link more-from-us"
                to="/morefromus"
                onClick={closeNavigation}
              >
                More From Us
              </NavLink>
            </div>
          </nav>

          <div className="header-account-actions">
              {managerIsLoggedIn && (
                <div className="hostel-manager-pill-container">
                  <button
                    className="hostel-manager-pill"
                    type="button"
                    aria-expanded={openManangerPopUpMenu}
                    aria-haspopup="true"
                    onClick={handleManagerDisplayPopUpMenu}
                  >
                    <span className="manager-avatar" aria-hidden="true">M</span>
                    <span>Manager</span>
                    <ChevronDown aria-hidden="true" />
                  </button>

                  <div
                    className={`manager-option-pop-up ${openManangerPopUpMenu ? "open" : "close"}`}
                  >
                    <Link
                      className="manager-menu-link"
                      to="/hostelManagerPage"
                      onClick={closeNavigation}
                    >
                      <img
                        src={dashboardImage}
                        className="user-option-pop-up-images"
                        alt=""
                      />
                      <span>Manager dashboard</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>

                    <Link
                      className="manager-menu-link"
                      to="/changePasswordPage"
                      onClick={closeNavigation}
                    >
                      <img
                        src={passwordImage}
                        className="user-option-pop-up-images"
                        alt=""
                      />
                      <span>Change password</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}

              {isLoggedIn ? (
                <div className="user-button-pill-container">
                  <button
                    className="user-button-pill"
                    type="button"
                    aria-expanded={openUserPopUpMenu}
                    aria-haspopup="true"
                    onClick={handleDisplayUserPopUpMenu}
                  >
                    <span className="user-button-pill-initials">
                      {getInitials(user?.name)}
                    </span>
                    <span className="user-button-pill-name">
                      {user?.name || "My account"}
                    </span>
                    <ChevronDown
                      className="user-pill-down-arrow"
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    className={`user-option-pop-up-container ${openUserPopUpMenu ? "open" : "close"}`}
                  >
                    <div className="user-option-pop-up-name-and-email-container">
                      <p>{user?.name || "My account"}</p>
                      {user?.email && (
                        <p className="user-option-pop-up-email">{user.email}</p>
                      )}
                    </div>
                    <Link
                      className="user-option-pop-up-profile-container"
                      to="/userProfilePage"
                      onClick={closeNavigation}
                    >
                      <img
                        src={userPopImage}
                        className="user-option-pop-up-images"
                        alt=""
                      />
                      <span>My Profile</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                    <button
                      className="user-option-pop-up-logout-container logout"
                      type="button"
                      onClick={() => {
                        closeNavigation();
                        setShowLogoutModal(true);
                      }}
                    >
                      <img
                        src={userPopLogOutImage}
                        className="user-option-pop-up-images"
                        alt=""
                      />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`login-systems ${managerIsLoggedIn ? "close-login-sytems" : ""}`}
                >
                  <Link
                    className="login-link"
                    to="/login"
                    onClick={closeNavigation}
                  >
                    Log in <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link
                    to="/signup"
                    className="signUp-link"
                    onClick={closeNavigation}
                  >
                    Sign up
                  </Link>
                </div>
              )}
          </div>
        </div>

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
      </header>
    </>
  );
}
