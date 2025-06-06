// Coffee product data
const products = [
  {
    id: 1,
    name: 'Espresso',
    desc: 'Strong and bold Italian coffee.',
    price: 120,
    img: 'main.png',
  },
  {
    id: 2,
    name: 'Cappuccino',
    desc: 'Espresso with steamed milk and foam.',
    price: 150,
    img: 'main.png',
  },
  {
    id: 3,
    name: 'Latte',
    desc: 'Smooth blend of espresso and milk.',
    price: 170,
    img: 'main.png',
  },
  {
    id: 4,
    name: 'Mocha',
    desc: 'Espresso, chocolate, and steamed milk.',
    price: 180,
    img: 'main.png',
  },
];

// Cart state
let cart = [];

// Load cart from localStorage
function loadCart() {
  const saved = localStorage.getItem('coffeeCart');
  if (saved) cart = JSON.parse(saved);
}
function saveCart() {
  localStorage.setItem('coffeeCart', JSON.stringify(cart));
}

// Render Daily Special
function renderDailySpecial() {
  const special = products[Math.floor(Math.random() * products.length)];
  document.getElementById('dailySpecial').innerHTML = `
    <h2>☕ Daily Special</h2>
    <img src="${special.img}" alt="${special.name}" class="special-img" />
    <h3>${special.name}</h3>
    <p>${special.desc}</p>
    <div class="price">₹${special.price}</div>
    <button onclick="addToCart(${special.id})">Add to Cart</button>
  `;
}

// Render Product Menu
function renderProductMenu() {
  document.getElementById('productMenu').innerHTML = products.map(prod => `
    <div class="product-card">
      <img src="${prod.img}" alt="${prod.name}" />
      <h3>${prod.name}</h3>
      <p>${prod.desc}</p>
      <div class="price">₹${prod.price}</div>
      <button onclick="addToCart(${prod.id})">Add to Cart</button>
    </div>
  `).join('');
}

// Add to Cart
window.addToCart = function(id) {
  const item = products.find(p => p.id === id);
  const found = cart.find(c => c.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartBadge();
  saveCart();
}

// Update Cart Badge
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').textContent = count;
}

// Render Cart Overlay
function renderCart() {
  const cartItems = document.getElementById('cartItems');
  if (cart.length === 0) {
    cartItems.innerHTML = '<li>Your cart is empty.</li>';
    document.getElementById('cartTotal').textContent = '0.00';
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <li>
      <span class="cart-item-name">${item.name}</span>
      <div class="qty-controls">
        <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
      </div>
      <span>₹${item.price * item.qty}</span>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    </li>
  `).join('');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// Quantity adjustment
window.increaseQty = function(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.qty += 1;
  updateCartBadge();
  renderCart();
  saveCart();
}
window.decreaseQty = function(id) {
  const found = cart.find(item => item.id === id);
  if (found && found.qty > 1) {
    found.qty -= 1;
  } else {
    cart = cart.filter(item => item.id !== id);
  }
  updateCartBadge();
  renderCart();
  saveCart();
}

// Remove from Cart
window.removeFromCart = function(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartBadge();
  renderCart();
  saveCart();
}

// Cart Overlay Logic
const cartIcon = document.getElementById('cartIcon');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');

cartIcon.addEventListener('click', () => {
  cartOverlay.classList.add('active');
  renderCart();
});
closeCart.addEventListener('click', () => {
  cartOverlay.classList.remove('active');
});
cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) cartOverlay.classList.remove('active');
});

// Checkout logic
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Thank you for your order! Your total is ₹' + cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2));
  cart = [];
  updateCartBadge();
  renderCart();
  saveCart();
  cartOverlay.classList.remove('active');
});

// Initial Render
loadCart();
renderDailySpecial();
renderProductMenu();
updateCartBadge();
