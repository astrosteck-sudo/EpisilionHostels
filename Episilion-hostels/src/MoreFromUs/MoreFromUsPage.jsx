import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Bell,
  CalendarEvent,
  Check2,
  GeoAlt,
  Heart,
  HouseDoor,
  Megaphone,
  Search,
  StarFill,
} from "react-bootstrap-icons";
import "./MoreFromUsPage.css";

const themeOptions = [
  {
    id: "pink",
    name: "Pink Dream",
    mood: "Soft, bright, all yours",
    swatch: "#e878a6",
  },
  {
    id: "cyber",
    name: "Cyber Tech",
    mood: "A little more electric",
    swatch: "#54ead1",
  },
  {
    id: "midnight",
    name: "Midnight Luxe",
    mood: "Dark mode, dressed up",
    swatch: "#b797f7",
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    mood: "Cool, clear, and coastal",
    swatch: "#57aee0",
  },
  {
    id: "lavender",
    name: "Lavender Haze",
    mood: "A softer kind of daydream",
    swatch: "#a77ce0",
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    mood: "Warm tones, golden hour",
    swatch: "#ed9565",
  },
  {
    id: "forest",
    name: "Forest Calm",
    mood: "Grounded in nature",
    swatch: "#72a776",
  },
  {
    id: "original",
    name: "Original Episilion",
    mood: "The look you know",
    swatch: "#168454",
  },
];

const pulseCategories = [
  "Everything",
  "Parties",
  "Entertainment",
  "Campus life",
  "Social",
];

const pulseStories = [
  {
    category: "Parties",
    title: "A night made for your people",
    description: "A sample look at how student party listings could appear.",
    icon: "✦",
    tone: "party",
  },
  {
    category: "Entertainment",
    title: "Find your next favourite show",
    description: "Entertainment picks, collected in one easy-to-find feed.",
    icon: "♫",
    tone: "show",
  },
  {
    category: "Campus life",
    title: "The little things happening around campus",
    description: "A place for student news, notices, and useful updates.",
    icon: "✳",
    tone: "campus",
  },
  {
    category: "Social",
    title: "Make a plan. Meet your people.",
    description: "Discover activities and reasons to get together.",
    icon: "↗",
    tone: "social",
  },
];

