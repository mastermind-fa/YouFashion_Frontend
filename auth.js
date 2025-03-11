// Function to handle registration
async function handleRegistration(event) {
  event.preventDefault();

  // Get form data
  const data = {
    username: document.getElementById("username").value,
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    confirm_password: document.getElementById("confirm_password").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
  };

  // Validate password match
  if (data.password !== data.confirm_password) {
    alert("Passwords do not match!");
    return;
  }

  // Remove confirm_password from the data object (not needed for the backend)
  //delete data.confirm_password;

  // Debugging: Log the data and its JSON string
  console.log("Data to be stringified:", data);
  try {
    const jsonData = JSON.stringify(data);
    console.log("Stringified JSON:", jsonData);
  } catch (error) {
    console.error("Error stringifying data:", error);
    alert("An error occurred while processing your data. Please try again.");
    return;
  }

  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/customer/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json(); // Parse the JSON response
    console.log("Response Data:", responseData); // Log the response data

    if (!response.ok) {
      throw new Error(responseData.detail || "Registration failed");
    }

    alert(
      "Registration successful! Please check your email to confirm your account."
    );
    window.location.href = "login.html"; // Redirect to login page
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Registration failed. Please try again.");
  }
}

// Function to handle login
  async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://you-fashion-backend.vercel.app/customer/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }
        console.log("Login Data:", data);

        // Save token and user details in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isAdmin", "true");

        alert("Login successful!");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please check your credentials.");
    }
}

// async function handleLogin(event) {
//   event.preventDefault();

//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;

//   try {
//     const response = await fetch("https://you-fashion-backend.vercel.app/customer/login/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || "Login failed");
//     }

//     console.log("Login Data:", data);

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user_id", data.user_id);
//     localStorage.setItem("username", data.username);
//     localStorage.setItem("isAuthenticated", "true");

//     alert("Login successful!");
//     window.location.href = "index.html";
//   } catch (error) {
//     console.error("Error during login:", error);
//     alert("Login failed. Please check your credentials.");
//   }
// }

// Function to handle logout
function handleLogout() {
  // Clear the token and authentication state from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("isAuthenticated");

  // Update the UI to reflect that the user is logged out
  checkAuthState();

  // Redirect the user to the login page (or home page)
  window.location.href = "login.html"; // Change this to your desired redirect page
}

// Function to check authentication state
function checkAuthState() {
  const token = localStorage.getItem("token");
  const authenticatedDiv = document.getElementById("authenticated");
  const unauthenticatedDiv = document.getElementById("unauthenticated");

  if (token) {
    // User is authenticated
    if (authenticatedDiv) authenticatedDiv.style.display = "block";
    if (unauthenticatedDiv) unauthenticatedDiv.style.display = "none";
  } else {
    // User is not authenticated
    if (authenticatedDiv) authenticatedDiv.style.display = "none";
    if (unauthenticatedDiv) unauthenticatedDiv.style.display = "block";
  }
}

// Call checkAuthState when the page loads
document.addEventListener("DOMContentLoaded", checkAuthState);
