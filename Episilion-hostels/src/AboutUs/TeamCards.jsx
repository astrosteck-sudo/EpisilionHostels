



export function TeamCards({ teamMember }){


    return(

        <div className="about-epislion-team-card">
          <img loading='lazy'src={teamMember.Picture} alt={teamMember.Name} className="about-epislion-team-image" />
          <p className="about-epislion-team-name">{teamMember.Name}</p>
          <p className="about-epislion-team-role">{teamMember.Position}</p>
        </div>
    )
}