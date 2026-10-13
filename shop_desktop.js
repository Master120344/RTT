var products = [
    {
        id: 'tshirt-sage-001',
        name: 'Hope Tee - Sage',
        description: 'Premium cotton t-shirt in our signature sage green. Soft, breathable fabric with a relaxed fit. Every purchase supports our community programs.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
        category: 'shirts',
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        isNew: true,
        featured: true
    },
    {
        id: 'tshirt-black-002',
        name: 'Redeem Tee - Black',
        description: 'Classic black t-shirt with subtle embroidered logo. Made from 100% organic cotton for ultimate comfort.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop',
        category: 'shirts',
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        isNew: false,
        featured: true
    },
    {
        id: 'tshirt-cream-003',
        name: 'Purpose Tee - Cream',
        description: 'Elegant cream t-shirt with a vintage feel. Perfectly soft fabric that gets better with every wash.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop',
        category: 'shirts',
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        isNew: false,
        featured: false
    },
    {
        id: 'tshirt-navy-004',
        name: 'Unity Tee - Navy',
        description: 'Deep navy t-shirt representing strength and stability. Premium heavyweight cotton construction.',
        price: 38.00,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop',
        category: 'shirts',
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        isNew: true,
        featured: false
    },
    {
        id: 'hat-sage-001',
        name: 'Classic Cap - Sage',
        description: 'Adjustable dad cap in sage green. Low-profile design with curved brim. One size fits most.',
        price: 28.00,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop',
        category: 'hats',
        sizes: [],
        isNew: true,
        featured: true
    },
    {
        id: 'hat-black-002',
        name: 'Classic Cap - Black',
        description: 'Timeless black baseball cap with structured crown. Perfect for everyday wear.',
        price: 28.00,
        image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&h=800&fit=crop',
        category: 'hats',
        sizes: [],
        isNew: false,
        featured: false
    },
    {
        id: 'hat-cream-003',
        name: 'Classic Cap - Cream',
        description: 'Relaxed fit cap in warm cream. Soft cotton twill with adjustable strap.',
        price: 28.00,
        image: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=800&h=800&fit=crop',
        category: 'hats',
        sizes: [],
        isNew: false,
        featured: false
    },
    {
        id: 'beanie-sage-001',
        name: 'Warmth Beanie - Sage',
        description: 'Cozy ribbed beanie in sage green. Soft acrylic blend keeps you warm all winter.',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=800&fit=crop',
        category: 'beanies',
        sizes: [],
        isNew: true,
        featured: false
    },
    {
        id: 'beanie-charcoal-002',
        name: 'Warmth Beanie - Charcoal',
        description: 'Essential charcoal gray beanie with folded cuff. Perfect layering piece for cold days.',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1510598969022-c4c6c5d05769?w=800&h=800&fit=crop',
        category: 'beanies',
        sizes: [],
        isNew: false,
        featured: true
    },
    {
        id: 'beanie-cream-003',
        name: 'Warmth Beanie - Cream',
        description: 'Chunky knit beanie in natural cream. Slouchy style with premium wool blend.',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&h=800&fit=crop',
        category: 'beanies',
        sizes: [],
        isNew: false,
        featured: false
    },
    {
        id: 'beanie-burgundy-004',
        name: 'Warmth Beanie - Burgundy',
        description: 'Rich burgundy beanie for a pop of color. Ultra-soft knit with ribbed texture.',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1517941823-815bea90d291?w=800&h=800&fit=crop',
        category: 'beanies',
        sizes: [],
        isNew: true,
        featured: false
    },
    {
        id: 'hat-trucker-001',
        name: 'Trucker Cap - Forest',
        description: 'Classic trucker style with mesh back. Snapback closure fits all sizes.',
        price: 30.00,
        image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&h=800&fit=crop',
        category: 'hats',
        sizes: [],
        isNew: false,
        featured: false
    }
];

var cart = [];
var currentProduct = null;
var currentQuantity = 1;
var currentSize = '';
var currentCategory = 'all';

function init() {
    renderProducts('all');
    setupEventListeners();
    updateCartCount();
    handleScroll();
    observeFadeElements();
}

