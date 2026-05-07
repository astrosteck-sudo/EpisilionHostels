import "./UserProfile.css";


export function FavoriteHostels({ favoriteHostel }) {
    const url = "http://localhost:3000";
    console.log(favoriteHostel.amenities[0].name)
  return (
    <div className="user-favorite-hostel">
      <img src={url + favoriteHostel.main_image} alt="Profile" className="user-favorite-hostel-image" />
      <div className="user-favorite-hostel-info">
        <p className="user-favorite-hostel-name">{favoriteHostel.name}</p>
        <p className="user-favorite-hostel-distance">15.1 km from campus</p>
        <div className="user-favorite-hostel-amenities">
          {favoriteHostel.amenities.map((amenity) => {
            return(
              <p>{amenity.name}</p>
            )
          })}
        </div>
      </div>
      <div className="user-favorite-hostel-price-and-button">
        <p className="user-favorite-hostel-price">{favoriteHostel.price_min}/sem</p>
        <button className="user-favorite-hostel-button">View</button>
        <p className="user-favorite-hostel-remove">Remove</p>
      </div>
    </div>
  );
}
