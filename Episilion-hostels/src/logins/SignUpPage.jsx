import { PageHeader } from "../PageHeader/PageHeader";
import './logins.css';
import { SiteFooter } from "../SiteFooter/SiteFooter";
//import googleImage from '../assets/icons/google.png';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import isValidEmail from "../UTILS/emailValidator.js";

export function SignUpPage() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleFullname(event) {
        setFullName(event.target.value);
    }
    function handleEmail(event) {
        setEmail(event.target.value);
    }
    function handlePassword(event) {
        setPassword(event.target.value);
    }
    function handleConfirmPassword(event) {
        setConfirmPassword(event.target.value);
    }
    useEffect(() => {
        document.body.classList.add("body-bg");
        return () => {
            document.body.classList.remove("body-bg");
        };
    }, []);

    const [type, setType] = useState('password');

    function showPassword(parameter) {
        // if (type === 'password') {
        //     setType('text')
        // } else {
        //     setType('password')
        // }
        if (parameter === 'password') {
            setType('text');
        } else {
            setType('password')
        }
    }


    async function handleSumbit(event) {
        event.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        event.preventDefault();
        if (!isValidEmail(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }

        setErrorMessage('');
        try {
            console.log("Submitting data:")
            await axios.post("/api/auth/signup", {
                name: fullName,
                email: email,
                password: password
            });
            setFullName('')
            setPassword('')
            setConfirmPassword('')
            setEmail('')
            console.log("Signup successful");
            navigate("/login"); // Redirect to login page after successful signup
            // Optionally, you can redirect the user to the login page or home page after successful signup
            // For example: window.location.href = "/login";

        } catch (error) {
            setErrorMessage(error.response?.data || "An error occurred during signup");
            console.log("Error submitting users:", error.response?.data || error.message);
        }
    }




    return (
        <>
            <title>Sign-Up | Episilion Hostels</title>
            {/* <PageHeader navlink={navlink} setNavLink={setNavLink} /> */}

            <div className="sign-up-container">
                <div className="sign-up-wrapper">
                    <div className="wrapper">
                        <p className="join-us-text"><span className="join-us-span">JOIN US</span></p>
                        <h4 className="create-account-text"><span className="create-account-span">Create Account</span></h4>
                        <p className="start-journey-text">Start your journey with Episilion Hostels</p>
                    </div>

                    {/* <div className="external-sign-up-buttons">
                        <button className="external-sign-up-button"><img loading='lazy'src={googleImage} className="external-sign-up-image"></img><span className="external-sign-up-button-span">Sign up with</span>Google</button>
                    </div> */}

                    <div className="divider">
                        <span>sign up with email</span>
                    </div>

                    <form method="POST" id="myForm" onSubmit={handleSumbit}>
                        <div className="fullname-conatainer">
                            <p for="fullname" className="full-name-header">FULL NAME</p>
                            <input type="text" name="fullname" placeholder="e.g. John Mensah" className="full-name-input" value={fullName} onChange={handleFullname} required />
                        </div>

                        <div className="email-address-conatainer">
                            <p for="email-address" className="email-address-header">EMAIL ADDRESS</p>
                            <input type="email" name="email" placeholder="you@example.com" className="email-address-input" value={email} onChange={handleEmail} required />
                        </div>

                        <div className="passwords-container">
                            <div className="password-conatainer">
                                <p for="password" className="password-header">PASSWORD</p>
                                <input type={type} name="password" placeholder="••••••••••••••••" className="password-input" value={password} onChange={handlePassword} required />
                            </div>

                            <div className="comfirm-password-conatainer">
                                <p for="comfirm-password" className="comfirm-password-header">COMFIRM PASSWORD</p>
                                <input type={type} name="comfirm-password" placeholder="••••••••••••••••" className="comfirm-password-input" value={confirmPassword} onChange={handleConfirmPassword} required />
                            </div>
                        </div>

                        <div className="show-password-container">
                            <input type="checkbox" id="showPassword" onClick={() => showPassword(type)} /><label for="showPassword" className="show-password">Show password</label>
                        </div>

                        <div className="create-account-button-container">
                            <button className="create-account-button" type="submit">Create Account</button>
                        </div>
                        <div className="error-message-container login">
                            <p>{errorMessage}</p>
                        </div>
                    </form>
                    <div className="alternate-link-container">
                        <p>Already have an account? <Link className="logins-page-link" to="/login">Log in</Link></p>
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

            <SiteFooter />

        </>
    )
}









//await axios.post(`${API_URL}/api/signup`, {...});