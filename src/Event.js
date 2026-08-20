import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { useNavigate } from "react-router-dom";


  


export default function Event() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const eventTypes = [
    "All",
    "Seminar",
    "Webinar",
    "Food Carnival",
    "Books Fair",
    "Live Concert",
    "Art & Craft Expo",
    "Fashion Show",
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const now = new Date();

    const firebaseEvents = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((e) => !e.deleted && new Date(e.date) >= now);

    setEvents(firebaseEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      navigate("/");
    });
  };

  const filteredEvents = events.filter(
    (e) =>
      (filter === "All" || e.type === filter) &&
      e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-circle animate-bounce-slow">🎉</div>
          <div>
            <h1 className="logo-title">Eventora</h1>
            <p className="tagline">Celebrating Life, One Event at a Time</p>
          </div>
        </div>
        <nav>
          <button onClick={() => navigate("/home")}>Home</button>
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          )}
        </nav>
      </header>

      {/* Search & Filter */}
      <section className="home-section">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "20px",
            width: "70%",
            margin: "20px 0",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />
        <div style={{ marginBottom: "20px" }}>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                margin: "5px",
                padding: "8px 15px",
                borderRadius: "20px",
                border: filter === type ? "2px solid #ff4d6d" : "1px solid #ccc",
                background: filter === type ? "#ffe4e8" : "#fff",
                cursor: "pointer",
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        <div className="breed-grid">
          {filteredEvents.map((e) => (
            <div key={e.id} className="breed-card hover-card">
              <img src={e.img || e.imageUrl} alt={e.name} />
              <h4>{e.name}</h4>
              <p>Type: {e.type}</p>
              <p>Location: {e.location}</p>
              <p>Date: {new Date(e.date).toLocaleDateString()}</p>
              <div className="btn-group">
                <button className="find-btn" onClick={() => setSelectedEvent(e)}>
                  View Detail
                </button>
                {e.bookUrl && (
                  <a
                    href={e.bookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="find-btn"
                  >
                    Book
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "15px",
              width: "90%",
              maxWidth: "500px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedEvent.name}</h3>
            <p>Type: {selectedEvent.type}</p>
            <p>Location: {selectedEvent.location}</p>
            <p>Date: {new Date(selectedEvent.date).toLocaleDateString()}</p>
            <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  }}
>

  {/* BOOK BUTTON */}
  <button
    className="find-btn"
    onClick={() =>
      navigate(
        `/book/${selectedEvent.id}`
      )
    }
  >

    Book Now

  </button>

  {/* VIEW TEASER BUTTON */}
  {selectedEvent.youtubeLink && (

    <button
      className="find-btn"
      onClick={() =>
        navigate(
          `/teaser/${selectedEvent.id}`
        )
      }
    >

      View Teaser

    </button>

  )}

</div>
            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
}
