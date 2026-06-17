/* =========================================================
   TRUST PAGE - INTERACTIVE FEATURES
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===== STATS COUNTING ANIMATION =====
    const counters = document.querySelectorAll(".stat-num");

    if (counters.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetAttr = counter.getAttribute("data-target");
                    if (!targetAttr) return;

                    const target = +targetAttr;
                    let count = 0;
                    const increment = target / 100;

                    const updateCounter = () => {
                        count += increment;
                        if (count < target) {
                            counter.textContent = Math.ceil(count);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                            // Add suffix back
                            if (target === 99) {
                                counter.textContent = "99%";
                            } else if (target === 100) {
                                counter.textContent = "100+";
                            } else if (target === 24) {
                                counter.textContent = "24/7";
                            }
                        }
                    };

                    updateCounter();
                    statsObserver.unobserve(counter); // Animate only once
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            if (counter.hasAttribute("data-target")) {
                statsObserver.observe(counter);
            }
        });
    }

    console.log('Trust page interactive script initialized ✨');
});
