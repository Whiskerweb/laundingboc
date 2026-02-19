// ===== FORM MODAL =====
function showForm() {
    const overlay = document.getElementById('form-overlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideForm() {
    const overlay = document.getElementById('form-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function closeFormOnOverlay(event) {
    if (event.target === event.currentTarget) {
        hideForm();
    }
}

// ===== CONDITIONAL FIELDS =====
function handleMetierChange() {
    const metier = document.getElementById('metier').value;
    const fieldCompany = document.getElementById('field-company');
    const fieldFederation = document.getElementById('field-federation');
    const companyInput = document.getElementById('company');
    const federationInput = document.getElementById('federation');

    // Reset all
    fieldCompany.classList.remove('visible');
    fieldFederation.classList.remove('visible');
    companyInput.removeAttribute('required');
    federationInput.removeAttribute('required');
    companyInput.value = '';
    federationInput.value = '';

    if (metier === 'artisan' || metier === 'agent-immo') {
        fieldCompany.classList.add('visible');
        companyInput.setAttribute('required', 'required');
    } else if (metier === 'marchand-de-bien') {
        fieldFederation.classList.add('visible');
        federationInput.setAttribute('required', 'required');
    }
    // particulier: nothing extra
}

// ===== FORM SUBMISSION =====
function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const metier = document.getElementById('metier').value;

    if (!name || !email || !metier) return;

    // Close form
    hideForm();

    // Populate thank you page
    const firstName = name.split(' ')[0];
    document.getElementById('thank-you-name').textContent = firstName;
    document.getElementById('thank-you-email').textContent = email;

    // Show thank you page
    const thankYouPage = document.getElementById('thank-you-page');
    thankYouPage.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Log data (replace with actual API call)
    console.log('Inscription webinaire:', {
        name,
        email,
        metier,
        company: document.getElementById('company').value || null,
        federation: document.getElementById('federation').value || null,
        timestamp: new Date().toISOString()
    });
}

// ===== ESCAPE KEY TO CLOSE MODAL =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideForm();
    }
});

// ===== REVIEWS CAROUSEL =====
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = track.querySelectorAll('.review-card');
    const gap = 24;
    let currentIndex = 0;
    let autoplayTimer = null;

    function getVisibleCount() {
        const containerWidth = track.parentElement.offsetWidth;
        const cardWidth = cards[0].offsetWidth + gap;
        return Math.max(1, Math.floor(containerWidth / cardWidth));
    }

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCount());
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const maxIdx = getMaxIndex();
        for (let i = 0; i <= maxIdx; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', 'Aller à l\'avis ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + gap;
        const offset = currentIndex * cardWidth;
        track.style.transform = 'translateX(-' + offset + 'px)';

        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Update buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= getMaxIndex();
    }

    function goTo(index) {
        const maxIdx = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIdx));
        updateCarousel();
        resetAutoplay();
    }

    function next() {
        if (currentIndex >= getMaxIndex()) {
            goTo(0);
        } else {
            goTo(currentIndex + 1);
        }
    }

    function prev() {
        goTo(currentIndex - 1);
    }

    function resetAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(next, 4000);
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Pause autoplay on hover
    track.addEventListener('mouseenter', () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
    });
    track.addEventListener('mouseleave', resetAutoplay);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        if (autoplayTimer) clearInterval(autoplayTimer);
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else prev();
        }
        resetAutoplay();
    }, { passive: true });

    // Rebuild on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (currentIndex > getMaxIndex()) {
                currentIndex = getMaxIndex();
            }
            buildDots();
            updateCarousel();
        }, 200);
    });

    // Init
    buildDots();
    updateCarousel();
    resetAutoplay();
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Scroll animations
    const animElements = document.querySelectorAll('.info-card, .detail-card, .cta-inner, .review-card');
    animElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease ' + (index * 0.08) + 's, transform 0.6s ease ' + (index * 0.08) + 's';
        observer.observe(el);
    });

    // Carousel
    initCarousel();

    // Navbar scroll effect
    initNavbarScroll();
});