function renderProducts(category) {
    var grid = document.getElementById('productsGrid');
    var emptyState = document.getElementById('emptyState');
    var filteredProducts = category === 'all' ? products : products.filter(function(p) { return p.category === category; });
    
    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = filteredProducts.map(function(product) {
        return '<div class="product-card" data-id="' + product.id + '">' +
            '<div class="product-image-wrapper">' +
                '<img src="' + product.image + '" alt="' + product.name + '" class="product-image">' +
                (product.isNew ? '<span class="product-badge">New</span>' : '') +
                '<div class="product-overlay">' +
                    '<button class="overlay-btn view-btn" data-action="view" aria-label="Quick view">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
                    '</button>' +
                    '<button class="overlay-btn add-btn" data-action="add" aria-label="Add to cart">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="product-info">' +
                '<p class="product-category">' + product.category + '</p>' +
                '<h3 class="product-name">' + product.name + '</h3>' +
                '<p class="product-price">$' + product.price.toFixed(2) + '</p>' +
            '</div>' +
        '</div>';
    }).join('');
}

function setupEventListeners() {
    var navbar = document.getElementById('navbar');
    var scrollTopBtn = document.getElementById('scrollTop');
    var mobileMenuToggle = document.getElementById('mobileMenuToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    var cartToggle = document.getElementById('cartToggle');
    var cartDrawer = document.getElementById('cartDrawer');
    var cartOverlay = document.getElementById('cartOverlay');
    var cartClose = document.getElementById('cartClose');
    var quickViewModal = document.getElementById('quickViewModal');
    var quickViewOverlay = document.getElementById('quickViewOverlay');
    var quickViewClose = document.getElementById('quickViewClose');
    var checkoutModal = document.getElementById('checkoutModal');
    var checkoutOverlay = document.getElementById('checkoutOverlay');
    var checkoutClose = document.getElementById('checkoutClose');
    var productsGrid = document.getElementById('productsGrid');
    var categoryFilter = document.getElementById('categoryFilter');
    
    window.addEventListener('scroll', handleScroll);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    cartToggle.addEventListener('click', function() {
        openCart();
    });
    
    cartOverlay.addEventListener('click', closeCart);
    cartClose.addEventListener('click', closeCart);
    document.getElementById('btnContinueShopping').addEventListener('click', closeCart);
    document.getElementById('btnContinueShoppingFooter').addEventListener('click', closeCart);
    
    quickViewOverlay.addEventListener('click', closeQuickView);
    quickViewClose.addEventListener('click', closeQuickView);
    
    checkoutOverlay.addEventListener('click', closeCheckout);
    checkoutClose.addEventListener('click', closeCheckout);
    
    productsGrid.addEventListener('click', function(e) {
        var card = e.target.closest('.product-card');
        if (!card) return;
        
        var productId = card.dataset.id;
        var product = products.find(function(p) { return p.id === productId; });
        
        if (e.target.closest('.add-btn')) {
            quickAddToCart(product);
        } else {
            openQuickView(product);
        }
    });
    
    categoryFilter.addEventListener('click', function(e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        
        var category = btn.dataset.category;
        setActiveCategory(category);
    });
    
    document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-column a').forEach(function(link) {
        if (link.dataset.category) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var category = this.dataset.category;
                setActiveCategory(category);
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.querySelector('.shop-section').scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
    
    document.getElementById('qtyDecrease').addEventListener('click', function() {
        if (currentQuantity > 1) {
            currentQuantity--;
            updateQuickViewQuantity();
        }
    });
    
    document.getElementById('qtyIncrease').addEventListener('click', function() {
        currentQuantity++;
        updateQuickViewQuantity();
    });
    
    document.getElementById('btnAddToCart').addEventListener('click', addToCartFromQuickView);
    
    document.getElementById('btnCheckout').addEventListener('click', openCheckout);
    
    document.getElementById('toStep2').addEventListener('click', function() {
        if (validateStep1()) goToStep(2);
    });
    
    document.getElementById('toStep3').addEventListener('click', function() {
        if (validateStep2()) goToStep(3);
    });
    
    document.getElementById('backToStep1').addEventListener('click', function() {
        goToStep(1);
    });
    
    document.getElementById('backToStep2').addEventListener('click', function() {
        goToStep(2);
    });
    
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        completeOrder();
    });
    
    document.getElementById('btnContinueShoppingSuccess').addEventListener('click', function() {
        closeCheckout();
        resetCheckout();
    });
    
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Thanks for subscribing!');
        this.reset();
    });
}

