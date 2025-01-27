// Fetch and display orders
async function fetchOrders() {
    try {
      const response = await fetch('https://youfashion-backend.onrender.com/order/orders/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        const orders = await response.json();
        renderOrders(orders);
      } else {
        alert('Failed to fetch orders.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders. Please try again.');
    }
  }
  
  // Render orders
//   function renderOrders(orders) {
//     const ordersContainer = document.getElementById('orders-list');
//     ordersContainer.innerHTML = ''; // Clear existing content
  
//     orders.forEach(order => {
//       const orderCard = `
//         <div class="bg-white shadow-lg rounded-lg p-6">
//           <h3 class="text-xl font-semibold text-gray-800 mb-2">Order ID: ${order.id}</h3>
//           <p class="text-gray-600 mb-2"><strong>Product:</strong> ${order.product.name}</p>
//           <p class="text-gray-600 mb-2"><strong>Quantity:</strong> ${order.quantity}</p>
//           <p class="text-gray-600 mb-2"><strong>Total Price:</strong> $${order.total_price}</p>
//           <p class="text-gray-600 mb-2"><strong>Ordered At:</strong> ${new Date(order.added_at).toLocaleString()}</p>
//         </div>
//       `;
//       ordersContainer.insertAdjacentHTML('beforeend', orderCard);
//     });
//   }

// Render orders
function renderOrders(orders) {
    const ordersContainer = document.getElementById('orders-list');
    ordersContainer.innerHTML = ''; // Clear existing content
  
    orders.forEach(order => {
      const orderCard = `
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Order ID: ${order.id}</h3>
          <div class="flex items-center space-x-4 mb-4">
            <img src="https://youfashion-backend.onrender.com/${order.product.image}" alt="${order.product.name}" class="w-24 h-24 object-cover rounded-lg">
            <div>
              <p class="text-gray-600"><strong>Product:</strong> ${order.product.name}</p>
              <p class="text-gray-600"><strong>Quantity:</strong> ${order.quantity}</p>
              <p class="text-gray-600"><strong>Total Price:</strong> $${order.total_price}</p>
              <p class="text-gray-600"><strong>Ordered At:</strong> ${new Date(order.added_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      `;
      ordersContainer.insertAdjacentHTML('beforeend', orderCard);
    });
  }
  
  // Fetch orders on page load
  fetchOrders();