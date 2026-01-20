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