function handleScroll() {
    var navbar = document.getElementById('navbar');
    var scrollTopBtn = document.getElementById('scrollTop');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

function observeFadeElements() {
    var fadeElements = document.querySelectorAll('.fade-in');
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(function(el) {
        observer.observe(el);
    });
}

function setActiveCategory(category) {
    currentCategory = category;
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.classList.toggle('active', link.dataset.category === category);
    });
    
    renderProducts(category);
}

function openCart() {
    document.getElementById('cartDrawer').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCart();
}

function closeCart() {
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCart() {
    var cartEmpty = document.getElementById('cartEmpty');
    var cartItems = document.getElementById('cartItems');
    var cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartItems.innerHTML = '';
        cartFooter.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    
    cartItems.innerHTML = cart.map(function(item, index) {
        return '<div class="cart-item" data-index="' + index + '">' +
            '<div class="cart-item-image">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
            '</div>' +
            '<div class="cart-item-details">' +
                '<h4 class="cart-item-name">' + item.name + '</h4>' +
                (item.size ? '<p class="cart-item-size">Size: ' + item.size + '</p>' : '') +
                '<p class="cart-item-price">$' + item.price.toFixed(2) + '</p>' +
                '<div class="cart-item-actions">' +
                    '<div class="quantity-control">' +
                        '<button data-action="decrease" data-index="' + index + '">-</button>' +
                        '<span>' + item.quantity + '</span>' +
                        '<button data-action="increase" data-index="' + index + '">+</button>' +
                    '</div>' +
                    '<button class="cart-item-remove" data-action="remove" data-index="' + index + '">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
    
    cartItems.addEventListener('click', function(e) {
        var action = e.target.closest('[data-action]');
        if (!action) return;
        
        var index = parseInt(action.dataset.index);
        
        if (action.dataset.action === 'decrease') {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
        } else if (action.dataset.action === 'increase') {
            cart[index].quantity++;
        } else if (action.dataset.action === 'remove') {
            cart.splice(index, 1);
        }
        
        updateCartCount();
        renderCart();
    });
    
    updateSubtotal();
}

function updateCartCount() {
    var totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    var cartCount = document.getElementById('cartCount');
    var cartHeaderCount = document.getElementById('cartHeaderCount');
    
    cartCount.textContent = totalItems;
    cartHeaderCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.classList.add('visible');
    } else {
        cartCount.classList.remove('visible');
    }
}

function updateSubtotal() {
    var subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    document.getElementById('subtotalAmount').textContent = '$' + subtotal.toFixed(2);
}

function quickAddToCart(product) {
    var existingItem = cart.find(function(item) {
        return item.id === product.id && item.size === (product.sizes.length > 0 ? product.sizes[0] : '');
    });
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.sizes.length > 0 ? product.sizes[0] : '',
            quantity: 1
        });
    }
    
    updateCartCount();
    showToast('Added to cart!');
}

function openQuickView(product) {
    currentProduct = product;
    currentQuantity = 1;
    currentSize = product.sizes.length > 0 ? product.sizes[0] : '';
    
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewImage').alt = product.name;
    document.getElementById('quickViewCategory').textContent = product.category;
    document.getElementById('quickViewTitle').textContent = product.name;
    document.getElementById('quickViewPrice').textContent = '$' + product.price.toFixed(2);
    document.getElementById('quickViewDescription').textContent = product.description;
    
    var badge = document.getElementById('quickViewBadge');
    if (product.isNew) {
        badge.classList.add('visible');
    } else {
        badge.classList.remove('visible');
    }
    
    var sizesContainer = document.getElementById('quickViewSizes');
    if (product.sizes.length > 0) {
        sizesContainer.innerHTML = '<label>Size</label>' +
            '<div class="size-options">' +
            product.sizes.map(function(size) {
                return '<button class="size-btn' + (size === currentSize ? ' active' : '') + '" data-size="' + size + '">' + size + '</button>';
            }).join('') +
            '</div>';
        sizesContainer.style.display = 'block';
        
        sizesContainer.querySelectorAll('.size-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                currentSize = this.dataset.size;
                sizesContainer.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
            });
        });
    } else {
        sizesContainer.style.display = 'none';
    }
    
    updateQuickViewQuantity();
    
    document.getElementById('quickViewModal').classList.add('active');
    document.getElementById('quickViewOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
    document.getElementById('quickViewOverlay').classList.remove('active');
    document.body.style.overflow = '';
    
    var addBtn = document.getElementById('btnAddToCart');
    addBtn.classList.remove('added');
    document.getElementById('addToCartText').textContent = 'Add to Cart - $0.00';
}

