// src/pages/OAuthError.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function OAuthError(){
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect back to homepage after short delay
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login failed</h2>
      <p>Redirecting you back to the homepage...</p>
    </div>
  );
};

