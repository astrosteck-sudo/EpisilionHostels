import { Link, useNavigate } from "react-router-dom";
import "./AskEpisilion.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { getDeviceId } from "../UTILS/deviceId.js";

import { initializePayment } from "../services/paymentService";
import { buildHostelSlug } from "../UTILS/slugFunctions.js";
import { authHeaders } from "../UTILS/authHeaders";

import {
  ArrowRight,
  Building,
  ChatDots,
  ClockHistory,
  LightbulbFill,
  Robot,
  Send,
  ShieldCheck,
  Stars,
  X,
} from "react-bootstrap-icons";

const STARTER_PROMPTS = [
  "Show me hostels near UPSA under GH₵2,000",
  "I need a female hostel with Wi-Fi",
  "Which hostels have a private bathroom?",
];

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
  const url = "https://episilionhostels.onrender.com"; //THIS IS THE URL FOR THE BACKEND, THIS IS USED TO ACCESS THE IMAGES IN THE PUBLIC FOLDER OF THE BACKEND
  const isSubscribed = Boolean(userSubcriptionInfo?.subscription?.subscribed);
  const requestLimit = isSubscribed ? 15 : 3;
  const requestRemaining = Number(
    isSubscribed ? aiSubscriptionRemaining : remainingRequests,
  );
  const safeRequestRemaining = Math.min(
    requestLimit,
    Math.max(0, Number.isFinite(requestRemaining) ? requestRemaining : 0),
  );
  const isLowOnRequests = !isSubscribed && safeRequestRemaining <= 1;
  const hasNoRequests = !isSubscribed && safeRequestRemaining === 0;
  const usagePercent = Math.min(
    100,
    Math.max(0, (safeRequestRemaining / requestLimit) * 100),
  );

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
    const messagesDiv = document.querySelector(".assistant-messages");
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
            ...authHeaders(),
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

  //Allow sending with Enter key
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
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
      const response = await axios.get(`/api/me`, {
        headers: {
          ...authHeaders(),
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
    if (!open) return undefined;
    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <main className="ask-assistant-page">
      <div className="ask-assistant-layout">
        <aside
          className={`ask-assistant-sidebar${open ? " is-open" : ""}`}
          aria-label="Assistant plan and usage"
        >
          <div className="assistant-sidebar-brand">
            <div className="assistant-sidebar-brand-icon" aria-hidden="true">
              <Robot />
            </div>
            <div>
              <p>EPISILION AI</p>
              <span>Your hostel guide</span>
            </div>
            <button
              className="assistant-sidebar-close"
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant details"
            >
              <X />
            </button>
          </div>

          <div className="assistant-sidebar-intro">
            <span className="assistant-eyebrow">MADE FOR YOUR NEXT MOVE</span>
            <h2>A better way to find your place.</h2>
            <p>
              Tell Episilion what matters to you. We’ll help you explore
              hostels that fit your student life.
            </p>
          </div>

          <section className="assistant-usage-card" aria-label="Daily request usage">
            <div className="assistant-usage-heading">
              <span className="assistant-usage-icon" aria-hidden="true">
                <ClockHistory />
              </span>
              <div>
                <span className="assistant-card-kicker">YOUR PLAN</span>
                <strong>{isSubscribed ? "Premium access" : "Free access"}</strong>
              </div>
            </div>
            <p className="assistant-usage-count">
              <strong>{safeRequestRemaining}</strong>
              <span> / {requestLimit} requests left today</span>
            </p>
            <div
              className="assistant-usage-track"
              role="progressbar"
              aria-label="Daily requests remaining"
              aria-valuemin="0"
              aria-valuemax={requestLimit}
              aria-valuenow={safeRequestRemaining}
            >
              <span style={{ width: `${usagePercent}%` }} />
            </div>
            <p className="assistant-usage-caption">
              {isSubscribed
                ? "Your daily searches refresh each day."
                : "Upgrade for 15 AI hostel searches each day."}
            </p>
          </section>

          {!isSubscribed ? (
            <section
              className={`assistant-premium-card${isLowOnRequests ? " is-low-credits" : ""}${hasNoRequests ? " is-out-of-credits" : ""}`}
            >
              <span className="assistant-premium-icon" aria-hidden="true">
                <Stars />
              </span>
              <p className="assistant-premium-kicker">
                {hasNoRequests
                  ? "NO FREE SEARCHES LEFT"
                  : isLowOnRequests
                    ? "ONE FREE SEARCH LEFT"
                    : "MORE ROOM TO EXPLORE"}
              </p>
              <h3>
                {hasNoRequests
                  ? "Keep your hostel search moving."
                  : "Find your fit, without the limit."}
              </h3>
              <p className="assistant-premium-copy">
                {hasNoRequests
                  ? "Upgrade for 15 AI hostel searches each day for GH₵10/month."
                  : "Get up to 15 AI requests a day for GH₵10/month."}
              </p>
              <button
                className="assistant-premium-button"
                type="button"
                onClick={handleSubscribe}
              >
                {hasNoRequests ? "Unlock 15 daily searches" : "Upgrade access"}
                <ArrowRight aria-hidden="true" />
              </button>
            </section>
          ) : (
            <div className="assistant-plan-note">
              <ShieldCheck aria-hidden="true" />
              <span>Your premium plan is active</span>
            </div>
          )}
          <div className="assistant-sidebar-footnote">
            <ShieldCheck aria-hidden="true" />
            <span>Helpful guidance for your hostel search</span>
          </div>
        </aside>

        {open && (
          <button
            className="assistant-sidebar-backdrop"
            type="button"
            aria-label="Close assistant details"
            onClick={() => setOpen(false)}
          />
        )}

        <section className="ask-assistant-main" aria-label="Ask Episilion chat">
          <header className="assistant-topbar">
            <div className="assistant-topbar-identity">
              <button
                className="assistant-sidebar-toggle"
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open assistant plan and usage"
                aria-expanded={open}
              >
                <ChatDots aria-hidden="true" />
              </button>
              <div className="assistant-topbar-avatar" aria-hidden="true">
                <Robot />
                <span />
              </div>
              <div className="assistant-topbar-copy">
                <h1>Ask Episilion</h1>
                <p>
                  <span className="assistant-online-dot" />
                  Your AI hostel specialist
                </p>
              </div>
            </div>
            <div className="assistant-topbar-actions">
              <div
                className={`assistant-requests-pill${isLowOnRequests ? " is-low-credits" : ""}`}
                aria-label={`${safeRequestRemaining} of ${requestLimit} AI requests left today`}
              >
                <ClockHistory aria-hidden="true" />
                <span>
                  {safeRequestRemaining} / {requestLimit}{" "}
                  <small>today</small>
                </span>
              </div>
              {!isSubscribed && (
                <button
                  className="assistant-topbar-upgrade"
                  type="button"
                  onClick={handleSubscribe}
                >
                  <Stars aria-hidden="true" />
                  <span>Upgrade</span>
                </button>
              )}
            </div>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {chatMessages.length === 0 && (
              <div className="assistant-welcome">
                <span className="assistant-welcome-mark" aria-hidden="true">
                  <Robot />
                </span>
                <span className="assistant-welcome-eyebrow">
                  YOUR UPSA HOSTEL SPECIALIST
                </span>
                <h2>
                  Hi {isLoggedIn ? user?.name || "there" : "there"}, let’s find
                  your next home.
                </h2>
                <p className="assistant-welcome-copy">
                  Ask about location, budget, amenities, or the kind of place
                  you have in mind. I’ll help you narrow it down.
                </p>
                <div className="assistant-starter-heading">
                  <LightbulbFill aria-hidden="true" />
                  <span>Try asking</span>
                </div>
                <div className="assistant-starter-prompts">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setUserSearchInput(prompt)}
                    >
                      {prompt}
                      <ArrowRight aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render the saved conversation and matched hostels. */}
            {chatMessages.map((chat, index) => (
              <div
                key={`${chat.sender}-${index}`}
                className={`assistant-message-row${chat.sender === "user" ? " is-user" : ""}`}
              >
                {chat.sender !== "user" && (
                  <span className="assistant-message-avatar" aria-hidden="true">
                    <Robot />
                  </span>
                )}
                <div
                  className={`assistant-chat-bubble${chat.sender === "user" ? " is-user" : ""}${chat.type === "error" ? " is-error" : ""}${chat.type === "episilionResults" ? " has-results" : ""}`}
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
                              <Link
                                key={hostel.id}
                                className="epi-hostel-card"
                                to={`/hostels/${buildHostelSlug(hostel)}`}
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
                                      <Building className="epi-hostel-thumb-fallback" />
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
                                  View hostel
                                  <ArrowRight aria-hidden="true" />
                                </span>
                              </Link>
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
                    <p className="assistant-message-copy">{chat.message}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="assistant-message-row">
                <span className="assistant-message-avatar" aria-hidden="true">
                  <Robot />
                </span>
                <div className="assistant-typing" role="status">
                  <span />
                  <span />
                  <span />
                  <span className="assistant-sr-only">Episilion is replying</span>
                </div>
              </div>
            )}
          </div>

          <form
            className="assistant-composer-area"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <div className="assistant-composer">
              <textarea
                id="assistant-message-input"
                className="assistant-composer-input"
                onChange={searchInput}
                onKeyDown={handleKeyDown}
                value={userSearchInput}
                placeholder="Ask about hostels, prices, amenities…"
                aria-label="Message Episilion AI"
                rows={1}
              />
              <button
                className="assistant-send-button"
                type="submit"
                disabled={!userSearchInput.trim() || isLoading}
                aria-label="Send message"
              >
                <Send aria-hidden="true" />
              </button>
            </div>
            <p className="assistant-composer-note">
              <ShieldCheck aria-hidden="true" />
              <span>
                Episilion AI can make mistakes. Confirm hostel details before
                booking.
              </span>
              <span className="assistant-composer-shortcut">
                <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for a new line
              </span>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
