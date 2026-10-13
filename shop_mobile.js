(function () {
const STORAGE_KEY = 'rtt_mobile_shop_cart_v2';
const clothingSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const oneSize = ['One Size'];
const mugSizes = ['11 oz'];
const penSizes = ['Set of 2'];

const categories = [
'All',
'Short Sleeve Shirts',
'Sweatshirts',
'Hoodies',
'Jackets',
'Beanies',
'Pens',
'Mugs',
'Bracelets'
];

const products = [
{ id: 'p200', name: 'Called for Today Crewneck Sweatshirt', category: 'Sweatshirts', price: 40, image: '200.jpeg', description: 'Blue crewneck sweatshirt featuring a dove, rising sun design, and Redeeming The Time Today message.', sizes: clothingSizes },
{ id: 'p201', name: 'Time Well Spent Crewneck Sweatshirt', category: 'Sweatshirts', price: 40, image: '201.jpeg', description: 'Red crewneck sweatshirt with a sunrise clock design, Time Well Spent message, and Redeeming The Time Today branding.', sizes: clothingSizes },
{ id: 'p202', name: 'Purpose Over Pressure Tee', category: 'Short Sleeve Shirts', price: 25, image: '202.jpeg', description: 'White short sleeve tee with a compass, hourglass, road design, and Purpose Over Pressure message.', sizes: clothingSizes },
{ id: 'p203', name: 'Every Moment Has Purpose Tee', category: 'Short Sleeve Shirts', price: 25, image: '203.jpeg', description: 'White short sleeve tee featuring a road, hourglass, dove, and Every Moment Has Purpose message.', sizes: clothingSizes },
{ id: 'p204', name: 'Sunrise Mountain Tee', category: 'Short Sleeve Shirts', price: 25, image: '204.jpeg', description: 'Blue short sleeve tee with mountains, sunrise artwork, and Redeeming The Time Today branding.', sizes: clothingSizes },
{ id: 'p205', name: 'Grace for the Journey Crewneck Sweatshirt', category: 'Sweatshirts', price: 40, image: '205.jpeg', description: 'Green crewneck sweatshirt with a compass, road, trees, and Grace for the Journey message.', sizes: clothingSizes },
{ id: 'p206', name: 'Walk in Faith Hoodie', category: 'Hoodies', price: 50, image: '206.jpeg', description: 'Black hoodie featuring a bright cross, road design, Walk in Faith message, and Every Day Matters detail.', sizes: clothingSizes },
{ id: 'p207', name: 'Live on Purpose Windbreaker Jacket', category: 'Jackets', price: 100, image: '207.jpeg', description: 'Redeeming The Time Today windbreaker with a clock, sun, road design, Live on Purpose message, and Ephesians 5:16 detail.', sizes: clothingSizes },
{ id: 'p208', name: 'Purpose in Motion Varsity Jacket', category: 'Jackets', price: 200, image: '208.jpeg', description: 'Premium varsity jacket featuring Purpose in Motion, Walk Forward in Faith, Hope, Renewal, and Purpose details.', sizes: clothingSizes },
{ id: 'p209', name: 'Write the Vision Pen Set', category: 'Pens', price: 30, image: '209.jpeg', description: 'Two piece Redeeming The Time Today pen set in a presentation box with Write the Vision branding.', sizes: penSizes },
{ id: 'p210', name: 'Redeeming The Time Coffee Mug', category: 'Mugs', price: 10, image: '210.jpeg', description: 'White Redeeming The Time Today coffee mug for daily use, gifting, and supporter merchandise.', sizes: mugSizes },
{ id: 'p211', name: 'Restoring Hope Hoodie', category: 'Hoodies', price: 50, image: '211.jpeg', description: 'White hoodie with Redeeming The Time Today branding and Restoring Hope, Transforming Lives message.', sizes: clothingSizes },
{ id: 'p212', name: 'Redeeming The Time Bracelet', category: 'Bracelets', price: 10, image: '212.jpeg', description: 'Redeeming The Time Today bracelet made for everyday support and simple mission wear.', sizes: oneSize },
{ id: 'p213', name: 'Daily Purpose Coffee Mug', category: 'Mugs', price: 10, image: '213.jpeg', description: 'White supporter coffee mug with a clean Redeeming The Time Today design for home, office, or gifting.', sizes: mugSizes },
{ id: 'p214', name: 'Make the Moment Count Beanie', category: 'Beanies', price: 15, image: '214.jpeg', description: 'Dark blue Redeeming The Time Today beanie with Make the Moment Count message.', sizes: oneSize }
];

let selectedCategory = 'All';
let searchTerm = '';
let cart = loadCart();

const productsGrid = document.getElementById('productsGrid');
const productTemplate = document.getElementById('productTemplate');
const categoryFilters = document.getElementById('categoryFilters');
const productSearch = document.getElementById('productSearch');
const resultCount = document.getElementById('resultCount');
const activeFilterLabel = document.getElementById('activeFilterLabel');
const emptyState = document.getElementById('emptyState');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartPanel = document.getElementById('cartPanel');
const cartScrim = document.getElementById('cartScrim');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartSubtotal = document.getElementById('cartSubtotal');
const checkoutButton = document.getElementById('checkoutButton');
const checkoutMessage = document.getElementById('checkoutMessage');

function formatPrice(amount) {
return '$' + Number(amount).toFixed(2);
}

function loadCart() {
try {
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
return Array.isArray(saved) ? saved.filter(function (item) {
return item && item.id && item.key && Number(item.quantity) > 0;
}) : [];
} catch (error) {
return [];
}
}

function saveCart() {
localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function getProduct(id) {
return products.find(function (product) {
return product.id === id;
});
}

function getFilteredProducts() {
const normalizedSearch = searchTerm.trim().toLowerCase();
return products.filter(function (product) {
const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
const searchable = [product.name, product.category, product.description].join(' ').toLowerCase();
return matchesCategory && (!normalizedSearch || searchable.includes(normalizedSearch));
});
}

function setMissingImage(img) {
const wrap = img.closest('.product-image-wrap');
if (wrap) wrap.classList.add('missing');
img.removeAttribute('src');
}

function renderCategories() {
categoryFilters.innerHTML = '';
categories.forEach(function (category) {
const button = document.createElement('button');
button.type = 'button';
button.className = 'category-chip';
button.textContent = category;
button.dataset.category = category;
button.setAttribute('aria-pressed', category === selectedCategory ? 'true' : 'false');
if (category === selectedCategory) button.classList.add('active');
categoryFilters.appendChild(button);
});
}

function renderProducts() {
const list = getFilteredProducts();
productsGrid.innerHTML = '';
resultCount.textContent = String(list.length);
activeFilterLabel.textContent = selectedCategory === 'All' ? 'All categories' : selectedCategory;
emptyState.hidden = list.length > 0;

list.forEach(function (product) {
const node = productTemplate.content.firstElementChild.cloneNode(true);
const image = node.querySelector('.product-image');
const sizeSelect = node.querySelector('.size-select');
const quantitySelect = node.querySelector('.quantity-select');
const addButton = node.querySelector('.add-button');

image.src = product.image;
image.alt = product.name;
image.addEventListener('error', function () {
setMissingImage(image);
});

node.querySelector('.product-category').textContent = product.category;
node.querySelector('.product-name').textContent = product.name;
node.querySelector('.product-description').textContent = product.description;
node.querySelector('.product-price').textContent = formatPrice(product.price);

product.sizes.forEach(function (size) {
const option = document.createElement('option');
option.value = size;
option.textContent = size;
sizeSelect.appendChild(option);
});

for (let quantity = 1; quantity <= 10; quantity += 1) {
const option = document.createElement('option');
option.value = String(quantity);
option.textContent = String(quantity);
quantitySelect.appendChild(option);
}

addButton.addEventListener('click', function () {
addToCart(product.id, sizeSelect.value, Number(quantitySelect.value));
});

productsGrid.appendChild(node);
});
}

function addToCart(productId, size, quantity) {
const product = getProduct(productId);
if (!product) return;

const safeQuantity = Math.max(1, Number(quantity) || 1);
const key = [product.id, size].join('::');
const existing = cart.find(function (item) {
return item.key === key;
});

if (existing) {
existing.quantity += safeQuantity;
} else {
cart.push({
key: key,
id: product.id,
name: product.name,
category: product.category,
price: product.price,
image: product.image,
size: size,
quantity: safeQuantity
});
}

checkoutMessage.hidden = true;
saveCart();
renderCart();
openCart();
}

function getSubtotal() {
return cart.reduce(function (sum, item) {
return sum + item.price * item.quantity;
}, 0);
}

function getItemCount() {
return cart.reduce(function (sum, item) {
return sum + item.quantity;
}, 0);
}

function renderCart() {
cartItems.innerHTML = '';
cartCount.textContent = String(getItemCount());
cartSubtotal.textContent = formatPrice(getSubtotal());

const hasItems = cart.length > 0;
cartEmpty.hidden = hasItems;
cartFooter.hidden = !hasItems;

cart.forEach(function (item) {
const row = document.createElement('article');
row.className = 'cart-item';

const image = document.createElement('img');
image.className = 'cart-thumb';
image.src = item.image;
image.alt = item.name;
image.loading = 'lazy';
image.addEventListener('error', function () {
image.classList.add('missing-thumb');
image.alt = 'Image Coming Soon';
image.removeAttribute('src');
});

const content = document.createElement('div');
content.innerHTML = `
<div class="cart-item-title">${item.name}</div>
<div class="cart-item-meta">${item.size} / ${formatPrice(item.price)} each</div>
<div class="cart-actions">
<div class="quantity-control" aria-label="Cart quantity controls">
<button type="button" data-cart-action="decrease" data-key="${item.key}" aria-label="Decrease ${item.name} quantity">-</button>
<strong>${item.quantity}</strong>
<button type="button" data-cart-action="increase" data-key="${item.key}" aria-label="Increase ${item.name} quantity">+</button>
</div>
<button class="remove-button" type="button" data-cart-action="remove" data-key="${item.key}">Remove</button>
</div>
`;

row.appendChild(image);
row.appendChild(content);
cartItems.appendChild(row);
});
}

function changeQuantity(key, delta) {
cart = cart.map(function (item) {
if (item.key !== key) return item;
return Object.assign({}, item, { quantity: Math.max(1, item.quantity + delta) });
});
checkoutMessage.hidden = true;
saveCart();
renderCart();
}

function removeItem(key) {
cart = cart.filter(function (item) {
return item.key !== key;
});
checkoutMessage.hidden = true;
saveCart();
renderCart();
}

function setCheckoutMessage(message) {
checkoutMessage.textContent = message;
checkoutMessage.hidden = false;
}

function getCheckoutItems() {
return cart.map(function (item) {
return {
id: item.id,
quantity: item.quantity,
size: item.size,
name: item.name,
price: item.price
};
});
}

async function submitCheckout() {
if (cart.length === 0) {
setCheckoutMessage('Your cart is empty.');
return;
}

checkoutButton.disabled = true;
const originalText = checkoutButton.textContent;
checkoutButton.textContent = 'Starting checkout...';
setCheckoutMessage('Starting secure checkout...');

try {
const response = await fetch('create_checkout.php', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
items: getCheckoutItems()
})
});

let data = null;
try {
data = await response.json();
} catch (error) {
throw new Error('Checkout returned an invalid response.');
}

if (!response.ok) {
throw new Error(data && data.error ? data.error : 'Checkout failed. Please try again.');
}

if (data && data.url) {
window.location.href = data.url;
return;
}

if (data && data.id) {
setCheckoutMessage('Checkout session was created, but Stripe did not return a redirect URL. Please try again or contact support with session ' + data.id + '.');
return;
}

throw new Error('Checkout did not return a Stripe session.');
} catch (error) {
setCheckoutMessage(error.message || 'Checkout failed. Please try again.');
} finally {
checkoutButton.disabled = false;
checkoutButton.textContent = originalText;
}
}

