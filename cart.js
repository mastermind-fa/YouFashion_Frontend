async function fetchCartProducts() {
  const response = await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
    method: "GET",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  if (response.ok) {
    const products = await response.json();
    renderCartProducts(products);
    calculateTotalPrice(products);
  } else {
    alert("Failed to fetch cart products.");
  }
}

function renderCartProducts(products) {
  const cartRow = document.getElementById("cart-row");
  cartRow.innerHTML = ""; // Clear existing content

  products.forEach((product) => {
    console.log(product);

    const productHTML = `
      <tr>
        <td>
          <div class="cart-info">
            <img src="https://you-fashion-backend.vercel.app/${product.product.image}" alt="${
      product.product.name
    }">
            <div>
              <p>${product.product.name}</p>
              <small>Price: $${product.product.price}</small>
              <br>
              <a href="#" onclick="removeProduct('${
                product.product.id
              }')">Remove</a>
            </div>
          </div>
        </td>
        <td>
          <input type="number" value="${
            product.quantity
          }" min="1" onchange="updateQuantity('${
      product.product.id
    }', this.value)">
        </td>
        <td>$${(parseFloat(product.product.price) * product.quantity).toFixed(
          2
        )}</td>
      </tr>
    `;
    cartRow.insertAdjacentHTML("beforeend", productHTML);
  });
}

function calculateTotalPrice(products) {
  const totalPriceTable = document.querySelector(".total-price table");
  const subtotalRow = totalPriceTable.querySelector(
    "tr:nth-child(1) td:nth-child(2)"
  );
  const taxRow = totalPriceTable.querySelector(
    "tr:nth-child(2) td:nth-child(2)"
  );
  const totalRow = totalPriceTable.querySelector(
    "tr:nth-child(3) td:nth-child(2)"
  );

  const subtotal = products.reduce(
    (sum, product) => sum + product.product.price * product.quantity,
    0
  );
  const tax = 10.0; // Assuming a fixed tax value
  const total = subtotal + tax;

  subtotalRow.textContent = `$${subtotal.toFixed(2)}`;
  taxRow.textContent = `$${tax.toFixed(2)}`;
  totalRow.textContent = `$${total.toFixed(2)}`;
}

async function updateQuantity(productId, quantity) {
  const response = await fetch(
    `https://you-fashion-backend.vercel.app/order/cart/${productId}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(quantity) }),
    }
  );
  if (response.ok) {
    fetchCartProducts(); // Refresh the cart
  } else {
    alert("Failed to update quantity.");
  }
}

async function removeProduct(productId) {
  const response = await fetch(
    `https://you-fashion-backend.vercel.app/order/cart/${productId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }
  );
  if (response.ok) {
    fetchCartProducts(); // Refresh the cart
  } else {
    alert("Failed to remove product.");
  }
}

async function handleCheckout() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in. Please log in to proceed.");
    return;
  }
  const response = await fetch(
    "https://you-fashion-backend.vercel.app/payment/create_payment/",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  // console.log(response.json());
  if (response.ok) {
    const data = await response.json();
    // Redirect to SSLCommerz payment gateway
    window.location.href = data.url;
  } else {
    alert("Failed to initiate checkout. Please try again.");
  }
}

// Fetch cart products on page load
document.addEventListener("DOMContentLoaded", fetchCartProducts);
