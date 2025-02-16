document.addEventListener("DOMContentLoaded", async function () {
  const wishlistContainer = document.getElementById("wishlist-container");
  const apiUrl = "https://you-fashion-backend.vercel.app/products/wishlist/";
  const token = localStorage.getItem("token");

  async function fetchWishlist() {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      const wishlist = await response.json();
      displayWishlist(wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }

  function displayWishlist(wishlist) {
    wishlistContainer.innerHTML = "";
    wishlist.forEach((item) => {
      const row = document.createElement("tr");
      
      row.innerHTML = `
        <td class="py-4 px-6">
          <img src="https://you-fashion-backend.vercel.app/${item.product.image}" alt="${item.product.name}" class="w-16 h-16 object-cover rounded">
        </td>
        <td class="py-4 px-6">${item.product.name}</td>
        <td class="py-4 px-6">
          <div class="flex items-center">
            <button class="px-2 py-1 bg-gray-300 rounded" onclick="updateQuantity(${item.id}, -1)">-</button>
            <input type="number" value="1" min="1" id="quantity-${item.id}" class="w-12 text-center border mx-2">
            <button class="px-2 py-1 bg-gray-300 rounded" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </td>
        <td class="py-4 px-6">$${item.product.price}</td>
        <td class="py-4 px-6">
          <button class="bg-green-500 text-white px-4 py-2 rounded" onclick="addToCart(${item.product.id}, ${item.id})">Add to Cart</button>
          <button class="bg-red-500 text-white px-4 py-2 rounded ml-2" onclick="removeFromWishlist(${item.product.id})">Remove</button>
        </td>
      `;
      wishlistContainer.appendChild(row);
    });
  }

  async function removeFromWishlist(productId) {
    try {
      const response = await fetch(`https://you-fashion-backend.vercel.app/products/wishlist/remove/${productId}/`, {
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

  async function addToCart(productId, wishlistId) {
    try {
      const quantity = document.getElementById(`quantity-${wishlistId}`).value;
      const sendData = { product_id: productId, quantity: quantity };
      console.log(sendData);
      
      await fetch("https://you-fashion-backend.vercel.app/order/cart/", {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      alert("Product added to cart!");
      
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  function updateQuantity(wishlistId, change) {
    const quantityInput = document.getElementById(`quantity-${wishlistId}`);
    let newQuantity = parseInt(quantityInput.value) + change;
    if (newQuantity < 1) newQuantity = 1;
    quantityInput.value = newQuantity;
  }

  // ✅ Attach functions to window (Fixes Uncaught ReferenceError)
  window.removeFromWishlist = removeFromWishlist;
  window.addToCart = addToCart;
  window.updateQuantity = updateQuantity;

  fetchWishlist();
});
