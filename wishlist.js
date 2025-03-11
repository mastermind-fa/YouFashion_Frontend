// DOM elements
const loadingElement = document.getElementById('loading');
const emptyWishlistElement = document.getElementById('empty-wishlist');
const wishlistItemsElement = document.getElementById('wishlist-items');
const wishlistItemsContainer = document.getElementById('wishlist-items-container');
const recentlyViewedContainer = document.getElementById('recently-viewed-container');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const cartCountElement = document.getElementById('cart-count');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Toggle mobile menu
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Function to show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toast.classList.add('bg-green-600');
        toast.classList.remove('bg-red-600', 'bg-gray-800');
    } else if (type === 'error') {
        toast.classList.add('bg-red-600');
        toast.classList.remove('bg-green-600', 'bg-gray-800');
    } else {
        toast.classList.add('bg-gray-800');
        toast.classList.remove('bg-green-600', 'bg-red-600');
    }
    
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}

// Function to check authentication
function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html?redirect=demoWishlist.html';
        return false;
    }
    return token;
}

// Function to fetch wishlist items
async function fetchWishlist() {
    const token = checkAuthentication();
    if (!token) return;
    
    try {
        const response = await fetch("https://you-fashion-backend.vercel.app/products/wishlist/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch wishlist');
        }
        
        const wishlistItems = await response.json();
        updateCartCount();
        return wishlistItems;
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        showToast('Failed to load wishlist items', 'error');
        return [];
    }
}

// Function to update cart count
async function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token) {
        cartCountElement.textContent = '0';
        return;
    }
    
    try {
        const response = await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        
        const cartItems = await response.json();
        const itemCount = cartItems.length;
        cartCountElement.textContent = itemCount.toString();
    } catch (error) {
        console.error('Error updating cart count:', error);
        cartCountElement.textContent = '0';
    }
}

// Function to remove item from wishlist
async function removeFromWishlist(productId, itemElement) {
    const token = checkAuthentication();
    if (!token) return;
    
    try {
        const response = await fetch(`https://you-fashion-backend.vercel.app/products/wishlist/remove/${productId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${token}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove item from wishlist');
        }
        
        // Remove the element with animation
        itemElement.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            itemElement.remove();
            
            // Check if wishlist is empty after removal
            if (wishlistItemsContainer.children.length === 0) {
                wishlistItemsElement.classList.add('hidden');
                emptyWishlistElement.classList.remove('hidden');
            }
            
            showToast('Item removed from wishlist');
        }, 300);
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        showToast('Failed to remove item', 'error');
    }
}

// Function to add item to cart
async function addToCart(productId, quantity = 1) {
    const token = checkAuthentication();
    if (!token) return;
    
    try {
        const sendData = {
            product_id: productId,
            quantity: quantity
        };
        
        const response = await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sendData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }
        
        updateCartCount();
        showToast('Item added to cart', 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add item to cart', 'error');
    }
}

// Function to render wishlist items
function renderWishlistItems(wishlistItems) {
    loadingElement.classList.add('hidden');
    
    if (wishlistItems.length === 0) {
        emptyWishlistElement.classList.remove('hidden');
        return;
    }
    
    wishlistItemsElement.classList.remove('hidden');
    wishlistItemsContainer.innerHTML = '';
    
    wishlistItems.forEach(item => {
        const product = item.product;
        const itemElement = document.createElement('tr');
        itemElement.className = 'border-b border-gray-200 block md:table-row transition duration-300 ease-in-out';
        
        // Create a more mobile-friendly layout
        itemElement.innerHTML = `
            <td class="py-4 px-4 flex flex-col md:table-cell">
                <div class="flex items-center">
                    <div class="flex-shrink-0 w-24 h-24 md:w-16 md:h-16">
                        <img src="https://you-fashion-backend.vercel.app${product.image}" alt="${product.name}" class="w-full h-full object-cover rounded">
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium">${product.name}</h3>
                        <p class="text-sm text-gray-600 md:hidden">$${product.price}</p>
                        <div class="md:hidden mt-2 text-sm">
                            <span class="text-gray-700">Size: ${product.size}</span>
                            <span class="text-gray-700 ml-4">Color: ${product.color}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td class="py-4 px-4 hidden md:table-cell">$${product.price}</td>
            <td class="py-4 px-4 hidden md:table-cell">
                <div>
                    <p>Size: ${product.size}</p>
                    <p>Color: ${product.color}</p>
                </div>
            </td>
            <td class="py-4 px-4 md:table-cell">
                <label class="md:hidden block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                <div class="flex items-center border border-gray-300 rounded w-28">
                    <button type="button" class="quantity-btn decrease-btn px-3 py-1 text-gray-600 hover:bg-gray-100" data-product-id="${product.id}">-</button>
                    <input type="number" value="1" min="1" class="quantity-input w-full text-center border-none focus:ring-0" data-product-id="${product.id}">
                    <button type="button" class="quantity-btn increase-btn px-3 py-1 text-gray-600 hover:bg-gray-100" data-product-id="${product.id}">+</button>
                </div>
            </td>
            <td class="py-4 px-4 md:table-cell">
                <div class="flex flex-col md:flex-row md:items-center gap-3">
                    <button type="button" class="add-to-cart-btn cart-button bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition flex items-center justify-center w-10 h-10" data-product-id="${product.id}" aria-label="Add to Cart">
                        <i class="fas fa-shopping-cart text-lg"></i>
                    </button>
                    <button type="button" class="remove-btn text-red-600 hover:text-red-800 transition text-sm flex items-center justify-center" data-product-id="${product.id}">
                        <i class="fas fa-trash-alt mr-1"></i> Remove
                    </button>
                </div>
            </td>
        `;
        
        wishlistItemsContainer.appendChild(itemElement);
        
        // Add event listeners to buttons
        const decreaseBtn = itemElement.querySelector('.decrease-btn');
        const increaseBtn = itemElement.querySelector('.increase-btn');
        const quantityInput = itemElement.querySelector('.quantity-input');
        const addToCartBtn = itemElement.querySelector('.add-to-cart-btn');
        const removeBtn = itemElement.querySelector('.remove-btn');
        
        decreaseBtn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
        
        quantityInput.addEventListener('change', (e) => {
            let value = parseInt(e.target.value);
            if (value < 1 || isNaN(value)) {
                e.target.value = 1;
            }
        });
        
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            addToCart(product.id, quantity);
        });
        
        removeBtn.addEventListener('click', () => {
            removeFromWishlist(product.id, itemElement);
        });
    });
}

// Function to render recently viewed products
function renderRecentlyViewed() {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    if (recentlyViewed.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'col-span-full text-center py-8 text-gray-500';
        emptyMessage.textContent = 'No recently viewed products';
        recentlyViewedContainer.appendChild(emptyMessage);
        return;
    }
    
    // Display up to 4 recently viewed products
    const displayItems = recentlyViewed.slice(0, 4);
    
    displayItems.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition btn-hover-effect';
        
        productCard.innerHTML = `
            <a href="dummyDetails.html?id=${product.id}">
                <img src="https://you-fashion-backend.vercel.app${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-medium text-gray-900 mb-1">${product.name}</h3>
                    <div class="flex justify-between items-center">
                        <p class="text-blue-600 font-medium">$${product.price}</p>
                        <button class="text-gray-600 hover:text-blue-600 transition">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </a>
        `;
        
        recentlyViewedContainer.appendChild(productCard);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html?redirect=demoWishlist.html';
        return;
    }
    
    const wishlistItems = await fetchWishlist();
    renderWishlistItems(wishlistItems);
    renderRecentlyViewed();
});