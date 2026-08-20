import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css"; 

export default function EventList({ adminMode }) {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const eventsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(eventsArray);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteDoc(doc(db, "events", id));
      alert("Event deleted successfully!");
      fetchEvents();
    }
  };

  return (
    <div className="event-list-container">
      <h2 className="event-list-title">Event List</h2>

      {events.length === 0 && (
        <p className="no-event-text">No events found</p>
      )}

      <div className="event-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="event-image"
            />
            <h3>{event.name}</h3>
            <p>
              📍 {event.location} <br />
              🕒 {event.date}
            </p>

            {adminMode && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(event.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
