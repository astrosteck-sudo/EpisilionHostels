import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { HostelCard } from "../HomePage/HostelCard.jsx";
import "./CampusLandingPage.css";

export function CampusLandingPage({ originalHostelCardData }) {
  const featuredHostels = originalHostelCardData?.slice(0, 6) || [];

  return (
    <>
      <Helmet>
        <title>
          Complete Guide to Finding a Hostel Near UPSA (2026) | Episilion Hostels
        </title>
        <link
          rel="canonical"
          href="https://www.episilionhostels.com/hostels-near-upsa"
        />
        <meta
          name="description"
          content="A complete guide for UPSA freshers and returning students on finding a hostel near campus — costs, areas, what to check before booking, and how to secure a room before semester starts."
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content="Complete Guide to Finding a Hostel Near UPSA"
        />
        <meta
          property="og:url"
          content="https://www.episilionhostels.com/hostels-near-upsa"
        />
      </Helmet>

      <div className="campus-landing-container">
        <div className="campus-landing-hero">
          <h1>Finding a Hostel Near UPSA: A Guide for Students</h1>
          <p className="campus-landing-subtitle">
            Everything you need to know before booking student
            accommodation close to the University of Professional Studies,
            Accra.
          </p>
        </div>

        <div className="campus-landing-section">
          <h2>What to Know Before Choosing a Hostel Near UPSA</h2>
          <p>
            Most hostels near UPSA sit within a 15–20 minute walk of campus,
            with prices generally ranging from GHS 2,000 to GHS 7,500 per
            semester depending on room type, amenities, and exact distance.
            Before picking one, it's worth checking a few things beyond
            price: is water supply reliable, is there 24-hour security, how
            far is it realistically from your lecture halls, and does the
            hostel allow installment payments if you're not paying the full
            semester upfront.
          </p>
          <p>
            For freshers especially, proximity matters more in your first
            semester than it might later — being able to walk to early
            morning lectures without relying on transport saves both money
            and stress during a period when you're already adjusting to a
            lot that's new.
          </p>
        </div>

        <div className="campus-landing-section">
          <h2>Areas Near UPSA Worth Considering</h2>
          <p>
            Most student hostels cluster around Madina and the Legon Road
            axis, both within easy reach of UPSA's main campus. Madina
            tends to offer a wider range of price points and is well
            connected by trotro and shared taxis, while hostels closer to
            Legon Road often mean a shorter walk but can come at a slightly
            higher price. Which area suits you best usually comes down to
            budget versus how much walking distance you're comfortable
            with daily.
          </p>
        </div>

        <div className="campus-landing-section">
          <h2>Featured Hostels Near UPSA</h2>
          <div className="campus-landing-hostel-grid">
            {featuredHostels.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
          <Link to="/" className="campus-landing-cta">
            Browse All Hostels & Filter by Price, Gender, and Location →
          </Link>
        </div>
      </div>
    </>
  );
}