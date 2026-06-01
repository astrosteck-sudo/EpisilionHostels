import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [message, setMessage] = useState("Verifying payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const reference = params.get("reference");
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://episilionhostels.com/api/payments/verify/${reference}`,
          {
            headers: { Authorization: token },
          }
        );

        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
        setMessage("Verification failed");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{message}</h1>
        <p style={styles.message}>
          {message === "Payment verified successfully"
            ? "Your subscription is now active. 🎉"
            : "Please try again or contact support."}
        </p>
        <button style={styles.button} onClick={() => navigate("/askepisilion")}>
          Go Back
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f6f8",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
  },
  title: { color: "#2e7d32", marginBottom: "1rem" },
  message: { fontSize: "1rem", color: "#555", marginBottom: "2rem" },
  button: {
    backgroundColor: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default PaymentSuccess;
