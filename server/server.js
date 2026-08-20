const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log(
  "SECRET:",
  process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing"
);

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==============================
// CREATE ORDER
// ==============================
app.post("/api/create-order", async (req, res) => {
  try {
    console.log("🔥 CREATE ORDER HIT");
    console.log(req.body);

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("ORDER CREATED:", order);

    res.json(order);

  } catch (error) {
    console.error("RAZORPAY ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      description: error.description,
    });
  }
});
// ==============================
// VERIFY PAYMENT
// ==============================
app.post("/api/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Signature verification failed",
      });
    }
  } catch (error) {
    console.error("VERIFY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});