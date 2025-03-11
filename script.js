// Function to fetch products from the API
async function fetchProducts(sortBy = "") {
  try {
    let url = "https://you-fashion-backend.vercel.app/products/list/";
    const params = new URLSearchParams();

    // Add sorting parameter if provided
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
    const products = await response.json();
    return products; // Assuming the API returns a JSON list of products
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array on error
  }
}

// Function to render products dynamically
async function renderProducts(containerId, products) {
  const productList = document.getElementById(containerId);
  productList.innerHTML = ""; // Clear existing products

  if (products.length === 0) {
    productList.innerHTML =
      "<p class='text-gray-600 text-center'>No products found.</p>";
    return;
  }

  // Render each product dynamically
  products.forEach((product) => {
    const productCard = `
          <div class="p-2 transition-transform transform hover:-translate-y-2">
              <img src="${
                product.image
              }" alt="" class="w-full h-64 object-cover rounded-md cursor-pointer" onclick="showProductDetails(${
      product.id
    })">
              <h4 class="text-gray-700 mt-3 text-lg">${product.name}</h4>
              <div class="flex mt-2">
                  ${Array.from({ length: 5 }, (_, i) =>
                    i < product.popularity
                      ? '<i class="fa fa-star text-red-500"></i>'
                      : '<i class="fa fa-star-o text-gray-400"></i>'
                  ).join("")}
              </div>
              <p class="text-gray-600 text-lg mt-2 font-semibold">$${
                product.price
              }</p>
          </div>
      `;
    productList.innerHTML += productCard;
  });
}
function showProductDetails(productId) {
  window.location.href = `productDetails.html?id=${productId}`;
}
// Function to show product details

// Function to filter and sort products
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

  // Render the sorted products in product-list3
  renderProducts("product-list3", products);
}

// Function to initialize product rendering
async function initProducts() {
  const allProducts = await fetchProducts();
  renderProducts("product-list", allProducts); // Initially render all products in product-list1
  renderProducts("product-list2", allProducts); // Initially render all products in product-list2
  renderProducts("product-list3", allProducts); // Initially render all products in product-list3
}

// Call the function to load products when the page loads
document.addEventListener("DOMContentLoaded", initProducts);
