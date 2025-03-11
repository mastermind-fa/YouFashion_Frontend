async function fetchCartProducts() {
  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart products.");
    }

    const products = await response.json();
    renderCartProducts(products);
    calculateTotalPrice(products);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function renderCartProducts(products) {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = ""; // Clear existing content

  products.forEach((product) => {
    const productRow = document.createElement("tr");
    productRow.classList.add("border-b");

    productRow.innerHTML = `
      <td class="p-4 flex items-center space-x-4">
        <img src="https://you-fashion-backend.vercel.app/${product.product.image}" alt="${product.product.name}" class="w-16 h-16 object-cover rounded">
        <div>
          <p class="font-semibold">${product.product.name}</p>
          <p class="text-gray-600">Price: $${product.product.price}</p>
          <button class="text-red-500 text-sm hover:underline" onclick="removeProduct('${product.product.id}')">Remove</button>
        </div>
      </td>
      <td class="p-4 text-center">
        <input type="number" class="w-16 p-2 border rounded text-center" value="${product.quantity}" min="1" 
          onchange="updateQuantity('${product.product.id}', this.value)">
      </td>
      <td class="p-4 text-center">$${(product.product.price * product.quantity).toFixed(2)}</td>
    `;

    cartItemsContainer.appendChild(productRow);
  });
}

function calculateTotalPrice(products) {
  let subtotal = products.reduce((sum, product) => sum + product.product.price * product.quantity, 0);
  let tax = subtotal * 0.05; // Assuming 5% tax
  let total = subtotal + tax;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("tax").textContent = tax.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

async function updateQuantity(productId, quantity) {
  try {
    const response = await fetch(`https://you-fashion-backend.vercel.app/order/cart/${productId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(quantity) }),
    });

    if (!response.ok) {
      throw new Error("Failed to update quantity.");
    }

    fetchCartProducts(); // Refresh the cart
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function removeProduct(productId) {
  try {
    const response = await fetch(`https://you-fashion-backend.vercel.app/order/cart/${productId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove product.");
    }

    fetchCartProducts(); // Refresh the cart
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// Fetch cart products on page load
document.addEventListener("DOMContentLoaded", fetchCartProducts);
