// Function to fetch profile data
async function fetchProfile() {
  const userId = localStorage.getItem("user_id"); // Get user ID from localStorage
  if (!userId && !localStorage.getItem("token")) {
    alert("User not logged in. Redirecting to login page.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      `https://you-fashion-backend.vercel.app/customer/details/${userId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const data = await response.json();
    displayProfile(data);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    alert("Failed to fetch profile data. Please try again later.");
    
  }
}

// Function to display profile data
function displayProfile(profile) {
  document.getElementById("user").textContent = profile.user || "N/A";
  document.getElementById("first_name").textContent =
    profile.first_name || "N/A";
  document.getElementById("last_name").textContent = profile.last_name || "N/A";
  document.getElementById("phone").textContent = profile.phone || "N/A";
  document.getElementById("address").textContent = profile.address || "N/A";
}
document.getElementById("viewWishlist").addEventListener("click", () => {
  window.location.href = "wishlist.html";
});

document.getElementById("previousOrders").addEventListener("click", () => {
  window.location.href = "order.html";
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  fetchProfile();
  checkAuthState(); // Ensure user is authenticated
});
