import { Routes, Route, Navigate, useSearchParams } from "react-router";
import { HomePage } from "./HomePage/HomePage";
import { MoreDetailsPage } from "./MoreDetailsPage/MoreDetailsPage";
import { useState, useEffect } from "react";
import axios from "axios";
import { SignUpPage } from "./logins/SignUpPage.jsx";
import { LoginPage } from "./logins/loginPage.jsx";
import { AskEpisilionPage } from "./AskEpisilionPage/AskEpisilionPage.jsx";
import { AboutUsPage } from "./AboutUs/AboutUsPage.jsx";
import { MoreFromUsPage } from "./MoreFromUs/MoreFromUsPage.jsx";
import "./App.css";
import { CompareHostels } from "./CompareHostelsPage/CompareHostels.jsx";
import { PageHeader } from "./PageHeader/PageHeader.jsx";
import { UserProfilePage } from "./UserProfilPage/UserProfile.jsx";
import { HostelManagerPage } from "./HostelManagerPage/HostelManagerPage.jsx";
import { ChangePasswordPage } from "./HostelManagerPage/ChangePasswordPage.jsx";
import PaymentSuccess from "./AskEpisilionPage/PaymentSuccess.jsx";
import { OAuthSuccess } from "./logins/OAuthSuccess.jsx";
import { OAuthError } from "./logins/OAuthError.jsx";
import { PrivacyPolicy } from "./services/PrivacyPolicy.jsx";
import { SiteFooter } from "./SiteFooter/SiteFooter.jsx";
import { useLocation } from "react-router-dom";
import { MobileNavButtons } from "./SiteFooter/MobileNavButtons.jsx";
import { buildHostelSlug } from "./UTILS/slugFunctions.js";
import { CampusLandingPage } from "./CampusLandingPage/CampusLandingPage.jsx";
import { NotFoundPage } from "./NotFoundPage/NotFoundPage.jsx";
import { Helmet } from "react-helmet-async";

function LegacyHostelRedirect({ originalHostelCardData }) {
  const [searchParams] = useSearchParams();
  const hostelId = searchParams.get("hostelId");
  const hostel = originalHostelCardData.find((h) => h.id === hostelId);

  if (!hostel) return <Navigate to="/" replace />;
  return <Navigate to={`/hostels/${buildHostelSlug(hostel)}`} replace />;
}

function App() {
  const [hostelsCardData, sethostelsCardData] = useState([]);
  const [originalHostelCardData, setOriginalHostelCardData] = useState([]);
  const [navlink, setNavLink] = useState(false); //THIS HIDES ANDS SHOWS THE HAMBURGER MENU AND BUTTON
  const [showLogoutModal, setShowLogoutModal] = useState(false); //this is for the pop up that appears when the user is trying to log out
  const [showManagerLogoutModal, setShowManagerLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true); //THIS CONTROLS THE CSS LOADING STATE

  const loadHostelsCard = async () => {
    try {
      const response = await axios.get("/api/hostels");
      sethostelsCardData(response.data);
      setOriginalHostelCardData(response.data);
    } catch (error) {
      console.error("HOSTEL FETCH ERROR:", error);
      sethostelsCardData([]);
      setOriginalHostelCardData([]);
    }
  };
  useEffect(() => {
    loadHostelsCard();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [managerIsLoggedIn, setManagerIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("managerToken");
  });

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setIsLoggedIn(true);
  //   }else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  const location = useLocation();

  const hideFooter = [
    "/login",
    "/signup",
    "/oauthsuccess",
    "/oautherror",
  ].includes(location.pathname);

  useEffect(() => {
    if (hostelsCardData?.length > 0) {
      setLoading(false);
    }
  }, [hostelsCardData]);

  if (loading) {
    return (
      <>
        <Helmet>
          <meta property="og:site_name" content="Episilion Hostels" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Episilion Hostels",
              url: "https://www.episilionhostels.com/",
            })}
          </script>
        </Helmet>

        <div className={`loader-container ${loading ? "open" : "close"}`}>
          <div className="loading-animation-conatainer">
            <div class="loader"></div>
          </div>

          <p className="shimmmer">EPISILION LOADING</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <meta property="og:site_name" content="Episilion Hostels" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Episilion Hostels",
            url: "https://www.episilionhostels.com/",
          })}
        </script>
      </Helmet>

      <PageHeader
        navlink={navlink}
        setNavLink={setNavLink}
        isLoggedIn={isLoggedIn}
        managerIsLoggedIn={managerIsLoggedIn}
        setManagerIsLoggedIn={setManagerIsLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        showManagerLogoutModal={showManagerLogoutModal}
        setShowManagerLogoutModal={setShowManagerLogoutModal}
      />
      <Routes>
        <Route
          index
          element={
            <HomePage
              hostelsCardData={hostelsCardData}
              sethostelsCardData={sethostelsCardData}
              navlink={navlink}
              setNavLink={setNavLink}
              originalHostelCardData={originalHostelCardData}
              setOriginalHostelCardData={setOriginalHostelCardData}
            />
          }
        />

        <Route
          path="hostels/:slug"
          element={
            <MoreDetailsPage originalHostelCardData={originalHostelCardData} />
          }
        />
        <Route
          path="moreDetails"
          element={
            <LegacyHostelRedirect
              originalHostelCardData={originalHostelCardData}
            />
          }
        />
        <Route path="aboutus" element={<AboutUsPage />} />
        <Route
          path="hostels-near-upsa"
          element={
            <CampusLandingPage
              originalHostelCardData={originalHostelCardData}
            />
          }
        />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="askepisilion"
          element={
            <AskEpisilionPage
              originalHostelCardData={originalHostelCardData}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="login"
          element={
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              setManagerIsLoggedIn={setManagerIsLoggedIn}
            />
          }
        />
        <Route path="morefromus" element={<MoreFromUsPage />} />
        <Route
          path="comparehostels"
          element={
            <CompareHostels originalHostelCardData={originalHostelCardData} />
          }
        />
        <Route
          path="userProfilePage"
          element={
            <UserProfilePage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              showLogoutModal={showLogoutModal}
              setShowLogoutModal={setShowLogoutModal}
            ></UserProfilePage>
          }
        />
        <Route
          path="hostelManagerPage"
          element={
            <HostelManagerPage
              setShowManagerLogoutModal={setShowManagerLogoutModal}
            ></HostelManagerPage>
          }
        ></Route>
        <Route
          path="changePasswordPage"
          element={
            <ChangePasswordPage
              managerIsLoggedIn={managerIsLoggedIn}
            ></ChangePasswordPage>
          }
        ></Route>
        <Route
          path="/payment/success"
          element={<PaymentSuccess></PaymentSuccess>}
        ></Route>
        <Route
          path="oauthsuccess"
          element={<OAuthSuccess setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="oautherror" element={<OAuthError />} />
        <Route path="privacypolicy" element={<PrivacyPolicy />} />
      </Routes>

      {!hideFooter && <SiteFooter />}
      <MobileNavButtons />
    </>
  );
}

export default App;
