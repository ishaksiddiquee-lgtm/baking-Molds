// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showMessage('Item removed from cart!', 'info');

    // Reload cart items if on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
        updateCartSummary();
    }
}

// Update quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        // Reload cart items if on cart page
        if (window.location.pathname.includes('cart.html')) {
            loadCartItems();
            updateCartSummary();
        }

        updateCartCount();
    }
}

// Load cart items to cart page
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');

    if (!cartItemsContainer || !cartSummary) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="products.html">Continue shopping</a></p>';
        cartSummary.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image || 'assets/images/default-product.jpg'}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
                <p class="item-total">${formatCurrency(item.price * item.quantity)}</p>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const deliveryFeeElement = document.getElementById('delivery-fee');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!subtotalElement || !deliveryFeeElement || !totalElement || !checkoutBtn) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? (subtotal > 2000 ? 0 : 100) : 0; // Free delivery over ₹2000
    const total = subtotal + deliveryFee;

    subtotalElement.textContent = formatCurrency(subtotal);
    deliveryFeeElement.textContent = formatCurrency(deliveryFee);
    totalElement.textContent = formatCurrency(total);

    // Enable checkout button if cart has items
    checkoutBtn.disabled = cart.length === 0;

    // Show summary section
    document.getElementById('cart-summary').style.display = 'block';
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
        updateCartSummary();
        showMessage('Cart cleared successfully!', 'info');
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // If on cart page, load cart items
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
    }
});