export function MoreFromUsPage() {
  const [selectedTheme, setSelectedTheme] = useState("pink");
  const [selectedCategory, setSelectedCategory] = useState("Everything");
  const visibleStories =
    selectedCategory === "Everything"
      ? pulseStories
      : pulseStories.filter((story) => story.category === selectedCategory);

  return (
    <>
      <title>More From Us | Episilion Hostels</title>

      <main className="more-from-us-page">
        <section className="more-from-us-opening">
          <div className="more-from-us-opening-copy">
            <span className="more-from-us-eyebrow">
              <span className="more-from-us-eyebrow-spark" aria-hidden="true">
                ✳
              </span>
              MORE THAN WHAT YOU KNOW
            </span>
            <h1>
              Episilion is
              <span> just getting started.</span>
            </h1>
            <p>
              Discover what we’re imagining for your next chapter at UPSA —
              a more personal way to explore, and more ways to feel part of
              campus life.
            </p>
            <div className="more-from-us-opening-actions">
              <a className="more-from-us-primary-link" href="#theme-experience">
                Explore the themes <ArrowDown aria-hidden="true" />
              </a>
              <a className="more-from-us-text-link" href="#campus-pulse">
                Meet Campus Pulse <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="more-from-us-opening-art" aria-hidden="true">
            <div className="more-from-us-orbit orbit-one" />
            <div className="more-from-us-orbit orbit-two" />
            <span className="opening-spark spark-one">✳</span>
            <span className="opening-spark spark-two">✦</span>
            <span className="opening-spark spark-three">✦</span>
            <div className="opening-note note-style">
              <span className="opening-note-icon">✧</span>
              <span>
                <strong>Your style</strong>
                <small>make it yours</small>
              </span>
            </div>
            <div className="opening-note note-campus">
              <span className="opening-note-icon">♫</span>
              <span>
                <strong>Your campus</strong>
                <small>stay in the loop</small>
              </span>
            </div>
            <div className="opening-app-tile">
              <img src="/episilion_logo.svg" alt="" />
            </div>
            <span className="opening-caption">GOOD THINGS ARE GROWING</span>
          </div>
        </section>

        <section
          className="more-from-us-theme-section"
          id="theme-experience"
          aria-labelledby="theme-heading"
        >
          <div className="more-from-us-section-intro">
            <span className="more-from-us-section-eyebrow">
              YOUR SPACE. YOUR STYLE.
            </span>
            <div className="more-from-us-theme-intro-row">
              <div>
                <h2 id="theme-heading">
                  What if Episilion looked exactly how you wanted?
                </h2>
                <p>
                  Your hostel search, your aesthetic. Imagine opening Episilion
                  to a design that feels completely yours—from dreamy pink to
                  futuristic tech.
                </p>
              </div>
              <span className="more-from-us-coming-pill">
                <span /> Coming soon
              </span>
            </div>
          </div>

          <div className="more-from-us-theme-stage">
            <aside className="more-from-us-theme-selector">
              <div className="theme-selector-heading">
                <span className="theme-selector-number">01 / 02</span>
                <span className="theme-premium-mark">✦ PREMIUM CONCEPT</span>
              </div>
              <h3>Explore the themes.</h3>
              <p>
                One familiar hostel search. Four ways it could feel.
              </p>

              <div
                className="more-from-us-theme-list"
                role="group"
                aria-label="Preview possible Episilion themes"
              >
                {themeOptions.map((theme, index) => (
                  <button
                    className="more-from-us-theme-choice"
                    data-active={selectedTheme === theme.id}
                    type="button"
                    key={theme.id}
                    aria-pressed={selectedTheme === theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <span
                      className="theme-choice-number"
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                    <span
                      className="theme-choice-swatch"
                      style={{ "--swatch-color": theme.swatch }}
                      aria-hidden="true"
                    />
                    <span className="theme-choice-copy">
                      <strong>{theme.name}</strong>
                      <small>{theme.mood}</small>
                    </span>
                    <span className="theme-choice-check" aria-hidden="true">
                      <Check2 />
                    </span>
                  </button>
                ))}
              </div>

              <div className="more-from-us-theme-note">
                <span className="theme-note-sparkle" aria-hidden="true">
                  ✦
                </span>
                <p>
                  Your look, your way. <strong>The features stay the same.</strong>
                </p>
              </div>
            </aside>

            <div className="more-from-us-live-preview">
              <div className="live-preview-chrome">
                <div className="preview-window-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="preview-window-title">
                  <span className="preview-lock" aria-hidden="true">✦</span>
                  episilionhostels.com
                </span>
                <span className="preview-window-badge">
                  <span /> LIVE CONCEPT
                </span>
              </div>

              <div
                className="more-from-us-hostel-site"
                data-theme={selectedTheme}
                aria-label={`${themeOptions.find((theme) => theme.id === selectedTheme)?.name} preview of the Episilion hostel discovery experience`}
              >
                <div className="mock-site-nav">
                  <span className="mock-site-brand">
                    <img src="/episilion_logo.svg" alt="" />
                    <strong>episilion</strong>
                  </span>
                  <nav className="mock-site-links" aria-label="Preview navigation">
                    <span className="mock-nav-active">Home</span>
                    <span>Hostels</span>
                    <span>About</span>
                  </nav>
                  <span className="mock-profile-chip" aria-hidden="true">A</span>
                </div>

                <div className="mock-site-content">
                  <div className="mock-site-kicker">
                    <span className="mock-kicker-dot" />
                    YOUR NEXT CHAPTER STARTS HERE
                  </div>
                  <h3>Find a place that feels like home.</h3>
                  <p>Explore student-friendly stays around UPSA.</p>

                  <div className="mock-search-bar">
                    <span className="mock-search-location">
                      <GeoAlt aria-hidden="true" />
                      <span>
                        <small>LOCATION</small>
                        <strong>Near UPSA</strong>
                      </span>
                    </span>
                    <span className="mock-search-divider" />
                    <span className="mock-search-type">
                      <HouseDoor aria-hidden="true" />
                      <span>
                        <small>YOUR STAY</small>
                        <strong>Any hostel</strong>
                      </span>
                    </span>
                    <span className="mock-search-action" aria-hidden="true">
                      <Search />
                    </span>
                  </div>

                  <div className="mock-listing-heading">
                    <span>
                      <strong>A place to call yours</strong>
                      <small>Concept listings · Example content</small>
                    </span>
                    <span className="mock-listing-view-all">
                      See all <ArrowRight aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mock-hostel-grid">
                    <article className="mock-hostel-card">
                      <div className="mock-hostel-image-wrap">
                        <img
                          src="https://episilionhostels.onrender.com/images/hostel-images/htc_towers.webp"
                          alt="Illustrative exterior image for the design preview"
                          className="mock-hostel-photo"
                          loading="lazy"
                        />
                        <span className="mock-hostel-image-label">
                          CONCEPT LISTING
                        </span>
                        <span className="mock-hostel-favourite">
                          <Heart aria-hidden="true" />
                        </span>
                      </div>
                      <div className="mock-hostel-card-content">
                        <span className="mock-hostel-category">
                          <span /> STUDENT STAY
                        </span>
                        <strong>A welcoming place to land</strong>
                        <span className="mock-hostel-card-location">
                          <GeoAlt aria-hidden="true" /> Around UPSA
                        </span>
                        <span className="mock-hostel-card-bottom">
                          <span>
                            <strong>GHS 2,800</strong>
                            <small>/ semester · example</small>
                          </span>
                          <span className="mock-hostel-rating">
                            <StarFill aria-hidden="true" /> 4.8
                          </span>
                        </span>
                      </div>
                    </article>

                    <article className="mock-hostel-card">
                      <div className="mock-hostel-image-wrap mock-hostel-room">
                        <img
                          src="/homePageWallpaper.png"
                          alt="Illustrative interior image for the design preview"
                          className="mock-hostel-photo"
                          loading="lazy"
                        />
                        <span className="mock-hostel-image-label">
                          CONCEPT LISTING
                        </span>
                        <span className="mock-hostel-favourite">
                          <Heart aria-hidden="true" />
                        </span>
                      </div>
                      <div className="mock-hostel-card-content">
                        <span className="mock-hostel-category">
                          <span /> STUDENT STAY
                        </span>
                        <strong>A little room to reset</strong>
                        <span className="mock-hostel-card-location">
                          <GeoAlt aria-hidden="true" /> Around UPSA
                        </span>
                        <span className="mock-hostel-card-bottom">
                          <span>
                            <strong>GHS 3,200</strong>
                            <small>/ semester · example</small>
                          </span>
                          <span className="mock-hostel-rating">
                            <StarFill aria-hidden="true" /> 4.9
                          </span>
                        </span>
                      </div>
                    </article>
                  </div>
                </div>
              </div>

              <div className="live-preview-caption">
                <span>
                  <span className="caption-sparkle">✦</span>
                  {themeOptions.find((theme) => theme.id === selectedTheme)?.name}
                </span>
                <span>Same experience. A whole new feeling.</span>
              </div>
            </div>
          </div>
          <p className="more-from-us-demo-disclaimer">
            A visual concept—not a live theme or purchasable pack. Listing
            details and prices are examples only.
          </p>
        </section>

        <section
          className="more-from-us-pulse-section"
          id="campus-pulse"
          aria-labelledby="pulse-heading"
        >
          <div className="pulse-section-heading">
            <span className="more-from-us-section-eyebrow">
              YOUR UPSA. YOUR PEOPLE. YOUR MOMENTS.
            </span>
            <span className="more-from-us-coming-pill pulse-coming">
              <span /> Coming soon
            </span>
          </div>

          <div className="more-from-us-pulse-stage">
            <div className="pulse-story">
              <span className="pulse-story-kicker">
                THE CAMPUS HAS A PULSE
              </span>
              <h2 id="pulse-heading">
                There’s more to
                <span> campus life.</span>
              </h2>
              <p>
                From exciting events to the next big gathering, imagine
                discovering what’s happening around UPSA—all in one place.
                Stay in the loop, find your people, and never miss a chance to
                make a memory.
              </p>
              <a className="pulse-preview-link" href="#pulse-demo">
                Preview Campus Pulse <ArrowRight aria-hidden="true" />
              </a>
              <div className="pulse-story-footnote">
                <span className="pulse-story-footnote-icon">✳</span>
                <span>
                  Events, socials, announcements, and the moments in between.
                </span>
              </div>
              <div className="pulse-orbit pulse-orbit-one" aria-hidden="true" />
              <div className="pulse-orbit pulse-orbit-two" aria-hidden="true" />
            </div>

            <div className="pulse-preview" id="pulse-demo">
              <div className="pulse-preview-topbar">
                <div className="pulse-preview-brand">
                  <span className="pulse-preview-brand-icon">
                    <Megaphone aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Campus Pulse</strong>
                    <small>YOUR UPSA, IN THE LOOP</small>
                  </span>
                </div>
                <span className="pulse-preview-concept-tag">
                  <span /> CONCEPT PREVIEW
                </span>
                <span className="pulse-bell-button" aria-hidden="true">
                  <Bell aria-hidden="true" />
                  <span />
                </span>
              </div>

              <div className="pulse-preview-content">
                <div className="pulse-greeting">
                  <span>THE UPSA COMMUNITY</span>
                  <h3>There’s always something worth discovering.</h3>
                </div>

                <div className="pulse-featured-event">
                  <div className="pulse-event-art">
                    <div className="pulse-event-art-lines" aria-hidden="true" />
                    <div className="pulse-event-art-orb" aria-hidden="true" />
                    <div className="pulse-event-art-copy">
                      <span>YOUR NEXT CAMPUS MOMENT</span>
                      <strong>
                        MAKE
                        <br />
                        SOME
                        <br />
                        MEMORIES
                      </strong>
                      <small>A sample event concept</small>
                    </div>
                    <span className="pulse-event-art-sticker" aria-hidden="true">
                      ✳
                    </span>
                  </div>
                  <div className="pulse-event-details">
                    <span className="pulse-event-label">
                      <CalendarEvent aria-hidden="true" />
                      FEATURED CONCEPT
                    </span>
                    <h4>A good night starts with good people.</h4>
                    <p>
                      Picture finding student socials and entertainment
                      happening around your campus.
                    </p>
                    <span className="pulse-event-more">
                      Discover your scene <ArrowRight aria-hidden="true" />
                    </span>
                    <span className="pulse-event-example">
                      Illustrative content · No real event
                    </span>
                  </div>
                </div>

                <div className="pulse-feed-heading">
                  <span>
                    <strong>Find your kind of moment</strong>
                    <small>Ideas for a future campus feed</small>
                  </span>
                  <span className="pulse-feed-count">SAMPLE FEED</span>
                </div>

                <div
                  className="pulse-category-list"
                  role="group"
                  aria-label="Filter illustrative Campus Pulse categories"
                >
                  {pulseCategories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      aria-pressed={selectedCategory === category}
                      data-active={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="pulse-story-list" aria-live="polite">
                  {visibleStories.map((story) => (
                    <article
                      className="pulse-story-card"
                      data-tone={story.tone}
                      key={story.category}
                    >
                      <span className="pulse-story-card-art" aria-hidden="true">
                        {story.icon}
                      </span>
                      <span className="pulse-story-card-copy">
                        <span className="pulse-story-card-category">
                          {story.category} · SAMPLE
                        </span>
                        <strong>{story.title}</strong>
                        <small>{story.description}</small>
                      </span>
                      <ArrowRight
                        className="pulse-story-card-arrow"
                        aria-hidden="true"
                      />
                    </article>
                  ))}
                </div>

                <div className="pulse-notice-preview">
                  <span className="pulse-notice-icon">
                    <Megaphone aria-hidden="true" />
                  </span>
                  <span>
                    <small>COMMUNITY NOTICE · SAMPLE</small>
                    <strong>
                      A home for the updates that matter to students.
                    </strong>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </div>

                <p className="pulse-disclaimer">
                  Everything shown is illustrative sample content. No real
                  events, dates, venues, or announcements are listed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="more-from-us-closing">
          <div className="closing-sparkles" aria-hidden="true">
            <span>✦</span>
            <span>✳</span>
            <span>✦</span>
          </div>
          <span className="closing-eyebrow">THE NEXT CHAPTER IS TAKING SHAPE</span>
          <h2>More ways to make student life yours.</h2>
          <p>
            While we imagine what’s next, discover what’s here today.
          </p>
          <Link to="/" className="closing-home-link">
            Explore hostels <ArrowRight aria-hidden="true" />
          </Link>
          <span className="closing-availability">
            Premium themes and Campus Pulse are future concepts.
          </span>
        </section>
      </main>
    </>
  );
}
