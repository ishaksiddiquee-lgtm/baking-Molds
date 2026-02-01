// Admin panel JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard stats
    loadDashboardStats();

    // Load recent activity
    loadRecentActivity();

    // Add event listeners for admin functionality
    setupAdminEvents();
});

// Load dashboard statistics
function loadDashboardStats() {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Calculate revenue (simplified)
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Update stat elements
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('total-users').textContent = users.length;
}

// Load recent activity
function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;

    // Sample recent activities (in a real app, this would come from logs)
    const activities = [
        { action: 'New product added', details: 'Silicone Cake Mold - Round', timestamp: new Date(Date.now() - 3600000) },
        { action: 'Order placed', details: '#ORD-001 by John Doe', timestamp: new Date(Date.now() - 7200000) },
        { action: 'User registered', details: 'jane@example.com', timestamp: new Date(Date.now() - 10800000) },
        { action: 'Product updated', details: 'Cupcake Liners Pack', timestamp: new Date(Date.now() - 14400000) },
        { action: 'Order shipped', details: '#ORD-002', timestamp: new Date(Date.now() - 18000000) }
    ];

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div>
                <strong>${activity.action}</strong>
                <p>${activity.details}</p>
            </div>
            <span class="timestamp">${formatTimeAgo(activity.timestamp)}</span>
        </div>
    `).join('');
}

// Format time ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + ' years ago';

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + ' months ago';

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + ' days ago';

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + ' hours ago';

    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
}

// Setup admin events
function setupAdminEvents() {
    // Add logout functionality
    const logoutBtn = document.querySelector('.admin-actions .btn-secondary');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                // In a real app, this would clear admin session
                alert('Logged out successfully!');
                window.location.href = '../index.html';
            }
        });
    }

    // Add refresh functionality to dashboard
    setInterval(loadDashboardStats, 30000); // Refresh every 30 seconds
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Utility function to show admin messages
function showAdminMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type} admin-message`;
    messageDiv.textContent = message;

    // Add to body
    document.body.appendChild(messageDiv);

    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Function to update site settings in localStorage
function updateSiteSettings(settings) {
    localStorage.setItem('siteSettings', JSON.stringify(settings));

    // Update the site in real-time if possible
    if (settings.siteName) {
        document.querySelectorAll('.logo h1').forEach(el => {
            el.textContent = settings.siteName;
        });
    }
}

// Function to update theme colors
function updateThemeColors(colors) {
    // This would typically inject CSS variables into the page
    const root = document.documentElement;

    if (colors.primaryColor) root.style.setProperty('--primary-color', colors.primaryColor);
    if (colors.secondaryColor) root.style.setProperty('--secondary-color', colors.secondaryColor);
    if (colors.accentColor) root.style.setProperty('--accent-color', colors.accentColor);
    if (colors.backgroundColor) root.style.setProperty('--background-color', colors.backgroundColor);

    // Save to localStorage
    localStorage.setItem('themeSettings', JSON.stringify(colors));
}

// Admin-specific functions for other pages
function approveProduct(productId) {
    // In a real app, this would update product status
    showAdminMessage('Product approved successfully!', 'success');
}

function rejectProduct(productId) {
    // In a real app, this would update product status
    showAdminMessage('Product rejected!', 'warning');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        // In a real app, this would remove user from database
        showAdminMessage('User deleted successfully!', 'success');
    }
}

function updateOrderStatus(orderId, newStatus) {
    // In a real app, this would update order status
    showAdminMessage(`Order status updated to ${newStatus}`, 'success');
}