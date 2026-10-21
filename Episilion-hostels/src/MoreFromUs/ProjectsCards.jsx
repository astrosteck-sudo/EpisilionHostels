
export function ProjectsCards({ project }){



    return(
        <div className="project-card">
            <h2 className="project-heading">{project.Name}</h2>
            <p className="project-description">{project.Role}</p>
            <div className="project-info"><span><span id="status">Status:</span>{project.StatusComplete === true ? 'Complete' : 'In Progress'}</span><a href={project.Link} id="project-link">Click Here</a></div>    
        </div>
    )
}