import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import axios from "axios";
import { Link } from "react-router-dom";
import { TeamCards } from "./TeamCards";
import { Helmet } from "react-helmet-async";

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
} from "react-bootstrap-icons";

import "./AboutUsPage.css";
export function AboutUsPage() {
  const [teamData, setTeamData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const loadTeamCards = async () => {
    const reposnse = await axios.get("/api/teamMembers");
    setTeamData(reposnse.data.teamMembers);
  };

  useEffect(() => {
    loadTeamCards();
  }, []);

  const faqs = [
    {
      q: "How do I find a hostel near UPSA as a fresher?",
      a: "Use Episilion Hostels to browse verified hostels near UPSA's main campus. You can filter by gender, price range, and distance to campus, then compare amenities before booking online.",
    },
    {
      q: "How much do hostels near UPSA cost per semester?",
      a: "Hostel prices near UPSA typically range from GHS 2,000 to GHS 7,500 per semester depending on room type, amenities, and distance to campus. All current prices are listed on each hostel's page.",
    },
    {
      q: "Can I pay for a UPSA hostel with Mobile Money?",
      a: "No. Episilion Hostels just lists verified hostels and provides contact information for hostel managers. Payment methods are determined by the hostel itself, so please contact the hostel manager directly to confirm payment options.",
    },
    {
      q: "Are the hostels on Episilion Hostels verified?",
      a: "Yes, every hostel listed on Episilion Hostels is manually verified before it appears on the platform, so students and freshers can book with confidence.",
    },
    {
      q: "Do you have hostels for both boys and girls near UPSA?",
      a: "Yes, Episilion Hostels lists hostels near UPSA for boys, girls, and mixed accommodation. You can filter by gender directly on the homepage.",
    },
    {
      q: "How early should I book a hostel before the UPSA semester starts?",
      a: "We recommend reserving a hostel near UPSA at least one month before the semester begins, as popular hostels close to campus fill up quickly.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          About Us | Episilion Hostels — Verified Student Housing Near UPSA
        </title>
        <link rel="canonical" href="https://www.episilionhostels.com/aboutus" />
        <meta
          name="description"
          content="Learn how Episilion Hostels helps UPSA students find safe, affordable, and verified hostels near campus. Our mission, team, and answers to common hostel-booking questions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Episilion Hostels" />
        <meta
          property="og:description"
          content="Helping UPSA students find safe, affordable, and comfortable hostels with ease."
        />
        <meta
          property="og:url"
          content="https://www.episilionhostels.com/aboutus"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          })}
        </script>
      </Helmet>
      <div className="about-episilion-header">
        <p className="about-epislion-about">
          <span className="about-epislion-about__dot" aria-hidden="true" />
          About Episilion
        </p>
        <h1 className="about-epislion-helping-students">
          Helping students find safe, affordable, and comfortable hostels with
          ease.
        </h1>
        <p className="about-epislion-header-short-description">
          We've redefined the housing search for the modern student, blending
          technology with deep local expertise to create a seamless marketplace
          for your next home.
        </p>
        <div className="about-epislion-header__stats">
          <div className="about-epislion-header__stat">
            <span className="about-epislion-header__stat-value">
              100%
            </span>
            <span className="about-epislion-header__stat-label">
              Manually verified listings
            </span>
          </div>
          <div className="about-epislion-header__stat">
            <span className="about-epislion-header__stat-value">24/7</span>
            <span className="about-epislion-header__stat-label">
              AI hostel assistance
            </span>
          </div>
          <div className="about-epislion-header__stat">
            <span className="about-epislion-header__stat-value">
              Near UPSA
            </span>
            <span className="about-epislion-header__stat-label">
              Every hostel mapped to campus
            </span>
          </div>
        </div>
      </div>

      <div className="who-we-are-container">
        <div className="unity-image">
          <img src="/newUnityImage2.png" alt="Students on the Episilion Hostels platform" />
        </div>
        <div className="who-we-are-description">
          <p className="section-eyebrow">
            <span className="section-eyebrow__dot" aria-hidden="true" />
            Who we are
          </p>
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
          <ul className="who-we-are-highlights">
            <li>
              <span className="who-we-are-highlights__icon" aria-hidden="true">
                <ShieldCheck />
              </span>
              <span>
                <strong>Verified listings</strong> — every hostel checked by
                hand, not scraped.
              </span>
            </li>
            <li>
              <span className="who-we-are-highlights__icon" aria-hidden="true">
                <CashStack />
              </span>
              <span>
                <strong>Transparent pricing</strong> — the full cost, with no
                hidden fees.
              </span>
            </li>
            <li>
              <span className="who-we-are-highlights__icon" aria-hidden="true">
                <Eye />
              </span>
              <span>
                <strong>Built around students</strong> — every feature starts
                from what a fresher actually needs.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mission-and-vision-container">
        <div className="mission">
          <span className="mission-vision__icon" aria-hidden="true">
            <RocketTakeoff />
          </span>
          <p className="section-eyebrow section-eyebrow--light">
            <span className="section-eyebrow__dot" aria-hidden="true" />
            What drives us
          </p>
          <h2>Our Mission</h2>
          <p>
            To simplify the hostel searching process by providing a transparent,
            efficient, and student-first digital ecosystem that removes the
            friction from finding a home.
          </p>
        </div>

        <div className="vision">
          <span className="mission-vision__icon" aria-hidden="true">
            <Eye />
          </span>
          <p className="section-eyebrow section-eyebrow--light">
            <span className="section-eyebrow__dot" aria-hidden="true" />
            Where we're going
          </p>
          <h2>Our Vision</h2>
          <p>
            To become the leading global marketplace for student housing,
            recognized for setting the gold standard in accommodation safety,
            quality, and student satisfaction.
          </p>
        </div>
      </div>

      <div className="what-we-offer-container">
        <p className="section-eyebrow section-eyebrow--center">
          <span className="section-eyebrow__dot" aria-hidden="true" />
          What we offer
        </p>
        <h2>What We Offer</h2>
        <p className="what-we-offer-subtitle">
          Tailored features designed for the modern university student.
        </p>

        <div className="what-we-offers-container">
          <div className="what-we-offer-card">
            <span className="what-we-offer-card__icon" aria-hidden="true">
              <ShieldCheck />
            </span>
            <h3>Verified Information</h3>
            <p>
              We manually verify every hostel listing. From water availability
              to security guards, the details you see are accurate and
              trustworthy.
            </p>
          </div>

          <div className="what-we-offer-card">
            <span className="what-we-offer-card__icon" aria-hidden="true">
              <GenderMale />
              <GenderFemale />
            </span>
            <h3>Gender-Based Filtering</h3>
            <p>
              Quickly browse hostels categorized by gender to find your perfect
              comfort zone.
            </p>
          </div>

          <div className="what-we-offer-card">
            <span className="what-we-offer-card__icon" aria-hidden="true">
              <CashStack />
            </span>
            <h3>Price Transparency</h3>
            <p>
              No hidden fees. Filter hostels based on your budget range and
              compare amenities side-by-side.
            </p>
          </div>

          <div className="what-we-offer-card what-we-offer-card--featured">
            <span className="what-we-offer-card__icon" aria-hidden="true">
              <Phone />
            </span>
            <h3>Direct Contact</h3>
            <p>
              Found a place you love? Contact hostel managers directly through
              our secure platform to book a viewing or secure your bed.
            </p>
          </div>
        </div>
      </div>

      <div className="about-epislion-team-section">
        <p className="section-eyebrow section-eyebrow--center">
          <span className="section-eyebrow__dot" aria-hidden="true" />
          The people behind it
        </p>
        <h2>Meet the Team</h2>
        <p className="about-epislion-team-subtitle">
          The passionate individuals behind your next home.
        </p>

        <div className="about-epislion-team-cards">
          {teamData.map((teamMember) => {
            //WITH THIS FOR EACH TEAM MEMEBER IT WILL GENERATE A TeamCards COMPONENT
            return <TeamCards key={teamMember.Name} teamMember={teamMember} />;
          })}
        </div>
      </div>

      <div className="about-us-faq-container">
        <p className="section-eyebrow section-eyebrow--center">
          <span className="section-eyebrow__dot" aria-hidden="true" />
          Need to know
        </p>
        <h2>Frequently Asked Questions</h2>
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              className={`about-us-faq-item ${isOpen ? "open" : ""}`}
              key={i}
            >
              <button
                type="button"
                className="about-us-faq-item__trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <h3>{item.q}</h3>
                <span className="about-us-faq-item__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
              <p>{item.a}</p>
            </div>
          );
        })}
      </div>


      <div className="contacts-container">
        <div className="about-us-contacts">
          <div className="about-us-contacts__intro">
            <p className="about-us-contacts__eyebrow">
              <span className="about-us-contacts__eyebrow-dot" />
              We're here to help
            </p>
            <h2>Get in Touch</h2>
            <p className="about-us-contacts__lede">
              Have questions about a listing or need help finding the right
              place? Our team is here to support you.
            </p>
          </div>

          <div className="about-us-contacts__channels">
            <a className="contact-channel" href="tel:0537222558">
              <span className="contact-channel__icon" aria-hidden="true">
                <Phone />
              </span>
              <span className="contact-channel__body">
                <span className="contact-channel__label">Call us</span>
                <span className="contact-channel__value">0537222558</span>
              </span>
              <span className="contact-channel__arrow" aria-hidden="true">
                →
              </span>
            </a>

            <a
              className="contact-channel"
              href={`mailto:episilionhostels26@gmail.com?subject=${encodeURIComponent("Hostel Inquiry")}&body=${encodeURIComponent("Hello, I would like to inquire about...")}`}
            >
              <span className="contact-channel__icon" aria-hidden="true">
                <Envelope />
              </span>
              <span className="contact-channel__body">
                <span className="contact-channel__label">Email us</span>
                <span className="contact-channel__value">
                  episilionhostels26@gmail.com
                </span>
              </span>
              <span className="contact-channel__arrow" aria-hidden="true">
                →
              </span>
            </a>

            <a
              className="contact-channel"
              href="https://wa.me/0537222558"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                className="contact-channel__icon contact-channel__icon--whatsapp"
                aria-hidden="true"
              >
                <Whatsapp />
              </span>
              <span className="contact-channel__body">
                <span className="contact-channel__label">WhatsApp us</span>
                <span className="contact-channel__value">0537222558</span>
              </span>
              <span className="contact-channel__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <p className="about-us-contacts__note">
            <span className="about-us-contacts__status" aria-hidden="true" />
            We typically reply within a few hours during working days.
          </p>
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
