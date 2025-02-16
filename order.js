document.addEventListener("DOMContentLoaded", async () => {
  const ordersContainer = document.getElementById("orders-container");

  try {
      const response = await fetch("https://you-fashion-backend.vercel.app/order/orders/", {
          method: "GET",
          headers: {
              "Authorization": `Token ${localStorage.getItem("token")}`,
          },
      });
      const orders = await response.json();

      if (orders.length === 0) {
          ordersContainer.innerHTML = `<p class="text-center text-gray-600">No orders found.</p>`;
          return;
      }

      orders.forEach(order => {
          const orderElement = document.createElement("div");
          orderElement.classList.add("bg-white", "p-6", "rounded-lg", "shadow-md", "mb-6");

          const product = order.product;

          orderElement.innerHTML = `
              <h2 class="text-xl font-semibold text-gray-700">Order #${order.id}</h2>
              <p class="text-sm text-gray-500">Placed On: ${new Date(order.ordered_at).toLocaleString()}</p>
              <div class="mt-4">
                  <div class="flex items-center space-x-4 border-b pb-4">
                      <img src="https://you-fashion-backend.vercel.app${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
                      <div>
                          <h3 class="text-lg font-semibold">${product.name}</h3>
                          <p class="text-sm text-gray-600">${product.description}</p>
                          <p class="text-sm font-medium text-gray-800">Quantity: ${order.quantity}</p>
                          <p class="text-sm font-semibold text-blue-600">Price: $${product.price}</p>
                      </div>
                  </div>
              </div>
              <p class="text-sm text-gray-500 mt-4">Total Price: <span class="font-medium">$${order.total_price}</span></p>
          `;

          ordersContainer.appendChild(orderElement);
      });
  } catch (error) {
      console.error("Error loading orders:", error);
      ordersContainer.innerHTML = `<p class="text-center text-red-500">Error loading orders. Please try again later.</p>`;
  }
});