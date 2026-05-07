
export function ProjectsCards({ project }){



    return(
        <div class="project-card">
            <h2 class="project-heading">{project.Name}</h2>
            <p class="project-description">{project.Role}</p>
            <div class="project-info"><span><span id="status">Status:</span>{project.StatusComplete === true ? 'Complete' : 'In Progress'}</span><a href={project.Link} id="project-link">Click Here</a></div>    
        </div>
    )
}