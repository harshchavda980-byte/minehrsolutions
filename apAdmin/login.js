function togglePassword() {
  const p = document.getElementById("password");
  p.type = p.type === "password" ? "text" : "password";
}

function sendOTP() {
  document.getElementById("step-login").classList.add("hidden");
  document.getElementById("step-otp").classList.remove("hidden");
}

function goBack() {
  document.getElementById("step-otp").classList.add("hidden");
  document.getElementById("step-login").classList.remove("hidden");
}

function verifyOTP() {
  document.getElementById("step-otp").classList.add("hidden");
  document.getElementById("loader").classList.remove("hidden");

  setTimeout(() => {
    // Redirect to dashboard
    window.location.href = "../master/index.html";
  }, 2000);
}
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  document.getElementById("loader").style.display = "flex";

  fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("otpBox").style.display = "block";
  })
  .catch(() => alert("Login failed"));
}

function verifyOTP() {
  const otp = document.getElementById("otp").value;
  const email = document.getElementById("email").value;

  fetch("http://localhost:5000/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  })
  .catch(() => alert("Invalid OTP"));
}
if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}
