let currentProductId = null;

// Fetch All Products
async function fetchProducts() {
  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/products/list/", {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();
    const container = document.getElementById("productsContainer");
    container.innerHTML = ""; // Clear loading state

    products.forEach((product) => {
      const card = createProductCard(product);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to load products");
  }
}

// Create Product Card
function createProductCard(product) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const div = document.createElement("div");
  div.className =
    "bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105";

  div.innerHTML = `
        <img src="${product.image || "https://via.placeholder.com/300"}" 
             alt="${product.name}" 
             class="w-full h-48 object-cover">
        <div class="p-4">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-800">${
                  product.name
                }</h3>
                <span class="text-lg font-bold text-indigo-600">$${
                  product.price
                }</span>
            </div>
            <p class="text-gray-600 text-sm mb-4">${
              product.description || "No description available"
            }</p>
            ${
              isAdmin
                ? `
                <div class="flex justify-end space-x-2">
                    <button onclick="openEditModal(${product.id})" 
                            class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-200">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" 
                            class="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `
                : ""
            }
        </div>
    `;
  return div;
}

// Delete Product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/delete/${productId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.ok) {
      showSuccess("Product deleted successfully");
      fetchProducts();
    } else {
      throw new Error("Failed to delete product");
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to delete product");
  }
}

// Edit Product Modal Functions
function openEditModal(productId) {
  currentProductId = productId;
  const modal = document.getElementById("editModal");
  modal.classList.remove("hidden");

  // Fetch product details and populate form
  fetchProductDetails(productId);
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  modal.classList.add("hidden");
  currentProductId = null;
}

async function fetchProductDetails(productId) {
  try {
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/list/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch product details");

    const product = await response.json();

    // Populate form fields
    document.getElementById("editName").value = product.name;
    document.getElementById("editPrice").value = product.price;
    document.getElementById("editDescription").value = product.description;
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to load product details");
    closeEditModal();
  }
}

// Update Product
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedData = {
    name: document.getElementById("editName").value,
    price: document.getElementById("editPrice").value,
    description: document.getElementById("editDescription").value,
  };

  try {
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/update/${currentProductId}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (response.ok) {
      showSuccess("Product updated successfully");
      closeEditModal();
      fetchProducts();
    } else {
      throw new Error("Failed to update product");
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to update product");
  }
});

// Utility Functions
function showSuccess(message) {
  // Implementation of success toast notification
  alert(message); // Replace with better UI notification
}

function showError(message) {
  // Implementation of error toast notification
  alert(message); // Replace with better UI notification
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  // Update user role button
  const username = localStorage.getItem("username");
  const userRoleButton = document.getElementById("userRoleButton");
  userRoleButton.querySelector("span").textContent = username || "Guest";
});
