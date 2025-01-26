// Function to fetch profile data
async function fetchProfile() {
    const userId = localStorage.getItem("user_id"); // Get user ID from localStorage
    if (!userId) {
      alert("User not logged in. Redirecting to login page.");
      window.location.href = "login.html";
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/customer/details/${userId}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
  
      const data = await response.json();
      displayProfile(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      alert("Failed to fetch profile data. Please try again.");
    }
  }
  
  // Function to display profile data
  function displayProfile(profile) {
    document.getElementById("user").textContent = profile.user || "N/A";
    document.getElementById("first_name").textContent = profile.first_name || "N/A";
    document.getElementById("last_name").textContent = profile.last_name || "N/A";
    document.getElementById("phone").textContent = profile.phone || "N/A";
    document.getElementById("address").textContent = profile.address || "N/A";
  }
  
  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    fetchProfile();
    checkAuthState(); // Ensure user is authenticated
  });