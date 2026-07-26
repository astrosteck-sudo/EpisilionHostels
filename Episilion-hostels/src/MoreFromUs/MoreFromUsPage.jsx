//import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./MoreFromUsPage.css";
import { Link } from "react-router-dom";
//import axios from "axios";
import { ProjectsCards } from "./ProjectsCards";
import { ArrowBarRight, RocketTakeoff } from "react-bootstrap-icons";

export function MoreFromUsPage() {
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
              This app creates a balanced marketplace where creators can invest
              in growing their follower base, while users are rewarded for
              engaging with those creators. Strict safeguards are built into
              both sides of the platform to ensure fairness, transparency, and a
              positive experience for everyone involved.
            </p>
            <div className="more-from-us-buttons">
              <button className="more-from-us-learn-more-button">
                <p>Learn More</p>
                <ArrowBarRight />
              </button>
              <button className="more-from-us-in-development">In Development</button>
            </div>
          </div>
          <div className="more-from-us-project-image">
            <img src="/riserFlyer2.png" alt="" className="project-image" />
          </div>
        </div>

        <div className="more-from-us-join-wishlist-container">
          <RocketTakeoff className="more-from-us-join-wishlist-icon" />
          <h2>Join the Waitlist</h2>
          <p>
            Be the first to know when we launch new services for your favorite
            games.
          </p>
          <input type="email" placeholder="johnDoe@gmail.com" />
          <button>Notify Me</button>
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
