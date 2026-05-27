import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import axios from "axios";
import { Link } from "react-router-dom";
import { TeamCards } from "./TeamCards";
import groupImage from "../assets/icons/group.png";
import missionImage from "../assets/icons/mission.png";
import eyeImage from "../assets/icons/eye.png";
import checkImage from "../assets/icons/check.png";
import "./AboutUsPage.css";

import facebook from "../assets/icons/contact-us-facebook.png";
import email from "../assets/icons/contact-us-gmail.png";
import phone from "../assets/icons/contact-us-phone.png";
import whatsapp from "../assets/icons/contact-us-whatsapp.png";

export function AboutUsPage() {
  const [teamData, setTeamData] = useState([]);

  const loadTeamCards = async () => {
    const reposnse = await axios.get("https://episilion-backend-2lt0.onrender.com/api/teamMembers");
    setTeamData(reposnse.data.teamMembers);
  };

  useEffect(() => {
    loadTeamCards();
  }, []);

  return (
    <>
      <title>About Us | Episilion Hostels</title>
      <div className="about-episilion-header">
        <p className="about-episilion-who-we-are">WHO WE ARE</p>
        <h1 className="about-epislion-about">About Episilion</h1>
        <p className="about-epislion-helping-students">
          Helping students find safe, affordable, and comfortable hostels with
          ease.
        </p>
      </div>

      <div className="about-epislion-content">
        <div className="about-epislion-what-we-offer-and-who-we-are-container">
          <div className="about-epislion-who-we-are-section">
            <img
              src={groupImage}
              alt="Group Image"
              className="about-epislion-icons"
            />
            <div>
              <h2>Who We Are</h2>
              <p>
                Episilion is a student-focused hostel discovery platform
                designed to simplify the process of finding accommodation. We
                connect students with verified, affordable, and quality hostels
                in just a few clicks.
              </p>
            </div>
          </div>
          <div className="about-epislion-what-we-offer-section">
            <img
              src={checkImage}
              alt="Check Image"
              className="about-epislion-icons"
            />
            <div>
              <h2>What We Offer</h2>
              <div className="about-episilion-what-we-offer-paragraphs">
                <p>Hostel listings by gender</p>
                <p>Price filtering</p>
                <p>Verified hostel information</p>
                <p>Direct contact with hostel management </p>
              </div>
            </div>
          </div>
        </div>
        <div className="about-epislion">
          <div className="about-epislion-our-mission-section">
            <img
              src={missionImage}
              alt="Mission Image"
              className="about-epislion-icons"
            />
            <div>
              <h2>Our Mission</h2>
              <p>
                To make hostel searching simple, transparent, and stress-free
                for students.
              </p>
            </div>
          </div>
          <div className="about-epislion-our-vision-section">
            <img
              src={eyeImage}
              alt="Eye Image"
              className="about-epislion-icons"
            />
            <div>
              <h2>Our Vision</h2>
              <p>
                To become the leading digital hostel marketplace for students
                nationwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-epislion-team-section">
        <p className="about-epislion-team-title">THE PEOPLE BEHIND EPISILION</p>
        <h2 className="about-epislion-team-heading">Meet the Team</h2>
      </div>

      <div className="about-epislion-team-cards">
        {teamData.map((teamMember) => {
          //WITH THIS FOR EACH TEAM MEMEBER IT WILL GENERATE A TeamCards COMPONENT
          return <TeamCards key={teamData.Name} teamMember={teamMember} />;
        })}
      </div>

      <div className="about-epislion-contact-section">
        <p className="about-epislion-contact-title">REACH OUT</p>
        <h2 className="about-epislion-contact-heading">Contact Us</h2>
        <p className="about-epislion-contact-paragraph">
          Noticed incorrect hostel info, or want to list your hostel near UPSA?
          Get in touch and our team will assist you.
        </p>
      </div>

      <div className="about-epislion-contact-options">
        <div className="about-epislion-contact-option">
          <img src={facebook} alt="Facebook Icon" className="contact-icon" />
          <p>Follow us on Facebook</p>
        </div>
        <div className="about-epislion-contact-option">
          <img src={email} alt="Email Icon" className="contact-icon" />
          <a
            href={`mailto:episilionhostels26@gmail.com?subject=${encodeURIComponent("Hostel Inquiry")}&body=${encodeURIComponent("Hello, I would like to inquire about...")}`}
          >
            episilionhostels26@gmail.com
          </a>
        </div>
        <div className="about-epislion-contact-option">
          <img src={whatsapp} alt="WhatsApp Icon" className="contact-icon" />
          <a
            href="https://wa.me/0537222558"
            target="_blank"
            rel="noopener noreferrer"
          >
            0537222558
          </a>
        </div>

        <div className="about-epislion-contact-option">
          <img src={phone} alt="Phone Icon" className="contact-icon" />
          <a href="tel:0537222558">0537222558</a>
        </div>
      </div>

      <div className="about-epislion-join-us-on-our-journey">
        <p className="about-epislion-contact-title">JOIN US ON OUR JOURNEY</p>

        <p className="about-epislion-join-us-on-our-paragraph">
          We're committed to making student accommodation easier and better.
        </p>

        <div className="about-epislion-browse-hostels-button">
          <Link to="/" className="browse-hostels-cta-button">
            Browse Hostels
          </Link>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

/*
<section className="team-section">
          <h2 className="primary-header">Meet the Team</h2>
          <div className="team-cards">
            {teamData.map((teamMember) => {
              //WITH THIS FOR EACH TEAM MEMEBER IT WILL GENERATE A TeamCards COMPONENT
              return <TeamCards key={teamData.Name} teamMember={teamMember} />;
            })}
          </div>
        </section>/*/
