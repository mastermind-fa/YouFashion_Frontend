// Function to fetch products from the API
async function fetchProducts(sortBy = "") {
  try {
    let url = "https://you-fashion-backend.vercel.app/products/list/";
    const params = new URLSearchParams();

    
    if (sortBy) {
      params.append("ordering", sortBy); // Ensure this matches the API's expected parameter
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
      <div class="col-4">
        <img src="${product.image}" alt="" onclick="showProductDetails(${product.id})">
        <h4>${product.name}</h4>
        <div class="rating">
          ${Array.from({ length: 5 }, (_, i) =>
            i < product.popularity
              ? '<i class="fa fa-star"></i>'
              : '<i class="fa fa-star-o"></i>'
          ).join("")}
        </div>
        <p>$${product.price}</p>
      </div>
    `;
    productList.innerHTML += productCard;
  });
}

async function renderLatestProducts(products) {
  const productList = document.getElementById("product-list2");
  productList.innerHTML = ""; // Clear existing products

  if (products.length === 0) {
    productList.innerHTML = "<p class='text-gray-600'>No products found.</p>";
    return;
  }

  // Render each product
  products.forEach((product) => {
    const productCard = `
      <div class="col-4">
        <img src="${product.image}" alt="" onclick="showProductDetails(${product.id})">
        <h4>${product.name}</h4>
        <div class="rating">
          ${Array.from({ length: 5 }, (_, i) =>
            i < product.popularity
              ? '<i class="fa fa-star"></i>'
              : '<i class="fa fa-star-o"></i>'
          ).join("")}
        </div>
        <p>$${product.price}</p>
      </div>
    `;
    productList.innerHTML += productCard;
  });
}

async function renderAllProducts(products) {
  const productList = document.getElementById("product-list3");
  productList.innerHTML = ""; // Clear existing products

  if (products.length === 0) {
    productList.innerHTML = "<p class='text-gray-600'>No products found.</p>";
    return;
  }

  // Render each product
  products.forEach((product) => {
    const productCard = `
      <div class="col-4">
        <img src="${product.image}" alt="" onclick="showProductDetails(${product.id})">
        <h4>${product.name}</h4>
        <div class="rating">
          ${Array.from({ length: 5 }, (_, i) =>
            i < product.popularity
              ? '<i class="fa fa-star"></i>'
              : '<i class="fa fa-star-o"></i>'
          ).join("")}
        </div>
        <p>$${product.price}</p>
      </div>
    `;
    productList.innerHTML += productCard;
  });
}



// Function to initialize the page
async function initializePage() {
  const products = await fetchProducts();
  renderProducts(products);
  renderLatestProducts(products);
  renderAllProducts(products);
}

// Call the initialize function when the page loads
document.addEventListener("DOMContentLoaded", initializePage);

// Function to handle filtering and sorting
async function filterAndSortProducts() {
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

  console.log("Sorting by:", sortParam); // Debugging: Log the sorting parameter

  // Fetch products based on sorting
  const products = await fetchProducts(sortParam);

  console.log("Products fetched:", products); // Debugging: Log the fetched products

  // Render the sorted products
  renderAllProducts(products);
}

// Function to show product details
function showProductDetails(productId) {
  window.location.href = `productDetails.html?id=${productId}`;
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch and render products on page load
  const products = await fetchProducts();
  // renderProducts(products);
  renderAllProducts(products);
  // renderLatestProducts(products);

  // Update authentication state
  checkAuthState();
});


// Add event listeners for filter and sort changes


document
  .getElementById("sort-by")
  .addEventListener("change", filterAndSortProducts);




