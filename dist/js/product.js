let products = [];

async function fetchProducts() {
  try {
    let response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Gagal memuat data produk");
    products = await response.json();
    window.products = products; // Make it global for wishlist
    loadProduct();
    initializeCategories(); // Initialize category filter after loading products
  } catch (error) {
    console.error("ERROR saat memuat data produk:", error);
  }
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Show notification
  showNotification(`${product.title} added to cart!`);
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-40";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function openCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="cart-modal" onclick="closeCart(event)">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto border border-purple-500/30" onclick="event.stopPropagation()">
        <div class="sticky top-0 bg-black/50 p-6 border-b border-purple-500/30 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-white">Shopping Cart 🛒</h2>
          <button onclick="closeCart()" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        
        <div class="p-6">
  `;

  if (cart.length === 0) {
    cartHTML += `<p class="text-center text-gray-400">Your cart is empty</p>`;
  } else {
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      cartHTML += `
        <div class="flex gap-4 mb-4 pb-4 border-b border-purple-500/20">
          <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-contain bg-white/5 rounded p-2">
          <div class="flex-1">
            <h3 class="text-white font-semibold">${item.title}</h3>
            <p class="text-purple-400">$${item.price.toFixed(2)}</p>
            <div class="flex items-center gap-2 mt-2">
              <button onclick="updateQuantity(${index}, -1)" class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded">-</button>
              <span class="text-white px-3">${item.quantity}</span>
              <button onclick="updateQuantity(${index}, 1)" class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded">+</button>
              <button onclick="removeFromCart(${index})" class="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Remove</button>
            </div>
          </div>
        </div>
      `;
    });

    cartHTML += `
      <div class="mt-4 pt-4 border-t border-purple-500/30">
        <div class="flex justify-between items-center mb-4">
          <span class="text-white font-bold text-lg">Total:</span>
          <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$${total.toFixed(2)}</span>
        </div>
        <button onclick="checkout()" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition duration-200">
          Checkout
        </button>
      </div>
    `;
  }

  cartHTML += `
        </div>
      </div>
    </div>
  `;

  let existingModal = document.getElementById("cart-modal");
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML("beforeend", cartHTML);
}

function closeCart(event) {
  if (event && event.target.id !== "cart-modal") return;
  const modal = document.getElementById("cart-modal");
  if (modal) modal.remove();
}

function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  openCart();
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  openCart();
}

function checkout() {
  openCheckout();
}

function loadProduct() {
  let container = document.getElementById("product-container");
  let hasil = "";
  products.forEach((product) => {
    const inWishlist = isInWishlist(product.id);
    const heartIcon = inWishlist ? "❤️" : "🤍";

    hasil += `
    <div class="product-card bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 group relative cursor-pointer" onclick="showProductDescription(${product.id})">
      <!-- Image Container -->
      <div class="relative h-48 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center overflow-hidden">
        <img src="${product.image}" alt="${product.title}" class="h-40 w-40 object-contain group-hover:scale-110 transition duration-300">
        
        <!-- Wishlist Button -->
        <button onclick="event.stopPropagation(); addToWishlist(${product.id})" class="absolute top-2 right-2 text-2xl hover:scale-125 transition duration-200 bg-black/30 backdrop-blur-md p-2 rounded-full hover:bg-black/50">
          ${heartIcon}
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <div class="mb-2">
          <span class="inline-block px-3 py-1 bg-purple-500/30 text-purple-200 text-xs font-semibold rounded-full">${product.category}</span>
        </div>
        
        <h3 class="text-white font-bold text-sm mb-2 line-clamp-2 h-10">${product.title}</h3>
        
        <div class="flex items-center justify-between mb-4">
          <span class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$${product.price.toFixed(2)}</span>
          <div class="flex items-center gap-1">
            <span class="text-yellow-400">★</span>
            <span class="text-gray-300 text-sm">${product.rating ? product.rating.rate : "N/A"}</span>
          </div>
        </div>
        
        <button onclick="event.stopPropagation(); addToCart(${product.id})" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2">
          <span>🛒</span> Add to Cart
        </button>
      </div>
    </div>
    `;
  });
  container.innerHTML = hasil;
}

// Update cart count on page load
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  fetchProducts();
});
