import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import emailjs from "@emailjs/browser";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import "./App.css";

export default function BookEvent() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [event, setEvent] =
    useState(null);

  const [quantity, setQuantity] =
    useState(1);

  const [email, setEmail] =
    useState("");

  const [emailError, setEmailError] =
    useState("");

  // FETCH EVENT
  const fetchEvent = useCallback(
    async () => {

      try {

        const docRef = doc(
          db,
          "events",
          id
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {

          setEvent({
            id: docSnap.id,
            ...docSnap.data(),
          });

        } else {

          console.log(
            "No such document!"
          );

        }

      } catch (error) {

        console.log(
          "Fetch Error:",
          error
        );

      }

    },
    [id]
  );

  useEffect(() => {

    fetchEvent();

  }, [fetchEvent]);

  if (!event) {

    return <h2>Loading...</h2>;

  }

  const availableSeats =
    event.seats -
    event.bookedSeats;

  const totalPrice =
    event.eventType === "Offer"
      ? event.offerPrice *
        quantity
      : event.price * quantity;

  // LOAD RAZORPAY SDK
  const loadRazorpay = () => {

    return new Promise(
      (resolve) => {

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          resolve(true);
        };

        script.onerror = () => {
          resolve(false);
        };

        document.body.appendChild(
          script
        );

      }
    );

  };

  // CONFIRM BOOKING
  const confirmBooking =
    async (
      paymentId =
        "FREE_EVENT"
    ) => {

      try {

        // SAVE BOOKING
        await addDoc(
          collection(
            db,
            "bookings"
          ),
          {
            userEmail: email,
            eventId: event.id,
            eventName:
              event.name,
            seatsBooked:
              quantity,
            totalPrice,
            paymentId,
            bookingDate:
              new Date(),
          }
        );

        // UPDATE SEATS
        await updateDoc(
          doc(
            db,
            "events",
            event.id
          ),
          {
            bookedSeats:
              increment(
                quantity
              ),
          }
        );

        // SEND EMAIL
        try {

          const response =
            await emailjs.send(
              "service_70ofgks",
              "template_nhy3tjp",
              {
                name:
                  "Eventora",
                user_email:
                  email,
                event_name:
                  event.name,
                location:
                  event.location,
                date: String(
                  event.date
                ),
                seats:
                  quantity,
                payment_id:
                  paymentId,
                amount:
                  totalPrice,
              },
              "1-qVJaRVXAvLX3gS_"
            );

          console.log(
            "EMAIL SUCCESS:",
            response
          );

        } catch (
          emailError
        ) {

          console.log(
            "EMAIL ERROR:",
            emailError
          );

        }

        alert(
          "Booking Successful!"
        );

        navigate("/event");

      } catch (error) {

        console.log(
          "FULL ERROR:",
          error
        );

        alert(
          "Booking failed"
        );

      }

    };

  // HANDLE PAYMENT
  const handlePayment =
    async () => {

      // EMAIL VALIDATION
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {

        setEmailError(
          "Please enter your email"
        );

        return;

      }

      if (
        !emailRegex.test(email)
      ) {

        setEmailError(
          "Please enter a valid email address"
        );

        return;

      }

      setEmailError("");

      // SEAT VALIDATION
      if (
        quantity < 1 ||
        quantity >
          availableSeats
      ) {

        alert(
          "Invalid seat quantity"
        );

        return;

      }

      try {

        // FREE EVENT
        if (
          event.eventType ===
          "Free"
        ) {

          await confirmBooking();

          return;

        }

        // LOAD RAZORPAY SDK
        const loaded =
          await loadRazorpay();

        if (!loaded) {

          alert(
            "Razorpay SDK failed to load"
          );

          return;

        }

        // CREATE ORDER
        const orderData =
          await fetch(
            "http://localhost:5000/api/create-order",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  amount:
                    totalPrice *
                    100,
                }
              ),
            }
          );

        const order = await orderData.json();

console.log("HTTP Status:", orderData.status);
console.log("Order Response:", order);

if (!orderData.ok) {
  alert(order.message || "Order creation failed");
  return;
}

        // RAZORPAY OPTIONS
        const options = {

          key:
            "rzp_live_SpKboszAuRKUAs",

          amount:
            order.amount,

          currency:
            order.currency,

          name: "Eventora",

          description:
            event.name,

          order_id:
            order.id,

          handler:
            async function (
              response
            ) {

              console.log(
                "PAYMENT RESPONSE:",
                response
              );

              // VERIFY PAYMENT
              const verifyResponse =
                await fetch(
                  "http://localhost:5000/api/verify-payment",
                  {
                    method:
                      "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify(
                      response
                    ),
                  }
                );

              const verifyData =
                await verifyResponse.json();

              if (
                verifyData.success
              ) {

                await confirmBooking(
                  response.razorpay_payment_id
                );

              } else {

                alert(
                  "Payment verification failed"
                );

              }

            },

          prefill: {
            email: email,
          },

          theme: {
            color:
              "#ff4d6d",
          },

          modal: {

            ondismiss:
              function () {

                console.log(
                  "Payment popup closed"
                );

              },

          },

        };

        const paymentObject =
          new window.Razorpay(
            options
          );

        paymentObject.open();

      } catch (error) {

  console.error("PAYMENT ERROR:", error);

  alert(error.message || "Payment failed");

}

    };

  return (

    <div className="app-container">

      <div className="book-event-card">

        <img
          src={event.imageUrl}
          alt={event.name}
        />

        <h2>{event.name}</h2>

        <p>
          <b>Type:</b>{" "}
          {event.type}
        </p>

        <p>
          <b>Location:</b>{" "}
          {event.location}
        </p>

        <p>
          <b>Date:</b>{" "}
          {event.date}
        </p>

        <p>
          <b>Description:</b>{" "}
          {event.description}
        </p>

        <p>
          <b>
            Available Seats:
          </b>{" "}
          {availableSeats}
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {

            setEmail(
              e.target.value
            );

            setEmailError("");

          }}
          required
        />

        {/* EMAIL ERROR */}
        {emailError && (

          <p
            style={{
              color: "red",
              fontSize:
                "14px",
              marginTop: "5px",
            }}
          >

            {emailError}

          </p>

        )}

        {/* QUANTITY */}
        <input
          type="number"
          min="1"
          max={
            availableSeats
          }
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Number(
                e.target.value
              )
            )
          }
        />

        {/* PRICE */}
        {event.eventType ===
        "Free" ? (

          <h3
            style={{
              color: "green",
            }}
          >
            FREE EVENT
          </h3>

        ) : event.eventType ===
          "Offer" ? (

          <h3>
            ₹
            {event.offerPrice *
              quantity}
          </h3>

        ) : (

          <h3>
            ₹
            {event.price *
              quantity}
          </h3>

        )}

        {/* BUTTON */}
        <button
          className="find-btn"
          onClick={
            handlePayment
          }
        >

          {event.eventType ===
          "Free"
            ? "Confirm Booking"
            : "Pay & Book"}

        </button>

      </div>

    </div>

  );

}