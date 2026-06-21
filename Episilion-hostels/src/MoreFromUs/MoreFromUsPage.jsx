import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./MoreFromUsPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProjectsCards } from "./ProjectsCards";

export function MoreFromUsPage() {
  const [moreFromUsData, setMoreFromUs] = useState([]);

  const loadMoreFromUsCards = async () => {
    const repsonse = await axios.get("/api/moreProjects");
    setMoreFromUs(repsonse.data.moreProjects);
  };

  useEffect(() => {
    loadMoreFromUsCards();
  }, []);

  return (
    <>
      <title>More From Us | Episilion Hostels</title>
      {/* <PageHeader navlink={navlink} setNavLink={setNavLink} /> */}

      <div className="more-from-us-header">
        <p className="more-from-us-subtitle">EPISILION EXTRAS</p>
        <h2 className="more-from-us-title">Get More From Us</h2>
        <p className="more-from-us-description">
          Exclusive programmes and services for the Episilion community
        </p>
      </div>

      <div className="more-from-us-coming-soon-container">
        <p className="more-from-us-coming-soon">Coming Soon</p>
        <p className="more-from-us-coming-soon-line"></p>
      </div>

      <div className="more-from-us-projects-cards-container">
        <div className="more-from-us-projects-card">
          <div className="more-from-us-projects-card-content">
            <div className="more-from-us-projects-card-content-header">
              <img
                src="./flexPay26.png"
                alt="Project Icon"
                className="more-from-us-projects-card-content-header-logo"
              />
              <div className="more-from-us-projects-card-content-header-text">
                <p className="more-from-us-projects-card-content-header-text-title">
                  FlexPay 26
                </p>
                <p className="more-from-us-projects-card-content-header-text-description">
                  Gaming Top-Up Programme
                </p>
              </div>
            </div>

            <p className="more-from-us-projects-card-content-description">
              Tailored to provide quick and affordable Gold and Diamonds to Free
              Fire gamers. Coming soon: support for PUBG, Delta Force, Call of
              Duty, and Fortnite.
            </p>
          </div>
          <img
            src="./gameCollage.png"
            alt="Project Image"
            className="more-from-us-projects-card-image"
          />

          <div className="more-from-us-projects-card-buttons">
            <button className="more-from-us-projects-card-button-in-progress">
              Completed
            </button>
            <button className="more-from-us-projects-card-button-learn-more">
              <a href="https://flexpay26.vercel.app/" target="_blank">
                Learn More
              </a>
            </button>
          </div>
        </div>
      </div>

      <div className="more-from-us-more-projects-container">
        <p>More programmes on the way — stay tuned!</p>
      </div>

      <SiteFooter />
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
