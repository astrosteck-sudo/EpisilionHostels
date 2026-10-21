



export function TeamCards({ teamMember }) {
  return (
    <article className="about-epislion-team-card">
      <div className="about-epislion-team-image-wrap">
        <img
          loading="lazy"
          src={teamMember.Picture}
          alt={teamMember.Name}
          className="about-epislion-team-image"
        />
      </div>
      <div className="about-epislion-team-info">
        <h3 className="about-epislion-team-name">{teamMember.Name}</h3>
        <p className="about-epislion-team-role">{teamMember.Position}</p>
      </div>
    </article>
  );
}