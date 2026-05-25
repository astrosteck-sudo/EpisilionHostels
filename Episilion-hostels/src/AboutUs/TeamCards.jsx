



export function TeamCards({ teamMember }){


    return(

        <div className="about-epislion-team-card">
          <img src={teamMember.Picture} alt={teamMember.Name} className="about-epislion-team-image" />
          <p className="about-epislion-team-name">{teamMember.Name}</p>
          <p className="about-epislion-team-role">{teamMember.Position}</p>
          <p className="about-epislion-team-bio">{teamMember.Role}</p>
        </div>
    )
}