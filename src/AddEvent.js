import React, { useState } from "react";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import { uploadImageToCloudinary } from "./uploadImage";

import "./App.css";

export default function AddEvent() {

  const [loading, setLoading] =
    useState(false);

  const handleAddEvent =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        const file =
          e.target.image.files[0];

        const imageUrl =
          await uploadImageToCloudinary(
            file
          );

        const eventData = {

          name:
            e.target.name.value,

          type:
            e.target.type.value,

          location:
            e.target.location.value,

          date:
            e.target.date.value,

          seats: Number(
            e.target.seats.value
          ),

          bookedSeats: 0,

          price: Number(
            e.target.price.value
          ),

          offerPrice: Number(
            e.target.offerPrice.value
          ),

          eventType:
            e.target.eventType.value,

          description:
            e.target.description.value,

          youtubeLink:
            e.target.youtubeLink.value,

          imageUrl: imageUrl,

        };

        await addDoc(
          collection(
            db,
            "events"
          ),
          eventData
        );

        alert(
          "Event added successfully!"
        );

        e.target.reset();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to add event"
        );

      }

      setLoading(false);

    };

  return (

    <div className="add-event-container">

      <h2>Add New Event</h2>

      <form
        onSubmit={
          handleAddEvent
        }
        className="add-event-form"
      >

        <input
          type="text"
          name="name"
          placeholder="Event Name"
          required
        />

        <input
          type="text"
          name="type"
          placeholder="Event Type"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          required
        />

        <input
          type="date"
          name="date"
          required
        />

        <input
          type="number"
          name="seats"
          placeholder="Total Seats"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Original Price"
        />

        <input
          type="number"
          name="offerPrice"
          placeholder="Offer Price"
        />

        <select name="eventType">

          <option value="Paid">
            Paid
          </option>

          <option value="Free">
            Free
          </option>

          <option value="Offer">
            Offer
          </option>

        </select>

        <textarea
          name="description"
          placeholder="Event Description"
        ></textarea>

        {/* YOUTUBE LINK */}
        <input
          type="url"
          name="youtubeLink"
          placeholder="Paste YouTube Link"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          required
        />

        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Adding..."
            : "Add Event"}

        </button>

      </form>

    </div>

  );

}