function updateQuickViewQuantity() {
    document.getElementById('qtyValue').textContent = currentQuantity;
    var total = currentProduct.price * currentQuantity;
    document.getElementById('addToCartText').textContent = 'Add to Cart - $' + total.toFixed(2);
}

function addToCartFromQuickView() {
    var existingItem = cart.find(function(item) {
        return item.id === currentProduct.id && item.size === currentSize;
    });
    
    if (existingItem) {
        existingItem.quantity += currentQuantity;
    } else {
        cart.push({
            id: currentProduct.id + '-' + currentSize,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            size: currentSize,
            quantity: currentQuantity
        });
    }
    
    updateCartCount();
    
    var addBtn = document.getElementById('btnAddToCart');
    addBtn.classList.add('added');
    document.getElementById('addToCartText').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Added to Cart!';
    
    setTimeout(function() {
        closeQuickView();
    }, 1200);
}

function openCheckout() {
    closeCart();
    renderCheckoutItems();
    updateCheckoutTotals();
    
    document.getElementById('checkoutModal').classList.add('active');
    document.getElementById('checkoutOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('checkoutOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCheckoutItems() {
    var container = document.getElementById('checkoutItems');
    container.innerHTML = cart.map(function(item) {
        return '<div class="checkout-item">' +
            '<div class="checkout-item-image">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
                '<span class="checkout-item-qty">' + item.quantity + '</span>' +
            '</div>' +
            '<div class="checkout-item-details">' +
                '<h4 class="checkout-item-name">' + item.name + '</h4>' +
                (item.size ? '<p class="checkout-item-size">Size: ' + item.size + '</p>' : '') +
            '</div>' +
            '<span class="checkout-item-price">$' + (item.price * item.quantity).toFixed(2) + '</span>' +
        '</div>';
    }).join('');
}

function updateCheckoutTotals() {
    var subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    var shipping = 5.99;
    var tax = subtotal * 0.07;
    var total = subtotal + shipping + tax;
    
    document.getElementById('checkoutSubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('checkoutShipping').textContent = '$' + shipping.toFixed(2);
    document.getElementById('checkoutTax').textContent = '$' + tax.toFixed(2);
    document.getElementById('checkoutTotal').textContent = '$' + total.toFixed(2);
}

function goToStep(step) {
    document.querySelectorAll('.checkout-step-content').forEach(function(el) {
        el.style.display = 'none';
    });
    
    document.getElementById('step' + step + 'Content').style.display = 'block';
    
    document.querySelectorAll('.step').forEach(function(el, index) {
        var stepNum = index + 1;
        el.classList.remove('active', 'completed');
        
        if (stepNum < step) {
            el.classList.add('completed');
        } else if (stepNum === step) {
            el.classList.add('active');
        }
    });
}

function validateStep1() {
    var email = document.getElementById('checkoutEmail').value;
    var firstName = document.getElementById('checkoutFirstName').value;
    var lastName = document.getElementById('checkoutLastName').value;
    
    if (!email || !firstName || !lastName) {
        showToast('Please fill in all required fields');
        return false;
    }
    return true;
}

function validateStep2() {
    var address = document.getElementById('checkoutAddress').value;
    var city = document.getElementById('checkoutCity').value;
    var state = document.getElementById('checkoutState').value;
    var zip = document.getElementById('checkoutZip').value;
    
    if (!address || !city || !state || !zip) {
        showToast('Please fill in all required fields');
        return false;
    }
    return true;
}

function completeOrder() {
    cart = [];
    updateCartCount();
    
    document.querySelectorAll('.checkout-step-content').forEach(function(el) {
        el.style.display = 'none';
    });
    
    document.getElementById('stepSuccess').style.display = 'block';
    
    document.querySelectorAll('.step').forEach(function(el) {
        el.classList.add('completed');
        el.classList.remove('active');
    });
}

function resetCheckout() {
    document.getElementById('checkoutForm').reset();
    goToStep(1);
    document.getElementById('stepSuccess').style.display = 'none';
}

function showToast(message) {
    var toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('visible');
    
    setTimeout(function() {
        toast.classList.remove('visible');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
