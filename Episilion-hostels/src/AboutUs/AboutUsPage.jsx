import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import axios from "axios";
import { Link } from "react-router-dom";
import { TeamCards } from "./TeamCards";
import "./AboutUsPage.css";

import facebook from "../assets/icons/contact-us-facebook.png";
import email from "../assets/icons/contact-us-gmail.png";
import phone from "../assets/icons/contact-us-phone.png";
import whatsapp from "../assets/icons/contact-us-whatsapp.png";

export function AboutUsPage() {
  const [teamData, setTeamData] = useState([]);

  const loadTeamCards = async () => {
    const reposnse = await axios.get(
      "https://episilion-backend-2lt0.onrender.com/api/teamMembers",
    );
    setTeamData(reposnse.data.teamMembers);
  };

  useEffect(() => {
    loadTeamCards();
  }, []);

  return (
    <>
      <title>About Us | Episilion Hostels</title>
      {/* <PageHeader navlink={navlink} setNavLink={setNavLink} /> */}

      <main className="about-main">
        <section className="about-hero">
          <h2 className="primary-header">About Episilion</h2>
          <p className="about-paragraph">
            Helping students find, safe, afforadable, and comfortable, hostels
            with ease
          </p>
        </section>

        <section className="about-project">
          <h3>Who We Are</h3>
          <p className="about-paragraph">
            Episilion is a student-focused hostel discovery platform designed to
            simplify The process of finding accommodation. We aim to connect
            students with verified, Affordable, and quality hostels in just a
            few clicks.
          </p>
        </section>

        <section className="mission-vision">
          <div className="mission">
            <h3>Our Mission</h3>
            <p className="about-paragraph">
              To make hostel searching simple, transparent, and stress-free for
              students.
            </p>
          </div>

          <div className="”vision”">
            <h3>Our Vision</h3>
            <p className="about-paragraph">
              To become the leading digital hostel marketplace for students
              nationwide.
            </p>
          </div>
        </section>

        <section className="”services”">
          <h3>What We Offer</h3>
          <ul className="about-paragraph">
            <li>Hostel listings by gender</li>
            <li>Price filtering</li>
            <li>Verified hostel information</li>
            <li>Direct contact with hostel management</li>
          </ul>
        </section>

        <section className="team-section">
          <h2 className="primary-header">Meet the Team</h2>
          <div className="team-cards">
            {teamData.map((teamMember) => {
              //WITH THIS FOR EACH TEAM MEMEBER IT WILL GENERATE A TeamCards COMPONENT
              return <TeamCards key={teamData.Name} teamMember={teamMember} />;
            })}
          </div>
        </section>

        <section>
          <h2 className="primary-header">Contact Us</h2>
          <div className="contact-us-container">
            <p className="contact-us-paragraph">
              Report an Issue or List Your Hostel If you notice any incorrect
              information about a hostel on our platform, or if you have a
              hostel near UPSA that you would like to have listed, please
              contact us and our team will assist you.
            </p>

            <div className="contact-items">
              <a
                href="https://www.facebook.com/episilionhostels26"
                className="contact-us-icons-container"
              >
                <img
                  src={facebook}
                  alt="Facebook"
                  className="contact-us-icons"
                />
                <p className="contact-us-icon-name">EpisilionHostels26.com</p>
              </a>
              <a
                href={`mailto:episilionhostels26@gmail.com?subject=${encodeURIComponent("Hostel Inquiry")}&body=${encodeURIComponent("Hello, I would like to inquire about...")}`}
                className="contact-us-icons-container"
              >
                <img src={email} alt="Email" className="contact-us-icons" />
                <p className="contact-us-icon-name">
                  episilionhostels26@gmail.com
                </p>
              </a>

              <a href="tel:0537222558" className="contact-us-icons-container">
                <img src={phone} alt="Phone" className="contact-us-icons" />
                <p className="contact-us-icon-name">0537222558</p>
              </a>
              <a
                href="https://wa.me/0537222558"
                className="contact-us-icons-container"
              >
                <img
                  src={whatsapp}
                  alt="Whatsapp"
                  className="contact-us-icons"
                />
                <p className="contact-us-icon-name">0537222558</p>
              </a>
            </div>
          </div>
        </section>

        <section className="cta">
          <h3>Join Us on Our Journey</h3>
          <p className="cta-text">
            We’re committed to making student accommodation easier and better.
          </p>
          <div className="browse-hostels-cta-button-container">
            <Link to="/" className="browse-hostels-cta-button">
              Browse Hostels
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
