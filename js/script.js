/* 
   SCROLL & NAVIGATION
 */

// Smooth scroll on scroll indicator click
document.querySelector('.scroll-indicator')?.addEventListener('click', function() {
    window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Back to Top Button Logic
const backToTopBtn = document.querySelector('.btn-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hide/Show Back to Top button based on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });
}

// Navbar active link (Smooth scroll for anchor links)
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

/* 
   ANIMATIONS (Fade In)
 */

// Scroll reveal options
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Inject animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Observe elements
document.querySelectorAll('.card, .stat-item, .impact-card, .about-content').forEach(el => {
    el.style.opacity = '0'; 
    observer.observe(el);
});

/* 
   BUTTON HANDLERS
 */

document.querySelectorAll('.btn-primary, .btn-help').forEach(btn => {
    btn.addEventListener('click', function() {
        const text = this.textContent.toLowerCase();
        if (text.includes('donate')) {
            window.location.href = '/donate';
        } else if (text.includes('help')) {
            window.location.href = '/get-involved';
        }
    });
});

/* 
   COUNTER ANIMATION (Preserves Commas)
 */

function animateCounter(el, target, suffix, originalString) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            clearInterval(timer);
            // restore the original string (with commas/symbols) at the end
            el.textContent = originalString; 
        } else {
            // While counting, simple rounding
            el.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const h3 = entry.target.querySelector('h3');
            
            if (h3 && !h3.dataset.animated) {
                const originalText = h3.textContent;
                
                // Remove commas for calculation: "22,63,435" -> 2263435
                const number = parseInt(originalText.replace(/,/g, '').replace(/\D/g, ''));
                const suffix = originalText.includes('%') ? '%' : '';

                if (!isNaN(number)) {
                    h3.dataset.animated = 'true';
                    animateCounter(h3, number, suffix, originalText);
                }
            }
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.impact-card, .stat-item').forEach(el => {
    counterObserver.observe(el);
});

/* 
   SLIDER LOGIC
 */
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('cardSlider');
    const leftBtn = document.getElementById('slideLeft');
    const rightBtn = document.getElementById('slideRight');

    if(slider && leftBtn && rightBtn) {
        // Scroll amount is width of card + gap (approx 330px)
        const scrollAmount = 330; 

        leftBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        rightBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }
});

const scriptURL = "https://script.google.com/macros/s/AKfycbxzyxV73Z65IdmgEa5Sajrag5QFkzwzocklSpb3FxHw2CbLAQSNeehcuKslVEBNJToM/exec";
const form = document.getElementById('contactForm');

form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
    };

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (result.result === "success") {
            alert("Message sent successfully!");
            form.reset();
        } else {
            alert("Failed to send message.");
        }
    } catch (error) {
        alert("Error sending message.");
        console.error(error);
    }
});