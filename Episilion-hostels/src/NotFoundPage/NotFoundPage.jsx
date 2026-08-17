// new file: src/NotFoundPage/NotFoundPage.jsx
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Episilion Hostels</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="epi-not-found">
        <div className="epi-not-found-card">
          <span className="epi-not-found-icon" aria-hidden="true">
            🏠
          </span>
          <h1>404</h1>
          <p>Looks like this room isn’t available.</p>
          <p className="epi-not-found-sub">
            The page you’re looking for doesn’t exist or may have moved.
          </p>
          <Link to="/" className="epi-not-found-btn">
            Back to Episilion Hostels
          </Link>
        </div>
      </div>
    </>
  );
}
