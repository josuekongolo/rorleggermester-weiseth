/* ================================================
   RØRLEGGERMESTER WEISETH - Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ------------------------------------------------
    // Mobile Navigation Toggle
    // ------------------------------------------------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a nav link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ------------------------------------------------
    // Header Scroll Effect
    // ------------------------------------------------
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ------------------------------------------------
    // Smooth Scroll for Anchor Links
    // ------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ------------------------------------------------
    // Contact Form Handler
    // ------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.querySelector('.form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: contactForm.querySelector('#name').value.trim(),
                email: contactForm.querySelector('#email').value.trim(),
                phone: contactForm.querySelector('#phone').value.trim(),
                address: contactForm.querySelector('#address')?.value.trim() || '',
                jobType: contactForm.querySelector('#jobType').value,
                description: contactForm.querySelector('#description').value.trim(),
                isUrgent: contactForm.querySelector('#urgent')?.checked || false,
                wantSiteVisit: contactForm.querySelector('#siteVisit')?.checked || false
            };

            // Simple validation
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormMessage('Vennligst fyll ut alle obligatoriske felt.', 'error');
                return;
            }

            if (!isValidEmail(formData.email)) {
                showFormMessage('Vennligst oppgi en gyldig e-postadresse.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Sender...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual Resend API call)
                await simulateFormSubmission(formData);

                showFormMessage(
                    'Takk for din henvendelse! Jeg tar kontakt så snart som mulig, vanligvis innen noen timer på hverdager.',
                    'success'
                );
                contactForm.reset();
            } catch (error) {
                showFormMessage(
                    'Beklager, noe gikk galt. Vennligst prøv igjen eller ring meg direkte.',
                    'error'
                );
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function simulateFormSubmission(data) {
        // Simulate API call delay
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                // In production, replace this with actual Resend API call:
                /*
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();
                */

                console.log('Form data submitted:', data);
                resolve({ success: true });
            }, 1500);
        });
    }

    // ------------------------------------------------
    // Intersection Observer for Animations
    // ------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .value-card, .benefit-item, .project-card').forEach(function(el) {
        el.style.opacity = '0';
        animateOnScroll.observe(el);
    });

    // ------------------------------------------------
    // Active Navigation Link
    // ------------------------------------------------
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (currentPath.endsWith(href) ||
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    setActiveNavLink();

    // ------------------------------------------------
    // Phone Number Click Tracking (Analytics placeholder)
    // ------------------------------------------------
    document.querySelectorAll('a[href^="tel:"]').forEach(function(phoneLink) {
        phoneLink.addEventListener('click', function() {
            // Analytics tracking placeholder
            console.log('Phone link clicked:', this.getAttribute('href'));

            // In production, add analytics tracking:
            // gtag('event', 'click', { event_category: 'contact', event_label: 'phone' });
        });
    });

    // ------------------------------------------------
    // Lazy Load Images
    // ------------------------------------------------
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ------------------------------------------------
    // Year in Footer (Copyright)
    // ------------------------------------------------
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ------------------------------------------------
    // Escape Key to Close Mobile Menu
    // ------------------------------------------------
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ------------------------------------------------
    // Form Input Validation Visual Feedback
    // ------------------------------------------------
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    formInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#EF4444';
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#EF4444';
            } else {
                this.style.borderColor = '';
            }
        });

        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });

    // ------------------------------------------------
    // Service Card Hover Effect (Touch devices)
    // ------------------------------------------------
    if ('ontouchstart' in window) {
        document.querySelectorAll('.service-card').forEach(function(card) {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px)';
            });

            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }

    // ------------------------------------------------
    // Console message for developers
    // ------------------------------------------------
    console.log('%cRørleggermester Weiseth', 'color: #1A3A5C; font-size: 20px; font-weight: bold;');
    console.log('%cProfesjonell VVS-service i Trondheim', 'color: #B87333; font-size: 14px;');

});

// ------------------------------------------------
// Resend API Integration (for production)
// ------------------------------------------------
/*
async function sendContactEmail(formData) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_RESEND_API_KEY',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'noreply@weiseth-ror.no',
            to: 'post@weiseth-ror.no',
            subject: `Ny henvendelse fra ${formData.name}${formData.isUrgent ? ' - HASTER' : ''}`,
            html: `
                <h2>Ny henvendelse fra nettskjema</h2>
                <p><strong>Navn:</strong> ${formData.name}</p>
                <p><strong>E-post:</strong> ${formData.email}</p>
                <p><strong>Telefon:</strong> ${formData.phone}</p>
                <p><strong>Adresse:</strong> ${formData.address || 'Ikke oppgitt'}</p>
                <p><strong>Type oppdrag:</strong> ${formData.jobType}</p>
                <p><strong>Beskrivelse:</strong></p>
                <p>${formData.description}</p>
                <p><strong>Haster:</strong> ${formData.isUrgent ? 'Ja' : 'Nei'}</p>
                <p><strong>Ønsker befaring:</strong> ${formData.wantSiteVisit ? 'Ja' : 'Nei'}</p>
            `,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return response.json();
}
*/
