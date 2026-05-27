





export function HostelDetails({ hostelsCardData, hostelId }) {


    return (
        hostelsCardData.forEach((hostel) => {
            if (hostel.id === hostelId) {
                console.log('Hostel Name:', hostel.name, hostel.id, 'Clicked Hostel:', hostelId)
                return (
                    <>
                        <div className="hostel-image-card">
                            <img loading='lazy'src="" alt=""></img>
                            <div className="overlay">
                                <span className="overlay-text">{hostel.name}</span>
                            </div>
                        </div>

                        <div className="hostel-information-contaniner">
                            <div className="location-details">
                                <h2 className="font-header">Location</h2>
                                <p className="font-paragraph js-location-paragraph">
                                    <p className="font-paragraph js-distance-from-campus"></p>
                                </p>

                                <div className="view-location-container">
                                    <button className="view-location js-view-location">View Location</button>
                                    <button className="view-location js-get-directions">Get Directions</button>
                                </div>
                            </div>
                        </div>

                        <div className="price-and-payment">
                            <h2 className="font-header">Payment Details</h2>
                            <p className="font-paragraph js-minimum-price"></p>
                            <p className="font-paragraph js-maximum-price"></p>
                            <p className="font-paragraph js-installment-allowed"></p>
                            <p className="font-paragraph">Additional Fees</p>
                            <ul className="additional-fees js-additional-fees"></ul>
                            <p className="font-paragraph js-refund-policy"></p>
                        </div>

                        <div className="room-information">
                            <h2 className="font-header">Room Information</h2>
                            <ul className="types-of-rooms js-rooms-types"></ul>
                        </div>

                        <div className="facilities-and-amenities">
                            <h2 id="facilities-and-amenities-header" className="font-header">Facilities And Amenities</h2>
                            <ul className="facilities-and-amenities-perks grid js-facilities-and-amenities-perks"></ul>
                            <ul className="grid js-funishing"></ul>
                        </div><br></br>

                        <div className="rules-and-contact-container">
                            <div className="rules-and-policies">
                                <h2 className="font-header">Rules And Regulations</h2>
                                <ul className="grid rules-and-policies-style js-rules-and-regulations"></ul>
                            </div>
                            <div className="info-container">
                                <div className="management-contact">
                                    <h2 className="font-header">Contacts</h2>
                                    <a className="contact-item js-phone-number-link" href="tel:">
                                        <img loading='lazy'src="../icons/phone.svg" alt="Phone"></img>
                                        <p className="font-paragraph js-phone-number"></p>
                                    </a>
                                    <a className="contact-item js-whatsApp-number-link" href="https://wa.me/">
                                        <img loading='lazy'src="../icons/whatsapp-128.svg" alt="WhatsApp"></img>
                                        <p className="font-paragraph js-whatsapp-number"></p>
                                    </a>
                                    <a className="contact-item js-email-address-link" href="https://">
                                        <img loading='lazy'src="../icons/email-14.svg" alt="Email"></img>
                                        <p className="font-paragraph js-email-address"></p>
                                    </a>
                                    <div className="contact-item">
                                        <img loading='lazy'src="../icons/manager-avatar.svg" alt="manager-name"></img>
                                        <p className="font-paragraph js-manager-name"></p>
                                    </div>
                                    <div className="contact-item">
                                        <img loading='lazy'src="../icons/clock.svg" alt="clock"></img>
                                        <p className="font-paragraph js-office-hours"></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="media-information-cards js-media-information-cards"></div>
                    </>
                )
            }

        })
    )
}