function openCart() {
cartScrim.hidden = false;
requestAnimationFrame(function () {
cartScrim.classList.add('active');
cartPanel.classList.add('active');
});
cartPanel.setAttribute('aria-hidden', 'false');
cartToggle.setAttribute('aria-expanded', 'true');
document.body.style.overflow = 'hidden';
}

function closeCart() {
cartScrim.classList.remove('active');
cartPanel.classList.remove('active');
cartPanel.setAttribute('aria-hidden', 'true');
cartToggle.setAttribute('aria-expanded', 'false');
document.body.style.overflow = '';
window.setTimeout(function () {
cartScrim.hidden = true;
}, 220);
}

categoryFilters.addEventListener('click', function (event) {
const button = event.target.closest('.category-chip');
if (!button) return;
selectedCategory = button.dataset.category;
renderCategories();
renderProducts();
});

document.querySelector('[data-feature-category]').addEventListener('click', function (event) {
selectedCategory = event.currentTarget.dataset.featureCategory;
renderCategories();
renderProducts();
document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

productSearch.addEventListener('input', function () {
searchTerm = productSearch.value;
renderProducts();
});

cartItems.addEventListener('click', function (event) {
const control = event.target.closest('[data-cart-action]');
if (!control) return;

if (control.dataset.cartAction === 'increase') changeQuantity(control.dataset.key, 1);
if (control.dataset.cartAction === 'decrease') changeQuantity(control.dataset.key, -1);
if (control.dataset.cartAction === 'remove') removeItem(control.dataset.key);
});

checkoutButton.addEventListener('click', submitCheckout);

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartScrim.addEventListener('click', closeCart);

document.addEventListener('keydown', function (event) {
if (event.key === 'Escape' && cartPanel.classList.contains('active')) closeCart();
});

renderCategories();
renderProducts();
renderCart();
})();
