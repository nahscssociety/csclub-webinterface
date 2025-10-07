// ===== NAHS CS Honor Society Interactive Features =====

// Global state and utilities
const CSHonorSociety = {
    // Animation and scroll utilities
    utils: {
        // Debounce function for scroll events
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Check if element is in viewport
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Smooth scroll to element
        scrollToElement(element, offset = 0) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Initialize all features
    init() {
        this.setupNavigation();
        this.setupAnimations();
        this.setupForms();
        this.setupInteractiveElements();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
    }
};

// ===== NAVIGATION FEATURES =====
CSHonorSociety.setupNavigation = function() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbarNav = document.getElementById('navbar-nav');

    // Mobile menu toggle
    if (mobileMenuToggle && navbarNav) {
        mobileMenuToggle.addEventListener('click', () => {
            navbarNav.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', 
                navbarNav.classList.contains('active') ? 'true' : 'false'
            );
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                navbarNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbarNav.classList.contains('active')) {
                navbarNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Navbar scroll effect
    if (navbar) {
        const handleScroll = this.utils.debounce(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10);

        window.addEventListener('scroll', handleScroll);
    }

    // Active navigation highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                CSHonorSociety.utils.scrollToElement(target, 100);
            }
        });
    });
};

// ===== ANIMATION FEATURES =====
CSHonorSociety.setupAnimations = function() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .section-header, .hero-title, .hero-subtitle');
    animateElements.forEach(el => {
        el.classList.add('animate-target');
        observer.observe(el);
    });

    // Add CSS for animations
    if (!document.getElementById('animation-styles')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'animation-styles';
        animationStyles.textContent = `
            .animate-target {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }

            .animate-target.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-xl);
            }

            .btn {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }

            .btn:hover::before {
                left: 100%;
            }

            .hero::before {
                animation: float 20s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }

            .project-image, .member-avatar {
                transition: transform 0.3s ease;
            }

            .card:hover .project-image,
            .card:hover .member-avatar {
                transform: scale(1.02);
            }

            @media (prefers-reduced-motion: reduce) {
                .animate-target,
                .card,
                .btn,
                .project-image,
                .member-avatar {
                    transition: none;
                    animation: none;
                }
            }
        `;
        document.head.appendChild(animationStyles);
    }

    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero, .page-header');
    
    const handleParallax = this.utils.debounce(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        heroSections.forEach(hero => {
            hero.style.transform = `translateY(${rate}px)`;
        });
    }, 10);

    if (heroSections.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', handleParallax);
    }
};

// ===== FORM FEATURES =====
CSHonorSociety.setupForms = function() {
    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    });

    // Character counters for textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        this.addCharacterCounter(textarea);
    });

    // Enhanced checkbox and radio styling
    this.enhanceFormControls();
};

CSHonorSociety.validateField = function(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    }
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    // GPA validation
    else if (field.id === 'gpa' && value) {
        const gpa = parseFloat(value);
        if (gpa < 0 || gpa > 4) {
            isValid = false;
            message = 'GPA must be between 0.0 and 4.0';
        }
    }

    this.setFieldValidation(field, isValid, message);
    return isValid;
};

CSHonorSociety.setFieldValidation = function(field, isValid, message) {
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (isValid) {
        field.style.borderColor = '';
        if (errorElement) errorElement.remove();
    } else {
        field.style.borderColor = 'var(--error)';
        
        if (!errorElement) {
            const error = document.createElement('div');
            error.className = 'field-error text-xs text-error mt-xs';
            error.textContent = message;
            field.parentNode.appendChild(error);
        } else {
            errorElement.textContent = message;
        }
    }
};

CSHonorSociety.clearFieldError = function(field) {
    field.style.borderColor = '';
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) errorElement.remove();
};

CSHonorSociety.handleFormSubmission = function(form) {
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
        if (!this.validateField(input)) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual backend integration)
        setTimeout(() => {
            if (form.id === 'membership-application') {
                this.showSuccessMessage('Thank you for your application! You will receive a confirmation email shortly. Our leadership team will review your application and get back to you within 2 weeks.');
                form.reset();
            } else {
                this.showSuccessMessage('Thank you for your submission!');
            }

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    } else {
        this.showErrorMessage('Please correct the errors above and try again.');
    }
};

CSHonorSociety.addCharacterCounter = function(textarea) {
    const counter = document.createElement('div');
    counter.className = 'text-xs text-muted mt-sm character-counter';
    counter.style.textAlign = 'right';
    textarea.parentNode.appendChild(counter);

    const updateCounter = () => {
        const count = textarea.value.length;
        counter.textContent = `${count} characters`;
        
        // Color coding based on typical essay lengths
        if (count > 300) counter.style.color = 'var(--warning)';
        else if (count > 250) counter.style.color = 'var(--success)';
        else counter.style.color = 'var(--text-muted)';
    };

    textarea.addEventListener('input', updateCounter);
    updateCounter();
};

CSHonorSociety.enhanceFormControls = function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const radios = document.querySelectorAll('input[type="radio"]');

    [...checkboxes, ...radios].forEach(input => {
        input.addEventListener('change', () => {
            input.parentNode.classList.toggle('checked', input.checked);
        });
    });
};

// ===== INTERACTIVE ELEMENTS =====
CSHonorSociety.setupInteractiveElements = function() {
    // Filter functionality for events and projects
    this.setupFilters();
    
    // Image galleries and modals
    this.setupImageInteractions();
    
    // Tooltips and popovers
    this.setupTooltips();
    
    // Search functionality
    this.setupSearch();
    
    // Social sharing
    this.setupSocialSharing();
};

