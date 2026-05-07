import { useEffect, useState } from "react";
import { PageHeader } from "../PageHeader/PageHeader";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import leftArrowImage from '../assets/icons/left_arrow.png';
import rightArrowImage from '../assets/icons/right_arrow.png';
import closeMapImage from '../assets/icons/close.png';
import './CompareHostels.css'
import { showHostelLocationOnMap } from "../UTILS/mapFunctions.js";
import { getDirectionsOnMap } from '../UTILS/mapFunctions.js';
//import { useEffect } from "react";



export function CompareHostels({ originalHostelCardData }) {
    const params = new URLSearchParams(window.location.search);
    const hostelId = params.get("hostelId");
    const url = 'https://episilion-backend-2lt0.onrender.com';
    //const url = 'http://localhost:3000'
    const [hostelNumber, setHostelNumber] = useState(hostelId)//THIS CONTOLS THE HOSTEL THAT SHOWS UP WHEN THE USER CLICKES THE ARROW KEYS
    const [controlsListIndex, setControlListIndex] = useState(0)
    //THIS CONTROL CODE WILL MAKE SURE THE controlsListIndex WILL ALWAYS UPDATE WHEN THE originalHostelCardData CHANGES
    // useEffect(() => {
    //     setControlListIndex(originalHostelCardData.length)
    //     // const index = originalHostelCardData.findIndex(hostel => hostel.id == hostelId)
    //     // console.log(index + 1)
    // }, [originalHostelCardData,])

    function reduceHostelNumber() {
        let hostelIndex = controlsListIndex
        if (hostelIndex < 1) {
            hostelIndex = originalHostelCardData.length;
            setHostelNumber(originalHostelCardData[hostelIndex - 1].id)
            setControlListIndex(hostelIndex - 1)
        } else {
            setHostelNumber(originalHostelCardData[hostelIndex - 1].id)
            setControlListIndex(hostelIndex - 1)
        }
    }

    function increaseHostelNumber() {
        let hostelIndex = controlsListIndex + 1
        if (hostelIndex >= originalHostelCardData.length) {
            //console.log("bigger than originalHostelCardData", hostelIndex)
            hostelIndex = originalHostelCardData.length;
            setHostelNumber(originalHostelCardData[0].id)
            setControlListIndex(0)
        } else {
            console.log(hostelIndex)
            setHostelNumber(originalHostelCardData[hostelIndex].id)
            setControlListIndex(hostelIndex)
        }

    }


    const [leftHostelDistanceAdvantage, setleftHostelDistanceAdvantage] = useState(true);
    const [rightHostelDistanceAdvantage, setrightHostelDistanceAdvantage] = useState(true);

    const [leftHostelPriceAdvantage, setleftHostelPriceAdvantage] = useState(true);
    const [rightHostelPriceAdvantage, setRightHostelPriceAdvantage] = useState(true);

    // const [leftHostelRoomsAdvantage, setLeftHostelRoomsAdvantage] = useState(true);
    // const [rigthHostelRoomsAdvantage, setRightHostelRoomsAdvantage] = useState(true);

    const [leftHostel, setLeftHostel] = useState();
    const [rightHostel, setRightHostel] = useState();

    useEffect(() => {
        if (originalHostelCardData.length > 1) {
            const foundLeftHostel = (originalHostelCardData.find(hostel => hostel.id === hostelId))
            const foundRightHostel = (originalHostelCardData.find(hostel => hostel.id === hostelNumber))
            setLeftHostel(foundLeftHostel)
            setRightHostel(foundRightHostel)
        }
    }, [hostelNumber, originalHostelCardData, hostelId])



    useEffect(() => {
        if (leftHostel && rightHostel) {
            if (leftHostel.distance < rightHostel.distance) {
                //console.log("Left is smaller");
                setleftHostelDistanceAdvantage(true);
                setrightHostelDistanceAdvantage(false);
            } else {
                //console.log("Right is smaller");
                setleftHostelDistanceAdvantage(false);
                setrightHostelDistanceAdvantage(true);
            }
        }
    }, [leftHostel, rightHostel]);

    useEffect(() => {
        if (leftHostel && rightHostel) {
            //console.log(leftHostel.pricing.priceMin)
            if (leftHostel.pricing.priceMin < rightHostel.pricing.priceMin) {

                //console.log("Left is smaller");
                setleftHostelPriceAdvantage(true);
                setRightHostelPriceAdvantage(false);
            } else {
                //console.log("Right is smaller");
                setleftHostelPriceAdvantage(false);
                setRightHostelPriceAdvantage(true);
            }
        }
    }, [leftHostel, rightHostel]);

    const [close, setClose] = useState(true);//THIS CONTROLS THE THE IFRAME, OPENING AND CLOSING IT
    const [activate, setActivate] = useState(false);//THIS CONTROLS THE DARK BACKGROUND WHEN THE LOCATIONS BUTTONS ARE CLICKED

    const [googleMapSrc, setGoogleMapSrc] = useState('')

    function closeMap() {
        console.log('Close has bee clciked')
        if (!close) {
            setActivate(false)
            setClose(true)
        } else {
            setClose(false)
        }
    }
    return (

        <>
            <title>Compare Hostels | Epislion Hostels</title>
            {/* <PageHeader navlink={navlink} setNavLink={setNavLink} /> */}

            <div className="hostel-comparison-container">
                <div className="compared-hostels">
                    {originalHostelCardData.map((hostel) => {
                        if (hostel.id === hostelId) {
                            return (
                                <>
                                    <h1 className="compared-hostel-name">{hostel.name}</h1>
                                    <img className="compared-hostel-image" src={url + hostel.image} alt="" />
                                    <p className="compared-hostel-distance">Distance From Campus : {hostel.distance} <span className={`compared-hostel-diatance-advantage ${leftHostelDistanceAdvantage}`}>{leftHostelDistanceAdvantage ? 'Closer' : 'Further'}</span></p>
                                    <div className="view-location-container">
                                        <button className="view-location js-view-location" onClick={() =>showHostelLocationOnMap(setClose, setActivate, originalHostelCardData, hostelId, setGoogleMapSrc)}>View Location</button>
                                        <button className="view-location js-get-directions" onClick={() => getDirectionsOnMap(originalHostelCardData, hostelId)} >Get Directions</button>
                                    </div>

                                    <div className={`overlay-background ${activate ? 'activate' : ''}`}>
                                        <div className='map-modal'>
                                            <div className={`iframe-container ${close ? 'close' : ''}`}>
                                                <div className='close-button'><img src={closeMapImage} alt="" className='close-image' onClick={closeMap} /></div>
                                                <iframe
                                                    src={googleMapSrc}
                                                    className='iframe'
                                                    frameborder="1"
                                                    loading='lazy'
                                                    title='Hostel Location'></iframe>
                                            </div>
                                        </div>
                                    </div>

                                    <h1 className="compared-hostel-titles">Price Details <span className={`compared-hostel-price-advantage ${leftHostelPriceAdvantage}`}>{leftHostelPriceAdvantage ? 'Lower' : 'Higher'}</span></h1>
                                    <p className="compared-hostel-pricing">Minimum Price : {hostel.pricing.priceMin} </p>
                                    <p className="compared-hostel-pricing"> Additional Fees Total: {hostel.pricing.additionalFees.utilities + hostel.pricing.additionalFees.maintenance + hostel.pricing.additionalFees.cautionDeposit}</p>

                                    <h1 className="compared-hostel-titles">Room Types <span className="compared-hostel-room-advantage">{ }</span></h1>
                                    <ul className="types-of-rooms js-rooms-types">
                                        {hostel.rooms.types.map((room) => {
                                            return (
                                                <li className='special-font'>{room.type}<p>Price {room.price}</p></li>
                                            )
                                        })}
                                    </ul>

                                    <h1 className="compared-hostel-titles">Facilties And Ameneities</h1>
                                    <ul className="facilities-and-amenities-perks grid js-facilities-and-amenities-perks">
                                        {
                                            hostel.amenities.map((amenity) => {
                                                return (
                                                    <>
                                                        <li class="special-font">{amenity}</li>
                                                    </>
                                                )
                                            })
                                        }
                                        {
                                            hostel.furnishing.map((funish) => {
                                                return (
                                                    <li class="special-font">{funish}</li>
                                                )

                                            })
                                        }
                                    </ul>

                                    <h1 className="compared-hostel-titles">Rules And Regulation</h1>
                                    <ul className="grid rules-and-policies-style js-rules-and-regulations">
                                        {hostel.rules.map((rule) => {
                                            return (
                                                <li class="special-font">{rule}</li>
                                            )
                                        })}
                                    </ul>

                                    <h1 className="compared-hostel-titles">Room Images</h1>
                                    <div className="compared-hostel-room-type-images-continer">
                                        {hostel.media.images.map((image) => {

                                            return (
                                                <div class="compared-hostel-room-type-image">
                                                    <a href={url + image.url}>
                                                        <img class="hostel-room" src={url + image.url} alt={image.type}></img>
                                                    </a>
                                                    <div class="hostel-room-type-overlay">
                                                        <span class="hostel-room-type-overlay-text">{image.type}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>


                                </>
                            )
                        }


                    })}
                </div>
                <div className="compared-hostels">
                    {/* <div className="compared-hostels-switch">
                        <button className="compare-hostels-arrow-button" onClick={() => reduceHostelNumber()}><img src={leftArrowImage} alt="" /></button>
                        <p className="compare-hostels-switch-text">Switch Hostel</p>
                        <button className="compare-hostels-arrow-button" onClick={() => increaseHostelNumber()}><img src={rightArrowImage} alt="" /></button>
                    </div> */}
                    {originalHostelCardData.map((hostel) => {
                        if (hostel.id === hostelNumber) {
                            return (
                                <>

                                    <div className="compared-hostels-switch">
                                        <button className="compare-hostels-arrow-button" onClick={() => reduceHostelNumber()}><img src={leftArrowImage} alt="" /></button>
                                        <h1 className="compared-hostel-name">{hostel.name}</h1>
                                        <button className="compare-hostels-arrow-button" onClick={() => increaseHostelNumber()}><img src={rightArrowImage} alt="" /></button>
                                    </div>
                                    {/* <h1 className="compared-hostel-name">{hostel.name}</h1> */}
                                    <img className="compared-hostel-image" src={url + hostel.image} alt="" />
                                    <p className="compared-hostel-distance">Distance From Campus : {hostel.distance} m <span className={`compared-hostel-diatance-advantage ${rightHostelDistanceAdvantage}`}>{rightHostelDistanceAdvantage ? 'Closer' : 'Further'}</span></p>
                                    <div className="view-location-container">
                                        <button className="view-location js-view-location" onClick={() =>showHostelLocationOnMap(setClose, setActivate, originalHostelCardData, hostelId, setGoogleMapSrc)}>View Location</button>
                                        <button className="view-location js-get-directions" onClick={() => getDirectionsOnMap(originalHostelCardData, hostelId)} >Get Directions</button>
                                    </div>
                                    <div className={`overlay-background ${activate ? 'activate' : ''}`}>
                                        <div className='map-modal'>
                                            <div className={`iframe-container ${close ? 'close' : ''}`}>
                                                <div className='close-button'><img src={closeMapImage} alt="" className='close-image' onClick={closeMap} /></div>
                                                <iframe
                                                    src={googleMapSrc}
                                                    className='iframe'
                                                    frameborder="1"
                                                    loading='lazy'
                                                    title='Hostel Location'></iframe>
                                            </div>
                                        </div>
                                    </div>

                                    <h1 className="compared-hostel-titles">Price Details <span className={`compared-hostel-price-advantage ${rightHostelPriceAdvantage}`}>{rightHostelPriceAdvantage ? 'lower' : 'Higher'}</span></h1>
                                    <p className="compared-hostel-pricing">Minimum Price : {hostel.pricing.priceMin}</p>
                                    <p className="compared-hostel-pricing"> Additional Fees Total: {hostel.pricing.additionalFees.utilities + hostel.pricing.additionalFees.maintenance + hostel.pricing.additionalFees.cautionDeposit}</p>

                                    <h1 className="compared-hostel-titles">Room Types <span className="compared-hostel-room-advantage"></span></h1>
                                    <ul className="types-of-rooms js-rooms-types">
                                        {hostel.rooms.types.map((room) => {
                                            return (
                                                <li className='special-font'>{room.type}<p>Price {room.price}</p></li>
                                            )
                                        })}
                                    </ul>

                                    <h1 className="compared-hostel-titles">Facilties And Ameneities <span className="compared-hostel-price-advantage"></span></h1>
                                    <ul className="facilities-and-amenities-perks grid js-facilities-and-amenities-perks">
                                        {
                                            hostel.amenities.map((amenity) => {
                                                return (
                                                    <>
                                                        <li class="special-font">{amenity}</li>
                                                    </>
                                                )
                                            })
                                        }
                                        {
                                            hostel.furnishing.map((funish) => {
                                                return (
                                                    <li class="special-font">{funish}</li>
                                                )

                                            })
                                        }
                                    </ul>

                                    <h1 className="compared-hostel-titles">Rules And Regulation</h1>
                                    <ul className="grid rules-and-policies-style js-rules-and-regulations">
                                        {hostel.rules.map((rule) => {
                                            return (
                                                <li class="special-font">{rule}</li>
                                            )
                                        })}
                                    </ul>

                                    <h1 className="compared-hostel-titles">Room Images</h1>
                                    <div className="compared-hostel-room-type-images-continer">
                                        {hostel.media.images.map((image) => {

                                            return (
                                                <div class="compared-hostel-room-type-image">
                                                    <a href={url + image.url}>
                                                        <img class="hostel-room" src={url + image.url} alt={image.type}></img>
                                                    </a>
                                                    <div class="hostel-room-type-overlay">
                                                        <span class="hostel-room-type-overlay-text">{image.type}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>


                                </>
                            )
                        }


                    })}
                </div>
            </div>


            <SiteFooter />
        </>
    )
}