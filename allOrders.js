async function fetchAllOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://you-fashion-backend.vercel.app/order/admin/all', {
            headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayOrders(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = '';

    orders.forEach(order => {
        const date = new Date(order.ordered_at).toLocaleDateString();
        const row = `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${order.id}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                            <img class="h-10 w-10 rounded-full object-cover" 
                                 src="https://you-fashion-backend.vercel.app${order.product.image}" 
                                 alt="${order.product.name}">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${order.product.name}</div>
                            <div class="text-sm text-gray-500">${order.product.size} | ${order.product.color}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.user}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.quantity}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${order.total_price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Fetch orders when the page loads
document.addEventListener('DOMContentLoaded', fetchAllOrders);