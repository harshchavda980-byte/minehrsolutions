const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = "COREHRX_SECRET_KEY";

// TEMP OTP STORE
let otpStore = {};

/* LOGIN */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ msg: "Server error" });

    if (result.length === 0) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    console.log("OTP:", otp); // Replace with Email/SMS service later

    res.json({ msg: "OTP sent" });
  });
});

/* VERIFY OTP */
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];

    const token = jwt.sign({ email }, SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }

  res.status(401).json({ msg: "Invalid OTP" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
