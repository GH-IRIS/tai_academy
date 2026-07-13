// Tap Academy TAI Platform Clone - Interactive JavaScript

window.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupStatsCounter();
    setupActiveScrollLinks();
    setupCoursesDropdown();
    setupSyllabusAccordions();
    setupPlacementFilters();
    setupPlatformTabs();
    setupMentorHover();
    setupAdvisorForm();
    setupPlacementsCarousel();
    setupCourseTabs();
});

// Mobile Hamburger Menu Toggler
function setupMobileMenu() {
    const toggleBtn = document.getElementById("mobile-toggle-btn");
    const navMenu = document.getElementById("nav-menu");

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            
            // Toggle hamburger icon between bars and close X
            const icon = toggleBtn.querySelector("i");
            if (navMenu.classList.contains("open")) {
                icon.className = "fas fa-times";
            } else {
                icon.className = "fas fa-bars";
            }
        });

        // Close menu on nav item click (mobile)
        navMenu.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                toggleBtn.querySelector("i").className = "fas fa-bars";
            });
        });
    }
}

// Numerical Statistics Increment Animation (Intersection Observer)
function setupStatsCounter() {
    const statsSection = document.getElementById("stats");
    const statNumbers = document.querySelectorAll(".stat-number");

    if (!statsSection || statNumbers.length === 0) return;

    const observerOptions = {
        root: null,
        threshold: 0.2
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(numElement => {
                    const targetAttr = numElement.getAttribute("data-target");
                    if (targetAttr) {
                        const target = parseInt(targetAttr);
                        animateCount(numElement, target);
                    }
                });
                // Stop observing after firing animation once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statsObserver.observe(statsSection);
}

function animateCount(element, target) {
    let start = 0;
    const duration = 2000; // 2 seconds
    
    // Adjust steps for large numbers (like 75,000) so it finishes in 2 seconds
    const increment = Math.max(1, Math.floor(target / 100)); 
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString() + "+";
            clearInterval(timer);
        } else {
            element.textContent = start.toLocaleString() + "+";
        }
    }, 15);
}

// Scroll aware active nav links
function setupActiveScrollLinks() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });
}

// Courses Dropdown behavior (for mobile toggle)
function setupCoursesDropdown() {
    const dropdownToggle = document.getElementById("dropdown-toggle");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener("click", (e) => {
            // Only trigger click behavior on mobile screens
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownMenu.classList.toggle("mobile-show");
                
                // Rotate chevron icon
                const chevron = dropdownToggle.querySelector("i");
                if (dropdownMenu.classList.contains("mobile-show")) {
                    chevron.style.transform = "rotate(180deg)";
                } else {
                    chevron.style.transform = "rotate(0deg)";
                }
            }
        });
    }
}

// Collapsible Syllabus Accordions
function setupSyllabusAccordions() {
    const headers = document.querySelectorAll(".accordion-header-custom");
    
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            
            // Toggle active state on current item
            item.classList.toggle("active");
            
            // Adjust max-height dynamically
            if (item.classList.contains("active")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = 0;
            }
        });
    });
}

// Search and Filter logic for placed students on placements.html
function setupPlacementFilters() {
    const searchInput = document.getElementById("placement-search");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const placedCards = document.querySelectorAll(".placed-card");
    const noResultsMessage = document.getElementById("no-results-message");

    if (!placedCards.length) return;

    let activeFilter = "all";
    let searchQuery = "";

    function filterCards() {
        let visibleCount = 0;
        
        placedCards.forEach(card => {
            const courseType = card.getAttribute("data-course");
            const studentName = card.querySelector(".placed-user-details h3") ? card.querySelector(".placed-user-details h3").textContent.toLowerCase() : "";
            const companyName = card.querySelector(".placed-meta-item:first-of-type .meta-val") ? card.querySelector(".placed-meta-item:first-of-type .meta-val").textContent.toLowerCase() : "";
            const packageVal = card.querySelector(".placed-meta-item:last-of-type .meta-val") ? card.querySelector(".placed-meta-item:last-of-type .meta-val").textContent.toLowerCase() : "";
            
            const matchesFilter = activeFilter === "all" || courseType === activeFilter;
            const matchesSearch = studentName.includes(searchQuery) || 
                                  companyName.includes(searchQuery) || 
                                  packageVal.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                card.style.display = "block";
                setTimeout(() => {
                    card.style.opacity = "1";
                }, 10);
                visibleCount++;
            } else {
                card.style.opacity = "0";
                card.style.display = "none";
            }
        });

        // Toggle no results feedback message
        if (noResultsMessage) {
            if (visibleCount === 0) {
                noResultsMessage.style.display = "block";
            } else {
                noResultsMessage.style.display = "none";
            }
        }
    }

    // Listen to Search input events
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterCards();
        });
    }

    // Listen to Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Toggle active visual class
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            activeFilter = btn.getAttribute("data-filter");
            filterCards();
        });
    });
}

