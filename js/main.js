// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        title: "Silicone Cake Mold - Round",
        description: "High-quality silicone cake mold perfect for baking delicious cakes.",
        price: 899,
        category: "cake-molds",
        condition: "new",
        stock: 15,
        brand: "BakePro",
        material: "Food Grade Silicone",
        dimensions: "25cm diameter",
        image: "assets/images/cake-molds.jpg",
        rating: 4.5,
        sellerId: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "Cupcake Liners Pack of 100",
        description: "Non-stick cupcake liners for perfect cupcakes every time.",
        price: 499,
        category: "cupcake-molds",
        condition: "new",
        stock: 25,
        brand: "SweetBake",
        material: "Paper",
        dimensions: "Standard size",
        image: "assets/images/cupcake-molds.jpg",
        rating: 4.2,
        sellerId: 2,
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        title: "Bread Loaf Pan",
        description: "Heavy-duty bread loaf pan for homemade bread baking.",
        price: 1299,
        category: "bread-molds",
        condition: "new",
        stock: 8,
        brand: "BakeMaster",
        material: "Carbon Steel",
        dimensions: "30cm x 15cm x 10cm",
        image: "assets/images/bread-molds.jpg",
        rating: 4.7,
        sellerId: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        title: "Flexible Silicone Molds Set",
        description: "Set of 6 flexible silicone molds for various baking needs.",
        price: 1599,
        category: "silicone-molds",
        condition: "new",
        stock: 12,
        brand: "FlexiBake",
        material: "Platinum Silicone",
        dimensions: "Various shapes and sizes",
        image: "assets/images/silicone-molds.jpg",
        rating: 4.8,
        sellerId: 3,
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        title: "Cookie Cutter Set - Animals",
        description: "Set of 12 animal-shaped cookie cutters for fun baking.",
        price: 799,
        category: "cookie-cutters",
        condition: "new",
        stock: 20,
        brand: "FunBake",
        material: "Stainless Steel",
        dimensions: "Various sizes",
        image: "assets/images/cookie-cutters.jpg",
        rating: 4.4,
        sellerId: 2,
        createdAt: new Date().toISOString()
    }
];

// Save products to localStorage
localStorage.setItem('products', JSON.stringify(products));

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Initialize theme
    initializeTheme();

    // Add animations when elements come into view
    animateOnScroll();

    // Add event listeners for search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Add smooth scrolling for anchor links
    setupSmoothScrolling();

    // Load featured products on homepage
    if (document.querySelector('.featured-products')) {
        loadFeaturedProducts();
    }
});

// Theme management functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial theme based on saved preference or system preference
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    // Add event listener for theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    } else {
        root.setAttribute('data-theme', 'light');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Load featured products on homepage
function loadFeaturedProducts() {
    try {
        const productList = document.getElementById('product-list');
        if (!productList) return;

        // Get featured products (first 4 products or most popular ones)
        const featuredProducts = products.slice(0, 4);

        if (featuredProducts.length === 0) {
            productList.innerHTML = '<p class="no-products">No products available at the moment.</p>';
            return;
        }

        productList.innerHTML = featuredProducts.map(product => `
            <div class="product-card animated-hover">
                <img src="${product.image || 'assets/images/default-product.jpg'}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">${formatCurrency(product.price)}</p>
                    <div class="product-rating">
                        ${generateStars(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <p class="product-description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                        <button class="btn btn-secondary">View Details</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add animation to newly loaded products
        setTimeout(() => {
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.add('fade-in');
            });
        }, 100);
    } catch (error) {
        console.error('Error loading featured products:', error);
        const productList = document.getElementById('product-list');
        if (productList) {
            productList.innerHTML = '<p class="no-products">Unable to load products. Please refresh the page.</p>';
        }
    }
}

// Check if generateStars function exists, if not define it
if (typeof generateStars === 'undefined') {
    function generateStars(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push('★');
        }

        if (hasHalfStar) {
            stars.push('☆');
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push('☆');
        }

        return stars.join('');
    }
}

// Add animations when elements come into view
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    document.querySelectorAll('.category-item, .product-card, .stat-card, .action-card').forEach(el => {
        observer.observe(el);
    });
}

// Add smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = -scrollPosition * 0.5 + 'px';
    }
});

// Update cart count in header
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        updateCartCount();

        // Show success message
        showMessage('Item added to cart!', 'success');

        // If on cart page, reload cart items
        if (window.location.pathname.includes('cart.html')) {
            if (typeof loadCartItems === 'function') {
                loadCartItems();
                updateCartSummary();
            }
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showMessage('Item removed from cart!', 'info');
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (window.location.pathname.includes('products.html')) {
        // If on products page, trigger product filtering
        if (typeof loadProducts === 'function') {
            loadProducts(searchTerm);
        }
    } else {
        // On other pages, redirect to products page with search term
        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Show message to user
function showMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    // Add to body
    document.body.appendChild(messageDiv);

    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Load products from localStorage
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
    return products;
}

// Save products to localStorage
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Generate unique ID
function generateUniqueId() {
    return Date.now() + Math.floor(Math.random() * 10000);
}