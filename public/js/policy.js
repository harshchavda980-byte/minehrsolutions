function openModal() {
  document.getElementById("policyModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("policyModal").style.display = "none";
  document.body.style.overflow = "auto";
}

// Close on outside click
window.onclick = function (e) {
  const modal = document.getElementById("policyModal");
  if (e.target === modal) closeModal();
};

// Close on ESC
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});
