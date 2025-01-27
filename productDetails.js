// Function to fetch product details by ID
async function fetchProductDetails(productId) {
  try {
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/list/${productId}/`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}

// Function to fetch reviews for a product
async function fetchReviews(productId) {
  try {
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/reviews/list/?product=${productId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// Function to display product details and reviews
async function displayProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  // console.log(productId);

  if (productId) {
    const product = await fetchProductDetails(productId);
    if (product) {
      // Populate product details
      document.getElementById("product-image").src = product.image;
      document.getElementById("product-name").textContent = product.name;
      document.getElementById("product-description").textContent =
        product.description;
      document.getElementById(
        "product-price"
      ).textContent = `$${product.price}`;
      document.getElementById("color-value").textContent = product.color;
      document.getElementById("size-value").textContent = product.size;
      document.getElementById("popularity-value").textContent =
        product.popularity;

      // Fetch and display reviews
      const reviews = await fetchReviews(productId);
      displayReviews(reviews);

      // Calculate and display average rating
      const averageRating = calculateAverageRating(reviews);
      document.getElementById("rating-value").textContent =
        averageRating.toFixed(1);
    } else {
      alert("Product not found!");
    }
  } else {
    alert("Invalid product ID!");
  }
}


// Function to display reviews
function displayReviews(reviews) {
  const reviewList = document.getElementById("review-list");
  reviewList.innerHTML = ""; // Clear existing reviews

  if (reviews.length === 0) {
    reviewList.innerHTML = "<p class='text-gray-600'>No reviews yet.</p>";
    return;
  }

  reviews.forEach((review) => {
    const reviewCard = `
      <div class="bg-white shadow-lg rounded-lg p-6 mb-4">
        <div class="flex items-center mb-2">
          <span class="text-yellow-500 text-xl">${"★".repeat(
            review.rating
          )}${"☆".repeat(5 - review.rating)}</span>
          <span class="ml-2 text-gray-600">${review.rating}/5</span>
        </div>
        <p class="text-gray-600">${review.comment}</p>
        <p class="text-gray-400 text-sm mt-2">- ${review.user.user}</p>
      </div>
    `;
    reviewList.innerHTML += reviewCard;
  });
}

// Function to calculate average rating
function calculateAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
}

// Function to submit a review
async function submitReview(event) {
  event.preventDefault();

  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  try {
    const sendData = {
      rating: parseInt(rating),
      comment: comment,
      user: localStorage.getItem("user_id"),
      product: productId,

    };
    console.log(sendData);
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/reviews/`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData), // Only send rating and comment
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to submit review");
    }

    alert("Review submitted successfully!");
    displayProductDetails(); // Refresh reviews
  } catch (error) {
    console.error("Error submitting review:", error);
    //alert("Failed to submit review. Please try again.");
  }
}


async function addToCart() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const quantity = document.getElementById("quantity").value;
  const sendData = {
    product_id: productId,
    quantity: quantity,
  }
  console.log(sendData);

  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    });

    if (response.ok) {
      alert("Product added to cart!");
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to add to cart");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Added to Cart");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  displayProductDetails();
  checkAuthState();

  // Add event listener for review form
  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", submitReview);
  }

  // Add event listener for wishlist button
  const wishlistButton = document.getElementById("wishlist-button");
  if (wishlistButton) {
    wishlistButton.addEventListener("click", addToWishlist);
  }
  
  // Add event listener for cart button
  const cartButton = document.getElementById("cart-button");
  if (cartButton) {
    cartButton.addEventListener("click", addToCart);
  }
});