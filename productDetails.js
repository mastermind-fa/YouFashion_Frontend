function incrementQuantity() {
  const input = document.getElementById("quantity");
  input.value = parseInt(input.value) + 1;
}

function decrementQuantity() {
  const input = document.getElementById("quantity");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

// Fetch and Display Product Details
async function fetchProductDetails(productId) {
  try {
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/list/${productId}/`
    );
    if (!response.ok) throw new Error("Failed to fetch product details");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Display Product Details
async function displayProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    alert("Product ID not found");
    return;
  }

  const product = await fetchProductDetails(productId);
  if (!product) return;

  // Update all product details
  document.getElementById("mainImage").src = product.image;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productTitle").textContent = product.name;
  document.getElementById("productPrice").textContent = `$${product.price}`;
  document.getElementById("productDescription").textContent =
    product.description;
  document.getElementById("productColor").textContent = product.color;
  document.getElementById("productSize").textContent = product.size;

  // Fetch and display reviews
  fetchReviews(productId);

  // Fetch and display similar products
  fetchSimilarProducts();
}

// Reviews Functions
async function fetchReviews(productId) {
  try {
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/reviews/list/?product=${productId}`
    );
    if (!response.ok) throw new Error("Failed to fetch reviews");
    const reviews = await response.json();
    displayReviews(reviews);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayReviews(reviews) {
  const reviewList = document.getElementById("review-list");
  reviewList.innerHTML = "";

  if (reviews.length === 0) {
    reviewList.innerHTML = '<p class="text-gray-500">No reviews yet</p>';
    return;
  }

  reviews.forEach((review) => {
    const reviewElement = `
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="flex justify-between mb-4">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                ${review.username.charAt(0)}
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${
                  review.username
                }</div>
                <div class="text-sm text-gray-500">
                  ${new Date(
                    review.created_at
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div class="text-yellow-400">
              ${"★".repeat(review.rating)}${"☆".repeat(
      5 - review.rating
    )}
            </div>
          </div>
          <p class="text-gray-600">${review.comment}</p>
        </div>
      `;
    reviewList.innerHTML += reviewElement;
  });
}

// Submit Review
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to submit a review");
    return;
  }

  const productId = new URLSearchParams(window.location.search).get("id");
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/products/reviews/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: parseInt(rating),
        comment,
        user: localStorage.getItem("user_id"),
        product: productId,
      }),
    });

    if (!response.ok) throw new Error("Failed to submit review");

    alert("Review submitted successfully!");
    fetchReviews(productId);
    e.target.reset();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to submit review");
  }
});

// Cart and Wishlist Functions
async function addToCart() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to add items to cart");
    return;
  }

  const productId = new URLSearchParams(window.location.search).get("id");
  const quantity = document.getElementById("quantity").value;

  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: parseInt(quantity),
      }),
    });

    if (!response.ok) throw new Error("Failed to add to cart");
    alert("Added to cart successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to add to cart");
  }
}

async function addToWishlist() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to add items to wishlist");
    return;
  }

  const productId = new URLSearchParams(window.location.search).get("id");

  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/products/wishlist/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: productId,
        user: localStorage.getItem("user_id"),
      }),
    });

    if (!response.ok) throw new Error("Failed to add to wishlist");
    alert("Added to wishlist successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to add to wishlist");
  }
}

// Similar Products
async function fetchSimilarProducts() {
  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/products/list/");
    if (!response.ok) throw new Error("Failed to fetch similar products");
    const products = await response.json();
    displaySimilarProducts(products.slice(0, 4));
  } catch (error) {
    console.error("Error:", error);
  }
}

function displaySimilarProducts(products) {
  const container = document.getElementById("similarProducts");
  container.innerHTML = products
    .map(
      (product) => `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
            <a href="dummyDetails.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-semibold text-gray-900">${product.name}</h3>
                    <p class="text-gray-500 text-sm mb-2">${product.color} - ${product.size}</p>
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-gray-900">$${product.price}</span>
                        <span class="text-sm text-gray-500">Popularity: ${product.popularity}</span>
                    </div>
                </div>
            </a>
        </div>
    `
    )
    .join("");
}

// Initialize
document.addEventListener("DOMContentLoaded", displayProductDetails);
