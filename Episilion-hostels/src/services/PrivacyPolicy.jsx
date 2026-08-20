import React from "react";
import "./PrivacyPolicy.css";

export function PrivacyPolicy() {
  return (
    <main className="epi-privacy">
      <div className="epi-privacy-card">
        <header className="epi-privacy-header">
          <span className="epi-privacy-bar" aria-hidden="true" />
          <h1>Privacy Policy</h1>
        </header>

        <p className="epi-privacy-updated">
          Last updated: <time dateTime="2026-06-18">June 18, 2026</time>
        </p>

        <section className="epi-privacy-section">
          <p>
            This Privacy Policy describes how Episilion Hostels collects, uses,
            and protects your information when you use our services.
          </p>
        </section>

        <section className="epi-privacy-section">
          <h2>Information We Collect</h2>
          <p>
            We may collect personal details such as your name, email address,
            and booking information when you interact with our platform.
          </p>
        </section>

        <section className="epi-privacy-section">
          <h2>How We Use Your Information</h2>
          <p>
            Your information is used to provide and improve our services,
            process bookings, communicate with you, and ensure a secure
            experience.
          </p>
        </section>

        <section className="epi-privacy-section">
          <h2>Sharing of Information</h2>
          <p>
            We do not sell your personal data. Information may be shared only
            with trusted partners to deliver our services or when required by
            law.
          </p>
        </section>

        <section className="epi-privacy-section">
          <h2>Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal
            information. Please contact us if you wish to exercise these rights.
          </p>
        </section>

        <section className="epi-privacy-section">
          <h2>Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your data against unauthorized access, alteration, or
            disclosure.
          </p>
        </section>

        <section className="epi-privacy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please reach
            out to us at{" "}
            <a
              href="mailto:episilionhostels26@gmail.com"
              className="epi-privacy-link"
            >
              episilionhostels26@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
