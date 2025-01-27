// Fetch cart products from the backend
async function fetchCartProducts() {
    const response = await fetch('https://you-fashion-backend.vercel.app/order/cart/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const products = await response.json();
      renderCartProducts(products);
      calculateTotalPrice(products);
    } else {
      alert('Failed to fetch cart products.');
    }
  }

  // Render cart products
  function renderCartProducts(products) {
    const cartContainer = document.getElementById('cart-products');
    cartContainer.innerHTML = ''; // Clear existing content

    products.forEach(product => {
      const productCard = `
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <img src="https://you-fashion-backend.vercel.app/${product.product.image}" alt="${product.product.name}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">${product.product.name}</h3>
            <p class="text-gray-600 mb-2">${product.product.description.slice(0,60)}</p>
            <p class="text-purple-500 font-semibold mb-2">$${product.product.price}</p>
            <p class="text-gray-600 mb-2"><strong>Color:</strong> ${product.product.color}</p>
            <p class="text-gray-600 mb-2"><strong>Size:</strong> ${product.product.size}</p>
            <p class="text-gray-600 mb-2"><strong>Quantity:</strong> ${product.quantity}</p>
            <button onclick="removeFromCart('${product.id}')"
              class="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300 w-full">
              Remove from Cart
            </button>
          </div>
        </div>
      `;
      cartContainer.insertAdjacentHTML('beforeend', productCard);
    });
  }

  // Calculate total price
  function calculateTotalPrice(products) {
    const total = products.reduce((sum, product) => sum + product.product.price * product.quantity, 0);
    document.getElementById('total-price').textContent = total.toFixed(2);
  }

  // Remove product from cart
  async function removeFromCart(orderId) {
    console.log(orderId);
    

    const response = await fetch(`https://you-fashion-backend.vercel.app/order/cart/${orderId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      alert('Product removed from cart.');
      fetchCartProducts(); // Refresh the cart
    } else {
      alert('Failed to remove product from cart.');
    }
  }

  // Handle checkout
  async function handleCheckout() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    const response = await fetch('https://you-fashion-backend.vercel.app/order/checkout/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment_method: paymentMethod }),
    });
    if (response.ok) {
      alert('Checkout successful!');
      window.location.href = 'index.html'; // Redirect to home page
    } else {
      alert('Failed to complete checkout.');
    }
  }

  // Fetch cart products on page load
  fetchCartProducts();