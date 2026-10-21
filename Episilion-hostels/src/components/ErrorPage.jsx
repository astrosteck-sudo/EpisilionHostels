import { useEffect, useState } from "react";
import "./ErrorPage.css";

/**
 * The full-screen recovery page shown when the app hits an unexpected error.
 *
 * It deliberately reassures the visitor: the site is fine, the team is on it,
 * and there is a way forward (retry, or reload).
 */
export default function ErrorPage({ error, onRetry, onReload }) {
  // The animated dots cycle gently so the screen feels alive rather than frozen.
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((current) => (current >= 3 ? 1 : current + 1));
    }, 600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = "Something went wrong | Episilion Hostels";
  }, []);

  return (
    <div className="error-page">
      <div className="error-page__card">
        <div className="error-page__animation" aria-hidden="true">
          <span className="error-page__ring error-page__ring--outer" />
          <span className="error-page__ring error-page__ring--inner" />
          <span className="error-page__pulse" />
          <span className="error-page__house">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 6 6 20v22a2 2 0 0 0 2 2h32a2 2 0 0 0 2-2V20L24 6Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M18 44V28h12v16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M20 22h2M26 22h2"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        <h1 className="error-page__title">Sorry for the inconvenience</h1>

        <p className="error-page__message">
          Our people are working to bring the site back online. Please try again
          in a moment.
        </p>

        <p className="error-page__dots" aria-hidden="true">
          {".".repeat(dotCount)}
        </p>

        <div className="error-page__actions">
          <button
            type="button"
            className="error-page__button error-page__button--primary"
            onClick={onRetry}
          >
            Try again
          </button>
          <button
            type="button"
            className="error-page__button error-page__button--ghost"
            onClick={onReload}
          >
            Reload page
          </button>
        </div>

        {import.meta.env.DEV && error?.message ? (
          <details className="error-page__details">
            <summary>Developer details</summary>
            <pre>{error.message}</pre>
          </details>
        ) : null}
      </div>

      <p className="error-page__footer">
        Episilion Hostels &middot; Your home away from home
      </p>
    </div>
  );
}
