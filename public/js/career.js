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
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
  } else {
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
  }
}

function openForm(jobTitle) {

  // Close job modal if open
  const jobModal = document.getElementById("jobModal");
  if (jobModal) jobModal.style.display = "none";

  // Open apply modal
  const applyModal = document.getElementById("applyModal");
  if (applyModal) applyModal.style.display = "flex";
  
  // Set job title in hidden field
  const appliedJobTitle = document.getElementById("appliedJobTitle");
  if (appliedJobTitle) {
    appliedJobTitle.value = jobTitle || "General Application";
  }
  
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
    bde: {
      title: "Business Development Executive",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Identify and develop new business opportunities.</li>
          <li>Build and maintain strong relationships with prospective clients.</li>
          <li>Pitch company services/products effectively to decision-makers.</li>
          <li>Achieve monthly/quarterly business development targets.</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>2–3 Years of experience in Business Development / Sales.</li>
          <li>Location: Ahmedabad (On-site).</li>
          <li>Salary: ₹4–5 LPA + Incentives.</li>
          <li>Excellent communication, negotiation, and interpersonal skills.</li>
        </ul>
      `
    },

    sales_exec: {
      title: "Sales Executive",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Direct interaction with potential leads and clients.</li>
          <li>Understand client requirements and present suitable services.</li>
          <li>Close sales deals and follow up on inquiries.</li>
          <li>Work closely with the team to hit sales goals.</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>0–1 Year experience (Freshers welcome).</li>
          <li>Location: Ahmedabad.</li>
          <li>Salary: ₹2–3 LPA + Incentives.</li>
          <li>Good English and local language speaking skills.</li>
        </ul>
      `
    },

    presales: {
      title: "Pre-Sales Executive",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Conduct initial screening and qualify inbound/outbound leads.</li>
          <li>Explain product/service offerings to potential clients.</li>
          <li>Schedule meetings/demos for the sales team.</li>
          <li>Maintain detailed lead status reports.</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>6 Months–1 Year of experience in a pre-sales or tele-sales role.</li>
          <li>Location: Ahmedabad.</li>
          <li>Salary: ₹3 LPA.</li>
          <li>Strong listening and communication skills.</li>
        </ul>
      `
    },

    devops: {
      title: "DevOps Developer",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Manage and optimize cloud infrastructure (AWS/Azure).</li>
          <li>Build and maintain CI/CD pipelines for deployment.</li>
          <li>Monitor application performance and system uptime.</li>
          <li>Implement security best practices and automate system administration.</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>1 Year of experience in DevOps or Cloud engineering.</li>
          <li>Location: Ahmedabad.</li>
          <li>Salary: ₹3 LPA.</li>
          <li>Hands-on experience with Docker, Git, CI/CD tools, and AWS.</li>
        </ul>
      `
    },

    content_writer: {
      title: "Content Writer",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Create engaging and original content for blogs, websites, and social media.</li>
          <li>Conduct research on industry-related topics to guide writing.</li>
          <li>Proofread and edit copy before publication.</li>
          <li>Optimize content using SEO best practices to increase organic reach.</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>6 Months–2 Years of experience as a content writer or copywriter.</li>
          <li>Location: Ahmedabad.</li>
          <li>Salary: ₹3–4 LPA.</li>
          <li>Excellent written and verbal communication skills in English.</li>
        </ul>
      `
    },

    flutter_intern: {
      title: "Flutter Developer Intern",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Assist in designing and building mobile applications using Flutter.</li>
          <li>Write clean, maintainable, and efficient Dart code.</li>
          <li>Collaborate with cross-functional teams to define and ship new features.</li>
          <li>Debug and resolve issues in existing mobile apps.</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>Fresher with solid understanding of Dart and Flutter fundamentals.</li>
          <li>Location: Ahmedabad.</li>
          <li>Stipend: Paid Internship.</li>
          <li>Portfolio of personal projects or college work is a plus.</li>
        </ul>
      `
    },

    fullstack: {
      title: "Full Stack Developer",
      content: `
        <p><strong>Responsibilities:</strong></p>
        <ul>
          <li>Develop and maintain scalable web applications.</li>
          <li>Build responsive front-end interfaces and secure back-end APIs.</li>
          <li>Integrate databases and third-party services.</li>
          <li>Participate in code reviews and troubleshoot production issues.</li>
        </ul>

        <p><strong>Requirements:</strong></p>
        <ul>
          <li>6 Months–1 Year of experience in Full Stack development.</li>
          <li>Location: Ahmedabad.</li>
          <li>Salary: ₹2–3 LPA.</li>
          <li>Proficient in MongoDB, Express, React, and Node.js (MERN).</li>
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
      const visitorId = localStorage.getItem('mhr_visitor_id');
      const sessionId = sessionStorage.getItem('mhr_session_id');
      if (visitorId) formData.append('visitor_id', visitorId);
      if (sessionId) formData.append('session_id', sessionId);
      formData.append('page', window.location.pathname + window.location.search);
      formData.append('host', window.location.hostname);

      try {
        const response = await fetch("/api/apply", {
          method: "POST",
          body: formData
        });
        const result = await response.json().catch(() => ({}));

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
          alert(result.error || "Application failed. Please try again.");
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

  const number = "917574063353";

  const message =
    `Hello, I am interested in the ${jobTitle} position. Please share more details.`;

  const encodedMessage = encodeURIComponent(message);

  window.open(
    `https://wa.me/${number}?text=${encodedMessage}`,
    "_blank"
  );
}
