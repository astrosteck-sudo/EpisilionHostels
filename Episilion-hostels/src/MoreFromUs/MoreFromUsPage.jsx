import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import './MoreFromUsPage.css';
import { Link } from "react-router-dom";
import axios from "axios";
import { ProjectsCards } from "./ProjectsCards";


export function MoreFromUsPage() {

    const [moreFromUsData, setMoreFromUs] = useState([])

    const loadMoreFromUsCards = async () => {
        //const repsonse = await axios.get('https://episilion-backend-2lt0.onrender.com/api/moreProjects');
        const repsonse = await axios.get('/api/moreProjects');
        setMoreFromUs(repsonse.data.moreProjects)
    }

    useEffect(() => {
        loadMoreFromUsCards()
    },[])

    return (

        <>
            <title>More From Us | Episilion Hostels</title>
            {/* <PageHeader navlink={navlink} setNavLink={setNavLink} /> */}


            <section class="more-from-us-section js-more-from-us-section">
                <h3>Get More From Us</h3>

                <div class="projects-cards">
                    {moreFromUsData.map((project) => {

                        return(
                            <ProjectsCards key={project.Name} project={project} />
                        )
                    })}
                </div>
            </section>

            <SiteFooter />
        </>
    )
}