// Function to fetch products from the API
async function fetchProducts(color = "", size = "", sortBy = "") {
  try {
    let url = "https://you-fashion-backend.vercel.app/products/list/";
    const params = new URLSearchParams();

    if (color) {
      params.append("color", color);
    }
    if (size) {
      params.append("size", size);
    }
    if (sortBy) {
      params.append("ordering", sortBy);
    }

    // Append parameters to the URL
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data; // Assuming the API returns an array of products
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
}

// Function to render products
async function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear existing products

  if (products.length === 0) {
    productList.innerHTML = "<p class='text-gray-600'>No products found.</p>";
    return;
  }

  // Render each product
  products.forEach((product) => {
    const productCard = `
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src="${product.image}" alt="${
      product.name
    }" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">${
            product.name
          }</h3>
          <p class="text-gray-600">${product.description.slice(0,40)}</p>
          <p class="text-purple-500 font-semibold mt-4">$${product.price}</p>
          <button onclick="showProductDetails(${
            product.id
          })" class="mt-4 bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300">View Details</button>
          ${
            localStorage.getItem("token")
              ? `<button onclick="addToWishlist(${product.id})" class="mt-2 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-600 transition duration-300">Add to Wishlist</button>`
              : ""
          }
        </div>
      </div>
    `;
    productList.innerHTML += productCard;
  });
}

// Function to handle filtering and sorting
async function filterAndSortProducts() {
  const colorFilter = document.getElementById("filter-color").value;
  const sizeFilter = document.getElementById("filter-size").value;
  const sortBy = document.getElementById("sort-by").value;

  let sortParam = "";
  switch (sortBy) {
    case "price-asc":
      sortParam = "price";
      break;
    case "price-desc":
      sortParam = "-price";
      break;
    case "popularity-asc":
      sortParam = "popularity";
      break;
    case "popularity-desc":
      sortParam = "-popularity";
      break;
    default:
      sortParam = "";
  }

  // Fetch products based on filters and sorting
  const products = await fetchProducts(colorFilter, sizeFilter, sortParam);

  // Render the filtered and sorted products
  renderProducts(products);
}

// Function to show product details
function showProductDetails(productId) {
  window.location.href = `productDetails.html?id=${productId}`;
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch and render products on page load
  const products = await fetchProducts();
  renderProducts(products);

  // Update authentication state
  checkAuthState();
});

// Add event listeners for filter and sort changes
document
  .getElementById("filter-color")
  .addEventListener("change", filterAndSortProducts);

document
  .getElementById("filter-size")
  .addEventListener("change", filterAndSortProducts);

document
  .getElementById("sort-by")
  .addEventListener("change", filterAndSortProducts);

// async function fetchUserID() {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("No token found. Redirecting to login...");
//     //window.location.href = 'login.html'; // Redirect to login if no token
//     return;
//   }

//   try {
//     console.log("Fetching user ID...");
//     const response = await fetch(
//       "https://you-fashion-backend.vercel.app/customer/api/user-id/",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log("Response status:", response.status);
//     console.log("Response headers:", response.headers);

//     if (response.ok) {
//       const data = await response.json();
//       console.log("Response data:", data);
//       console.log("User ID:", data.user_id); // Log the user_id from the response
//       localStorage.setItem("user_id", data.user_id); // Store user_id in localStorage
//     } else {
//       console.error("Failed to fetch user ID. Status:", response.status);
//       const errorText = await response.text();
//       console.error("Error response:", errorText);
//     }
//   } catch (error) {
//     console.error("Network error:", error);
//   }
// }

// Call fetchUserID when the page loads
//fetchUserID();
