// Function to fetch wishlist items
async function fetchWishlist() {
  // const userID = localStorage.getItem("user_id");
  try {
    const response = await fetch("http://127.0.0.1:8000/products/wishlist/", {
      method: "GET",
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch wishlist");
    }

    const data = await response.json();
    console.log("Wishlist Data:", data);
    displayWishlist(data);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    alert("Failed to fetch wishlist. Please try again.");
  }
}

// Function to display wishlist items
function displayWishlist(wishlist) {
  const wishlistItems = document.getElementById("wishlist-items");
  const noWishlist = document.getElementById("no-wishlist");

  // Clear existing items
  wishlistItems.innerHTML = "";

  if (wishlist.length === 0) {
    noWishlist.style.display = "block"; // Show "No wishlist found" message
    return;
  }
  [
    // {
    //     "id": 4,
    //     "user": "mahabubalam",
    //     "product": "Tshirt2",
    //     "added_at": "2025-01-25T15:39:39.391497Z"
    // },
    // {
    //     "id": 5,
    //     "user": "mahabubalam",
    //     "product": "Tshirt",
    //     "added_at": "2025-01-25T16:06:13.472062Z"
    // }
]
console.log(wishlist);
  // Display each wishlist item
  wishlist.forEach((item) => {
    const productCard = `
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src="http://127.0.0.1:8000${item.product.image}" alt="${item.product.name}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">${item.product.name}</h3>
          <p class="text-gray-600">${item.product.description}</p>
          <p class="text-purple-500 font-semibold mt-4">$${item.product.price}</p>
          <button onclick="addToCart(${item.product.id})" class="mt-4 bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300">Add to Cart</button>
          <button onclick="removeFromWishlist(${item.product.id})" class="mt-2 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-600 transition duration-300">Remove</button>
        </div>
      </div>
    `;
    wishlistItems.innerHTML += productCard;
  });
}

// Function to add a product to the cart
async function addToCart(productId) {
  try {
    const response = await fetch("http://127.0.0.1:8000/products/cart/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });

    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }

    alert("Product added to cart!");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add to cart. Please try again.");
  }
}

// Function to remove a product from the wishlist
async function removeFromWishlist(productId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/products/wishlist/remove/${productId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove from wishlist");
    }

    alert("Product removed from wishlist!");
    fetchWishlist(); // Refresh the wishlist
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    alert("Failed to remove from wishlist. Please try again.");
  }
}

function checkAuthState() {
  const token = localStorage.getItem("token");
  const authenticatedDiv = document.getElementById("authenticated");
  const unauthenticatedDiv = document.getElementById("unauthenticated");

  if (token) {
    // User is authenticated
    if (authenticatedDiv) authenticatedDiv.style.display = "block";
    if (unauthenticatedDiv) unauthenticatedDiv.style.display = "none";
  } else {
    // User is not authenticated
    if (authenticatedDiv) authenticatedDiv.style.display = "none";
    if (unauthenticatedDiv) unauthenticatedDiv.style.display = "block";
  }
}
// Initialize
document.addEventListener("DOMContentLoaded", () => {
  fetchWishlist();
  checkAuthState(); // Ensure user is authenticated
});