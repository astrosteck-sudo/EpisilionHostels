import "./SiteFooter.css";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";

export function SiteFooter() {
  const token = localStorage.getItem("token");
  const managerToken = localStorage.getItem("managerToken");
  const navigate = useNavigate();
  const profileLink = managerToken? '/hostelManagerPage': '/userProfilePage'
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
  return (
    <>
      {/* <section className="hostels-section">
        <div className="hostels-cards js-hostel-cards"></div>
      </section> */}
      <footer className="site-footer">
        <div className="footer-content">
          <p id="all-rights-text">
            &copy; 2026 Episilion. All rights reserved.
          </p>
          <nav className="footer-links">
            <Link to="/aboutus">About Us</Link>
            <Link to="/morefromus">More From Us</Link>
            <Link to="/askepisilion">Ask Epsilion</Link>
          </nav>
        </div>

        <div className="bottom-tabs">
          <NavLink to="/" className="bottom-tab-home">
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <p>Home</p>
          </NavLink>

          <NavLink to="/aboutus" className="bottom-tab-about-us">
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>

            <p>About Us</p>
          </NavLink>

          <NavLink
            className="bottom-tab-user"
            onClick={handleUserLoggedIn}
            to={profileLink}
          >
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2.67c0-2.66-5.33-4-8-4z" />
            </svg>

            <p>Profile</p>
          </NavLink>
          <NavLink to="/askepisilion" className="bottom-tab-epsilion">
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="4" />
            </svg>

            <p>Episilion</p>
          </NavLink>

          <NavLink to="/morefromus" className="bottom-tab-more">
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>

            <p>More </p>
          </NavLink>
        </div>
      </footer>
    </>
  );
}
