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

// Function to display product details
async function displayProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    const product = await fetchProductDetails(productId);
    if (product) {
      // Populate main product image
      const mainImage = document.getElementById("product-img");
      mainImage.src = product.image;

      // Populate breadcrumb
      const category = document.getElementById("product-category");
      category.innerHTML = `${product.name}`;

      // Populate product name
      const productName = document.getElementById("product-name");
      productName.textContent = product.name;

      // Populate product price
      const productPrice = document.getElementById("product-price");
      productPrice.textContent = `$${product.price}`;

      // Populate product description
      const productDescription = document.getElementById("product-description");
      if (product.description) {
        productDescription.innerHTML = `${product.description}`;
      } else {
        productDescription.textContent = "No description available.";
      }

      // Add event listener for "Add to Cart" button
      const addToCartButton = document.getElementById("add-to-cart");
      if (addToCartButton) {
        addToCartButton.addEventListener("click", (e) => {
          e.preventDefault();
          addToCart();
        });
      }

      // Fetch and display reviews
      const reviews = await fetchReviews(productId);
      displayReviews(reviews);
    } else {
      alert("Product not found!");
    }
  } else {
    alert("Invalid product ID!");
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

// Function to submit a review
async function submitReview(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to submit a review.");
    window.location.href = "login.html"; // Redirect to the login page
    return;
  }

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
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
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
    alert("Failed to submit review. Please try again.");
  }
}

// Function to add product to cart
async function addToCart() {
  console.log("addToCart called"); // Debugging
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const quantity = document.getElementById("quantity").value;
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to add items to your cart.");
    window.location.href = "login.html";
    return;
  }

  const sendData = {
    product_id: productId,
    quantity: quantity,
  };

  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
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

// Function to add product to wishlist
async function addToWishlist() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const token = localStorage.getItem("token");
  const sendData = { product: productId, user: localStorage.getItem('user_id') };

  if (!token) {
    alert("You must be logged in to add items to your wishlist.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/products/wishlist/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend Error:", errorData); // Log backend error
      throw new Error(errorData.error || "Failed to add to wishlist");
    }

    alert("Product added to wishlist!");
  } catch (error) {
    console.error("Fetch Error:", error); // Log fetch error
    alert(error.message || "Failed to add to wishlist.");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  displayProductDetails();
  checkAuthState();

  
  const wishlistButton = document.getElementById("add-to-wishlist");
  if (wishlistButton) {
    wishlistButton.addEventListener("click", (e) => {
      e.preventDefault();
      addToWishlist();
    });
  }

  // Add event listener for cart button
  
});