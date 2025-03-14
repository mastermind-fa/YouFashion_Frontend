const searchToggle = document.getElementById("search-toggle");
const searchBar = document.getElementById("search-bar");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const profileDropdownToggle = document.getElementById(
  "profile-dropdown-toggle"
);
const profileDropdown = document.getElementById("profile-dropdown");

// Auth Elements
const authenticatedElementsDesktop = document.getElementById(
  "authenticated-elements-desktop"
);
const unauthenticatedElementsDesktop = document.getElementById(
  "unauthenticated-elements-desktop"
);
const authenticatedElementsMobile = document.getElementById(
  "authenticated-elements-mobile"
);
const unauthenticatedElementsMobile = document.getElementById(
  "unauthenticated-elements-mobile"
);
const authElementsDesktop = document.getElementById("auth-elements-desktop");

// Logout buttons
const logoutButton = document.getElementById("logout-button");
const logoutButtonMobile = document.getElementById("logout-button-mobile");

// Toggle search bar
searchToggle.addEventListener("click", () => {
  searchBar.classList.toggle("hidden");
  if (!searchBar.classList.contains("hidden")) {
    searchBar.querySelector("input").focus();
  }
});

// Toggle mobile menu
mobileMenuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");

  // Change icon based on menu state
  const icon = mobileMenuToggle.querySelector("i");
  if (mobileMenu.classList.contains("hidden")) {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  } else {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  }
});

// Toggle profile dropdown
profileDropdownToggle.addEventListener("click", () => {
  profileDropdown.classList.toggle("hidden");
});

// Close profile dropdown when clicking outside
document.addEventListener("click", (event) => {
  const isClickInsideDropdown =
    profileDropdownToggle?.contains(event.target) ||
    profileDropdown?.contains(event.target);

  if (
    !isClickInsideDropdown &&
    profileDropdown &&
    !profileDropdown.classList.contains("hidden")
  ) {
    profileDropdown.classList.add("hidden");
  }
});

// Function to check authentication state
function checkAuthState() {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated;
}

