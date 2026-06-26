document.addEventListener("DOMContentLoaded", function () {
  const continueBtn = document.getElementById("continueBtn");
  const slider = document.querySelector(".left-slider");

  if (continueBtn && slider) {
    continueBtn.addEventListener("click", () => {
      // Desktop: translateX(-50%) slide transition
      // Mobile: toggles visibility via .slider-active class (see responsive.css)
      slider.classList.add("slide-next");
      slider.classList.add("slider-active");
    });
  }
});

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



// ===== SERVICES INFINITE MARQUEE SCROLL (AUTO & MANUAL) =====
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
  let isMouseOver = false;
  let isDragging = false;
  let startX = 0;
  let dragScrollPos = 0;
  let moved = false;
  let resumeTimeout = null;
  let animationFrameId;

  // Set initial style properties
  container.style.display = "flex";
  container.style.gap = "30px";
  container.style.overflow = "hidden";
  container.style.width = "max-content";
  container.style.cursor = "grab";

  function updateScrollPos(newVal) {
    const firstCardWidth = cards[0].offsetWidth || 280;
    const totalWidth = (firstCardWidth + 30) * cards.length;
    
    // Wrap around to keep scrollPos strictly between (-totalWidth, 0]
    while (newVal > 0) {
      newVal -= totalWidth;
    }
    while (newVal <= -totalWidth) {
      newVal += totalWidth;
    }
    
    scrollPos = newVal;
    container.style.transform = `translateX(${scrollPos}px)`;
  }

  function scroll() {
    if (!isHovered && !isDragging) {
      const firstCardWidth = cards[0].offsetWidth || 280;
      const totalWidth = (firstCardWidth + 30) * cards.length;
      
      let newVal = scrollPos - 1.5; // Adjust speed
      
      // Wrap around
      while (newVal > 0) {
        newVal -= totalWidth;
      }
      while (newVal <= -totalWidth) {
        newVal += totalWidth;
      }
      
      scrollPos = newVal;
      container.style.transform = `translateX(${scrollPos}px)`;
    }
    animationFrameId = requestAnimationFrame(scroll);
  }

  function handleStart(clientX) {
    isDragging = true;
    isHovered = true;
    startX = clientX;
    dragScrollPos = scrollPos;
    container.style.cursor = "grabbing";
    moved = false;
    if (resumeTimeout) clearTimeout(resumeTimeout);
  }

  function handleMove(clientX) {
    if (!isDragging) return;
    const dx = clientX - startX;
    if (Math.abs(dx) > 5) {
      moved = true;
    }
    updateScrollPos(dragScrollPos + dx);
  }

  function handleEnd() {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = "grab";
    
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      if (!isMouseOver) {
        isHovered = false;
      }
    }, 2000); // Resume auto scroll after 2s of inactivity if not hovering
  }

  // Mouse drag events
  container.addEventListener("mousedown", (e) => {
    e.preventDefault(); // Prevents image drag ghosting & text selection
    handleStart(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    handleMove(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    handleEnd();
  });

  // Touch drag events
  container.addEventListener("touchstart", (e) => {
    handleStart(e.touches[0].clientX);
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    handleMove(e.touches[0].clientX);
  }, { passive: true });

  container.addEventListener("touchend", () => {
    handleEnd();
  }, { passive: true });

  // Prevent link click action if dragging occurred
  container.addEventListener("click", (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true); // Use capture phase to intercept click before children get it

  // Mouse hover pause events
  container.addEventListener("mouseenter", () => {
    isMouseOver = true;
    isHovered = true;
    if (resumeTimeout) clearTimeout(resumeTimeout);
  });

  container.addEventListener("mouseleave", () => {
    isMouseOver = false;
    if (!isDragging) {
      isHovered = false;
    }
  });

  // Wheel scroll event
  container.addEventListener("wheel", (e) => {
    // Suppress vertical scrolling on the page when scrolling over the horizontal marquee container
    e.preventDefault();
    isHovered = true;
    isMouseOver = true;
    
    if (resumeTimeout) clearTimeout(resumeTimeout);

    // Combine horizontal and vertical delta for horizontal scroll control
    updateScrollPos(scrollPos - e.deltaY - e.deltaX);

    resumeTimeout = setTimeout(() => {
      if (!isMouseOver) {
        isHovered = false;
      }
    }, 2000); // Resume after 2s if no longer hovering
  }, { passive: false });

  // Start the marquee animation loop
  scroll();
});
