// =====================================
// APPLY FORM OPEN / CLOSE
// =====================================

function openForm() {

  // Close job modal if open
  const jobModal = document.getElementById("jobModal");
  if (jobModal) jobModal.style.display = "none";

  // Open apply modal
  const applyModal = document.getElementById("applyModal");
  if (applyModal) applyModal.style.display = "flex";
}

function closeForm() {
  const applyModal = document.getElementById("applyModal");
  if (applyModal) applyModal.style.display = "none";
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
}

function closeJob(){
  const jobModal = document.getElementById("jobModal");
  if (jobModal) jobModal.style.display = "none";
}


// =====================================
// SUCCESS POPUP AFTER SUBMIT
// =====================================

document.addEventListener("DOMContentLoaded", function() {

  const form = document.querySelector(".apply-form-box form");

  if(form){
    // FormSubmit requires these hidden fields for proper AJAX submission
    const hiddenEmail = document.createElement("input");
    hiddenEmail.type = "hidden";
    hiddenEmail.name = "_replyto";
    hiddenEmail.value = "info@minehrsolutions.com";
    form.appendChild(hiddenEmail);

    const hiddenSubject = document.createElement("input");
    hiddenSubject.type = "hidden";
    hiddenSubject.name = "_subject";
    hiddenSubject.value = "New Job Application - MineHR";
    form.appendChild(hiddenSubject);

    // Disable captcha for AJAX
    const hiddenCaptcha = document.createElement("input");
    hiddenCaptcha.type = "hidden";
    hiddenCaptcha.name = "_captcha";
    hiddenCaptcha.value = "false";
    form.appendChild(hiddenCaptcha);

    form.addEventListener("submit", async function(e) {
      e.preventDefault();

      // Show loading state on button
      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn.innerText;
      submitBtn.innerText = "Submitting...";
      submitBtn.disabled = true;

      const formData = new FormData(form);

      try {
        const response = await fetch("https://formsubmit.co/ajax/info@minehrsolutions.com", {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if(response.ok){
          // Close apply modal
          const applyModal = document.getElementById("applyModal");
          if (applyModal) applyModal.style.display = "none";

          // Show success modal
          const successModal = document.getElementById("successModal");
          if (successModal) successModal.style.display = "flex";

          form.reset();
        } else {
          alert("Application failed. Please check your internet connection.");
        }
      } catch (err) {
        alert("Error submitting application. Please try again.");
      } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    });
  }

});

function closeSuccess(){
  const successModal = document.getElementById("successModal");
  if (successModal) successModal.style.display = "none";
}


// =====================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// =====================================

window.onclick = function(event) {

  const applyModal = document.getElementById("applyModal");
  const jobModal = document.getElementById("jobModal");
  const successModal = document.getElementById("successModal");

  if (event.target === applyModal) {
    applyModal.style.display = "none";
  }

  if (event.target === jobModal) {
    jobModal.style.display = "none";
  }

  if (event.target === successModal) {
    successModal.style.display = "none";
  }
};


// =====================================
// WHATSAPP CHAT WITH PREFILLED MESSAGE
// =====================================

function chatRecruiter(jobTitle) {

  const number = "917574063353";

  const message =
    `Hello, I am interested in the ${jobTitle} position. Please share more details.`;

  const encodedMessage = encodeURIComponent(message);

  window.open(
    `https://wa.me/${number}?text=${encodedMessage}`,
    "_blank"
  );
}
