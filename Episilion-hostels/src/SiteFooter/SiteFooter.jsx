import "./SiteFooter.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import validator from 'validator';

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  function handleEmail(event) {
    setEmail(event.target.value);
  }

  const subscribeNewsletter = async () => {
    if(email.length === 0){
      return
    }
    if (!validator.isEmail(email)) {
      setError(true)
      setMessage("Enter a valid email")
      return;
    }

    try {
      const response = await axios.post(`/api/subscribers/newsletter`, {
        email,
      });

      setError(false)
      setMessage("You email has been sent")
      setTimeout(() => {
        setMessage("")
      }, 6000)
      return response.data;
    } catch (error) {
      setError(true)
      setMessage("You email could not be sent, try again!")
      throw (
        error.response?.data || {
          success: false,
          message: "Something went wrong.",
        }
      );
    } finally {
      setEmail("");
    }
  };

 

  return (
    <>
      <section className="site-footer">
        <div className="site-footer-episilion-container">
          <div className="site-footer-logo-and-name">
            <img src="/episilion_logo.svg" alt="" />
            <h2>EPISILION HOSTELS</h2>
          </div>
          <p className="site-footer-short-descriptions">
            Making university life seamless through affordable, safe, and
            community-driven housing solutions.
          </p>
        </div>

        <div className="site-footer-short-descriptions">
          <h2>Quick Links</h2>
          <p>
            <Link className="site-footer-links" to="/aboutus">
              About Us
            </Link>
          </p>
          <p>
            <Link className="site-footer-links" to="/askepisilion">
              Ask Episilion
            </Link>
          </p>
          <p>
            <Link className="site-footer-links" to="/morefromus">
              More From Us
            </Link>
          </p>
          <p>
            <Link className="site-footer-links" to="/privacyPolicy">
              Privacy Policy
            </Link>
          </p>
        </div>

        <div className="site-footer-short-descriptions">
          <h2>For Students</h2>
          <p>Browse Hostels</p>
          <p>AI Assistant</p>
          <p>Reviews</p>
          <p>Saved Hostels</p>
        </div>

        <div className="site-footer-short-descriptions">
          <h2>Newsletter</h2>
          <p>Subscribe to get updates on new hostels and exclusive offers</p>
          <div className="site-footer-newsletter-input">
            <input
              type="email"
              value={email}
              onChange={handleEmail}
              placeholder="johnDoe@gmail.com"
            />
            <div onClick={subscribeNewsletter} className="newsletter-send-button">
              <svg
                xmlns="http://w3.org"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                  fill="#ffffff"
                />
              </svg>
            </div>
          </div>
          <div className={error? 'emailError' : 'emailSuccess'}>
            {message}
          </div>
        </div>
        <div className="site-footer-all-rights">
          <p>© 2026 Episilion Hostels. All rights reserved.</p>
        </div>
      </section>
    </>
  );
}