// TAI Platform Tab Switching Logic
function setupPlatformTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-tab");

            // Update active button
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Update active panel
            panels.forEach(panel => {
                panel.classList.remove("active");
                if (panel.getAttribute("id") === `tab-${target}`) {
                    panel.classList.add("active");
                }
            });
        });
    });
}

// Mentor Hover Profiles
function setupMentorHover() {
    const avatars = document.querySelectorAll(".mentor-avatar-tag");

    const mentorData = {
        "Rohit": {
            role: "Senior Full-Stack Architect",
            desc: "12+ years building enterprise Java systems. Formerly Tech Lead at IBM, specializes in Spring Security, microservices, and system design."
        },
        "Kshitij": {
            role: "Lead Python Architect",
            desc: "Expert in Django, REST APIs, and core DSA logic structures. Guides students through competitive coding paradigms."
        },
        "Somanna M G": {
            role: "Head of Data Science",
            desc: "Mathematical modeling and advanced analytics veteran. Specializes in SQL optimizations, Excel dashboards, and Power BI KPIs."
        },
        "Harshith": {
            role: "Frontend Lead & UI Expert",
            desc: "React.js developer focusing on clean state management, visual responsive components, and UI/UX micro-interactions."
        },
        "Ravi": {
            role: "Senior Placement Lead",
            desc: "10+ years coordinating with corporate HRs, optimizing resumes, and directing mock technical and HR interviews."
        }
    };

    avatars.forEach(avatar => {
        avatar.addEventListener("mouseenter", () => {
            const name = avatar.getAttribute("data-mentor");
            const info = mentorData[name];
            
            // Find the display card local to the active course slide
            const activeCard = avatar.closest(".course-detail-card");
            const displayCard = activeCard ? activeCard.querySelector(".mentor-details-card") : null;
            
            if (info && displayCard) {
                displayCard.innerHTML = `
                    <strong>${name}</strong>
                    <span style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--accent-blue); margin-top: 2px;">${info.role}</span>
                    <p style="margin-top: 6px; font-size: 12px; line-height: 1.4; color: var(--text-secondary);">${info.desc}</p>
                `;
                displayCard.classList.add("highlight");
            }
        });

        avatar.addEventListener("mouseleave", () => {
            const activeCard = avatar.closest(".course-detail-card");
            const displayCard = activeCard ? activeCard.querySelector(".mentor-details-card") : null;
            if (displayCard) {
                displayCard.classList.remove("highlight");
                displayCard.innerHTML = "Hover over an avatar initials bubble to see their profile details!";
            }
        });
    });
}

// Advisor form feedback
function setupAdvisorForm() {
    const form = document.getElementById("advisor-form");
    const feedback = document.getElementById("form-feedback-message");

    if (form && feedback) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("username").value;
            const phone = document.getElementById("userphone").value;
            
            // Basic 10-digit validation
            if (!/^\d{10}$/.test(phone)) {
                feedback.style.color = "#dc2626";
                feedback.textContent = "❌ Please enter a valid 10-digit phone number.";
                return;
            }

            feedback.style.color = "#16a34a";
            feedback.innerHTML = `🎉 Thank you, <strong>${name}</strong>! Your callback request is confirmed. Our advisor will reach out to you within 24 hours.`;
            form.reset();
        });
    }
}

// Placements Carousel Initialization using Swiper.js
function setupPlacementsCarousel() {
    const swiperContainer = document.querySelector(".placements-list-wrapper.swiper");
    if (!swiperContainer) return;

    new Swiper(".placements-list-wrapper.swiper", {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 28,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 28,
            }
        }
    });
}

// Course Tabs Switcher logic
function setupCourseTabs() {
    const tabBtns = document.querySelectorAll(".course-tab-btn");
    const cards = document.querySelectorAll(".course-detail-card");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-course");

            // Update active tab button visual state
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Show selected course card, hide others
            cards.forEach(card => {
                card.classList.remove("active");
                if (card.getAttribute("id") === `course-card-${target}`) {
                    card.classList.add("active");
                }
            });
        });
    });
}
