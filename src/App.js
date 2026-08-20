// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EventoraApp from "./EventoraApp";
import Signup from "./Signup";
import Login from "./Login";
import Event from "./Event";
import Home from "./Home";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AddEvent from "./AddEvent";
import EventList from "./EventList";
import BookEvent from "./BookEvent";
import TeaserPage from "./TeaserPage";

function App() {
  const [user, setUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      setIsAdmin(currentUser?.email === "admin@example.com"); 
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventoraApp user={user} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/event" element={<Event />} />
        <Route path="/book/:id" element={<BookEvent />} />
        <Route
  path="/teaser/:id"
  element={<TeaserPage />}
/>

        {/*  Admin-only Add Event Route */}
        <Route
          path="/admin"
          element={isAdmin ? <AddEvent /> : <Navigate to="/" />}
        />
      </Routes>

      {/*  Optional admin panel UI */}
      {isAdmin && (
  <div className="admin-dashboard">
    <h2>Admin Dashboard</h2>
    <AddEvent />
    <EventList adminMode={true} />
  </div>
)}

    </Router>
  );
}

export default App;
