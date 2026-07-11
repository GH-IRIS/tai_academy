// Tap Academy TAI Platform Clone - Interactive JavaScript

window.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupStatsCounter();
    setupActiveScrollLinks();
    setupCoursesDropdown();
    setupSyllabusAccordions();
    setupPlacementFilters();
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
    const stepTime = Math.abs(Math.floor(duration / target));
    
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
            if (pageYOffset >= sectionTop) {
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
            const studentName = card.querySelector(".placed-user-details h3").textContent.toLowerCase();
            const companyName = card.querySelector(".placed-meta-item:first-of-type .meta-val").textContent.toLowerCase();
            const packageVal = card.querySelector(".placed-meta-item:last-of-type .meta-val").textContent.toLowerCase();
            
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
        if (visibleCount === 0) {
            noResultsMessage.style.display = "block";
        } else {
            noResultsMessage.style.display = "none";
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

