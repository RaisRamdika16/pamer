// checkout.js - Checkout functionality

function openCheckout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    showNotification("Your cart is empty!");
    return;
  }

  let cartHTML = "";
  let subtotal = 0;
  let tax = 0;
  let shipping = 9.99;
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    cartHTML += `
      <div class="flex gap-3 mb-4 pb-4 border-b border-purple-500/20">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain bg-white/5 rounded p-2">
        <div class="flex-1">
          <h4 class="text-white font-semibold text-sm mb-1">${item.title}</h4>
          <p class="text-purple-400 text-sm">$${item.price.toFixed(2)} × ${item.quantity}</p>
          <p class="text-gray-300 text-sm font-bold">$${itemTotal.toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  tax = subtotal * 0.08; // 8% tax
  total = subtotal + tax + shipping;

  const checkoutHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="checkout-modal" onclick="closeCheckout(event)">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30" onclick="event.stopPropagation()">

        <!-- Header -->
        <div class="sticky top-0 bg-black/50 p-6 border-b border-purple-500/30 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-white">Checkout 🛒</h2>
          <button onclick="closeCheckout()" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Left Column - Order Summary -->
          <div>
            <h3 class="text-xl font-bold text-white mb-4">Order Summary</h3>
            <div class="bg-white/5 rounded-lg p-4 mb-6">
              ${cartHTML}
            </div>

            <!-- Order Totals -->
            <div class="bg-white/5 rounded-lg p-4">
              <div class="space-y-2">
                <div class="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-gray-300">
                  <span>Tax (8%):</span>
                  <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-gray-300">
                  <span>Shipping:</span>
                  <span>$${shipping.toFixed(2)}</span>
                </div>
                <div class="border-t border-purple-500/30 pt-2 mt-2">
                  <div class="flex justify-between text-white font-bold text-lg">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Checkout Form -->
          <div>
            <h3 class="text-xl font-bold text-white mb-4">Shipping & Payment</h3>

            <form id="checkout-form" onsubmit="processCheckout(event)">

              <!-- Shipping Information -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-white mb-3">Shipping Information</h4>
                <div class="space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-gray-300 text-sm mb-1">First Name</label>
                      <input type="text" name="firstName" required
                             class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                    </div>
                    <div>
                      <label class="block text-gray-300 text-sm mb-1">Last Name</label>
                      <input type="text" name="lastName" required
                             class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-300 text-sm mb-1">Email</label>
                    <input type="email" name="email" required
                           class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                  </div>
                  <div>
                    <label class="block text-gray-300 text-sm mb-1">Phone</label>
                    <input type="tel" name="phone" required
                           class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                  </div>
                  <div>
                    <label class="block text-gray-300 text-sm mb-1">Address</label>
                    <input type="text" name="address" required
                           class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-gray-300 text-sm mb-1">City</label>
                      <input type="text" name="city" required
                             class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                    </div>
                    <div>
                      <label class="block text-gray-300 text-sm mb-1">ZIP Code</label>
                      <input type="text" name="zipCode" required
                             class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Information -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-white mb-3">Payment Information</h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-gray-300 text-sm mb-1">Card Number</label>
                    <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" required
                           class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-gray-300 text-sm mb-1">Expiry Date</label>
                      <input type="text" name="expiryDate" placeholder="MM/YY" required
                             class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                    </div>
                    <div>
                      <label class="block text-gray-300 text-sm mb-1">CVV</label>
                      <input type="text" name="cvv" placeholder="123" required
                             class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-300 text-sm mb-1">Cardholder Name</label>
                    <input type="text" name="cardholderName" required
                           class="w-full bg-white/10 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <button type="submit"
                      class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                <span>💳</span> Complete Purchase
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  `;

  // Close cart modal first
  closeCart();

  // Add checkout modal to page
  document.body.insertAdjacentHTML("beforeend", checkoutHTML);
}

function closeCheckout(event) {
  if (event && event.target.id !== "checkout-modal") return;
  const modal = document.getElementById("checkout-modal");
  if (modal) modal.remove();
}

function processCheckout(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const orderData = {
    customer: {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      zipCode: formData.get("zipCode"),
    },
    payment: {
      cardNumber: formData.get("cardNumber").replace(/\d(?=\d{4})/g, "*"),
      expiryDate: formData.get("expiryDate"),
      cardholderName: formData.get("cardholderName"),
    },
    items: JSON.parse(localStorage.getItem("cart")) || [],
    orderDate: new Date().toISOString(),
    orderId: "ORD-" + Date.now(),
  };

  // Simulate payment processing
  showNotification("Processing payment...");

  setTimeout(() => {
    // Clear cart
    localStorage.removeItem("cart");
    updateCartCount();

    // Show success message
    showOrderConfirmation(orderData);

    // Close checkout modal
    closeCheckout();
  }, 2000);
}

function showOrderConfirmation(orderData) {
  const total = calculateOrderTotal(orderData.items);

  const confirmationHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="confirmation-modal" onclick="closeOrderConfirmation(event)">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg max-w-md w-full border border-purple-500/30" onclick="event.stopPropagation()">

        <div class="p-6 text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
          <p class="text-gray-300 mb-4">Thank you for your purchase! Your order has been placed successfully.</p>

          <div class="bg-white/5 rounded-lg p-4 mb-6">
            <div class="text-left space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-300">Order ID:</span>
                <span class="text-white font-mono">${orderData.orderId}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Total:</span>
                <span class="text-white font-bold">$${total.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Items:</span>
                <span class="text-white">${orderData.items.length}</span>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-400 mb-6">
            A confirmation email has been sent to ${orderData.customer.email}
          </p>

          <button onclick="closeOrderConfirmation(); window.location.reload()" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition duration-200">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", confirmationHTML);
}

function closeOrderConfirmation(event) {
  if (event && event.target.id !== "confirmation-modal") return;
  const modal = document.getElementById("confirmation-modal");
  if (modal) modal.remove();
}

function calculateOrderTotal(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const shipping = 9.99;
  return subtotal + tax + shipping;
}

// Export functions to global scope
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.processCheckout = processCheckout;
window.closeOrderConfirmation = closeOrderConfirmation;
