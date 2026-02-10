// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.querySelector('.cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const cursorFollower = document.querySelector('.cursor-follower');

// State
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
    setupCursor();
    setupAnimations();
});

// Render Products
function renderProducts(items) {
    productGrid.innerHTML = items.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div style="overflow: hidden;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">Rs. ${product.price.toLocaleString()}</p>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Cart Functionality
window.addToCart = (id) => { // Attached to window for inline onclick access
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();

    // Add animation to cart icon
    gsap.fromTo('.cart-btn', { scale: 1.5 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
};

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    // Update Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;

    // Update Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">Rs. ${item.price} x ${item.quantity}</p>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `Rs. ${total.toLocaleString()}`;
}

function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active State
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter Logic
        const filter = btn.dataset.filter;
        const filteredProducts = filter === 'all'
            ? products
            : products.filter(p => p.category === filter);

        // Animate Out
        gsap.to('.product-card', {
            opacity: 0,
            y: 20,
            stagger: 0.05,
            duration: 0.3,
            onComplete: () => {
                renderProducts(filteredProducts);
                // Animate In
                gsap.fromTo('.product-card',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 }
                );
            }
        });
    });
});

// Event Listeners
function setupEventListeners() {
    cartToggle.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartDrawer);
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) closeCartDrawer();
    });

    // Make remove function global
    window.removeFromCart = removeFromCart;
}

// Custom Cursor
function setupCursor() {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, .product-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorFollower, { scale: 2.5, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorFollower, { scale: 1, duration: 0.3 });
        });
    });
}

// GSAP Animations
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const tl = gsap.timeline();
    tl.to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
        .to('.cta-btn', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

    // Section Headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
}
