const continueBtn = document.getElementById("continueBtn");
const slider = document.querySelector(".left-slider");

if (continueBtn && slider) {
  continueBtn.addEventListener("click", () => {
    slider.classList.add("slide-next");
  });
}

const backBtn = document.querySelector('.global-back-btn');
if (backBtn) {
  backBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.history.length > 1 ? window.history.back() : window.location.href = '/';
  });
}



// Hero typing effect script
console.log("MineHR Solutions website loaded successfully!");

document.addEventListener("DOMContentLoaded", () => {

  // Text to type (^ = new line)
  const fullText = "Automate payroll, compliance, attendance, and employee management -^all from one powerful platform.";

  // Get required elements
  const typingElement = document.getElementById("hero-typing-text");
  const signatureElement = document.getElementById("hero-signature");
  const cursorElement = document.getElementById("hero-cursor");

  // Stop if main element not found
  if (!typingElement) {
    console.warn("hero-typing-text element not found!");
    return;
  }

  // Current character index
  let charIndex = 0;

  // Types text character by character
  function typeText() {
    if (charIndex < fullText.length) {
      const char = fullText.charAt(charIndex);

      // Handle line break symbol
      if (char === "^") {
        typingElement.innerHTML += "<br>";
      } else {
        typingElement.innerHTML += char;
      }

      charIndex++;
      setTimeout(typeText, 30); // Typing speed
    } else {
      // Hide cursor and show signature
      if (cursorElement) cursorElement.style.display = "none";
      if (signatureElement) {
        setTimeout(() => {
          signatureElement.style.opacity = "1";
        }, 500);
      }
    }
  }

  // Clear text and start typing
  typingElement.innerHTML = "";
  setTimeout(typeText, 500);
});


// Stats counting animation script using IntersectionObserver
const counters = document.querySelectorAll(".stat-number");
const statsSection = document.querySelector(".stats-section");

if (statsSection && counters.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          const target = +counter.getAttribute("data-target");
          let count = 0;
          const increment = target / 100;

          const updateCounter = () => {
            count += increment;
            if (count < target) {
              counter.textContent = Math.ceil(count);
              requestAnimationFrame(updateCounter);
            } else {
              if (target === 1800) {
                counter.textContent = "1.8K+";
              } else if (target === 48) {
                counter.textContent = "48%+";
              } else if (target === 11) {
                counter.textContent = "11+";
              } else if (target === 3) {
                counter.textContent = "3";
              } else {
                counter.textContent = target;
              }
            }
          };
          updateCounter();
        });
        observer.unobserve(statsSection);
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of the section is visible
  });

  observer.observe(statsSection);
}



// ===== SERVICES INFINITE MARQUEE SCROLL =====
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".services-scroll-container");
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".service-card-scroll"));
  if (cards.length === 0) return;

  // Clone all cards and append them to create a seamless loop
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    container.appendChild(clone);
  });

  let scrollPos = 0;
  let isHovered = false;
  let animationFrameId;

  // Set gap and display
  container.style.display = "flex";
  container.style.gap = "30px";
  container.style.overflow = "hidden";
  container.style.width = "max-content";

  // Wrap container in a parent that hides overflow (done in css by .services-scroll-section)
  
  function scroll() {
    if (!isHovered) {
      scrollPos -= 1.5; // Adjust speed
      
      // Calculate total width of original cards + gaps
      const firstCardWidth = cards[0].offsetWidth;
      const totalWidth = (firstCardWidth + 30) * cards.length;
      
      // Reset if we've scrolled past the first set
      if (Math.abs(scrollPos) >= totalWidth) {
        scrollPos = 0;
      }
      
      container.style.transform = `translateX(${scrollPos}px)`;
    }
    animationFrameId = requestAnimationFrame(scroll);
  }

  container.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  container.addEventListener("mouseleave", () => {
    isHovered = false;
  });

  // Handle touch events to pause on mobile
  container.addEventListener("touchstart", () => {
    isHovered = true;
  }, { passive: true });

  container.addEventListener("touchend", () => {
    isHovered = false;
  }, { passive: true });

  scroll();
});

