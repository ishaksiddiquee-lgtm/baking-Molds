// Product management functions
let currentPage = 1;
const itemsPerPage = 12;

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.product-grid')) {
        loadProducts();
    }

    // Add event listeners for filters
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');

    if (categoryFilter) categoryFilter.addEventListener('change', loadProducts);
    if (priceFilter) priceFilter.addEventListener('change', loadProducts);
    if (sortBy) sortBy.addEventListener('change', loadProducts);
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => changePage(-1));
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => changePage(1));

    // Add event listener for sell form
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmission);
    }

    // Add event listener for image preview
    const productImages = document.getElementById('product-images');
    if (productImages) {
        productImages.addEventListener('change', previewImages);
    }
});

// Load products with filters and pagination
function loadProducts(searchQuery = '') {
    // Get filter values
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');

    let filteredProducts = [...products];

    // Apply search filter
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        // Check URL for search parameter
        const urlSearch = getUrlParameter('search');
        if (urlSearch) {
            filteredProducts = filteredProducts.filter(product =>
                product.title.toLowerCase().includes(urlSearch.toLowerCase()) ||
                product.description.toLowerCase().includes(urlSearch.toLowerCase())
            );
        }
    }

    // Apply category filter
    if (categoryFilter && categoryFilter.value) {
        filteredProducts = filteredProducts.filter(product =>
            product.category === categoryFilter.value
        );
    }

    // Apply price filter
    if (priceFilter && priceFilter.value) {
        filteredProducts = filteredProducts.filter(product => {
            const [min, max] = priceFilter.value.split('-');
            if (max === '+') {
                return product.price >= parseInt(min);
            } else if (!min) {
                return true;
            } else {
                return product.price >= parseInt(min) && product.price <= parseInt(max);
            }
        });
    }

    // Apply sorting
    if (sortBy) {
        switch(sortBy.value) {
            case 'newest':
                filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
        }
    }

    // Calculate pagination
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Update page info
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Update pagination buttons
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');

    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
    }
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Render products
    renderProducts(paginatedProducts);
}

// Render products to the page
function renderProducts(productsToShow) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (productsToShow.length === 0) {
        productList.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        return;
    }

    productList.innerHTML = productsToShow.map(product => `
        <div class="product-card">
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
}

// Generate star rating HTML
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

// Change page for pagination
function changePage(direction) {
    const totalPages = Math.ceil(
        products.filter(product => {
            const categoryFilter = document.getElementById('category-filter');
            const priceFilter = document.getElementById('price-filter');

            let match = true;

            if (categoryFilter && categoryFilter.value) {
                match = match && product.category === categoryFilter.value;
            }

            if (priceFilter && priceFilter.value) {
                const [min, max] = priceFilter.value.split('-');
                if (max === '+') {
                    match = match && product.price >= parseInt(min);
                } else if (min) {
                    match = match && product.price >= parseInt(min) && product.price <= parseInt(max);
                }
            }

            return match;
        }).length / itemsPerPage
    );

    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    loadProducts();
}

// Handle product submission
function handleProductSubmission(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const productData = {
        id: generateUniqueId(),
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        condition: formData.get('condition'),
        stock: parseInt(formData.get('stock')),
        brand: formData.get('brand') || '',
        material: formData.get('material') || '',
        dimensions: formData.get('dimensions') || '',
        image: 'assets/images/default-product.jpg', // Default image for now
        rating: 0,
        sellerId: 1, // Default seller ID
        createdAt: new Date().toISOString()
    };

    // Add to products array
    products.push(productData);

    // Save to localStorage
    saveProductsToStorage();

    // Show success message
    showMessage('Product listed successfully!', 'success');

    // Reset form
    event.target.reset();

    // Redirect to products page
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 1500);
}

// Preview selected images
function previewImages(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('image-preview');

    if (!previewContainer) return;

    previewContainer.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.match('image.*')) continue;

        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = `Preview ${i + 1}`;
            previewContainer.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
}

// Add to cart function (if not defined elsewhere)
if (typeof addToCart === 'undefined') {
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
}