/**
 * FlowBot Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Typing effect
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const texts = [
            'your knowledge base',
            'your documentation',
            'your Notion pages',
            'your PDFs',
            'your help center'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100; // Normal speed when typing
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                // Pause at the end of typing
                isDeleting = true;
                typingSpeed = 1500; // Wait before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before typing new text
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start the typing effect
        setTimeout(type, 1000);
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // In a real application, this would send the email to a server
                // For this demo, we'll just show a success message
                showFormSuccess(newsletterForm);
            } else {
                showFormError(emailInput, 'Please enter a valid email address');
            }
        });
    }
    
    // Handle waitlist form submissions
    const heroForm = document.getElementById('hero-waitlist-form');
    const footerForm = document.getElementById('footer-waitlist-form');
    
    const handleFormSubmit = function(event, formId) {
        event.preventDefault();
        
        const form = event.target;
        const email = form.querySelector('input[type="email"]').value;
        const honeypot = form.querySelector('input[name="honeypot"]').value;
        const successElement = document.getElementById(`${formId}-form-success`);
        
        // Check if honeypot field is filled (spam bot)
        if (honeypot) {
            return;
        }
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showFormError(form, 'Please enter a valid email address');
            return;
        }
        
        // Clear any previous errors
        clearFormErrors(form);
        
        // Simulating API call to waitlist service
        // In production, replace with actual API call to Supabase, Firebase, or your backend
        setTimeout(() => {
            // Show success message
            if (successElement) {
                successElement.style.display = 'block';
                
                // Hide the form inputs
                form.querySelector('.form-group').style.display = 'none';
                form.querySelector('.micro-copy').style.display = 'none';
                
                // Log email for development purposes
                console.log(`Waitlist submission: ${email}`);
                
                // Reset form
                form.reset();
                
                // Scroll to the success message if needed
                successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Optional: Send event to analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'waitlist_signup', {
                        'event_category': 'engagement',
                        'event_label': formId
                    });
                }
            }
        }, 1000); // Simulate network delay for better UX
    };
    
    if (heroForm) {
        heroForm.addEventListener('submit', function(event) {
            handleFormSubmit(event, 'hero');
        });
    }
    
    if (footerForm) {
        footerForm.addEventListener('submit', function(event) {
            handleFormSubmit(event, 'footer');
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Show form error helper
    function showFormError(form, message) {
        // Clear any existing errors
        clearFormErrors(form);
        
        // Add error class to input
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.classList.add('input-error');
            
            // Create and append error message
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.textContent = message;
            
            // Add after the form group
            const formGroup = form.querySelector('.form-group');
            if (formGroup) {
                formGroup.after(errorElement);
            }
        }
    }
    
    // Clear form errors helper
    function clearFormErrors(form) {
        // Remove error class from input
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.classList.remove('input-error');
        }
        
        // Remove any error messages
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(el => el.remove());
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (menuToggle && menuToggle.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    if ('IntersectionObserver' in window) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            });
        }, appearOptions);
        
        // Observe elements that should animate on scroll
        document.querySelectorAll('.benefit-card, .step-card, .audience-card').forEach(el => {
            appearOnScroll.observe(el);
        });
    }
    
    // Scroll animations
    const animatedElements = document.querySelectorAll('.benefit-card, .step-card, .story-card, .audience-card');
    
    function checkIfInView() {
        animatedElements.forEach(element => {
            // Get element's position relative to the viewport
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Check if element is in viewport
            if (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) {
                element.classList.add('animated');
            }
        });
    }
    
    // Check on initial load
    checkIfInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkIfInView);
    
    // Add active class to current section in nav
    function setActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.main-nav a');
        
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavItem);
    setActiveNavItem();
    
    // Check if URL has a hash and scroll to it after page load
    window.addEventListener('load', function() {
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            
            if (targetElement) {
                setTimeout(() => {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const bannerHeight = document.querySelector('.top-banner').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + bannerHeight);
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });
});

// Helper functions
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showFormSuccess(form) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = 'Thank you for subscribing!';
    
    // Replace form with success message
    form.innerHTML = '';
    form.appendChild(successMessage);
}

function showFormError(inputElement, message) {
    // Remove any existing error message
    const existingError = inputElement.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error';
    errorMessage.textContent = message;
    
    // Add error class to input
    inputElement.classList.add('input-error');
    
    // Add error message after input
    inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorMessage.remove();
        inputElement.classList.remove('input-error');
    }, 3000);
}

// Helper function to track events in various analytics platforms
function trackEvent(eventName, eventParams) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
    }
    
    // Facebook Pixel
    if (typeof fbq === 'function') {
        fbq('track', eventName, eventParams);
    }
    
    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Event tracked:', eventName, eventParams);
    }
}

// Helper function to get UTM parameters
function getUTMParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
} 