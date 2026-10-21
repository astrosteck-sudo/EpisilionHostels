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
import { getErrorMessage, isRateLimitError } from "../UTILS/apiError";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
} from "../UTILS/validation";

export function SignUpPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUpForm = useFormSubmission({
    fallbackMessage: "We couldn't create your account. Please try again.",
    mapError: (error) => {
      // The signup endpoint answers with a plain-text body.
      const serverMessage = getErrorMessage(error);
      const alreadyExists =
        typeof error?.response?.data === "string" &&
        error.response.data.toLowerCase().includes("already exists");

      if (alreadyExists) {
        return {
          type: "error",
          title: "Account already exists",
          message:
            "An account with this email already exists. Try logging in instead.",
        };
      }

      if (isRateLimitError(error)) {
        return {
          type: "warning",
          title: "Too many attempts",
          message:
            serverMessage ||
            "Please wait a few minutes before trying again.",
        };
      }

      return {
        type: "error",
        title: "We couldn't create your account",
        message: serverMessage,
        showConnectionHelp: !error?.response,
      };
    },
  });

  function handleFullname(event) {
    setFullName(event.target.value);
    signUpForm.clearFieldError("fullName");
  }
  function handleEmail(event) {
    setEmail(event.target.value);
    signUpForm.clearFieldError("email");
  }
  function handlePassword(event) {
    setPassword(event.target.value);
    signUpForm.clearFieldError("password");
  }
  function handleConfirmPassword(event) {
    setConfirmPassword(event.target.value);
    signUpForm.clearFieldError("confirmPassword");
  }
  useEffect(() => {
    document.body.classList.add("body-bg");
    return () => {
      document.body.classList.remove("body-bg");
    };
  }, []);

  const [type, setType] = useState("password");

  function showPassword(parameter) {
    // if (type === 'password') {
    //     setType('text')
    // } else {
    //     setType('password')
    // }
    if (parameter === "password") {
      setType("text");
    } else {
      setType("password");
    }
  }

  async function handleSumbit(event) {
    event.preventDefault();

    // Validate every field up front so the user sees all problems at once
    // rather than fixing them one at a time.
    const errors = {
      fullName: validateName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validatePasswordMatch(password, confirmPassword),
    };

    const hasErrors = Object.values(errors).some(Boolean);
    signUpForm.setFieldErrorsFrom(errors);
    if (hasErrors) return;

    await signUpForm.run(async () => {
      await axios.post("/api/auth/signup", {
        name: fullName.trim(),
        email: email.trim(),
        password,
      });

      setFullName("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");

      navigate("/login"); // Redirect to login page after successful signup
    });
  }

  return (
    <>
      <title>Sign-Up | Episilion Hostels</title>
      {/* <PageHeader navlink={navlink} setNavLink={setNavLink} /> */}

      <div className="sign-up-container">
        <div className="sign-up-wrapper">
          <div className="wrapper">
            <p className="join-us-text">
              <span className="join-us-span">JOIN US</span>
            </p>
            <h4 className="create-account-text">
              <span className="create-account-span">Create Account</span>
            </h4>
            <p className="start-journey-text">
              Start your journey with Episilion Hostels
            </p>
          </div>

          <div className="external-sign-up-buttons">
            <a href="https://episilionhostels.onrender.com/api/auth/google" className="external-sign-up-button">
              <img
                loading="lazy"
                src={googleImage}
                className="external-sign-up-image"
              ></img>
              <span className="external-sign-up-button-span">Sign up with</span>
              Google
            </a>
          </div>

          <div className="divider">
            <span>sign up with email</span>
          </div>

          <form method="POST" id="myForm" onSubmit={handleSumbit} noValidate>
            <div className="fullname-conatainer">
              <label htmlFor="signup-fullname" className="full-name-header">
                FULL NAME
              </label>
              <input
                type="text"
                id="signup-fullname"
                name="fullname"
                placeholder="e.g. John Mensah"
                className="full-name-input"
                value={fullName}
                onChange={handleFullname}
                aria-invalid={
                  signUpForm.fieldErrors.fullName ? "true" : "false"
                }
                aria-describedby={
                  signUpForm.fieldErrors.fullName
                    ? "signup-fullname-error"
                    : undefined
                }
                autoComplete="name"
                required
              />
              <FieldMessage
                id="signup-fullname-error"
                message={signUpForm.fieldErrors.fullName}
              />
            </div>

            <div className="email-address-conatainer">
              <label htmlFor="signup-email" className="email-address-header">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="signup-email"
                name="email"
                placeholder="you@example.com"
                className="email-address-input"
                value={email}
                onChange={handleEmail}
                aria-invalid={signUpForm.fieldErrors.email ? "true" : "false"}
                aria-describedby={
                  signUpForm.fieldErrors.email ? "signup-email-error" : undefined
                }
                autoComplete="email"
                required
              />
              <FieldMessage
                id="signup-email-error"
                message={signUpForm.fieldErrors.email}
              />
            </div>

            <div className="passwords-container">
              <div className="password-conatainer">
                <label htmlFor="signup-password" className="password-header">
                  PASSWORD
                </label>
                <input
                  type={type}
                  id="signup-password"
                  name="password"
                  placeholder="••••••••••••••••"
                  className="password-input"
                  value={password}
                  onChange={handlePassword}
                  aria-invalid={
                    signUpForm.fieldErrors.password ? "true" : "false"
                  }
                  aria-describedby={
                    signUpForm.fieldErrors.password
                      ? "signup-password-error"
                      : undefined
                  }
                  autoComplete="new-password"
                  required
                />
                <FieldMessage
                  id="signup-password-error"
                  message={signUpForm.fieldErrors.password}
                />
              </div>

              <div className="comfirm-password-conatainer">
                <label htmlFor="signup-confirm-password" className="comfirm-password-header">
                  COMFIRM PASSWORD
                </label>
                <input
                  type={type}
                  id="signup-confirm-password"
                  name="comfirm-password"
                  placeholder="••••••••••••••••"
                  className="comfirm-password-input"
                  value={confirmPassword}
                  onChange={handleConfirmPassword}
                  aria-invalid={
                    signUpForm.fieldErrors.confirmPassword ? "true" : "false"
                  }
                  aria-describedby={
                    signUpForm.fieldErrors.confirmPassword
                      ? "signup-confirm-password-error"
                      : undefined
                  }
                  autoComplete="new-password"
                  required
                />
                <FieldMessage
                  id="signup-confirm-password-error"
                  message={signUpForm.fieldErrors.confirmPassword}
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
                disabled={signUpForm.isSubmitting}
                aria-busy={signUpForm.isSubmitting}
              >
                {signUpForm.isSubmitting
                  ? "Creating your account…"
                  : "Create Account"}
              </button>
            </div>

            {signUpForm.alert && (
              <div className="form-alert-wrapper">
                <FormAlert
                  type={signUpForm.alert.type}
                  title={signUpForm.alert.title}
                  message={signUpForm.alert.message}
                />
                {signUpForm.alert.showConnectionHelp && <ConnectionHelp />}
              </div>
            )}
          </form>
          <div className="alternate-link-container">
            <p>
              Already have an account?{" "}
              <Link className="logins-page-link" to="/login">
                Log in
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
      </div>

      
    </>
  );
}

//await axios.post(`${API_URL}/api/signup`, {...});
