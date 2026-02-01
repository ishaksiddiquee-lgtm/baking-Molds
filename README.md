# Baking Molds E-commerce Website

A Daraz-like e-commerce website focused on baking molds and accessories, built with HTML, CSS, and JavaScript.

## Features

### Customer Features:
- Browse products with filtering and sorting
- Search functionality
- Add/remove items from cart
- User registration and login
- Profile management
- Order history

### Seller Features:
- List new products for sale
- Manage existing listings
- View sales statistics

### Admin Features:
- Dashboard with sales analytics
- Product management
- Order management
- User management
- Site administration tools

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Client-side functionality
- **localStorage**: Data persistence

## File Structure

```
baking-molds/
├── index.html              # Homepage
├── products.html           # Product listing page
├── sell.html               # Product selling/creation page
├── login.html              # Login page
├── register.html           # Registration page
├── cart.html               # Shopping cart page
├── profile.html            # User profile page
├── admin/
│   ├── index.html          # Admin dashboard
│   ├── products.html       # Admin product management
│   ├── orders.html         # Order management
│   ├── users.html          # User management
│   ├── styles.css          # Admin styles
│   └── script.js           # Admin functionality
├── css/
│   ├── style.css           # Main stylesheet
│   └── responsive.css      # Responsive design
├── js/
│   ├── main.js             # Main JavaScript functionality
│   ├── products.js         # Product handling
│   └── cart.js             # Cart functionality
├── assets/
│   ├── images/             # Images folder
│   └── uploads/            # Product image uploads
└── README.md               # Project documentation
```

## Setup Instructions

1. Clone or download this repository
2. Open `index.html` in a web browser
3. Start exploring the e-commerce features

## Functionality

The website simulates a full e-commerce experience using localStorage for data persistence. All CRUD operations (Create, Read, Update, Delete) for products, users, and orders are implemented client-side.

## Responsive Design

The website is fully responsive and works on mobile, tablet, and desktop devices.

## Security Note

This is a frontend-only implementation for demonstration purposes. In a production environment, proper backend authentication and security measures would be essential.