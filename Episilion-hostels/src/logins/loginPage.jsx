import { PageHeader } from "../PageHeader/PageHeader";
import "./logins.css";
import "../components/forms/FormFeedback.css";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import googleImage from "../assets/icons/google.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FormAlert,
  FieldMessage,
  ConnectionHelp,
} from "../components/forms/FormFeedback";
import { useFormSubmission } from "../hooks/useFormSubmission";
import {
  getErrorMessage,
  INVALID_CREDENTIALS_MESSAGE,
  isCredentialRejection,
  isRateLimitError,
} from "../UTILS/apiError";
import { validateEmail, validateHostelName } from "../UTILS/validation";
//import fullStar from '../assets/icons/favorite.png';

export function LoginPage({ setIsLoggedIn, setManagerIsLoggedIn }) {
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const [email, setEmail] = useState("");
  const [managerHostelName, setManagerHostelName] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [password, setPassword] = useState("");

  const studentForm = useFormSubmission({
    fallbackMessage: "We couldn't log you in. Please try again.",
    mapError: (error) => {
      if (isCredentialRejection(error)) {
        return {
          type: "error",
          title: "We couldn't sign you in",
          message: INVALID_CREDENTIALS_MESSAGE,
        };
      }
      if (isRateLimitError(error)) {
        return {
          type: "warning",
          title: "Too many attempts",
          message:
            getErrorMessage(error) ||
            "Please wait a few minutes before trying again.",
        };
      }
      return {
        type: "error",
        title: "We couldn't sign you in",
        message: getErrorMessage(error),
        showConnectionHelp: !error?.response,
      };
    },
  });

  const managerForm = useFormSubmission({
    fallbackMessage: "We couldn't log you in. Please try again.",
    mapError: (error) => {
      if (isCredentialRejection(error)) {
        return {
          type: "error",
          title: "We couldn't sign you in",
          message: INVALID_CREDENTIALS_MESSAGE,
        };
      }
      if (isRateLimitError(error)) {
        return {
          type: "warning",
          title: "Too many attempts",
          message:
            getErrorMessage(error) ||
            "Please wait a few minutes before trying again.",
        };
      }
      return {
        type: "error",
        title: "We couldn't sign you in",
        message: getErrorMessage(error),
        showConnectionHelp: !error?.response,
      };
    },
  });

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
  function managerShowPassword(parameter) {
    if (parameter === "password") {
      setType("text");
    } else {
      setType("password");
    }
  }
  function handleEmail(event) {
    setEmail(event.target.value);
    studentForm.clearFieldError("email");
  }
  function handleManagerHostelName(event) {
    setManagerHostelName(event.target.value);
    managerForm.clearFieldError("hostelName");
  }
  function handleManagerPassword(event) {
    setManagerPassword(event.target.value);
    managerForm.clearFieldError("password");
  }
  function handlePasword(event) {
    setPassword(event.target.value);
    studentForm.clearFieldError("password");
  }
  function handleBlur(event) {
    setManagerPassword(event.target.value.trim());
  }
  function handleNameBlur(event) {
    setManagerHostelName(event.target.value.trim());
  }

  //const API_URL = process.env.REACT_APP_API_URL || "";

  async function handleHostelManagerLogin(e) {
    e.preventDefault();

    const hostelNameError = validateHostelName(managerHostelName);
    if (hostelNameError || !managerPassword) {
      managerForm.setFieldErrorsFrom({
        hostelName: hostelNameError,
        password: managerPassword ? "" : "Password is required.",
      });
      return;
    }

    await managerForm.run(async () => {
      const res = await axios.post(`/api/manager/auth/login`, {
        managerHostelName,
        managerPassword,
      });

      // ✅ STORE TOKEN
      localStorage.setItem("managerToken", res.data.token); // 1. store login proof
      localStorage.setItem("managerUser", JSON.stringify(res.data.manager)); // 2. store manager info

      setManagerIsLoggedIn(true);
      navigate("/hostelManagerPage");

      // A manager session replaces any student session.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    });
  }

  async function handleLogin(e) {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError || !password) {
      studentForm.setFieldErrorsFrom({
        email: emailError,
        password: password ? "" : "Password is required.",
      });
      return;
    }

    await studentForm.run(async () => {
      const res = await axios.post(`/api/auth/login`, {
        email: email.trim(),
        password,
      });

      // ✅ STORE TOKEN
      localStorage.setItem("token", res.data.token); // 1. store login proof
      localStorage.setItem("user", JSON.stringify(res.data.user)); // 2. store user info

      setEmail("");
      setPassword("");

      // ✅ REDIRECT TO HOME
      setIsLoggedIn(true);

      // A student session replaces any manager session.
      localStorage.removeItem("managerToken");
      localStorage.removeItem("managerUser");
      setManagerIsLoggedIn(false);
      navigate("/");
    });
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
        <div className="login-branding">
          <img src="/episilion_logo.svg" alt="Episilion Logo" />
          <h1>EPISILION HOSTELS</h1>
          <p>Your home away from home</p>
        </div>

        <div className="side-bar-login">
          <div className="episilion-logo-login">
            <img loading="lazy" src="/episilion_logo.svg" alt="" />
          </div>
          <div>
            <h3 className="episilion-name-login">EPISILION</h3>
            <h3 className="episilion-name-login">HOSTELS</h3>
            <p className="home-away-from-home-text">Your home away from home</p>
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
              <span className="create-account-span">Student Login</span>
            </h4>
            <p className="start-journey-text">
              Good to see you again - let's get you in
            </p>
          </div>

          <div className="external-sign-up-buttons">

            <div className="external-sign-up-buttons">
              <a
                href="https://episilionhostels.onrender.com/api/auth/google"
                className="external-sign-up-button"
              >
                <img
                  loading="lazy"
                  src={googleImage}
                  className="external-sign-up-image"
                ></img>
                <span className="external-sign-up-button-span">
                  Log in with Google
                </span>
                
              </a>
            </div>
          </div>

          <div className="divider">
            <span>log in with email</span>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div className="email-address-conatainer">
              <label htmlFor="login-email" className="email-address-header">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                placeholder="you@example.com"
                className="email-address-input"
                value={email}
                onChange={handleEmail}
                aria-invalid={studentForm.fieldErrors.email ? "true" : "false"}
                aria-describedby={
                  studentForm.fieldErrors.email ? "login-email-error" : undefined
                }
                autoComplete="email"
                required
              />
              <FieldMessage
                id="login-email-error"
                message={studentForm.fieldErrors.email}
              />
            </div>

            <div className="passwords-container">
              <div className="password-conatainer">
                <label htmlFor="login-password" className="password-header">
                  PASSWORD
                </label>
                <input
                  type={type}
                  id="login-password"
                  name="password"
                  placeholder="••••••••••••••••"
                  className="password-input"
                  value={password}
                  onChange={handlePasword}
                  aria-invalid={
                    studentForm.fieldErrors.password ? "true" : "false"
                  }
                  aria-describedby={
                    studentForm.fieldErrors.password
                      ? "login-password-error"
                      : undefined
                  }
                  autoComplete="current-password"
                  required
                />
                <FieldMessage
                  id="login-password-error"
                  message={studentForm.fieldErrors.password}
                />
              </div>
            </div>

            <div className="show-password-container">
              <input
                type="checkbox"
                id="showPassword"
                onClick={() => showPassword(type)}
              />
              <label htmlFor="showPassword" className="show-password">
                Show password
              </label>
            </div>

            <div className="create-account-button-container">
              <button
                className="create-account-button"
                type="submit"
                disabled={studentForm.isSubmitting}
                aria-busy={studentForm.isSubmitting}
              >
                {studentForm.isSubmitting ? "Getting you in…" : "Login"}
              </button>
            </div>
          </form>

          {studentForm.alert && (
            <div className="form-alert-wrapper">
              <FormAlert
                type={studentForm.alert.type}
                title={studentForm.alert.title}
                message={studentForm.alert.message}
              />
              {studentForm.alert.showConnectionHelp && <ConnectionHelp />}
            </div>
          )}

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
              <span className="create-account-span">Hostel Manager Login</span>
            </h4>
            <p className="start-journey-text">
              Good to see you - let's get you in
            </p>
          </div>
          <div className="divider">
            <span>log in with hostel name</span>
          </div>

          <form method="POST" id="myForm" onSubmit={handleHostelManagerLogin} noValidate>
            <div className="email-address-conatainer">
              <label htmlFor="manager-hostel-name" className="email-address-header">
                HOSTEL NAME
              </label>
              <input
                type="text"
                id="manager-hostel-name"
                name="hostel-name"
                placeholder="e.g. prestige hostel"
                className="email-address-input"
                value={managerHostelName}
                onChange={handleManagerHostelName}
                onBlur={handleNameBlur}
                aria-invalid={
                  managerForm.fieldErrors.hostelName ? "true" : "false"
                }
                aria-describedby={
                  managerForm.fieldErrors.hostelName
                    ? "manager-hostel-name-error"
                    : undefined
                }
                autoComplete="organization"
                required
              />
              <FieldMessage
                id="manager-hostel-name-error"
                message={managerForm.fieldErrors.hostelName}
              />
            </div>

            <div className="passwords-container">
              <div className="password-conatainer">
                <label htmlFor="manager-password" className="password-header">
                  PASSWORD
                </label>
                <input
                  type={type}
                  id="manager-password"
                  name="password"
                  placeholder="••••••••••••••••"
                  className="password-input"
                  value={managerPassword}
                  onChange={handleManagerPassword}
                  onBlur={handleBlur}
                  aria-invalid={
                    managerForm.fieldErrors.password ? "true" : "false"
                  }
                  aria-describedby={
                    managerForm.fieldErrors.password
                      ? "manager-password-error"
                      : undefined
                  }
                  autoComplete="current-password"
                  required
                />
                <FieldMessage
                  id="manager-password-error"
                  message={managerForm.fieldErrors.password}
                />
              </div>
            </div>

            <div className="show-password-container">
              <input
                type="checkbox"
                id="managerShowPassword"
                onClick={() => managerShowPassword(type)}
              />
              <label htmlFor="managerShowPassword" className="show-password">
                Show password
              </label>
            </div>

            <div className="create-account-button-container">
              <button
                className="create-account-button"
                type="submit"
                disabled={managerForm.isSubmitting}
                aria-busy={managerForm.isSubmitting}
              >
                {managerForm.isSubmitting ? "Getting you in…" : "Login"}
              </button>
            </div>

            {managerForm.alert && (
              <div className="form-alert-wrapper">
                <FormAlert
                  type={managerForm.alert.type}
                  title={managerForm.alert.title}
                  message={managerForm.alert.message}
                />
                {managerForm.alert.showConnectionHelp && <ConnectionHelp />}
              </div>
            )}
          </form>

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

      
    </>
  );
}
