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
    console.log('📋 Inscription webinaire:', {
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

// Observe elements for scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const animElements = document.querySelectorAll('.info-card, .detail-card, .cta-inner');
    animElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});
