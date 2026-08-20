import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import "./App.css";

export default function TeaserPage() {

  const { id } =
    useParams();

  const [event, setEvent] =
    useState(null);

  useEffect(() => {

    fetchEvent();

  }, []);

  const fetchEvent =
    async () => {

      try {

        const docRef = doc(
          db,
          "events",
          id
        );

        const docSnap =
          await getDoc(docRef);

        if (
          docSnap.exists()
        ) {

          setEvent({
            id:
              docSnap.id,
            ...docSnap.data(),
          });

        }

      } catch (error) {

        console.log(error);

      }

    };

  if (!event) {

    return <h2>Loading...</h2>;

  }

  return (

    <div className="app-container">

      <div
        className="book-event-card"
      >

        <h2>
          {event.name} Teaser
        </h2>

        <iframe
  width="100%"
  height="450"
  src={
    event.youtubeLink
      .replace(
        "youtu.be/",
        "www.youtube.com/embed/"
      )
      .replace(
        "watch?v=",
        "embed/"
      )
  }
  title="Event Teaser"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  style={{
    borderRadius: "15px",
    marginTop: "20px",
  }}
></iframe>

      </div>

    </div>

  );

}