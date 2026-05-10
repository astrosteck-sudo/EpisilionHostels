import { PageHeader } from "../PageHeader/PageHeader.jsx"
import { HostelCard } from "./HostelCard.jsx";
import './HomePage.css';
import { SiteFooter } from "../SiteFooter/SiteFooter.jsx";
import filterImage from '../assets/icons/filter4.png';
import closeFilterImage from '../assets/icons/close.png';
import boyImage from '../assets/icons/man.png';
import girlImage from '../assets/icons/woman-avatar.png';
import mixedImage from '../assets/icons/shuffle.png'
import searchButton from '../assets/icons/search.png';
import resetImage from '../assets/icons/refresh.png';
import noResultImage from '../assets/icons/no-results-(1).png'
import { useEffect, useState } from "react";
//import { all } from "axios";

export function HomePage({ hostelsCardData, sethostelsCardData, originalHostelCardData }) {
    const [gender, setGender] = useState('');//THIS CONTROLS THE GENDER OT BE USED IN THE FILTERING PROCESS
    const [genderText, setGenderText] = useState('Search');// THIS CONTROLS THE D=GENDER SHOWN IN THE SEARCH BUTTON IN THE FILTER MENUI
    const [minPrice, setMinPrice] = useState('');//THIS CONTROLS THE MIN PRICE IN THE FILTER
    const [maxPrice, setMaxPrice] = useState('');//THIS CONTROLS THE MAX PRICE IN THE FILTER
    const [searchHostelName, setSearchHostelName] = useState('')//THIS CONTROLS THE HOSTEL NAME TYPE SBY THE USER WHICH WILL BE USED IN THE searchHostelByName FUNCTION
    const [filter, setFilter] = useState();//THIS CONTROLS THE HOSTELS THAT PASSED THE CRITIRIA OF THE filter
    const [suggestionBoxOpen, setSuggestionBoxOpen] = useState(true);//THIS CONTOLS THE CSS THAT DETERMINES WHEATHER OR NOT THE SUGGESTION BOX IS OPEN
    const [value, setValue] = useState('');//THIS CONTROLLS THE TEXT THE USER TYPES IN THE SEARCH BOX 
    const [hostelsFound, setHostelsFound] = useState(true);//THIS CONTROLS THE not found image AND text
    const [loading, setLoading] = useState(true);//THIS CONTROLS THE CSS LOADING STATE
    const [filterMenu, setFilterMenu] = useState(false)// THIS CONTROLS THE FILTER MENU OPEN AND CLOSE
    //THESE CONTROLS THE COLOR OF THE BACKGROUND OF THE TEXT WHEN IT IS CLICKED
    const [allActive, setAllActive] = useState(true)
    const [boysActive, setBoysActive] = useState(false)
    const [girlsActive, setGirlsActive] = useState(false)
    const [mixedActive, setMixedActive] = useState(false)
    const [underActive, setUnderActive] = useState(false)

    //console.log(hostelsCardData)
    useEffect(() => {
        if (hostelsCardData.length > 0) {
            setLoading(false)
        }
    }, [hostelsCardData])

    //const filterMenu = useRef(null) //THIS WILL SELECT THE filter menu 




    //THIS IS FOR THE FILTER MENU
    function openFilterMenu() {
        setFilterMenu(true)
    }
    function closeFilterMenu() {
        setFilterMenu(false)
    }
    //WITH THIS IF ANY PART OF THE DOCUMENT IS CLICKED WHICH IS NOT THE filter OR filter-image IT WILL CLOSE THE FILTER MENU
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.filter') && !event.target.closest('.main-filter')) {
                setFilterMenu(false)
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    function filterHostelsByGender(parameter) {
        setGenderText(parameter)//THIS WILL CHANGE THE TEXT IN THE search button
        setGender(parameter);//THIS WILL PUT THE CLCIKED GENDER INTO THE gender VARIABLE 
    }

    function userMinPrice(event) {
        setMinPrice(event.target.value)
    }
    function userMaxPrice(event) {
        setMaxPrice(event.target.value)
    }
    function searchHostels() {
        setHostelsFound(true)
        if (!gender && !minPrice && !maxPrice) {
            setFilterMenu(false)
            return;
        }


        let userMinPrice = minPrice === '' ? 0 : Number(minPrice);

        let userMaxPrice = maxPrice === '' ? 0 : Number(maxPrice);

        //THIW WILL INTERCHANGE THE VALUES WHEN THE MIN PRICE IS GREATOR THAN THE MAX PRICE
        if (userMaxPrice < userMinPrice) {
            [userMinPrice, userMaxPrice] = [userMaxPrice, userMinPrice]
        }

        //THIS FILTERS FROM THE originalHostelCardData AND PUTS THE VALUES INTO THE 
        //filteredHostels, THEN THE sethostelsCardData RESETS THE  hostelsCardData TO THE FILTERED
        //VALUES.
        // THE MAIN IDEA HERE IS , originalHostelCardData AND hostelsCardData HAS THE SAME VALUES AT THE START
        //OF THE PROGRAM, BUT hostelsCardData WILL ALWAYS CHANGE DEPENDING ON THE FILTER USED.
        //BUT THE FILTER WILL ALWAYS FILTER FROM THE UNCHANGING originalHostelCardData
        if (gender && userMinPrice && userMaxPrice) {
            const filteredHostels = originalHostelCardData.filter(
                (hostel) => hostel.type === gender && hostel.pricing.priceMin >= userMinPrice && hostel.pricing.priceMin <= userMaxPrice
            )
            sethostelsCardData(filteredHostels);
            setFilterMenu(false)
        } else if (gender || userMinPrice || userMaxPrice) {
            const filteredHostels = originalHostelCardData.filter(
                (hostel) => hostel.type === gender || hostel.pricing.priceMin >= userMinPrice && hostel.pricing.priceMin <= userMaxPrice
            )
            if (filteredHostels.length === 0) {
                sethostelsCardData([])//THIS WILL EMPTY ANY VALUE IN hostelsCardData
                setHostelsFound(false)//AND THIS WILL DISPLAY THE NOT FOUND TEXT
                setFilterMenu(false)
            } else {
                sethostelsCardData(filteredHostels);
                setFilterMenu(false)
            }

        }

        //THIS RESET THE VALUES ON THE USER SCREEN
        setMinPrice('');
        setMaxPrice('');
        setGender();
        setGenderText('Search');
        //THIS IS A MORE EIFFICIENT CODE TO REPLACE THE ONE ABOVE BUT I DONT UNDERSTAND IT YET SO ITS COMMENTED
        // const filteredData = originalHostelCardData.filter(hostel => 
        //     selectedGender ? hostel.type === selectedGender : true)
        // sethostelsCardData(filteredHostels);
        // filterMenu.current.style.opacity = 0;
        // filterMenu.current.style.pointerEvents = 'none';
    }
    function resetValues() {
        setMinPrice('');
        setMaxPrice('');
        setGender('');
        setGenderText('Search')
        sethostelsCardData(originalHostelCardData);
        setHostelsFound(true)
    }






    //THIS IS FOR THE SUGGESTIONBOX AND SEARCH BAR
    function userSearchedHostelName(event) {
        setSuggestionBoxOpen(true)
        setValue(event.target.value)//THIS MAKES SURE THAT AS THE USER TYPES THE TEXT IS DISPLAYED ON THE THE SEARCH INPUT
        //.trim() removes leading/trailing spaces. 
        // .replace(/\s+/g, "",) collapses multiple spaces into NONE. 
        // .toLowerCase() normalizes casing.
        const typedtext = event.target.value
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();


        //THIS CODE FIRST RUNS THE typedtext TO SEE IF ANY OF THE HOSTEL NAME CONTAINS THE LETTER OR SEQUENCE OF LETTERS
        //THE IF THE typedtext LENGTH IS ZERO IT JUST HIDES THE SUGGESTION BOX, IF NOT IS SHOWS IT
        let filtered = originalHostelCardData.filter(
            hostel => hostel.name.toLowerCase().includes(typedtext)
        )
        setSearchHostelName(typedtext);//THIS IS THE USERS HOSTEL NAME HE TYPES
        setFilter(filtered)//THIS IS THE COLLECTION OF THE HOSTELS THAT FIT THE filter CRITIRIA
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.suggestions-dropdown')) {
                setSuggestionBoxOpen(false)
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    //THIS FUNCTION TAKES THE HOSTEL NAME AS A PARAMETER, IT THE FILTERS THE HOSTEL IN THE originalHostelCardData
    //TO SEE IF ANY HOSTEL NAME MATCH IF IT DOES THEN IT sethostelsCardData TO THAT HOSTEL OBJECT
    function suggestionHostelClicked(parameter) {
        setHostelsFound(true)
        setSuggestionBoxOpen(false)
        setValue(parameter)

        //suggestionsDiv.current.style.display = 'none';
        const filteredHostel = originalHostelCardData.filter(
            (hostel) => hostel.name.trim().replace(/\s+/g, "").toLowerCase() === parameter.trim().replace(/\s+/g, "").toLowerCase()
        )
        sethostelsCardData(filteredHostel);
    }

    function searchHostelByName() {
        setHostelsFound(true)
        //THIS WILL MAKE SURE NOTHING HAPPENS WHEN THE USER PREESES 
        // THE SEARCH BUTTON WHEN THERE IS NOTHING IN THE SEARCH INPUT
        if (!searchHostelName) {
            return;
        }
        let filteredHostels = false
        filteredHostels = originalHostelCardData.filter(
            //(hostel) => hostel.name.trim().replace(/\s+/g, "").toLowerCase() === searchHostelName.replace(/\s+/g, "")
            (hostel) => hostel.name.trim().replace(/\s+/g, "").toLowerCase().includes(searchHostelName.replace(/\s+/g, ""))
        )

        if (filteredHostels.length === 0) {
            sethostelsCardData([])//THIS WILL EMPTY ANY VALUE IN hostelsCardData
            setHostelsFound(false)//AND THIS WILL DISPLAY THE NOT FOUND TEXT
        } else {
            sethostelsCardData(filteredHostels);
        }
    }



    //THIS IS FOR THE CHANGING HOSTEL TEXTS
    // All sentences to cycle through
    const SENTENCES = [
        "ALWAYS UP-TO-DATE LISTINGS",
        "OVER 100 HOSTELS LISTED",
        "FIND YOUR PERFECT STAY",
        "COMPARE HOSTELS INSTANTLY",
        "BROWSE HOSTELS FROM HOME",
        "BOOK WITH CONFIDENCE",
        "REAL REVIEWS, REAL STAYS",
        "FILTER BY PRICE & LOCATION",
        "NEW HOSTELS ADDED DAILY",
        "STUDENT-FRIENDLY OPTIONS",
        "SAFE & VERIFIED HOSTELS",
        "AFFORDABLE STAYS NEAR YOU",
        "NO HIDDEN FEES",
        "YOUR NEXT HOME AWAITS",
        "EXPLORE. COMPARE. BOOK.",
    ];

    const [text, setText] = useState("");

    useEffect(() => {
        let sentenceIndex = 0; // Tracks which sentence we're currently typing
        let charIndex = 0;     // Tracks how many characters have been revealed
        let timeoutId;         // Stores the active timeout so we can cancel it on cleanup

        const type = () => {
            const current = SENTENCES[sentenceIndex];

            // Reveal one more character of the current sentence
            charIndex++;
            setText(current.slice(0, charIndex));

            if (charIndex < current.length) {
                // Sentence not finished yet — schedule the next character in 200ms
                timeoutId = setTimeout(type, 100);
            } else {
                // Sentence fully typed — pause for 1500ms, then clear and move to next
                timeoutId = setTimeout(() => {
                    setText("");                                          // Clear the displayed text
                    charIndex = 0;                                        // Reset character position
                    sentenceIndex = (sentenceIndex + 1) % SENTENCES.length; // Advance to next sentence, looping back to 0 after the last
                    timeoutId = setTimeout(type, 300); // Brief pause before starting to type the next sentence
                }, 1500);
            }
        };

        // Small initial delay before the first sentence starts typing
        timeoutId = setTimeout(type, 300);

        // Cleanup: cancel any pending timeout when the component unmounts
        return () => clearTimeout(timeoutId);
    }, []);




    


    function handleFilterSelection(parameter) {
        if (parameter === 'allActive') {
            setHostelsFound(true)
            sethostelsCardData(originalHostelCardData)
            setAllActive(true)
            setBoysActive(false)
            setGirlsActive(false)
            setUnderActive(false)
            setMixedActive(false)
        } else if (parameter === 'boysActive') {
            setHostelsFound(true)
            const filteredHostels = originalHostelCardData.filter(
                (hostel) => hostel.type === 'Boys'
            )
            if (filteredHostels.length === 0) {
                sethostelsCardData([])//THIS WILL EMPTY ANY VALUE IN hostelsCardData
                setHostelsFound(false)//AND THIS WILL DISPLAY THE NOT FOUND TEXT
            } else {
                sethostelsCardData(filteredHostels)
            }
            setBoysActive(true)
            setGirlsActive(false)
            setUnderActive(false)
            setAllActive(false)
            setMixedActive(false)
        }
        else if (parameter === 'girlsActive') {
            setHostelsFound(true)
            const filteredHostels = originalHostelCardData.filter(
                (hostel) => hostel.type === 'Girls'
            )
            if (filteredHostels.length === 0) {
                sethostelsCardData([])//THIS WILL EMPTY ANY VALUE IN hostelsCardData
                setHostelsFound(false)//AND THIS WILL DISPLAY THE NOT FOUND TEXT
            } else {
                sethostelsCardData(filteredHostels)
            }
            setGirlsActive(true)
            setBoysActive(false)
            setUnderActive(false)
            setAllActive(false)
            setMixedActive(false)
        } else if (parameter === 'mixedActive') {
            setHostelsFound(true)
            const filteredHostels = originalHostelCardData.filter(
                (hostel) => hostel.type === 'Mixed'
            )
            if (filteredHostels.length === 0) {
                sethostelsCardData([])//THIS WILL EMPTY ANY VALUE IN hostelsCardData
                setHostelsFound(false)//AND THIS WILL DISPLAY THE NOT FOUND TEXT
            } else {
                sethostelsCardData(filteredHostels)
            }
            setMixedActive(true)
            setBoysActive(false)
            setGirlsActive(false)
            setUnderActive(false)
            setAllActive(false)
        } else if (parameter === 'underActive') {
            setHostelsFound(true)
            setUnderActive(true)
            setBoysActive(false)
            setGirlsActive(false)
            setMixedActive(false)
            setAllActive(false)
            const filteredHostels = originalHostelCardData.filter(
                (hostel) => hostel.pricing.priceMin <= 2500
            )
            if (filteredHostels.length === 0) {
                sethostelsCardData([])//THIS WILL EMPTY ANY VALUE IN hostelsCardData
                setHostelsFound(false)//AND THIS WILL DISPLAY THE NOT FOUND TEXT
            } else {
                sethostelsCardData(filteredHostels)
            }
        }
    }

    return (
        <>
            {/* <PageHeader navlink={navlink} setNavLink={setNavLink} sethostelsCardData={sethostelsCardData} originalHostelCardData={originalHostelCardData} setHostelsFound={setHostelsFound} /> */}

            {/* <div className="side-bar-buttons-container">
                <button className="filter-image" onClick={openFilterMenu}><img src={filterImage}></img>Filter</button>
                <button><img src={favoriteImage}></img>Fav</button>
            </div> */}
            
            <section>
                <div className={`filter ${filterMenu ? 'open' : 'close'}`}>
                    <div className="filter-close-button js-close-button" onClick={closeFilterMenu}>
                        <img className="filter-close-image" src={closeFilterImage}></img>
                    </div>
                    <div className="filter-by-items js-filter">
                        <h3 className="filter-header">By Gender</h3>
                        <div className="gender-buttons">
                            <button className="gender-button male-gender-button" onClick={() => filterHostelsByGender('Boys')}>
                                <img className="male-filter-icon" src={boyImage}></img>Boys
                            </button>
                            <button className="gender-button female-gender-button" data-gender-name="Girls" onClick={() => filterHostelsByGender('Girls')}>
                                <img className="female-filter-icon" src={girlImage}></img>Girls
                            </button>
                            <button className="gender-button mixed-gender-button" data-gender-name="Mixed" onClick={() => filterHostelsByGender('Mixed')}>
                                <img className="mixed-filter-icon" src={mixedImage}></img>
                                <p id="mixed-text">Mixed</p>
                            </button>
                        </div>

                        <div className="price-filter">
                            <h3 className="filter-header">By Price</h3>
                            <div className="price-input-container">
                                <input
                                    type="number"
                                    name="user-min-price"
                                    id="user-min-price"
                                    min="0" max="20000"
                                    className="price-input js-min-price-input"
                                    placeholder="Minimum Price"
                                    onChange={userMinPrice}
                                    value={minPrice}>
                                </input>
                                <input
                                    type="number"
                                    name="user-max-price"
                                    id="user-max-price"
                                    min="0" max="20000"
                                    className="price-input js-max-price-input"
                                    placeholder="Maximum Price"
                                    onChange={userMaxPrice}
                                    value={maxPrice}>
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className="filter-search-box-container">
                        <div className="filter-search-box js-search-box" onClick={searchHostels}>
                            <p className="filter-search-box-text js-search-box-text">{genderText}</p>
                            <img className="filter-search-icon" src={searchButton}></img>
                        </div>
                        <div className="filter-search-box js-search-box" onClick={resetValues}>
                            <p className="filter-search-box-text js-search-box-text">Reset</p>
                            <img className="filter-search-icon" src={resetImage}></img>
                        </div>
                    </div>
                </div>
            </section>

            <section className="search-box-container">
                <div className="episilion-hostels-changing-texts">
                    <h1 className="changing-texts">{text}</h1>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        name="search-box"
                        id="search-box-text"
                        placeholder="Search Hostel By Name"
                        list="Hostels"
                        onChange={userSearchedHostelName}
                        value={value}
                    >
                    </input>
                    <img className="search-icon" src={searchButton} onClick={searchHostelByName}></img>
                    <div id="suggestions" className={`suggestions-dropdown ${!suggestionBoxOpen ? 'close' : ''}`}>
                        {
                            value ? filter.map((hostel) => {
                                return (
                                    <div className="suggestion-item" onClick={() => suggestionHostelClicked(hostel.name)}>{hostel.name}</div>
                                )
                            }) : ''
                        }


                    </div>
                </div>
            </section>

            <div className={`loader-container ${loading ? 'open' : 'close'}`}>
                <div className="loading-animation-conatainer">
                    <div className="loader"></div>
                </div>

                <p className="loading-hostels-text">Loading Hostels...</p>
            </div>

            <div className={`filter-horizontal-bar js-filters-container ${loading ? 'inactive' : ''}`}>
                <div className={`filter-buttons main-filter`} onClick={openFilterMenu}>
                    <div className="filter-button " >
                        <img src={filterImage} alt="" className="filter-button-image" />
                        <p>Filter</p>
                    </div>
                </div>
                <div className={`filter-buttons ${allActive ? 'active' : 'inactive'}`} onClick={() => handleFilterSelection('allActive')} >All</div>
                <div className={`filter-buttons ${girlsActive ? 'active' : 'inactive'}`} onClick={() => handleFilterSelection('girlsActive')} >Girls</div>
                <div className={`filter-buttons ${boysActive ? 'active' : 'inactive'}`} onClick={() => handleFilterSelection('boysActive')} >Boys</div>
                <div className={`filter-buttons ${mixedActive ? 'active' : 'inactive'}`} onClick={() => handleFilterSelection('mixedActive')} >Mixed</div>
                <div className={`filter-buttons ${underActive ? 'active' : 'inactive'}`} onClick={() => handleFilterSelection('underActive')} >{'<'}$2500</div>
            </div>

            <section className="hostels-section">
                {hostelsFound ? "" :
                    <div className="no-results">
                        <p className="not-found-text">No Hostel Found<span className="not-found-hostel-name"></span></p>
                        <img src={noResultImage} className="not-found-icon" alt="Sort"></img>
                    </div>
                }
                <div className="hostels-cards js-hostel-cards">
                    {hostelsCardData.map((hostel) => {
                        return (
                            <HostelCard key={hostel.id} hostel={hostel} />
                        )
                    })}
                </div>
            </section>
            <SiteFooter />

        </>
    )
}








/**{hostelsCardData.map((hostel, index) => (
                        <motion.div
                            key={hostel.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <HostelCard hostel={hostel} />
                        </motion.div>
                    ))} */