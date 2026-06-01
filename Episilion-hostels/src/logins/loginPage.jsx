import { PageHeader } from "../PageHeader/PageHeader";
import "./logins.css";
import { SiteFooter } from "../SiteFooter/SiteFooter";
//import googleImage from '../assets/icons/google.png';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import fullStar from '../assets/icons/favorite.png';

export function LoginPage({ setIsLoggedIn, setManagerIsLoggedIn }) {
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const [email, setEmail] = useState("");
  const [managerHostelName, setManagerHostelName] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [managerErrorMessage, setManagerErrorMessage] = useState("");

  //THIS USEEFFECT ADDS A BACKGROUND PICTURE TO THE BODY WHEN THE LOGIN PAGE IS RENDERED AND REMOVES IT WHEN THE COMPONENT UNMOUNTS
  useEffect(() => {
    document.body.classList.add("body-bg");
    return () => {
      document.body.classList.remove("body-bg");
    };
  }, []);

  function showPassword(parameter) {
    if (parameter === "password") {
      setType("text");
    } else {
      setType("password");
    }
  }
  function handleEmail(event) {
    setEmail(event.target.value);
  }
  function handleManagerHostelName(event) {
    setManagerHostelName(event.target.value);
  }
  function handleManagerPassword(event) {
    setManagerPassword(event.target.value);
  }
  function handlePasword(event) {
    setPassword(event.target.value);
  }

  //const API_URL = process.env.REACT_APP_API_URL || "";

  async function handleHostelManagerLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `https://episilion-backend-2lt0.onrender.com/api/manager/auth/login`,
        {
          managerHostelName,
          managerPassword,
        },
      );

      // const token = res.data.token;

      // ✅ STORE TOKEN
      localStorage.setItem("managerToken", res.data.token); // 1. store login proof
      localStorage.setItem("managerUser", JSON.stringify(res.data.manager)); // 2. store manager info
      console.log("Manager token stored:", res.data.manager);
      // setManagerHostelName("");
      // setManagerPassword("");
      console.log("Login successful");
      setManagerIsLoggedIn(true);
      navigate("/hostelManagerPage");
      setManagerErrorMessage("");
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setIsLoggedIn(false)
    } catch (error) {
      navigate("/login");
      console.log(error);
      setManagerErrorMessage("Something is wrong try again");
    }
  } 

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post(`https://episilion-backend-2lt0.onrender.com/api/auth/login`, {
        email,
        password,
      });

      // const token = res.data.token;

      // ✅ STORE TOKEN
      localStorage.setItem("token", res.data.token); // 1. store login proof
      localStorage.setItem("user", JSON.stringify(res.data.user)); // 2. store user info

      setEmail("");
      setPassword("");
      console.log("Login successful");

      // ✅ REDIRECT TO HOME
      setIsLoggedIn(true);
      localStorage.removeItem("managerToken");
      localStorage.removeItem('managerUser')
      setManagerIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      //setErrorMessage(error.response?.data || "Login failed");
      setErrorMessage('Something is wrong, Try again !!')
      setTimeout(() => {
        setErrorMessage('')
      }, 2000)
    }
  }

  const [openManagerLoginPage, setOpenManagerLoginPage] = useState(false);

  function openHostelManagerLoginPage() {
    if (openManagerLoginPage) {
      setOpenManagerLoginPage(false);
    } else {
      setOpenManagerLoginPage(true);
    }
  }

  return (
    <>
      <title>Login | Episilion Hostels</title>
      {/* <PageHeader navlink={navlink} setNavLink={setNavLink} /> */}

      <div className="sign-up-container">
        <div className="side-bar-login">
          <div className="episilion-logo-login">
            <img loading='lazy'src="/episilion_logo.svg" alt="" />
          </div>
          <div>
            <h3 className="episilion-name-login">EPISILION</h3>
            <h3 className="episilion-name-login">HOSTELS</h3>
            <p className="home-away-from-home-text">Your home away from home</p>
          </div>

          <div className="testimonial-login">
            <p>
              <p>
                "The staff made us feel so welcome. Best hostel experince we've
                ever had"
              </p>
              <p className="testimonial-person">
                - Maria T., Traveller from Ghana
              </p>
            </p>
          </div>

          <div className="hostels-figures">
            <div className="average-rating-login-container">
              <p className="average-rating-login">4.8</p>
              <p className="avg-rating-text">Avg Rating</p>
            </div>
            <div className="happy-guest-container">
              <p className="happy-guest-number">2,400+</p>{" "}
              <p className="happy-guest-text">Happy Guest</p>
            </div>
            <div className="locations-container-login">
              <p className="locations-number-login">12+</p>{" "}
              <p className="locations-text-login">Locations</p>
            </div>
          </div>
        </div>
        <div
          className={`sign-up-wrapper login ${openManagerLoginPage ? "openHostelManagerLoginPage" : "closeHostelManagerLoginPage"}`}
        >
          <div className="wrapper login">
            <p className="join-us-text login">
              <span className="join-us-span">WELCOME BACK</span>
            </p>
            <h4 className="create-account-text login">
              <span className="create-account-span">STUDENT LOGIN</span>
            </h4>
            <p className="start-journey-text">
              Good to see you again - let's get you in
            </p>
          </div>

          {/* <div className="external-sign-up-buttons">
                        <button className="external-sign-up-button"><img loading='lazy'src={googleImage} className="external-sign-up-image"></img><span className="external-sign-up-button-span">Log in with</span>Google</button>
                    </div> */}

          <div className="divider">
            <span>log in with email</span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="email-address-conatainer">
              <p for="email-address" className="email-address-header">
                EMAIL ADDRESS
              </p>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="email-address-input"
                value={email}
                onChange={handleEmail}
                required
              />
            </div>

            <div className="passwords-container">
              <div className="password-conatainer">
                <p for="password" className="password-header">
                  PASSWORD
                </p>
                <input
                  type={type}
                  name="password"
                  placeholder="••••••••••••••••"
                  className="password-input"
                  value={password}
                  onChange={handlePasword}
                  required
                />
              </div>
            </div>

            <div className="show-password-container">
              <input
                type="checkbox"
                id="showPassword"
                onClick={() => showPassword(type)}
              />
              <label for="showPassword" className="show-password">
                Show password
              </label>
            </div>

            <div className="create-account-button-container">
              <button className="create-account-button" type="submit">
                Login
              </button>
            </div>
          </form>
          <div className="error-message-container login">
            <p>{errorMessage}</p>
          </div>

          <div
            className="hostel-manager-log-in"
            onClick={openHostelManagerLoginPage}
          >
            <p className="logins-page-link">Log in as hostel manager</p>
          </div>

          <div className="alternate-link-container">
            <p>
              Don't have an account?{" "}
              <Link className="logins-page-link" to="/signup">
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="perks-container">
            <ul className="perks-list">
              <li>Free to join</li>
              <li>Exclusive deals</li>
              <li>Easy booking</li>
            </ul>
          </div>
        </div>

        <div
          className={`hostel-manager-sign-up-wrapper login ${openManagerLoginPage ? "openHostelManagerLoginPage" : "closeHostelManagerLoginPage"}`}
        >
          <div className="wrapper login">
            <p className="join-us-text login">
              <span className="join-us-span">THANKS FOR JOINING</span>
            </p>
            <h4 className="create-account-text login">
              <span className="create-account-span">HOSTEL MANAGER LOGIN</span>
            </h4>
            <p className="start-journey-text">
              Good to see you - let's get you in
            </p>
          </div>
          <div className="divider">
            <span>log in with hostel name</span>
          </div>

          <form method="POST" id="myForm" onSubmit={handleHostelManagerLogin}>
            <div className="email-address-conatainer">
              <p for="hostel-name" className="email-address-header">
                HOSTEL NAME
              </p>
              <input
                type="text"
                name="hostel-name"
                placeholder="e.g. prestige hostel"
                className="email-address-input"
                value={managerHostelName}
                onChange={handleManagerHostelName}
                required
              />
            </div>

            <div className="passwords-container">
              <div className="password-conatainer">
                <p for="password" className="password-header">
                  PASSWORD
                </p>
                <input
                  type={type}
                  name="password"
                  placeholder="••••••••••••••••"
                  className="password-input"
                  value={managerPassword}
                  onChange={handleManagerPassword}
                  required
                />
              </div>
            </div>

            <div className="show-password-container">
              <input
                type="checkbox"
                id="showPassword"
                onClick={() => showPassword(type)}
              />
              <label for="showPassword" className="show-password">
                Show password
              </label>
            </div>

            <div className="create-account-button-container">
              <button className="create-account-button" type="submit">
                Login
              </button>
            </div>
            <div className="error-message-container login">
              <p>{managerErrorMessage}</p>
            </div>
          </form>
          <div className="error-message-container login">
            <p>{errorMessage}</p>
          </div>

          <div
            className="hostel-manager-log-in"
            onClick={openHostelManagerLoginPage}
          >
            <p className="logins-page-link">Log in as student</p>
          </div>

          <div className="hostel-manager-caution-text">
            <p>
              As hostel managers messages containing your hostel name and
              password where sent to your whatsapp numbers and emails
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