// Function to fetch user details from API
async function fetchUserDetails() {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      return null;
    }

    const response = await fetch(
      `https://you-fashion-backend.vercel.app/customer/details/${userId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

// Function to fetch cart count from API
async function fetchCartCount() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return 0;
    }

    const response = await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }

    const cartData = await response.json();
    return cartData.length || 0;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return 0;
  }
}

// Function to update UI based on authentication state
async function updateAuthUI(isAuthenticated) {
  // Show/hide desktop elements
  authElementsDesktop.classList.remove("hidden");

  if (isAuthenticated) {
    // Show authenticated elements
    authenticatedElementsDesktop.classList.remove("hidden");
    unauthenticatedElementsDesktop.classList.add("hidden");
    authenticatedElementsMobile.classList.remove("hidden");
    unauthenticatedElementsMobile.classList.add("hidden");

    try {
      // Fetch and update user details from API
      const userData = await fetchUserDetails();
      if (userData) {
        document.getElementById("user-name").textContent =
          localStorage.getItem("username") || "User";
        document.getElementById("user-email").textContent =
          userData.email || "";
      }

      // Fetch and update cart count from API
      const cartCount = await fetchCartCount();
      document.getElementById("cart-count").textContent = cartCount;
      document.getElementById("cart-count-mobile").textContent = cartCount;

      // Set up periodic cart count refresh (every 30 seconds)
      startCartCountRefresh();
    } catch (error) {
      console.error("Error updating user interface:", error);
    }
  } else {
    // Show unauthenticated elements
    authenticatedElementsDesktop.classList.add("hidden");
    unauthenticatedElementsDesktop.classList.remove("hidden");
    authenticatedElementsMobile.classList.add("hidden");
    unauthenticatedElementsMobile.classList.remove("hidden");

    // Stop cart count refresh
    stopCartCountRefresh();
  }
}

let cartRefreshInterval;

// Start periodic cart count refresh
function startCartCountRefresh() {
  // Clear any existing interval
  stopCartCountRefresh();

  // Set new interval (every 30 seconds)
  cartRefreshInterval = setInterval(async () => {
    try {
      const cartCount = await fetchCartCount();
      document.getElementById("cart-count").textContent = cartCount;
      document.getElementById("cart-count-mobile").textContent = cartCount;
    } catch (error) {
      console.error("Error refreshing cart count:", error);
    }
  }, 30000);
}

// Stop cart count refresh
function stopCartCountRefresh() {
  if (cartRefreshInterval) {
    clearInterval(cartRefreshInterval);
    cartRefreshInterval = null;
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  stopCartCountRefresh();
  updateAuthUI(false);

  // Redirect to home page
  window.location.href = "index.html";
}

// Attach logout event listeners
logoutButton.addEventListener("click", handleLogout);
logoutButtonMobile.addEventListener("click", handleLogout);

// Initialize UI on page load
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI(checkAuthState());
});

// Get search elements
const searchForm = document.querySelector("#search-bar");
const searchInput = document.querySelector("#search-bar input");
const searchButton = document.querySelector("#search-bar button");

// Handle search submission
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchQuery = searchInput.value.trim();

  if (searchQuery) {
    performSearch(searchQuery);
  }
});

// Search button click handler
searchButton.addEventListener("click", function () {
  const searchQuery = searchInput.value.trim();

  if (searchQuery) {
    performSearch(searchQuery);
  }
});

// Function to perform search
async function performSearch(query) {
  try {
    // Show loading state
    document.body.style.cursor = "wait";

    // Fetch search results from API
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/products/list/?search=${encodeURIComponent(query)}`
    );
    const products = await response.json();

    // Create search results modal
    showSearchResults(products, query);
  } catch (error) {
    console.error("Search error:", error);
    showSearchResults([], query); // Show empty results on error
  } finally {
    document.body.style.cursor = "default";
  }
}

// Function to display search results
function showSearchResults(products, query) {
  // Remove existing modal if any
  const existingModal = document.getElementById("search-results-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal container
  const modal = document.createElement("div");
  modal.id = "search-results-modal";
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  // Create modal content
  let modalContent = `
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden">
      <div class="flex justify-between items-center p-5 border-b">
        <h3 class="text-lg font-semibold text-gray-800">Search Results for "${query}"</h3>
        <button id="close-search-modal" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="p-6">
  `;

  // Add products or "no results" message
  if (products.length > 0) {
    modalContent += `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">`;
    products.forEach((product) => {
      modalContent += `
        <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300">
          <a href="productDetails.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover rounded-t-lg">
            <div class="p-4">
              <h3 class="font-semibold text-gray-800">${product.name}</h3>
              <p class="text-gray-600">${product.color}, ${product.size}</p>
              <div class="mt-2 flex justify-between items-center">
                <span class="font-bold text-gray-900">$${product.price}</span>
              </div>
            </div>
          </a>
        </div>
      `;
    });
    modalContent += `</div>`;
  } else {
    modalContent += `
      <div class="text-center py-8">
        <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No products found matching "${query}"</p>
        <p class="text-gray-400 mt-2">Try different keywords or browse our categories</p>
      </div>
    `;
  }

  modalContent += `
      </div>
      <div class="bg-gray-50 px-4 py-3 flex justify-end">
        <button id="browse-all-products" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Browse All Products
        </button>
      </div>
    </div>
  `;

  // Add content to modal
  modal.innerHTML = modalContent;

  // Add modal to document
  document.body.appendChild(modal);

  // Add event listeners
  document
    .getElementById("close-search-modal")
    .addEventListener("click", () => {
      modal.remove();
    });

  document
    .getElementById("browse-all-products")
    .addEventListener("click", () => {
      window.location.href = "products.html";
    });

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Clear search input
  searchInput.value = "";
  searchBar.classList.add("hidden");
}
