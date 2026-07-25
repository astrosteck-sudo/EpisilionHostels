import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import axios from "axios";
import { Link } from "react-router-dom";
import { TeamCards } from "./TeamCards";
import {
  RocketTakeoff,
  Eye,
  ShieldCheck,
  GenderMale,
  GenderFemale,
  CashStack,
  Phone,
  Envelope,
  Whatsapp,
  Textarea,
} from "react-bootstrap-icons";

import "./AboutUsPage.css";
export function AboutUsPage() {
  const [teamData, setTeamData] = useState([]);

  const loadTeamCards = async () => {
    const reposnse = await axios.get("/api/teamMembers");
    setTeamData(reposnse.data.teamMembers);
  };

  useEffect(() => {
    loadTeamCards();
  }, []);

  return (
    <>
      <title>About Us | Episilion Hostels</title>
      <div className="about-episilion-header">
        <h1 className="about-epislion-about">About Episilion</h1>
        <p className="about-epislion-helping-students">
          Helping students find safe, affordable, and comfortable hostels with
          ease.
        </p>
        <p className="about-epislion-header-short-description">
          We've redefined the housing search for the modern student, blending
          technology with deep local expertise to create a seamless marketplace
          for your next home.
        </p>
      </div>

      <div className="who-we-are-container">
        <div className="unity-image">
          <img src="/unity@.jpg" alt="unityImage" />
        </div>
        <div className="who-we-are-description">
          <h2>Who We Are</h2>
          <p>
            Episilion Hostels is more than just a listing site; we are a
            dedicated student-focused hostel discovery platform. Born from the
            challenges students face when relocating for university, we built a
            bridge between high-quality accommodation providers and the
            ambitious youth who need them.
          </p>
          <p>
            Our team leverages data-driven insights to ensure every hostel on
            our platform meets strict standards for safety, hygiene, and
            proximity to campus. We believe that a better living environment
            leads to better academic performance.
          </p>
        </div>
      </div>

      <div className="mission-and-vision-container">
        <div className="mission">
          <RocketTakeoff className="about-us-icon" />
          <h2>Our Mission</h2>
          <p>
            To simplify the hostel searching process by providing a transparent,
            efficient, and student-first digital ecosystem that removes the
            friction from finding a home.
          </p>
        </div>

        <div className="vision">
          <Eye className="about-us-icon" />
          <h2>Our Vision</h2>
          <p>
            To become the leading global marketplace for student housing,
            recognized for setting the gold standard in accommodation safety,
            quality, and student satisfaction.
          </p>
        </div>
      </div>

      <div className="what-we-offer-container">
        <h2>What We Offer</h2>
        <h1>Tailored features designed for the modern university student.</h1>

        <div className="what-we-offers-container">
          <div className="what-we-offer-long-container">
            <ShieldCheck className="about-us-icon" />
            <h3>Verified Information</h3>

            <p>
              We manually verify every hostel listing. From water availability
              to security guards, the details you see are accurate and
              trustworthy.
            </p>
          </div>

          <div className="what-we-offer-short-container">
            <div>
              <GenderMale className="about-us-icon" />
              <GenderFemale className="about-us-icon" />
            </div>
            <h3>Gender-Based Filtering</h3>
            <p>
              Quickly browse hostels categorized by gender to find your perfect
              comfort zone.
            </p>
          </div>
        </div>

        <div className="what-we-offers-container">
          <div className="what-we-offer-short-container">
            <CashStack className="about-us-icon" />
            <h3>Price Transparency</h3>
            <p>
              No hidden fees. Filter hostels based on your budget range and
              compare amenities side-by-side.
            </p>
          </div>

          <div className="what-we-offer-long-container contact">
            <Phone className="about-us-icon" style={{ color: "white" }} />
            <h3>Direct Contact</h3>
            <p>
              Found a place you love? Contact hostel managers directly through
              our secure platform to book a viewing or secure your bed.
            </p>
          </div>
        </div>
      </div>

      <div className="about-epislion-team-section">
        <h2>Meet the Team</h2>
        <h1>The passionate individuals behind your next home.</h1>

        <div className="about-epislion-team-cards">
          {teamData.map((teamMember) => {
            //WITH THIS FOR EACH TEAM MEMEBER IT WILL GENERATE A TeamCards COMPONENT
            return <TeamCards key={teamData.Name} teamMember={teamMember} />;
          })}
        </div>
      </div>

      {/* <div className="about-epislion-contact-options">
        <div className="about-epislion-contact-option">
          <img
            loading="lazy"
            src={facebook}
            alt="Facebook Icon"
            className="contact-icon"
          />
          <p>Follow us on Facebook</p>
        </div>
        <div className="about-epislion-contact-option">
          <img
            loading="lazy"
            src={email}
            alt="Email Icon"
            className="contact-icon"
          />
          <a
            href={`mailto:episilionhostels26@gmail.com?subject=${encodeURIComponent("Hostel Inquiry")}&body=${encodeURIComponent("Hello, I would like to inquire about...")}`}
          >
            episilionhostels26@gmail.com
          </a>
        </div>
        <div className="about-epislion-contact-option">
          <img
            loading="lazy"
            src={whatsapp}
            alt="WhatsApp Icon"
            className="contact-icon"
          />
          <a
            href="https://wa.me/0537222558"
            target="_blank"
            rel="noopener noreferrer"
          >
            0537222558
          </a>
        </div>

        <div className="about-epislion-contact-option">
          <img
            loading="lazy"
            src={phone}
            alt="Phone Icon"
            className="contact-icon"
          />
          <a href="tel:0537222558">0537222558</a>
        </div>
      </div> */}

      <div className="contacts-container">
        <div className="about-us-contacts">
          <h2>Get in Touch</h2>
          <p>
            Have questions about a listing or need help finding the right place?
            Our team is here to support you.
          </p>
          <div className="about-us-contact">
            <Phone className="contacts-icon" />
            <a href="tel:0537222558">0537222558</a>
          </div>
          <div className="about-us-contact">
            <Envelope className="contacts-icon" />
            <a
              href={`mailto:episilionhostels26@gmail.com?subject=${encodeURIComponent("Hostel Inquiry")}&body=${encodeURIComponent("Hello, I would like to inquire about...")}`}
            >
              episilionhostels26@gmail.com
            </a>
          </div>

          <div className="about-us-contact">
            <Whatsapp className="contacts-icon" />
            <a
              href="https://wa.me/0537222558"
              target="_blank"
              rel="noopener noreferrer"
            >
              0537222558
            </a>
          </div>
        </div>
        <div className="message-container">
          <div className="inputs-container">
            <p>Full Name</p>
            <input type="text" placeholder="John Doe" />
          </div>

          <div className="inputs-container">
            <p>Email Address</p>
            <input type="text" placeholder="doe123@gmail.com" />
          </div>

          <div className="inputs-container">
            <p>Message</p>
            <textarea></textarea>
          </div>
        </div>
      </div>
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
