import { useNavigate } from "react-router-dom";
import { getDistance } from 'geolib';
import { useEffect, useState } from "react";
import './HostelCard.css'

export function HostelCard({ hostel }) {

    //THIS IS THE URL FOR THE BACKEND, THIS IS USED TO ACCESS THE IMAGES IN THE PUBLIC FOLDER OF THE BACKEND
    //const url = "http://localhost:3000"
    const url = 'https://episilion-backend-2lt0.onrender.com'

    const navigate = useNavigate();
    // function showHostelId(parameter){
    //     window.location.href = `moreDetails?hostelId=${parameter}`;
    // }
    function showHostelId(parameter) {
        navigate(`/moreDetails?hostelId=${parameter}`);
    }

    const [amenities, setAmenities] = useState([])


    useEffect(() => {
        setAmenities(hostel.amenities.slice(1, 4)); // first 3 amenities
    }, [hostel]);




    // console.log("hostel data in hostel card", hostel)

    return (
        <div className="hostel-card">
            <div className="image-container">
                <img id="hostel-card-image" src={url + hostel.image} alt="hostel-image"></img>
                <div className="hostel-rating-text">
                    <span className="overlay-text-hostel-rating">{hostel.reviews.averageRating}({hostel.reviews.totalReviews})</span><br></br>
                </div>
                <div className="hostel-type-text">
                    <span className="overlay-text-hostel-type">{hostel.type}</span>
                </div>
            </div>
            <table border="0" width="100%">
                <tr width="20px">
                    <td className="td-vetical"><p id="hostel-name">{hostel.name}</p></td>
                    <td className="td-vetical"><p id="hostel-price">${hostel.pricing.priceMin}</p></td>
                </tr>
                <tr width="20px">
                    <td colSpan="2" className="td-vetical">
                        <p id="hostel-distace">{((getDistance(
                            { latitude: 5.660969, longitude: -0.166374 },
                            { latitude: hostel.location.latitude, longitude: hostel.location.longitude })) / 1000).toFixed(1)}
                            km from campus
                        </p></td>
                </tr>
                <tr className="amenities-homepage">
                    <td colSpan="2">
                        <div id="hostel-perks">
                            {amenities.map((amenity, index) => (
                                <span key={index} className="amenity">
                                    {amenity}{index < amenities.length - 1 ? " • " : ""}
                                </span>
                            ))}
                        </div>
                    </td>
                </tr>
            </table>
            <p><button className="view-more-details js-view-more-details" onClick={() => showHostelId(hostel.id)}>View Details</button></p>
        </div>
    )
}