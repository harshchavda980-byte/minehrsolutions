// =====================================
// APPLY FORM OPEN / CLOSE
// =====================================

function updateBodyScroll() {
  const applyModal = document.getElementById("applyModal");
  const jobModal = document.getElementById("jobModal");
  const successModal = document.getElementById("successModal");
  
  const isAnyModalOpen = 
    (applyModal && applyModal.style.display === "flex") ||
    (jobModal && jobModal.style.display === "flex") ||
    (successModal && successModal.style.display === "flex");
    
  if (isAnyModalOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

function openForm() {

  // Close job modal if open
  const jobModal = document.getElementById("jobModal");
  if (jobModal) jobModal.style.display = "none";

  // Open apply modal
  const applyModal = document.getElementById("applyModal");
  if (applyModal) applyModal.style.display = "flex";
  
  updateBodyScroll();
}

function closeForm() {
  const applyModal = document.getElementById("applyModal");
  if (applyModal) applyModal.style.display = "none";
  
  updateBodyScroll();
}


// =====================================
// JOB DESCRIPTION MODAL
// =====================================

function openJob(type) {

  const modal = document.getElementById("jobModal");
  const title = document.getElementById("jobTitle");
  const content = document.getElementById("jobContent");

  if (!modal || !title || !content) return;

  modal.style.display = "flex";

  let jobData = {
    ai: {
      title: "Senior Staff Gen AI Engineer",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Develop AI and Machine Learning models</li>
          <li>Work on LLM based applications</li>
          <li>Collaborate with Data Science team</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>10+ years experience</li>
          <li>Strong Python & SQL knowledge</li>
          <li>Experience in Generative AI</li>
        </ul>
      `
    },

    fullstack: {
      title: "Full Stack Developer (Python & JavaScript) – AI",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Develop full stack applications</li>
          <li>Integrate AI models</li>
          <li>Work with Django & MERN stack</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>7+ years experience</li>
          <li>Strong JavaScript & Python</li>
          <li>Cloud experience (AWS/Azure)</li>
        </ul>
      `
    },

    sales: {
      title: "Consultant (Sales) – Education & Immigration",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Handle client communication</li>
          <li>Manage immigration cases</li>
          <li>Achieve sales targets</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>2–5 years experience</li>
          <li>Strong communication skills</li>
          <li>English speaking mandatory</li>
        </ul>
      `
    }
  };

  if (jobData[type]) {
    title.innerText = jobData[type].title;
    content.innerHTML = jobData[type].content;
  }
  updateBodyScroll();
}

function closeJob(){
  const jobModal = document.getElementById("jobModal");
  if (jobModal) jobModal.style.display = "none";
  updateBodyScroll();
}


// =====================================
// SUCCESS POPUP AFTER SUBMIT
// =====================================

document.addEventListener("DOMContentLoaded", function() {

  const form = document.querySelector(".apply-form-box form");

  if(form){
    // Suppress browser default validation bubbles
    form.setAttribute("novalidate", "true");

    const fullNameInput = form.querySelector("#fullName");
    const emailInput = form.querySelector("#email");
    const phoneInput = form.querySelector("#phone");
    const resumeInput = form.querySelector("#resume");

    function getErrorSpan(input) {
      const fieldWrap = input.closest(".field-wrap");
      if (fieldWrap) {
        return fieldWrap.querySelector(".error-msg");
      }
      return null;
    }

    function showError(input, message) {
      input.classList.add("invalid-input");
      const span = getErrorSpan(input);
      if (span) {
        span.textContent = message;
        span.classList.add("visible");
      }
    }

    function clearError(input) {
      input.classList.remove("invalid-input");
      const span = getErrorSpan(input);
      if (span) {
        span.textContent = "";
        span.classList.remove("visible");
      }
    }

    // Clear errors on user input/focus
    [fullNameInput, emailInput, phoneInput, resumeInput].forEach(input => {
      if (input) {
        input.addEventListener("input", () => clearError(input));
        input.addEventListener("focus", () => clearError(input));
        input.addEventListener("change", () => clearError(input)); // for file input
      }
    });

    form.addEventListener("submit", async function(e) {
      e.preventDefault();

      let hasError = false;
      let firstErrorField = null;

      // ─── 1. VALIDATE FULL NAME ───
      const fullNameVal = fullNameInput.value.trim();
      if (!fullNameVal) {
        showError(fullNameInput, "Full Name is required.");
        hasError = true;
        if (!firstErrorField) firstErrorField = fullNameInput;
      } else {
        clearError(fullNameInput);
      }

      // ─── 2. VALIDATE EMAIL ───
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        showError(emailInput, "Email Address is required.");
        hasError = true;
        if (!firstErrorField) firstErrorField = emailInput;
      } else if (!emailRegex.test(emailVal)) {
        showError(emailInput, "Please enter a valid email address.");
        hasError = true;
        if (!firstErrorField) firstErrorField = emailInput;
      } else {
        clearError(emailInput);
      }

      // ─── 3. VALIDATE PHONE ───
      const phoneVal = phoneInput.value.trim();
      const phoneClean = phoneVal.replace(/[^0-9]/g, "");
      if (!phoneVal) {
        showError(phoneInput, "Phone Number is required.");
        hasError = true;
        if (!firstErrorField) firstErrorField = phoneInput;
      } else if (phoneClean.length < 10) {
        showError(phoneInput, "Please enter a valid phone number (at least 10 digits).");
        hasError = true;
        if (!firstErrorField) firstErrorField = phoneInput;
      } else {
        clearError(phoneInput);
      }

      // ─── 4. VALIDATE RESUME ───
      if (!resumeInput.files || resumeInput.files.length === 0) {
        showError(resumeInput, "Please upload your resume.");
        hasError = true;
        if (!firstErrorField) firstErrorField = resumeInput;
      } else {
        const file = resumeInput.files[0];
        const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
        if (!allowedExtensions.exec(file.name)) {
          showError(resumeInput, "Only PDF, DOC, or DOCX files are allowed.");
          hasError = true;
          if (!firstErrorField) firstErrorField = resumeInput;
        } else {
          clearError(resumeInput);
        }
      }

      if (hasError) {
        if (firstErrorField) {
          firstErrorField.focus();
        }
        return; // Stop form submission
      }

      // Proceed to server submit
      const formData = new FormData(form);

      try {
        const response = await fetch("/api/apply", {
          method: "POST",
          body: formData
        });
        if(response.ok){
          // Close apply modal
          const applyModal = document.getElementById("applyModal");
          if (applyModal) applyModal.style.display = "none";

          // Show success modal
          const successModal = document.getElementById("successModal");
          if (successModal) successModal.style.display = "flex";

          form.reset();
          updateBodyScroll();
        } else {
          alert("Application failed. Please try again.");
        }
      } catch (err) {
        alert("Error submitting application.");
      }
    });
  }

});

function closeSuccess(){
  const successModal = document.getElementById("successModal");
  if (successModal) successModal.style.display = "none";
  updateBodyScroll();
}


// =====================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// =====================================

window.onclick = function(event) {

  const applyModal = document.getElementById("applyModal");
  const jobModal = document.getElementById("jobModal");
  const successModal = document.getElementById("successModal");
  let changed = false;

  if (event.target === applyModal) {
    applyModal.style.display = "none";
    changed = true;
  }

  if (event.target === jobModal) {
    jobModal.style.display = "none";
    changed = true;
  }

  if (event.target === successModal) {
    successModal.style.display = "none";
    changed = true;
  }
  
  if (changed) {
    updateBodyScroll();
  }
};


// =====================================
// WHATSAPP CHAT WITH PREFILLED MESSAGE
// =====================================

function chatRecruiter(jobTitle) {

  const number = "917990977434";

  const message =
    `Hello, I am interested in the ${jobTitle} position. Please share more details.`;

  const encodedMessage = encodeURIComponent(message);

  window.open(
    `https://wa.me/${number}?text=${encodedMessage}`,
    "_blank"
  );
}
