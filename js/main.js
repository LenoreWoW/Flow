/**
 * FlowBot Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Typing animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const phrases = [
            'your Notion wiki',
            'your FAQ doc',
            'your help center',
            'your knowledge base',
            'your team docs'
        ];
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let pauseDuration = 1500;
        
        function type() {
            const currentPhrase = phrases[currentPhraseIndex];
            
            if (isDeleting) {
                // Deleting the phrase
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                // Typing the phrase
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100; // Normal typing speed
            }
            
            // Check if completed typing phrase
            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                // Pause at the end of phrase
                isDeleting = true;
                typingSpeed = pauseDuration;
            } else if (isDeleting && currentCharIndex === 0) {
                // Move to next phrase
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start the typing animation
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
    
    function handleFormSubmit(form, successElementId) {
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const emailInput = form.querySelector('input[type="email"]');
            const honeypotField = form.querySelector('input[name="honeypot"]');
            const successElement = document.getElementById(successElementId);
            
            // Spam protection - if honeypot field is filled, ignore submission
            if (honeypotField && honeypotField.value) {
                console.log('Potential spam detected');
                return;
            }
            
            if (emailInput && emailInput.value) {
                // Analytics - track conversion
                if (typeof gtag === 'function') {
                    gtag('event', 'waitlist_signup', {
                        'event_category': 'engagement',
                        'event_label': 'waitlist_join'
                    });
                }
                
                // TODO: Replace with Supabase integration
                // Example Supabase code (commented out):
                /*
                async function storeEmailInSupabase(email) {
                    try {
                        const { data, error } = await supabase
                            .from('waitlist')
                            .insert([{ email: email, created_at: new Date() }]);
                            
                        if (error) throw error;
                        return { success: true, data };
                    } catch (error) {
                        console.error('Error storing email:', error);
                        return { success: false, error };
                    }
                }
                
                storeEmailInSupabase(emailInput.value);
                */
                
                // Store email in localStorage as a temporary solution
                const emails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
                emails.push({
                    email: emailInput.value,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('waitlistEmails', JSON.stringify(emails));
                
                // Show success message
                if (successElement) {
                    successElement.style.display = 'block';
                    successElement.textContent = 'You\'re on the list! Watch your inbox.';
                }
                
                // Clear the form
                emailInput.value = '';
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successElement) {
                        successElement.style.display = 'none';
                    }
                }, 5000);
            }
        });
    }
    
    handleFormSubmit(heroForm, 'hero-form-success');
    handleFormSubmit(footerForm, 'footer-form-success');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    // Add offset for fixed header and banner
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const bannerHeight = document.querySelector('.top-banner').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + bannerHeight);
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
        });
    });
    
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