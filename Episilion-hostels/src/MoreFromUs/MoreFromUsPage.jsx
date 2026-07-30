//import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./MoreFromUsPage.css";
import { Link } from "react-router-dom";
//import axios from "axios";
import { ProjectsCards } from "./ProjectsCards";
import { ArrowBarRight, RocketTakeoff } from "react-bootstrap-icons";
import { useState } from "react";
import axios from "axios";
import validator from "validator";

export function MoreFromUsPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function handleEmail(event) {
    setEmail(event.target.value);
  }

  const joinWaitlist = async () => {
    if (email.length === 0) {
      return;
    }
    if (!validator.isEmail(email)) {
      setError(true);
      setMessage("Enter a valid email");
      return;
    }
    try {
      const response = await axios.post(`/api/subscribers/waitlist`, {
        email,
      });

      setError(false);
      setMessage("Your email has been saved");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return response.data;
    } catch (error) {
      setError(true);
      setMessage("Your email could not be sent, try again!");
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
  //const [moreFromUsData, setMoreFromUs] = useState([]);

  // const loadMoreFromUsCards = async () => {
  //   const repsonse = await axios.get("/api/moreProjects");
  //   setMoreFromUs(repsonse.data.moreProjects);
  // };

  // useEffect(() => {
  //   loadMoreFromUsCards();
  // }, []);

  return (
    <>
      <title>More From Us | Episilion Hostels</title>
      {/* <PageHeader navlink={navlink} setNavLink={setNavLink} /> */}

      <div className="more-from-us-header">
        <h2>Get More From Us</h2>
        <p>
          Exclusive programmes and services for the Episilion community. We go
          beyond housing to power your student lifestyle.
        </p>
      </div>

      <div className="more-from-us-main-container">
        <div className="more-from-us-project-container">
          <div className="more-from-us-project-details">
            <h2>Riser</h2>
            <h3>TikTok Creator/Earner App</h3>
            <p>
              Riser is a marketplace designed to help new and growing
              creators build momentum with real, verified followers. Instead of
              starting from an empty profile, creators can kick-start their
              growth by connecting with real people, while users earn cash for
              discovering and following new creators. We don't promise viral
              success or guaranteed engagement—great content is still what keeps
              an audience. Our goal is to help creators overcome the hardest
              part of the journey: getting noticed. Every follow comes from a
              real person, and strict safeguards are built into the platform to
              ensure fairness, transparency, and a trusted experience for both
              creators and users.
            </p>
            <div className="more-from-us-buttons">
              <button className="more-from-us-learn-more-button">
                <p>Learn More</p>
                <ArrowBarRight />
              </button>
              <button className="more-from-us-in-development">
                In Development
              </button>
            </div>
          </div>
          <div className="more-from-us-project-image">
            <img src="/riserPromotionImage.png" alt="riserPromotionImage" className="project-image" />
          </div>
        </div>

        <div className="more-from-us-join-wishlist-container">
          <RocketTakeoff className="more-from-us-join-wishlist-icon" />
          <h2>Join the Waitlist</h2>
          <p>
            Be the first to know when we launch this app.
          </p>
          <input
            type="email"
            placeholder="johnDoe@gmail.com"
            value={email}
            onChange={handleEmail}
          />
          <button onClick={joinWaitlist} className="notify-me-button">
            Notify Me
          </button>
          <div className={error ? "emailError" : "emailSuccess"}>{message}</div>
        </div>
      </div>
    </>
  );
}

// <section class="more-from-us-section js-more-from-us-section">
//                 <h3>Get More From Us</h3>

//                 <div class="projects-cards">
//                     {moreFromUsData.map((project) => {

//                         return(
//                             <ProjectsCards key={project.Name} project={project} />
//                         )
//                     })}
//                 </div>
//             </section>
