import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { auth } from "./firebase"; 
import "./App.css";

export default function EventoraApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState("home");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const events = [
    {
      id: "Art & Craft",
      name: "Mega Art & Craft Expo",
      img: "/image/craft.jpg",
      note: "Discover creativity at its best with art exhibits, craft stalls, and live demonstrations.",
    },
    {
      id: "Food Fest",
      name: "Food Carnival",
      img: "/image/fd.avif",
      note: "A feast for your senses with gourmet food stalls, live cooking shows, and mouth-watering delicacies.",
    },
    {
      id: "concert",
      name: "Live Concert",
      img: "/image/lc.jpg",
      note: "Experience electrifying performances by top artists in an unforgettable live music show.",
    },
    {
      id: "Fashion",
      name: "Fashion Show",
      img: "/image/fas.jpg",
      note: "Step into the world of glamour with trending fashion collections and runway extravaganza.",
    },
    {
      id: "expo",
      name: "Books Fair",
      img: "/image/book27.jpg",
      note: "Explore thousands of books, meet authors, and enjoy literary sessions for all ages.",
    },
    {
      id: "Fair",
      name: "Creative Bloom Fair",
      img: "/image/blo.webp",
      note: "Discover creativity at its best with art exhibits, craft stalls, and live demonstrations.",
    },
    {
      id: "Carnival",
      name: "Couture Carnival",
      img: "/image/carni.jpg",
      note: "Discover creativity at its best with art exhibits, craft stalls, and live demonstrations.",
    },
    {
      id: "Crime Novel Expo",
      name: "A Special Crime Novel Expo",
      img: "/image/crime.webp",
      note: "Discover creativity at its best with art exhibits, craft stalls, and live demonstrations.",
    },
  ];

  const slides = [
    {
      title: "Make Every Moment Unforgettable ✨",
      text: "From dazzling concerts to gourmet festivals, Eventora brings life to every celebration.",
    },
    {
      title: "Art & Inspiration Everywhere 🎨",
      text: "Discover creative brilliance in exhibitions, craft expos, and artistic workshops that ignite imagination.",
    },
    {
      title: "A Feast for Your Senses 🍴",
      text: "Relish world cuisines, live cooking shows, and gourmet street food at our vibrant food carnivals.",
    },
    {
      title: "Step Into Style 👗",
      text: "Witness stunning collections and elegant designs at our glamorous fashion shows and runway events.",
    },
    {
      title: "Feel the Beat of the Night 🎶",
      text: "Experience electrifying live concerts and musical performances that light up your world.",
    },
    {
      title: "Dive Into Stories 📚",
      text: "Explore endless worlds of knowledge and creativity at our national book fairs and author meetups.",
    },
    {
      title: "Celebrate Creativity 🌈",
      text: "Join art expos, craft fairs, and cultural events that bring artists and dreamers together.",
    },
    {
      title: "Taste the World 🌍",
      text: "From local street flavors to international gourmet delights — your food journey starts here.",
    },
    {
      title: "Fashion Meets Passion 💃",
      text: "Be part of the trendsetting moments defining elegance, culture, and creativity in fashion.",
    },
    {
      title: "Where Every Event Tells a Story 💫",
      text: "Join Eventora — your destination for music, art, books, and unforgettable experiences.",
    },
  ];

  const [slide, setSlide] = useState(0);

  const handleSend = (e) => {
    e.preventDefault();
    emailjs
      .send("service_u9e6ie5", "template_nd00gr6", formData, "f16-qTdlHPRJodm_d")
      .then(() => {
        setSent(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 3000);
      })
      .catch((err) => {
        console.error("❌ Email sending error:", err);
        alert("Message failed to send. Please check your EmailJS setup.");
      });
  };

  const handleExploreEvents = () => {
    if (user) {
      navigate("/Event");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="app-container">
      <div className="paw-bg"></div>

      {/* Header Section */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-circle animate-bounce-slow">🎉</div>
          <div>
            <h1 className="logo-title">Eventora</h1>
            <p className="tagline">Celebrating Life, One Event at a Time</p>
          </div>
        </div>
        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("about")}>About</button>
          <button onClick={() => setPage("support")}>Support</button>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/signup"><button>Sign Up</button></Link>
        </nav>
      </header>

      <main>
        {/* HOME PAGE */}
        {page === "home" && (
          <section className="home-section fade-in">
            {/* Hero Slider */}
            <div className="home-slider">
              <button
                className="slide-arrow left"
                onClick={() => setSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              >
                ❮
              </button>

              <div className="home-text fade-slide">
                <h2>{slides[slide].title}</h2>
                <p>{slides[slide].text}</p>
                <button className="find-btn" onClick={handleExploreEvents}>
                  Explore Events
                </button>
              </div>

              <button
                className="slide-arrow right"
                onClick={() => setSlide((prev) => (prev + 1) % slides.length)}
              >
                ❯
              </button>
            </div>

            {/* Event Cards */}
            <div className="breed-grid">
              {events.map((e) => (
                <div key={e.id} className="breed-card hover-card">
                  <img src={e.img} alt={e.name} />
                  <h4>{e.name}</h4>
                  <p>{e.note}</p>
                </div>
              ))}
            </div>

            {/*  Upcoming Events */}
            <div className="upcoming-section">
              <h2>✨ Upcoming Highlights ✨</h2>
              <p>Mark your calendars for these unmissable experiences!</p>
              <div className="upcoming-grid">
                <div className="up-card">
                  <img src="/image/con.jpg" alt="Concert" />
                  <h4>Summer Beats Music Fest</h4>
                  <p>Dance your heart out to live DJ mixes under the stars.</p>
                </div>
                <div className="up-card">
                  <img src="/image/food.webp" alt="Food Fest" />
                  <h4>Street Food Fiesta</h4>
                  <p>A delicious journey through India’s iconic street foods.</p>
                </div>
                <div className="up-card">
                  <img src="/image/Artfair.jpg" alt="Art" />
                  <h4>Artistry Reloaded</h4>
                  <p>Immerse yourself in colors, crafts, and creative installations.</p>
                </div>
              </div>
            </div>

            {/*  Gallery */}
            <div className="gallery-section">
              <h2>Moments Captured 📸</h2>
              <div className="gallery-grid">
                <img src="/image/artc.avif" alt="Event moment 1" />
                <img src="/image/mo2.webp" alt="Event moment 2" />
                <img src="/image/fash.webp" alt="Event moment 3" />
                <img src="/image/mo4.webp" alt="Event moment 4" />
              </div>
            </div>

            {/* 💬 Testimonials */}
      <div className="testimonial-section">
        <h2>💖 What People Say 💬</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>🎶 Eventora made my weekend magical, truly unforgettable and energetic! 🌟</p>
            <span>By Aditi Sharma ✨</span>
          </div>
          <div className="testimonial-card">
            <p>🍴 Food stalls, music, art — everything felt beautifully — organized! 🎨</p>
            <span>By Rohan Kumar 😍</span>
          </div>
          <div className="testimonial-card">
            <p>💃 Loved every — vibe, great people, fun — shows, pure — happiness! 🎉</p>
            <span>By Priya Nair 💫</span>
          </div>
        </div>
      </div>

            
            <div className="join-section">
  <h2>Join Our Celebration Family 🎊</h2>
  <p>Be part of an ever-growing community of event lovers!</p>
  <button
    className="join-btn"
    onClick={() => {
      if (user) {
        navigate("/Event"); 
      } else {
        navigate("/signup"); 
      }
    }}
  >
    Join Now
  </button>
</div>

          </section>
        )}

        {/* 🌼 ABOUT PAGE */}
        {page === "about" && (
          <section className="register-section fade-in">
            <h2 className="animated-title">About Eventora</h2>
            <p className="animated-para">
              Welcome to Eventora — your ultimate gateway to unforgettable experiences and spectacular celebrations! 🌟
              Whether you’re passionate about music, art, food, or fashion, Eventora brings you closer to the events that
              inspire creativity, joy, and connection. 🎤🎨🍰
              Join the Eventora community today and step into a world where every event tells a story — yours. 🎇
            </p>

            <div className="floating-bubbles">
              {[...Array(7)].map((_, i) => (
                <span key={i} className="bubble"></span>
              ))}
            </div>
          </section>
        )}

        {/* ☎️ SUPPORT PAGE */}
        {page === "support" && (
          <section className="register-section fade-in support-layout">
            <div className="support-info">
              <h2>💬 Support & Contact Us</h2>
              <p>
                Have questions or need assistance? Our friendly team is here to help you explore
                and join the best events around.
              </p>
              <ul>
                <li>📧 Email: support@eventora.com</li>
                <li>📞 Phone: +91 98765 43210</li>
                <li>📍 Location: Chennai, India</li>
              </ul>

              <a
                href="https://chat.whatsapp.com/FfZXcIWpOmEGQktBRxoe1k"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  className="whatsapp-icon"
                />
                Join our WhatsApp Community
              </a>
            </div>

            <form className="contact-form" onSubmit={handleSend}>
              <h3>💌 Send us a Message</h3>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                placeholder="Your Message"
                value={formData.message}
                required
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <button type="submit" className="send-btn">Send Message</button>
              {sent && <p className="success-msg">✅ Message sent successfully!</p>}
            </form>
          </section>
        )}
      </main>

      <footer>© {new Date().getFullYear()} Eventora — Experience the Extraordinary ✨</footer>
    </div>
  );
}
