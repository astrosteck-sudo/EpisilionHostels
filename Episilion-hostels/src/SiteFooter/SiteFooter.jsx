import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Check2Circle,
  Envelope,
  ExclamationCircle,
  Phone,
  Send,
  Whatsapp,
} from "react-bootstrap-icons";

import { FieldMessage } from "../components/forms/FormFeedback";
import { getErrorMessage } from "../UTILS/apiError";
import { validateEmail } from "../UTILS/validation";
import "./SiteFooter.css";

const CONTACT_EMAIL = "episilionhostels26@gmail.com";
const CONTACT_PHONE = "0537222558";

const QUICK_LINKS = [
  { label: "About Us", to: "/aboutus" },
  { label: "Ask Episilion", to: "/askepisilion" },
  { label: "More From Us", to: "/morefromus" },
  { label: "Hostels Near UPSA", to: "/hostels-near-upsa" },
  { label: "Privacy Policy", to: "/privacypolicy" },
];

const STUDENT_LINKS = [
  { label: "Browse Hostels", to: "/hostels-near-upsa" },
  { label: "AI Assistant", to: "/askepisilion" },
  { label: "Compare Hostels", to: "/comparehostels" },
  { label: "My Profile", to: "/userProfilePage" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
    if (feedback) setFeedback(null);
  }

  async function subscribeNewsletter(event) {
    event?.preventDefault();

    if (isSubmitting) return;

    const validationError = validateEmail(email);
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await axios.post("/api/subscribers/newsletter", {
        email: email.trim(),
      });

      setFeedback({
        type: "success",
        message:
          response.data?.message || "You're on the list. We'll be in touch!",
      });
      setEmail("");
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, {
          fallback: "We couldn't subscribe you right now. Please try again.",
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* ---------- Brand ---------- */}
        <div className="site-footer__brand">
          <Link className="site-footer__logo" to="/">
            <img src="/episilion_logo.svg" alt="" aria-hidden="true" />
            <span className="site-footer__logo-text">EPISILION HOSTELS</span>
          </Link>
          <p className="site-footer__tagline">
            Making university life seamless through affordable, safe, and
            community-driven housing solutions.
          </p>
          <ul className="site-footer__contact-list">
            <li>
              <span className="site-footer__contact-icon" aria-hidden="true">
                <Phone />
              </span>
              <a href={"tel:" + CONTACT_PHONE}>{CONTACT_PHONE}</a>
            </li>
            <li>
              <span className="site-footer__contact-icon" aria-hidden="true">
                <Envelope />
              </span>
              <a href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              <span
                className="site-footer__contact-icon site-footer__contact-icon--whatsapp"
                aria-hidden="true"
              >
                <Whatsapp />
              </span>
              <a
                href={"https://wa.me/" + CONTACT_PHONE}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_PHONE}
              </a>
            </li>
          </ul>
        </div>

        {/* ---------- Quick links ---------- */}
        <nav className="site-footer__column" aria-label="Quick links">
          <h2 className="site-footer__heading">Quick Links</h2>
          <ul className="site-footer__links">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link className="site-footer__link" to={link.to}>
                  <span className="site-footer__link-arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------- For students ---------- */}
        <nav className="site-footer__column" aria-label="For students">
          <h2 className="site-footer__heading">For Students</h2>
          <ul className="site-footer__links">
            {STUDENT_LINKS.map((link) => (
              <li key={link.label}>
                <Link className="site-footer__link" to={link.to}>
                  <span className="site-footer__link-arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------- Newsletter ---------- */}
        <div className="site-footer__column site-footer__column--newsletter">
          <h2 className="site-footer__heading">Newsletter</h2>
          <p className="site-footer__newsletter-copy">
            Subscribe to get updates on new hostels and exclusive offers.
          </p>
          <form
            className="site-footer__newsletter"
            onSubmit={subscribeNewsletter}
            noValidate
          >
            <label
              className="site-footer__sr-only"
              htmlFor="footer-newsletter-email"
            >
              Email address
            </label>
            <input
              id="footer-newsletter-email"
              className="site-footer__newsletter-input"
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={feedback?.type === "error" ? "true" : "false"}
              aria-describedby="footer-newsletter-message"
            />
            <button
              type="submit"
              className="site-footer__newsletter-button"
              disabled={isSubmitting}
            >
              <span className="site-footer__newsletter-button-label">
                {isSubmitting ? "Sending" : "Subscribe"}
              </span>
              <span
                className="site-footer__newsletter-button-icon"
                aria-hidden="true"
              >
                {isSubmitting ? <ExclamationCircle /> : <Send />}
              </span>
            </button>
          </form>
          <div id="footer-newsletter-message">
            <FieldMessage
              message={feedback?.message}
              type={feedback?.type === "success" ? "success" : "error"}
            />
          </div>
          <p className="site-footer__newsletter-note">
            <Check2Circle aria-hidden="true" />
            No spam. Unsubscribe any time.
          </p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copyright">
          © {new Date().getFullYear()} Episilion Hostels. All rights reserved.
        </p>
        <p className="site-footer__built">Built for students at UPSA</p>
      </div>
    </footer>
  );
}