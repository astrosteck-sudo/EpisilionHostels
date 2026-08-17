import { PageHeader } from "../PageHeader/PageHeader.jsx";
import { HostelCard } from "./HostelCard.jsx";
import "./HomePage.css";
//import filterImage from "../assets/icons/filter4.png";
import closeFilterImage from "../assets/icons/close.png";
import boyImage from "../assets/icons/man.png";
import girlImage from "../assets/icons/woman-avatar.png";
import mixedImage from "../assets/icons/shuffle.png";
import searchButton from "../assets/icons/search.png";
import resetImage from "../assets/icons/refresh.png";
import { useEffect, useState } from "react";
//import { all } from "axios";
import { Helmet } from "react-helmet-async";

export function HomePage({
  hostelsCardData,
  sethostelsCardData,
  originalHostelCardData,
}) {
  const [gender, setGender] = useState(""); //THIS CONTROLS THE GENDER OT BE USED IN THE FILTERING PROCESS
  const [genderText, setGenderText] = useState("Search"); // THIS CONTROLS THE D=GENDER SHOWN IN THE SEARCH BUTTON IN THE FILTER MENUI
  const [minPrice, setMinPrice] = useState(""); //THIS CONTROLS THE MIN PRICE IN THE FILTER
  const [maxPrice, setMaxPrice] = useState(""); //THIS CONTROLS THE MAX PRICE IN THE FILTER
  const [searchHostelName, setSearchHostelName] = useState(""); //THIS CONTROLS THE HOSTEL NAME TYPE SBY THE USER WHICH WILL BE USED IN THE searchHostelByName FUNCTION
  const [filter, setFilter] = useState([]); //THIS CONTROLS THE HOSTELS THAT PASSED THE CRITIRIA OF THE filter
  const [suggestionBoxOpen, setSuggestionBoxOpen] = useState(false); //THIS CONTOLS THE CSS THAT DETERMINES WHEATHER OR NOT THE SUGGESTION BOX IS OPEN
  const [value, setValue] = useState(""); //THIS CONTROLLS THE TEXT THE USER TYPES IN THE SEARCH BOX
  const [hostelsFound, setHostelsFound] = useState(true); //THIS CONTROLS THE not found image AND text

  const [filterMenu, setFilterMenu] = useState(false); // THIS CONTROLS THE FILTER MENU OPEN AND CLOSE
  //THESE CONTROLS THE COLOR OF THE BACKGROUND OF THE TEXT WHEN IT IS CLICKED
  const [allActive, setAllActive] = useState(true);
  const [boysActive, setBoysActive] = useState(false);
  const [girlsActive, setGirlsActive] = useState(false);
  const [mixedActive, setMixedActive] = useState(false);
  const [underActive, setUnderActive] = useState(false);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  //console.log(hostelsCardData)

  //const filterMenu = useRef(null) //THIS WILL SELECT THE filter menu

  //THIS IS FOR THE FILTER MENU
  // function openFilterMenu() {
  //   setFilterMenu(true);
  // }
  function closeFilterMenu() {
    setFilterMenu(false);
  }
  //WITH THIS IF ANY PART OF THE DOCUMENT IS CLICKED WHICH IS NOT THE filter OR filter-image IT WILL CLOSE THE FILTER MENU
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".filter") &&
        !event.target.closest(".main-filter")
      ) {
        setFilterMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function filterHostelsByGender(parameter) {
    setGenderText(parameter); //THIS WILL CHANGE THE TEXT IN THE search button
    setGender(parameter); //THIS WILL PUT THE CLCIKED GENDER INTO THE gender VARIABLE
  }

  function userMinPrice(event) {
    setMinPrice(event.target.value);
  }
  function userMaxPrice(event) {
    setMaxPrice(event.target.value);
  }
  function searchHostels() {
    setHostelsFound(true);
    if (!gender && !minPrice && !maxPrice) {
      setFilterMenu(false);
      return;
    }

    let userMinPrice = minPrice === "" ? 0 : Number(minPrice);

    let userMaxPrice = maxPrice === "" ? 0 : Number(maxPrice);

    //THIW WILL INTERCHANGE THE VALUES WHEN THE MIN PRICE IS GREATOR THAN THE MAX PRICE
    if (userMaxPrice < userMinPrice) {
      [userMinPrice, userMaxPrice] = [userMaxPrice, userMinPrice];
    }

    //THIS FILTERS FROM THE originalHostelCardData AND PUTS THE VALUES INTO THE
    //filteredHostels, THEN THE sethostelsCardData RESETS THE  hostelsCardData TO THE FILTERED
    //VALUES.
    // THE MAIN IDEA HERE IS , originalHostelCardData AND hostelsCardData HAS THE SAME VALUES AT THE START
    //OF THE PROGRAM, BUT hostelsCardData WILL ALWAYS CHANGE DEPENDING ON THE FILTER USED.
    //BUT THE FILTER WILL ALWAYS FILTER FROM THE UNCHANGING originalHostelCardData
    if (gender && userMinPrice && userMaxPrice) {
      const filteredHostels = originalHostelCardData?.filter(
        (hostel) =>
          hostel.type === gender &&
          hostel.pricing.priceMin >= userMinPrice &&
          hostel.pricing.priceMin <= userMaxPrice,
      );
      sethostelsCardData(filteredHostels);
      setFilterMenu(false);
    } else if (gender || userMinPrice || userMaxPrice) {
      const filteredHostels = originalHostelCardData?.filter(
        (hostel) =>
          hostel.type === gender ||
          (hostel.pricing.priceMin >= userMinPrice &&
            hostel.pricing.priceMin <= userMaxPrice),
      );
      if (filteredHostels.length === 0) {
        sethostelsCardData([]); //THIS WILL EMPTY ANY VALUE IN hostelsCardData
        setHostelsFound(false); //AND THIS WILL DISPLAY THE NOT FOUND TEXT
        setFilterMenu(false);
      } else {
        sethostelsCardData(filteredHostels);
        setFilterMenu(false);
      }
    }

    //THIS RESET THE VALUES ON THE USER SCREEN
    setMinPrice("");
    setMaxPrice("");
    setGender("");
    setGenderText("Search");
    //THIS IS A MORE EIFFICIENT CODE TO REPLACE THE ONE ABOVE BUT I DONT UNDERSTAND IT YET SO ITS COMMENTED
    // const filteredData = originalHostelCardData.filter(hostel =>
    //     selectedGender ? hostel.type === selectedGender : true)
    // sethostelsCardData(filteredHostels);
    // filterMenu.current.style.opacity = 0;
    // filterMenu.current.style.pointerEvents = 'none';
  }
  function resetValues() {
    setMinPrice("");
    setMaxPrice("");
    setGender("");
    setGenderText("Search");
    sethostelsCardData(originalHostelCardData);
    setHostelsFound(true);
  }

  //THIS IS FOR THE SUGGESTIONBOX AND SEARCH BAR
  function userSearchedHostelName(event) {
    setSuggestionBoxOpen(true);
    setValue(event.target.value); //THIS MAKES SURE THAT AS THE USER TYPES THE TEXT IS DISPLAYED ON THE THE SEARCH INPUT
    //.trim() removes leading/trailing spaces.
    // .replace(/\s+/g, "",) collapses multiple spaces into NONE.
    // .toLowerCase() normalizes casing.
    const typedtext = event.target.value
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

    //THIS CODE FIRST RUNS THE typedtext TO SEE IF ANY OF THE HOSTEL NAME CONTAINS THE LETTER OR SEQUENCE OF LETTERS
    //THE IF THE typedtext LENGTH IS ZERO IT JUST HIDES THE SUGGESTION BOX, IF NOT IS SHOWS IT
    let filtered = originalHostelCardData?.filter((hostel) =>
      hostel.name.toLowerCase().includes(typedtext),
    );
    setSearchHostelName(typedtext); //THIS IS THE USERS HOSTEL NAME HE TYPES
    setFilter(filtered); //THIS IS THE COLLECTION OF THE HOSTELS THAT FIT THE filter CRITIRIA
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".suggestions-dropdown")) {
        setSuggestionBoxOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //THIS FUNCTION TAKES THE HOSTEL NAME AS A PARAMETER, IT THE FILTERS THE HOSTEL IN THE originalHostelCardData
  //TO SEE IF ANY HOSTEL NAME MATCH IF IT DOES THEN IT sethostelsCardData TO THAT HOSTEL OBJECT
  function suggestionHostelClicked(parameter) {
    setHostelsFound(true);
    setSuggestionBoxOpen(false);
    setValue(parameter);

    //suggestionsDiv.current.style.display = 'none';
    const filteredHostel = originalHostelCardData?.filter(
      (hostel) =>
        hostel.name.trim().replace(/\s+/g, "").toLowerCase() ===
        parameter.trim().replace(/\s+/g, "").toLowerCase(),
    );
    sethostelsCardData(filteredHostel);
  }

  function searchHostelByName() {
    setHostelsFound(true);
    //THIS WILL MAKE SURE NOTHING HAPPENS WHEN THE USER PREESES
    // THE SEARCH BUTTON WHEN THERE IS NOTHING IN THE SEARCH INPUT
    if (!searchHostelName) {
      return;
    }
    let filteredHostels = false;
    filteredHostels = originalHostelCardData?.filter(
      //(hostel) => hostel.name.trim().replace(/\s+/g, "").toLowerCase() === searchHostelName.replace(/\s+/g, "")
      (hostel) =>
        hostel.name
          .trim()
          .replace(/\s+/g, "")
          .toLowerCase()
          .includes(searchHostelName.replace(/\s+/g, "")),
    );

    if (filteredHostels.length === 0) {
      sethostelsCardData([]); //THIS WILL EMPTY ANY VALUE IN hostelsCardData
      setHostelsFound(false); //AND THIS WILL DISPLAY THE NOT FOUND TEXT
    } else {
      sethostelsCardData(filteredHostels);
    }
  }

  function handleFilterSelection(parameter) {
    if (parameter === "allActive") {
      setHostelsFound(true);
      sethostelsCardData(originalHostelCardData);
      setAllActive(true);
      setBoysActive(false);
      setGirlsActive(false);
      setUnderActive(false);
      setMixedActive(false);
    } else if (parameter === "boysActive") {
      setHostelsFound(true);
      const filteredHostels = originalHostelCardData?.filter(
        (hostel) => hostel.type === "Boys",
      );
      if (filteredHostels.length === 0) {
        sethostelsCardData([]); //THIS WILL EMPTY ANY VALUE IN hostelsCardData
        setHostelsFound(false); //AND THIS WILL DISPLAY THE NOT FOUND TEXT
      } else {
        sethostelsCardData(filteredHostels);
      }
      setBoysActive(true);
      setGirlsActive(false);
      setUnderActive(false);
      setAllActive(false);
      setMixedActive(false);
    } else if (parameter === "girlsActive") {
      setHostelsFound(true);
      const filteredHostels = originalHostelCardData?.filter(
        (hostel) => hostel.type === "Girls",
      );
      if (filteredHostels.length === 0) {
        sethostelsCardData([]); //THIS WILL EMPTY ANY VALUE IN hostelsCardData
        setHostelsFound(false); //AND THIS WILL DISPLAY THE NOT FOUND TEXT
      } else {
        sethostelsCardData(filteredHostels);
      }
      setGirlsActive(true);
      setBoysActive(false);
      setUnderActive(false);
      setAllActive(false);
      setMixedActive(false);
    } else if (parameter === "mixedActive") {
      setHostelsFound(true);
      const filteredHostels = originalHostelCardData?.filter(
        (hostel) => hostel.type === "Mixed",
      );
      if (filteredHostels.length === 0) {
        sethostelsCardData([]); //THIS WILL EMPTY ANY VALUE IN hostelsCardData
        setHostelsFound(false); //AND THIS WILL DISPLAY THE NOT FOUND TEXT
      } else {
        sethostelsCardData(filteredHostels);
      }
      setMixedActive(true);
      setBoysActive(false);
      setGirlsActive(false);
      setUnderActive(false);
      setAllActive(false);
    } else if (parameter === "underActive") {
      setHostelsFound(true);
      setUnderActive(true);
      setBoysActive(false);
      setGirlsActive(false);
      setMixedActive(false);
      setAllActive(false);
      const filteredHostels = originalHostelCardData?.filter(
        (hostel) => hostel.pricing.priceMin <= 2500,
      );
      if (filteredHostels.length === 0) {
        sethostelsCardData([]); //THIS WILL EMPTY ANY VALUE IN hostelsCardData
        setHostelsFound(false); //AND THIS WILL DISPLAY THE NOT FOUND TEXT
      } else {
        sethostelsCardData(filteredHostels);
      }
    }
  }
  //console.log(originalHostelCardData);

  return (
    <>
      {/* <PageHeader navlink={navlink} setNavLink={setNavLink} sethostelsCardData={sethostelsCardData} originalHostelCardData={originalHostelCardData} setHostelsFound={setHostelsFound} /> */}

      {/* <div className="side-bar-buttons-container">
                <button className="filter-image" onClick={openFilterMenu}><img loading='lazy'src={filterImage}></img>Filter</button>
                <button><img loading='lazy'src={favoriteImage}></img>Fav</button>
            </div> */}

      <Helmet>
        <title>
          Hostels Near UPSA | Book Verified Student Hostels Online – Episilion
          Hostels
        </title>

        <link rel="canonical" href="https://www.episilionhostels.com/" />

        <meta
          name="description"
          content="Find and book verified student hostels near UPSA (University of Professional Studies, Accra). Compare prices, room types, and amenities, read real reviews, and pay securely with Mobile Money or Paystack — no site visits required."
        />

        <meta
          name="keywords"
          content="hostels near UPSA, UPSA hostel booking, UPSA freshers hostel, UPSA fresher accommodation, affordable hostels near UPSA, cheap hostels near UPSA, best hostels for UPSA students, hostels near UPSA for girls, hostels near UPSA for boys, mixed hostels near UPSA, UPSA off-campus hostels, UPSA hostel prices, UPSA hostel registration, student hostels Madina, student hostels Legon Road, student hostels Accra, hostel booking Ghana, verified student housing Ghana, how to find a hostel at UPSA, self-contained hostel near UPSA, UPSA accommodation for new students"
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Episilion Hostels" />
        <meta
          property="og:title"
          content="Hostels Near UPSA | Episilion Hostels"
        />
        <meta
          property="og:description"
          content="Browse and book verified student hostels near UPSA. Compare prices, amenities, and locations — secure payments, real reviews, direct manager contact."
        />
        <meta property="og:url" content="https://www.episilionhostels.com/" />
        <meta
          property="og:image"
          content="https://www.episilionhostels.com/og-image.jpg"
        />
        <meta property="og:locale" content="en_GH" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Hostels Near UPSA | Episilion Hostels"
        />
        <meta
          name="twitter:description"
          content="Find and book verified student hostels near UPSA — compare prices, amenities, and pay securely online."
        />
        <meta
          name="twitter:image"
          content="https://www.episilionhostels.com/og-image.jpg"
        />

        {/* WebSite + SearchAction JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Episilion Hostels",
            url: "https://www.episilionhostels.com/",
            description:
              "Book verified student hostels near UPSA. Compare prices, amenities, and locations, and pay securely with Mobile Money or Paystack.",
          })}
        </script>

        {/* Organization JSON-LD - builds brand entity recognition */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Episilion Hostels",
            url: "https://www.episilionhostels.com/",
            logo: "https://www.episilionhostels.com/logo.png",
            description:
              "A platform for finding and booking verified student hostels near UPSA, Accra.",
            areaServed: {
              "@type": "City",
              name: "Accra",
            },
          })}
        </script>
      </Helmet>

      <section>
        <div className={`filter ${filterMenu ? "open" : "close"}`}>
          <div
            className="filter-close-button js-close-button"
            onClick={closeFilterMenu}
          >
            <img
              loading="lazy"
              className="filter-close-image"
              src={closeFilterImage}
            ></img>
          </div>
          <div className="filter-by-items js-filter">
            <h3 className="filter-header">By Gender</h3>
            <div className="gender-buttons">
              <button
                className="gender-button male-gender-button"
                onClick={() => filterHostelsByGender("Boys")}
              >
                <img
                  loading="lazy"
                  className="male-filter-icon"
                  src={boyImage}
                ></img>
                Boys
              </button>
              <button
                className="gender-button female-gender-button"
                data-gender-name="Girls"
                onClick={() => filterHostelsByGender("Girls")}
              >
                <img
                  loading="lazy"
                  className="female-filter-icon"
                  src={girlImage}
                ></img>
                Girls
              </button>
              <button
                className="gender-button mixed-gender-button"
                data-gender-name="Mixed"
                onClick={() => filterHostelsByGender("Mixed")}
              >
                <img
                  loading="lazy"
                  className="mixed-filter-icon"
                  src={mixedImage}
                ></img>
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
                  min="0"
                  max="20000"
                  className="price-input js-min-price-input"
                  placeholder="Minimum Price"
                  onChange={userMinPrice}
                  value={minPrice}
                ></input>
                <input
                  type="number"
                  name="user-max-price"
                  id="user-max-price"
                  min="0"
                  max="20000"
                  className="price-input js-max-price-input"
                  placeholder="Maximum Price"
                  onChange={userMaxPrice}
                  value={maxPrice}
                ></input>
              </div>
            </div>
          </div>
          <div className="filter-search-box-container">
            <div
              className="filter-search-box js-search-box"
              onClick={searchHostels}
            >
              <p className="filter-search-box-text js-search-box-text">
                {genderText}
              </p>
              <img
                loading="lazy"
                className="filter-search-icon"
                src={searchButton}
              ></img>
            </div>
            <div
              className="filter-search-box js-search-box"
              onClick={resetValues}
            >
              <p className="filter-search-box-text js-search-box-text">Reset</p>
              <img
                loading="lazy"
                className="filter-search-icon"
                src={resetImage}
              ></img>
            </div>
          </div>
        </div>
      </section>

      <section className="search-box-container">
        <div className="intro-text-container">
          <div className="verified-hostel-number">
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <circle cx="12" cy="12" r="11" fill="" />

              <path
                d="M12 5.5s3.5-1 6-0.5v5c0 4-3.5 7-6 8.5-2.5-1.5-6-4.5-6-8.5v-5c2.5-0.5 6 0.5 6 0.5z"
                fill="#FFFFFF"
              />

              <path
                d="M9.5 12l1.5 1.5 3.5-3.5"
                fill="none"
                stroke="#003311"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p>Over 10+ Verified Hostels</p>
          </div>

          <p className="intro-text-one">
            Find Comfortable,
            <span className="affodable-and-safe-text">Affordable & Safe </span>
            Hostels Near You
          </p>

          <p className="intro-text-two">
            Discover verified, student-friendly accommodations that match your
            lifestyle and budget. Your home away from home starts here.
          </p>

          <div className="search-box">
            <input
              type="text"
              name="search-box"
              id="search-box-text"
              placeholder="Search hostel by name"
              list="Hostels"
              onChange={userSearchedHostelName}
              value={value}
            ></input>

            <div className="search-button">
              <svg
                xmlns="http://w3.org"
                viewBox="0 0 24 24"
                width="70%"
                height="70%"
                onClick={searchHostelByName}
              >
                <circle cx="12" cy="12" r="11" fill="#1E8234" />

                <g
                  stroke="#EBF7F2"
                  stroke-width="1"
                  stroke-linecap="round"
                  fill="none"
                >
                  <circle cx="11.5" cy="11.5" r="4" />

                  <line x1="14.5" y1="14.5" x2="17.5" x2="17.5" y2="17.5" />
                </g>
              </svg>
            </div>
          </div>

          <div className={`filter-horizontal-bar`}>
            {/* <div
              className={`filter-buttons main-filter`}
              onClick={openFilterMenu}
            >
              <div className="filter-button ">
                <img
                  loading="lazy"
                  src={filterImage}
                  alt=""
                  className="filter-button-image"
                />
                <p>Filter</p>
              </div>
            </div> */}
            <div
              className={`filter-buttons ${allActive ? "active" : "inactive"}`}
              onClick={() => handleFilterSelection("allActive")}
            >
              All
            </div>
            <div
              className={`filter-buttons ${girlsActive ? "active" : "inactive"}`}
              onClick={() => handleFilterSelection("girlsActive")}
            >
              Girls
            </div>
            <div
              className={`filter-buttons ${boysActive ? "active" : "inactive"}`}
              onClick={() => handleFilterSelection("boysActive")}
            >
              Boys
            </div>
            <div
              className={`filter-buttons ${mixedActive ? "active" : "inactive"}`}
              onClick={() => handleFilterSelection("mixedActive")}
            >
              Mixed
            </div>
            <div
              className={`filter-buttons ${underActive ? "active" : "inactive"}`}
              onClick={() => handleFilterSelection("underActive")}
            >
              {"<"}$2500
            </div>
          </div>

          <div
            id="suggestions"
            className={`suggestions-dropdown ${!suggestionBoxOpen ? "close" : ""}`}
          >
            {value
              ? filter.map((hostel) => {
                  return (
                    <div
                      className="suggestion-item"
                      onClick={() => suggestionHostelClicked(hostel.name)}
                    >
                      {hostel.name}
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        {/* <div className="episilion-hostels-changing-texts">
          <h1 className="changing-texts">{text}</h1>
        </div> */}
      </section>

      <section className="hostels-section">
        {hostelsFound ? (
          ""
        ) : (
          <div className="no-results">
            <p className="not-found-text">No Hostel Found</p>
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 100 100"
              width="150"
              height="150"
            >
              <circle cx="50" cy="50" r="46" fill="#ffffff" />

              <g transform="translate(4, -2)">
                <circle
                  cx="42"
                  cy="42"
                  r="16"
                  fill="none"
                  stroke="#006644"
                  stroke-width="4.5"
                />

                <path
                  d="M38 38l8 8M46 38l-8 8"
                  stroke="#006644"
                  stroke-width="3"
                  stroke-linecap="round"
                  opacity="0.4"
                />

                <line
                  x1="54"
                  y1="54"
                  x2="68"
                  y2="68"
                  stroke="#006644"
                  stroke-width="5.5"
                  stroke-linecap="round"
                />
              </g>

              <line
                x1="28"
                y1="72"
                x2="48"
                y2="72"
                stroke="#006644"
                stroke-width="3"
                stroke-linecap="round"
                opacity="0.25"
              />
              <line
                x1="56"
                y1="72"
                x2="72"
                y2="72"
                stroke="#006644"
                stroke-width="3"
                stroke-linecap="round"
                opacity="0.25"
              />
            </svg>
          </div>
        )}
        <div className="hostels-cards js-hostel-cards">
          {hostelsCardData?.map((hostel) => {
            return <HostelCard key={hostel.id} hostel={hostel} />;
          })}
        </div>

        <section className="homepage-seo-content">
          <button
            className="learn-more-toggle"
            onClick={() => setLearnMoreOpen(!learnMoreOpen)}
            aria-expanded={learnMoreOpen}
          >
            <span>Learn more about hostels near UPSA</span>
            <span className={`learn-more-arrow ${learnMoreOpen ? "open" : ""}`}>
              ▾
            </span>
          </button>

          <div
            className={`learn-more-content ${learnMoreOpen ? "open" : "closed"}`}
          >
            <div className="homepage-intro-text">
              <h1>Find Verified Student Hostels Near UPSA</h1>
              <p>
                Starting fresh at the University of Professional Studies, Accra
                (UPSA)? Finding the right hostel is one of the most stressful
                parts of freshman year — Episilion Hostels makes it simple. We
                list verified, student-friendly hostels near UPSA's main campus,
                so you can compare prices, room types, amenities, and walking
                distance to campus, all in one place, before you commit to
                anything.
              </p>
              <p>
                Whether you're a UPSA fresher looking for an affordable hostel
                on a tight budget, a hostel with Wi-Fi and 24-hour security, or
                a self-contained room close to Madina and Legon Road, our
                listings cover a range of options for boys, girls, and mixed
                accommodation. Every hostel on Episilion Hostels is verified
                before it's listed, so new students moving to Accra for the
                first time can book with confidence instead of guessing from
                word of mouth.
              </p>
            </div>

            <div className={`homepage-how-it-works ${learnMoreOpen ? "open" : "closed"}`}>
              <h2>How Booking a Hostel Near UPSA Works</h2>
              <div className="how-it-works-steps">
                <div className="how-it-works-step">
                  <h3>1. Search</h3>
                  <p>
                    Filter hostels near UPSA by gender, price, and distance to
                    campus.
                  </p>
                </div>
                <div className="how-it-works-step">
                  <h3>2. Compare</h3>
                  <p>
                    Check amenities, room types, and real student reviews side
                    by side.
                  </p>
                </div>
                <div className="how-it-works-step">
                  <h3>3. Book</h3>
                  <p>
                    Reserve your room and pay securely with Mobile Money or
                    Paystack.
                  </p>
                </div>
                <div className="how-it-works-step">
                  <h3>4. Move In</h3>
                  <p>
                    Get direct contact details for your hostel manager and
                    settle in before semester begins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="more-hostels-container">
          <p>More Hostels on the way — stay tuned!</p>
        </div>
      </section>
    </>
  );
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
