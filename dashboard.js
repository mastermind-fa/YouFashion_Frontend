
// Chart Data for Different Years
const chartData = {
  2023: [1000, 2000, 1500, 5000, 2500, 3000, 4000],
  2022: [800, 1800, 1200, 4500, 2000, 2500, 3500],
  2021: [600, 1500, 1000, 4000, 1800, 2200, 3000],
};

const ctx = document.getElementById("salesChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales ($)",
        data: chartData[2023],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  },
});

// Update Chart on Year Filter Change
document.getElementById("yearFilter").addEventListener("change", (e) => {
  const year = e.target.value;
  chart.data.datasets[0].data = chartData[year];
  chart.update();
});



// Fetch Recent Menus
async function fetchRecentMenus() {
  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/products/list/");
    const data = await response.json();
    const recentMenus = document.getElementById("recentMenus");

    // Display only the first 5 menus
    data.slice(0, 5).forEach((menu) => {
      const menuItem = document.createElement("li");
      menuItem.className = "flex justify-between p-2 border-b";
      menuItem.innerHTML = `
                <span>${menu.name}</span>
                <span>$${menu.price}</span>
            `;
      recentMenus.appendChild(menuItem);
    });
  } catch (error) {
    console.error("Error fetching recent menus:", error);
  }
}

// Fetch Total Orders
async function fetchTotalOrders() {
  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/order/admin/all", {
        headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
        }
    });
    const data = await response.json();
    const totalOrders = data.length; // Count the number of orders
    document.querySelector(".bg-pink-500 h3").textContent = totalOrders;
  } catch (error) {
    console.error("Error fetching total orders:", error);
  }
}

// Fetch Total Customers
async function fetchTotalCustomers() {
  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/customer/list/");
    const data = await response.json();
    const totalCustomers = data.length; // Count the number of customers
    document.querySelector(".bg-orange-500 h3").textContent = totalCustomers;
  } catch (error) {
    console.error("Error fetching total customers:", error);
  }
}

// Fetch Total Menus
async function fetchTotalMenus() {
  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/products/list/");
    const data = await response.json();
    const totalMenus = data.length; // Count the number of menus
    document.querySelector(".bg-blue-500 h3").textContent = totalMenus;
  } catch (error) {
    console.error("Error fetching total menus:", error);
  }
}

// Calculate Total Sales
function calculateTotalSales(orders) {
  return orders
    .reduce((total, order) => total + order.total_price, 0)
    .toFixed(2);
}

// Fetch Total Sales
async function fetchTotalSales() {
  try {
    const response = await fetch("https://you-fashion-backend.vercel.app/order/admin/all");
    const data = await response.json();
    const totalSales = calculateTotalSales(data); // Calculate total sales
    document.querySelector(".bg-purple-500 h3").textContent = `$${totalSales}`;
  } catch (error) {
    console.error("Error fetching total sales:", error);
  }
}

 

// Initialize

fetchRecentMenus();
fetchTotalOrders();
fetchTotalCustomers();
fetchTotalMenus();
fetchTotalSales();
