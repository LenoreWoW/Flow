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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    // Add offset for fixed header
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
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
    
    // Handle waitlist form submissions
    const heroForm = document.getElementById('hero-waitlist-form');
    const footerForm = document.getElementById('footer-waitlist-form');
    
    function handleFormSubmit(form, successElementId) {
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const successElement = document.getElementById(successElementId);
            
            if (emailInput && emailInput.value) {
                // Store email in localStorage
                const emails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
                emails.push({
                    email: emailInput.value,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('waitlistEmails', JSON.stringify(emails));
                
                // Show success message
                if (successElement) {
                    successElement.style.display = 'block';
                    successElement.textContent = 'Thank you! You\'ve been added to our waitlist.';
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
    
    // Check if URL has a hash and scroll to it after page load
    window.addEventListener('load', function() {
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            
            if (targetElement) {
                setTimeout(() => {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
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