
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const productGrid = document.querySelector('.product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.total-amount');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');
const contactForm = document.getElementById('contact-form');
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        category: 'electronics',
        image: "C:\\Users\\LIKKI NANI\\Desktop\\head.jpg",
        description: 'High-quality wireless headphones with noise cancellation.'
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 199.99,
        category: 'electronics',
        image: "C:\\Users\\LIKKI NANI\\Desktop\\watch.jpg",
        description: 'Feature-rich smartwatch with health monitoring.'
    },
    {
        id: 3,
        name: 'Cotton T-Shirt',
        price: 24.99,
        category: 'clothing',
        image: "C:\\Users\\LIKKI NANI\\Desktop\\tshirt.jpg",
        description: 'Comfortable cotton t-shirt available in multiple colors.'
    },
    {
        id: 4,
        name: 'Denim Jeans',
        price: 59.99,
        category: 'clothing',
        image: "C:\\Users\\LIKKI NANI\\Desktop\\jeans.jpg",
        description: 'Classic fit denim jeans for everyday wear.'
    },
    {
        id: 5,
        name: 'Coffee Maker',
        price: 49.99,
        category: 'home',
        image: "C:\\Users\\LIKKI NANI\\Desktop\\coffee.jpg",
        description: 'Automatic coffee maker for your perfect morning brew.'
    },
    {
        id: 6,
        name: 'Blender',
        price: 39.99,
        category: 'home',
        image:"C:\\Users\\LIKKI NANI\\Desktop\\blender.webp",
        description: 'High-power blender for smoothies and food preparation.'
    },
    {
        id: 7,
        name: 'Laptop',
        price: 899.99,
        category: 'electronics',
        image: "C:\\Users\\LIKKI NANI\\Desktop\\lappy.jpg",
        description: 'Thin and light laptop with powerful performance.'
    },
    {
        id: 8,
        name: 'Throw Pillow',
        price: 19.99,
        category: 'home',
        image: "C:\\Users\\LIKKI NANI\\Desktop\\pillow.avif",
        description: 'Soft decorative throw pillow for your living space.'
    }
];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
function init() {
    renderProducts(products);
    setupEventListeners();
    updateCartCount();
}
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }
}
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
    updateCartTotal();
}
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-quantity">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
            </div>
            <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}
function decreaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}
function increaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}
function removeItem(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}
function setupEventListeners() {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.filter);
        });
    });
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert('Thank you for your purchase!');
        cart = [];
        updateCart();
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', init);