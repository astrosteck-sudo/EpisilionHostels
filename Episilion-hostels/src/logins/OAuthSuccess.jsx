// src/pages/OAuthSuccess.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function OAuthSuccess({ setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");

    if (token && userData) {
      localStorage.setItem("token", token);

      // Decode user object
      const user = JSON.parse(decodeURIComponent(userData));
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoggedIn(true)

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [navigate]);

  return <h2 style={{ textAlign: "center" }}>Redirecting to homepage...</h2>;
}