CSHonorSociety.setupFilters = function() {
    const filterContainers = document.querySelectorAll('.filter-btn');
    
    filterContainers.forEach(container => {
        const filterBtns = container.parentNode.querySelectorAll('.filter-btn');
        const targetContainer = container.closest('section').querySelector('[id*="container"], .events-grid, .projects-grid');
        
        if (!targetContainer) return;
        
        const items = targetContainer.querySelectorAll('[data-category]');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                // Filter items with animation
                items.forEach((item, index) => {
                    const categories = item.getAttribute('data-category').split(' ');
                    const shouldShow = filter === 'all' || categories.includes(filter);
                    
                    setTimeout(() => {
                        if (shouldShow) {
                            item.style.display = 'block';
                            item.style.animation = 'fadeInUp 0.5s ease forwards';
                        } else {
                            item.style.animation = 'fadeOut 0.3s ease forwards';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    }, index * 50);
                });
            });
        });
    });

    // Add filter animations CSS
    if (!document.getElementById('filter-animations')) {
        const filterStyles = document.createElement('style');
        filterStyles.id = 'filter-animations';
        filterStyles.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }
        `;
        document.head.appendChild(filterStyles);
    }
};

CSHonorSociety.setupImageInteractions = function() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

CSHonorSociety.setupTooltips = function() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        let tooltip;
        
        element.addEventListener('mouseenter', () => {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--gray-800);
                color: white;
                padding: var(--space-sm);
                border-radius: var(--radius-sm);
                font-size: var(--text-xs);
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            setTimeout(() => tooltip.style.opacity = '1', 10);
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 300);
            }
        });
    });
};

CSHonorSociety.setupSearch = function() {
    // Add search functionality if search input exists
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        const searchableItems = document.querySelectorAll('[data-searchable]');
        
        searchInput.addEventListener('input', this.utils.debounce((e) => {
            const query = e.target.value.toLowerCase().trim();
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                const matches = text.includes(query);
                
                item.style.display = matches ? 'block' : 'none';
            });
        }, 300));
    }
};

CSHonorSociety.setupSocialSharing = function() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = btn.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
};

// ===== ACCESSIBILITY FEATURES =====
CSHonorSociety.setupAccessibility = function() {
    // Focus management
    this.setupFocusManagement();
    
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Screen reader enhancements
    this.setupScreenReaderEnhancements();
};

CSHonorSociety.setupFocusManagement = function() {
    // Focus trap for modals
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    });

    // Skip to main content functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = document.querySelector('#main, main');
            if (main) {
                main.focus();
                main.scrollIntoView();
            }
        });
    }
};

CSHonorSociety.setupKeyboardNavigation = function() {
    // Enhanced button keyboard support
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Card keyboard navigation
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        if (!card.querySelector('a, button')) {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const link = card.querySelector('a');
                    if (link) link.click();
                }
            });
        }
    });
};

CSHonorSociety.setupScreenReaderEnhancements = function() {
    // Live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);

    // Enhanced form labels and descriptions
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        const label = input.parentNode.querySelector('label');
        const helpText = input.parentNode.querySelector('.help-text');
        
        if (label && !input.getAttribute('aria-labelledby')) {
            const labelId = `label-${Math.random().toString(36).substr(2, 9)}`;
            label.id = labelId;
            input.setAttribute('aria-labelledby', labelId);
        }
        
        if (helpText && !input.getAttribute('aria-describedby')) {
            const helpId = `help-${Math.random().toString(36).substr(2, 9)}`;
            helpText.id = helpId;
            input.setAttribute('aria-describedby', helpId);
        }
    });
};

// ===== PERFORMANCE OPTIMIZATIONS =====
CSHonorSociety.setupPerformanceOptimizations = function() {
    // Lazy load non-critical scripts
    this.lazyLoadScripts();
    
    // Optimize images
    this.optimizeImages();
    
    // Cache management
    this.setupCaching();
};

CSHonorSociety.lazyLoadScripts = function() {
    const scripts = [
        // Add any additional scripts that should be loaded lazily
    ];
    
    scripts.forEach(script => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scriptElement = document.createElement('script');
                    scriptElement.src = script.src;
                    scriptElement.async = true;
                    document.head.appendChild(scriptElement);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        // Observe an element that indicates when to load the script
        const trigger = document.querySelector(script.trigger || 'footer');
        if (trigger) observer.observe(trigger);
    });
};

CSHonorSociety.optimizeImages = function() {
    // Add loading="lazy" to images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    
    images.forEach(img => {
        if (img.getBoundingClientRect().top > window.innerHeight) {
            img.setAttribute('loading', 'lazy');
        }
    });
};

CSHonorSociety.setupCaching = function() {
    // Simple localStorage caching for form data
    const forms = document.querySelectorAll('form[data-cache]');
    
    forms.forEach(form => {
        const cacheKey = `form-data-${form.id}`;
        
        // Restore form data
        const savedData = localStorage.getItem(cacheKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) input.value = data[key];
                });
            } catch (e) {
                console.warn('Failed to restore form data:', e);
            }
        }
        
        // Save form data on input
        form.addEventListener('input', this.utils.debounce(() => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            localStorage.setItem(cacheKey, JSON.stringify(data));
        }, 1000));
        
        // Clear cache on successful submission
        form.addEventListener('submit', () => {
            localStorage.removeItem(cacheKey);
        });
    });
};

// ===== UTILITY FUNCTIONS =====
CSHonorSociety.showSuccessMessage = function(message) {
    this.showNotification(message, 'success');
};

CSHonorSociety.showErrorMessage = function(message) {
    this.showNotification(message, 'error');
};

CSHonorSociety.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
        color: white;
        padding: var(--space-md);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Manual close on click
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
};

// ===== INITIALIZATION =====
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CSHonorSociety.init());
} else {
    CSHonorSociety.init();
}

// Update footer year (legacy support)
document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSHonorSociety;
}