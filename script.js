const navbar = document.querySelector('.navbar');
const gallerySection = document.querySelector('#gallery-page');
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const stats = document.querySelectorAll('.stat-number');
const navLinks = document.querySelectorAll('.navbar a');
const sections = document.querySelectorAll('section, .main-page, .services-page, .gallery-page, .about-page, .contact-page');
const statsSection = document.getElementById('stats-section');

// Testimonials Carousel Logic
let currentIndex = 0;
function showTestimonial(index) {
    testimonials.forEach((t, i) => {
        t.classList.remove('active');
        if (i === index) {
            t.classList.add('active');
        }
    });
}

if (testimonials.length > 0) {
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    });

    // Optional: Auto-slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}

// Counter Animation for Stats Section
function animateCounter() {
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        let count = 1;
        const speed = Math.min(target / 100, 50); // Adjust speed, limit to avoid fast animation

        const interval = setInterval(() => {
            stat.innerText = count;
            count++;

            if (count > target) {
                clearInterval(interval);
            }
        }, speed);
    });
}

// Trigger counter animation when stats section is in view
const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        animateCounter(); // Start animation when section is in view
    }
}, { threshold: 0.5 });

statsObserver.observe(statsSection);

// IntersectionObserver for Navbar Scroll Effect (Optional)
const navbarObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}, { threshold: 0.5 });

navbarObserver.observe(gallerySection);

// Request Animation Frame for Smooth Scrolling + Active Link
let lastScrollY = 0;
function handleScroll() {
    const scrollY = window.scrollY;
    if (Math.abs(scrollY - lastScrollY) < 2) return; // Prevent unnecessary recalculations
    lastScrollY = scrollY;

    // Sticky Navbar
    if (scrollY + 60 >= gallerySection.offsetTop) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active Link Highlighting
    let currentSectionId = "";
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
            currentSectionId = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSectionId) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(handleScroll);
});
// Smooth scroll without updating URL hash
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Stop the default anchor behavior
        const targetId = this.getAttribute('href').substring(1); // Get ID without #
        const targetEl = document.getElementById(targetId);

        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });

            // Optionally remove focus to avoid outline
            this.blur();
        }
    });
});


function toggleDetails(button) {
    const cardBody = button.closest('.card-body');
    const extraContent = cardBody.querySelector('.card-extra');

    if (extraContent.style.display === "none") {
        extraContent.style.display = "block";
        button.textContent = "See Less Details";
    } else {
        extraContent.style.display = "none";
        button.textContent = "See More Details";
    }
}

document.getElementById("cta-button").addEventListener("click", function () {
    document.getElementById("contact-page").scrollIntoView({ behavior: "smooth" });
});

fetch('gallery.json')
    .then(response => response.json())
    .then(data => {
        const galleryContainer = document.getElementById('galleryContainer');
        let delay = 100;

        // Loop through each category in the JSON data
        for (const [category, images] of Object.entries(data)) {
            const firstImage = images[0]; // Get the first image of the category

            // Create a link for each category with the first image
            const categoryLink = document.createElement('a');
            categoryLink.href = `category.html?category=${encodeURIComponent(category)}`; // Link to the category page
            categoryLink.className = 'category-link';
            categoryLink.setAttribute('data-aos', 'fade-up');
            categoryLink.setAttribute('data-aos-delay', delay);

            const categoryImageContainer = document.createElement('div');
            categoryImageContainer.className = 'category-image-container';
            
            const img = document.createElement('img');
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-name';
            categoryTitle.textContent = category;
            img.src = firstImage;
            img.alt = `${category} First Image`;
            img.className = 'category-image';
            img.loading = 'lazy'; // Lazy load the image
            
            categoryImageContainer.appendChild(img);
            categoryLink.appendChild(categoryImageContainer);
            categoryLink.appendChild(categoryTitle);
            galleryContainer.appendChild(categoryLink);

            delay += 100;
        }
    })
    .catch(error => {
        console.error('Error loading gallery categories:', error);
    });
