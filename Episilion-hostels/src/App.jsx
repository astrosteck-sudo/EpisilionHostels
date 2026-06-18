import { Routes, Route } from 'react-router'
import { HomePage } from './HomePage/HomePage';
import { MoreDetailsPage } from './MoreDetailsPage/MoreDetailsPage';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SignUpPage } from './logins/SignUpPage.jsx';
import { LoginPage } from './logins/loginPage.jsx';
import { AskEpisilionPage } from './AskEpisilionPage/AskEpisilionPage.jsx';
import { AboutUsPage } from './AboutUs/AboutUsPage.jsx';
import { MoreFromUsPage } from './MoreFromUs/MoreFromUsPage.jsx';
import './App.css'
import { CompareHostels } from './CompareHostelsPage/CompareHostels.jsx';
import { PageHeader } from './PageHeader/PageHeader.jsx';
import { UserProfilePage } from './UserProfilPage/UserProfile.jsx';
import { HostelManagerPage } from './HostelManagerPage/HostelManagerPage.jsx';
import { ChangePasswordPage } from './HostelManagerPage/ChangePasswordPage.jsx';
import PaymentSuccess from './AskEpisilionPage/PaymentSuccess.jsx';
import { OAuthSuccess } from './logins/OAuthSuccess.jsx';
import { OAuthError } from './logins/OAuthError.jsx';
import { PrivacyPolicy } from './services/PrivacyPolicy.jsx';


function App() {
  const [hostelsCardData, sethostelsCardData] = useState([]);
  const [originalHostelCardData, setOriginalHostelCardData] = useState([])
  const [navlink, setNavLink] = useState(false);//THIS HIDES ANDS SHOWS THE HAMBURGER MENU AND BUTTON

  

  const loadHostelsCard = async () => {
  try {
    const response = await axios.get('/api/hostels');
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



  return (
    <>
      <PageHeader navlink={navlink} setNavLink={setNavLink} isLoggedIn={isLoggedIn} managerIsLoggedIn={managerIsLoggedIn} setManagerIsLoggedIn={setManagerIsLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route index element={<HomePage hostelsCardData={hostelsCardData} sethostelsCardData={sethostelsCardData}
          navlink={navlink} setNavLink={setNavLink} originalHostelCardData={originalHostelCardData} setOriginalHostelCardData={setOriginalHostelCardData} />} />

        <Route path="moreDetails" element={<MoreDetailsPage originalHostelCardData={originalHostelCardData} />} />
        <Route path="aboutus" element={<AboutUsPage />} />
        <Route path="signup" element={<SignUpPage  />} />
        <Route path="askepisilion" element={<AskEpisilionPage  originalHostelCardData={originalHostelCardData} isLoggedIn={isLoggedIn} />} />
        <Route path="login" element={<LoginPage  setIsLoggedIn={setIsLoggedIn} setManagerIsLoggedIn={setManagerIsLoggedIn} />} />
        <Route path='morefromus' element={<MoreFromUsPage  />} />
        <Route path='comparehostels' element={<CompareHostels  originalHostelCardData={originalHostelCardData} />} />
        <Route path='userProfilePage' element={<UserProfilePage isLoggedIn={isLoggedIn}></UserProfilePage>} />
        <Route path='hostelManagerPage' element={<HostelManagerPage></HostelManagerPage>}></Route>
        <Route path='changePasswordPage' element={<ChangePasswordPage managerIsLoggedIn={managerIsLoggedIn}></ChangePasswordPage>}></Route>
        <Route path="/payment/success" element={<PaymentSuccess></PaymentSuccess>}></Route>
        <Route path='oauthsuccess' element={<OAuthSuccess setIsLoggedIn={setIsLoggedIn}/>}/>
        <Route path='oautherror' element={<OAuthError/>}/>
        <Route path='privacypolicy' element={<PrivacyPolicy/>}/>
      </Routes>
    </>
  )
}

export default App
