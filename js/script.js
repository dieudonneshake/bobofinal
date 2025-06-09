document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.mobile-menu') && !e.target.closest('.hamburger')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Quick View Modal
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');

    if (quickViewButtons.length && quickViewModal) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.price').textContent;
                const productImage = productCard.querySelector('img').src;
                
                // Set modal content
                document.getElementById('modalProductName').textContent = productName;
                document.getElementById('modalProductPrice').textContent = productPrice;
                document.getElementById('modalProductImage').src = productImage;
                
                // Product description
                document.getElementById('modalProductDescription').textContent = 
                    `This is a premium ${productName} with all the latest features and technology.`;
                
                // Show modal with animation
                quickViewModal.style.display = 'block';
                setTimeout(() => {
                    quickViewModal.querySelector('.modal-content').style.transform = 'scale(1)';
                    quickViewModal.querySelector('.modal-content').style.opacity = '1';
                }, 10);
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeModal.addEventListener('click', function() {
            quickViewModal.querySelector('.modal-content').style.transform = 'scale(0.9)';
            quickViewModal.querySelector('.modal-content').style.opacity = '0';
            setTimeout(() => {
                quickViewModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                quickViewModal.querySelector('.modal-content').style.transform = 'scale(0.9)';
                quickViewModal.querySelector('.modal-content').style.opacity = '0';
                setTimeout(() => {
                    quickViewModal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }
    
    // WhatsApp Message Functionality
    function sendWhatsAppMessage(productName, productPrice) {
        const phoneNumber = '+250781370531';
        const message = `Hello BOBO250 Electronics Shop,\n\nI would like to purchase:\nProduct: ${productName}\nPrice: ${productPrice}\n\nPlease provide more details about availability, delivery and payment options.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }

    // Handle Buy Now Button Click - Enhanced for all product types
    function handleBuyNowClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const productCard = button.closest('.product-card');
        
        if (productCard) {
            let productName, productPrice;
            
            // Handle simple product cards (like phone cases)
            if (productCard.classList.contains('simple-case')) {
                productName = productCard.querySelector('img').alt || 'Product';
                // Try to find price in various locations
                productPrice = productCard.querySelector('.price')?.textContent || 
                              productCard.dataset.price || 
                              '$0';
            } 
            // Handle regular product cards
            else {
                productName = productCard.querySelector('h3').textContent;
                productPrice = productCard.querySelector('.price').textContent;
            }
            
            sendWhatsAppMessage(productName, productPrice);
            
            // Animation feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Initialize all Buy Now buttons (both regular and simple)
    function initializeBuyNowButtons() {
        // Handle both button types
        document.querySelectorAll('.buy-now, .buy-now-simple').forEach(button => {
            // Skip modal button (handled separately)
            if (!button.closest('#quickViewModal')) {
                button.addEventListener('click', handleBuyNowClick);
            }
        });
        
        // Modal buy now button (separate handler)
        const modalBuyNow = document.querySelector('#quickViewModal .buy-now');
        if (modalBuyNow) {
            modalBuyNow.addEventListener('click', function(e) {
                e.preventDefault();
                const productName = document.getElementById('modalProductName').textContent;
                const productPrice = document.getElementById('modalProductPrice').textContent;
                
                sendWhatsAppMessage(productName, productPrice);
                
                // Animation feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        }
    }

    // Initialize buy now buttons on page load
    initializeBuyNowButtons();

    // Event delegation as fallback for dynamically added buttons
    document.addEventListener('click', function(e) {
        const buyNowButton = e.target.closest('.buy-now, .buy-now-simple');
        if (buyNowButton && !buyNowButton.closest('#quickViewModal') && !e.defaultPrevented) {
            handleBuyNowClick(e);
        }
    });

    // Add animations to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.slide-up, .fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value) {
                // Animation feedback
                const button = this.querySelector('button');
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                setTimeout(() => {
                    button.innerHTML = 'Subscribe <i class="fas fa-paper-plane"></i>';
                }, 2000);
                
                emailInput.value = '';
            } else {
                emailInput.style.border = '1px solid red';
                setTimeout(() => {
                    emailInput.style.border = '1px solid #ddd';
                }, 2000);
            }
        });
    });
});