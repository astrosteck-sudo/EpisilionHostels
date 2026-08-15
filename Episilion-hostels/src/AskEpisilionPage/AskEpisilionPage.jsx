import { Link } from "react-router-dom";
import { SiteFooter } from "../SiteFooter/SiteFooter";
import { useNavigate } from "react-router-dom";
import "./AskEpisilion.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { getDeviceId } from "../UTILS/deviceId.js";

import { initializePayment } from "../services/paymentService";

import { Robot, Send, LightbulbFill, Building } from "react-bootstrap-icons";

export function AskEpisilionPage({ isLoggedIn }) {
  const [userSearchInput, setUserSearchInput] = useState(""); //THIS IS TO TRACK THE USER INPUT IN THE SEARCH BAR
  const [chatMessages, setChatMessages] = useState([]); //Initialize as array
  const [open, setOpen] = useState(false);
  const [userSubcriptionInfo, setUserSubcriptionInfo] = useState({});
  const [aiSubscriptionRemaining, setAiSubscriptionRemaining] = useState(15);
  //THIS IS TO TRACK THE NUMBER OF REQUESTS THE USER HAS LEFT
  const [remainingRequests, setRemainingRequest] = useState(() => {
    const saved = localStorage.getItem("episilionRemainingRequests");
    return saved !== null ? parseInt(saved) : "3";
  });

  //THIS IS TO TRACK THE LOADING STATE OF THE AI RESPONSE
  const [isLoading, setIsLoading] = useState(false);
  const url = "https://episilion-backend-2lt0.onrender.com"; //THIS IS THE URL FOR THE BACKEND, THIS IS USED TO ACCESS THE IMAGES IN THE PUBLIC FOLDER OF THE BACKEND

  //const [userCautionText, setUserCautionText] = useState(true)
  const navigate = useNavigate();

  // useEffect(() => {
  //   document.body.classList.add("episilion-bg");
  //   return () => {
  //     document.body.classList.remove("episilion-bg");
  //   };
  // }, []);

  //THIS HOOK UPDATES THE REMAINING REQUESTS IN LOCAL STORAGE WHENEVER IT CHANGES AND THE TEXT THAT SHOWS THE REMAINING REQUESTS IN THE SIDEBAR
  useEffect(() => {
    localStorage.setItem("episilionRemainingRequests", remainingRequests);
  }, [remainingRequests]);

  //This hook scrolls to the bottom whenever chatMessages updates.
  useEffect(() => {
    const messagesDiv = document.querySelector(".messages");
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }, [chatMessages]);

  // Load messages on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("episilionChat");
    if (savedMessages) {
      //setUserCautionText(false)
      setChatMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages whenever they change, but only if not empty
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem("episilionChat", JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  function searchInput(event) {
    setUserSearchInput(event.target.value);
  }

  async function sendMessage() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!userSearchInput.trim()) return;

    setIsLoading(true);
    const userMessage = userSearchInput;
    setUserSearchInput("");

    // 1. ADD USER MESSAGE TO CHAT
    setChatMessages((prev) => [
      ...prev,
      {
        message: userMessage,
        sender: "user",
      },
    ]);

    try {
      const res = await axios.post(
        "/api/intent/search",
        { query: userMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-device-id": getDeviceId(),
          },
        },
      );

      const data = res.data;
      console.log("AI Response:", data);
      setRemainingRequest(data.remainingRequests);
      localStorage.setItem(
        "episilionRemainingRequests",
        data.remainingRequests,
      );

      if (data.type === "hostels") {
        setChatMessages((prev) => [
          ...prev,
          {
            message: data.result,
            type: "episilionResults",
            sender: "episilion",
            header: data.reason,
          },
        ]);
      } else {
        // "chat" type — plain conversational reply, no cards
        setChatMessages((prev) => [
          ...prev,
          {
            message: data.message,
            type: "chat",
            sender: "episilion",
          },
        ]);
      }
    } catch (error) {
      const data = error.response?.data;
      const errorMessage =
        data?.message ||
        data?.error ||
        "Something went wrong. Please try again.";

      // "no_match" comes back as an HTTP error status but still carries a
      // real remainingRequests count — keep the sidebar counter in sync
      // even on this path, or it'll drift from what the server recorded.
      if (typeof data?.remainingRequests === "number") {
        setRemainingRequest(data.remainingRequests);
        localStorage.setItem(
          "episilionRemainingRequests",
          data.remainingRequests,
        );
      }

      setChatMessages((prev) => [
        ...prev,
        {
          message: errorMessage,
          // no_match isn't really an "error" — render it like a normal reply
          type: data?.type === "no_match" ? "chat" : "error",
          sender: "episilion",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function goToHostelPage(parameter) {
    navigate(`/moreDetails?hostelId=${parameter}`);
  }

  //Allow sending with Enter key
  function handleKeyDown(event) {
    //event.preventDefault(); // Prevents the default behavior of the Enter key (like adding a new line)
    //THIS RETURNS THE USER WHEN THE USER IS NOT LOGGED IN
    if (event.key === "Enter") {
      if (!isLoggedIn) {
        navigate("/login");
      } else {
        sendMessage();
      }
    }
  }
  //THIS IS TO EXTRACT THE USER IMFORMATION FROM THE TOKEN
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    document.title = "Ask Episilion | Episilion Hostels";
  }, []);

  const handleSubscribe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      //setLoading(true);

      const data = await initializePayment(1);
      // console.log(data);

      window.location.href = data.authorization_url;
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Payment failed");
    } finally {
      //setLoading(false);
    }
  };

  const getMe = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/me`, {
        headers: {
          Authorization: token,
        },
      });
      // console.log(response.data);
      setUserSubcriptionInfo(response.data);
      setAiSubscriptionRemaining(response.data.subscription.remainingSearches);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  useEffect(() => {
    getMe();
  }, [aiSubscriptionRemaining]);

  useEffect(() => {
    function handleClick(event) {
      if (
        !event.target.closest(".epsilion-wrapper-one") &&
        !event.target.closest(".topbar .menu-btn")
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [setOpen]);

  return (
    <>
      <div className="main-epsilion-container">
        <div className={`epsilion-wrapper-one ${open ? "open" : ""}`}>
          <div className="sidebar-header">
            <button className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="ask-episilion-page-header-AI-description sidebar">
            <p>Ask Episilion</p>
            <p>AI powered hostel assistant</p>
          </div>
          <p className="your-usage-text">YOUR USAGE</p>
          <div
            className={`user-AI-usage-container ${!userSubcriptionInfo?.subscription?.subscribed ? "" : "no-opacity"}`}
          >
            <p className="free-request-text">
              Free Request{" "}
              <span className="user-number-request-left">
                {remainingRequests}/3 left
              </span>
            </p>
            <p className="upgrade-text">Upgrade for 15 request/day</p>
          </div>
          {userSubcriptionInfo?.subscription?.subscribed && (
            <div className="user-AI-usage-container-subscription">
              <p className="free-request-text">
                Free Request{" "}
                <span className="user-number-request-left">
                  {aiSubscriptionRemaining}/15 left
                </span>
              </p>
              <p className="upgrade-text">Upgraded Access</p>
            </div>
          )}

          {userSubcriptionInfo?.subscription?.subscribed ? (
            ""
          ) : (
            <div className="premuim-access-container">
              <p>Unlock Full Access</p>
              <p>Get 15 AI request per day for just GHS 10/month</p>
              <button className="upgrade-now-button" onClick={handleSubscribe}>
                Upgrade Now
              </button>
            </div>
          )}
        </div>

        <div className={`epsilion-wrapper-two ${open ? "shift" : ""}`}>
          <div className="topbar">
            <button className="menu-btn" onClick={() => setOpen(true)}>
              ☰
            </button>
            <div className="ask-episilion-page-header">
              <Robot className="ask-episilion-page-header-robot-image" />
              {/* <img
                src={robotImage}
                className="ask-episilion-page-header-robot-image"
              /> */}
              <div className="ask-episilion-page-header-AI-description">
                <p>Episilion AI</p>
                <p>Online • Powered By Open AI • Hostel Specialist</p>
              </div>
            </div>
          </div>

          <div className="messages">
            <div className="episilion-message-and-bot-conatainer">
              <Robot className="ask-episilion-robot-image" />
              <div className="episilion-message">
                <p className="ask-episilion-message-first-Paragraph">
                  Hi {!isLoggedIn ? "student" : user?.name || "student"}! 👋 How
                  can I help you today?
                </p>
                <p className="ask-episilion-message-second-Paragraph">
                  I'm your Epislion AI assistant - ask me anything about
                  hostels, prices, amenities, or locations near your campus.
                  I'll find the best options for you.
                </p>
                <p className="ask-episilion-message-third-Paragraph">
                  <LightbulbFill className="ask-episilion-light-bulb" />
                  Tip: Keep questions short and direct for the most accurate
                  answers
                </p>
              </div>
            </div>
            {/*Map over chatMessages array to render each bubble */}
            {chatMessages.map((chat, index) => (
              <div
                key={index}
                className={
                  chat.sender === "user" ? "user-message" : "episilion-message"
                }
              >
                {chat.type === "episilionResults" ? (
                  <div className="epi-ai-response">
                    <div className="epi-ai-response-head">
                      <span
                        className="epi-ai-response-bar"
                        aria-hidden="true"
                      />
                      <p className="epi-ai-response-header">{chat.header}</p>
                    </div>

                    {Array.isArray(chat.message) ? (
                      <>
                        <div className="epi-hostel-grid">
                          {chat.message.map((hostel) => (
                            <button
                              key={hostel.id}
                              type="button"
                              className="epi-hostel-card"
                              onClick={() => goToHostelPage(hostel.id)}
                            >
                              <div className="epi-hostel-info">
                                <div className="epi-hostel-thumb">
                                  {hostel.image ? (
                                    <img
                                      loading="lazy"
                                      src={url + hostel.image}
                                      alt={hostel.name}
                                    />
                                  ) : (
                                    <Buildings className="epi-hostel-thumb-fallback" />
                                  )}
                                </div>

                                <div className="epi-hostel-text">
                                  <p className="epi-hostel-name">
                                    {hostel.name}
                                  </p>
                                  <p className="epi-hostel-meta">
                                    {hostel.gender || "Mixed"} ·{" "}
                                    {hostel.location || "Near campus"}
                                  </p>
                                  <p className="epi-hostel-price">
                                    <span>
                                      GH₵{Number(hostel.price).toLocaleString()}
                                    </span>
                                    <small>/sem</small>
                                  </p>
                                </div>
                              </div>

                              <span className="epi-hostel-cta">
                                View
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M5 12h14M13 6l6 6-6 6"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </button>
                          ))}
                        </div>

                        <p className="epi-ai-response-note">
                          {chat.message.length} hostel
                          {chat.message.length === 1 ? "" : "s"} matched your
                          request
                        </p>
                      </>
                    ) : (
                      <p className="epi-ai-response-text">{chat.message}</p>
                    )}
                  </div>
                ) : (
                  chat.message
                )}
              </div>
            ))}

            {isLoading && (
              <div className="ask-episilion-loader-container">
                <div className="ask-episilion-loader active"></div>
              </div>
            )}
          </div>

          <div className="ask-episilion-search-conatainer">
            <div className="ask-episilion-search-bar">
              <textarea
                className="ask-episilion-input-box"
                onChange={searchInput}
                onKeyDown={handleKeyDown}
                value={userSearchInput}
                placeholder="Ask about hostels, pricing, and amenities.."
              />
              <button
                className="ask-episilion-search-button"
                onClick={sendMessage}
              >
                <Send className="send-image-epislion" />
              </button>
            </div>
            <div className="ask-epislion-warning-message">
              Episilion AI can make mistakes. Always verify hostels details
              before booking
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
