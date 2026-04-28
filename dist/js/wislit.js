// Wishlist Management Functions

function addToWishlist(productId) {
  const product = window.products.find((p) => p.id === productId);
  if (!product) return;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const existingItem = wishlist.find((item) => item.id === productId);

  if (!existingItem) {
    wishlist.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      rating: product.rating,
      category: product.category,
      addedDate: new Date().toLocaleDateString(),
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
    showNotification(`${product.title} added to wishlist! ❤️`);
    updateProductCards(); // Update UI to show filled heart
  } else {
    removeFromWishlist(productId);
  }
}

function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter((item) => item.id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  showNotification("Removed from wishlist");
  updateProductCards(); // Update UI to show empty heart
}

function isInWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.some((item) => item.id === productId);
}

function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistCountElement = document.getElementById("wishlist-count");
  if (wishlistCountElement) {
    wishlistCountElement.textContent = wishlist.length;
  }
}

function openWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let wishlistHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="wishlist-modal" onclick="closeWishlist(event)">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg max-w-3xl w-full max-h-96 overflow-y-auto border border-pink-500/30" onclick="event.stopPropagation()">
        <div class="sticky top-0 bg-black/50 p-6 border-b border-pink-500/30 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-white">My Wishlist ❤️</h2>
          <button onclick="closeWishlist()" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        
        <div class="p-6">
  `;

  if (wishlist.length === 0) {
    wishlistHTML += `
      <div class="text-center py-8">
        <div class="text-5xl mb-4">💭</div>
        <p class="text-gray-400 text-lg">Your wishlist is empty</p>
        <p class="text-gray-500 text-sm mt-2">Add items to save them for later</p>
      </div>
    `;
  } else {
    wishlistHTML += `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    `;
    wishlist.forEach((item, index) => {
      wishlistHTML += `
        <div class="bg-white/5 border border-pink-500/20 rounded-lg p-4 hover:border-pink-500/50 transition">
          <div class="flex gap-4">
            <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-contain bg-white/5 rounded p-2">
            <div class="flex-1">
              <h3 class="text-white font-semibold text-sm mb-1">${item.title}</h3>
              <p class="text-pink-400 font-bold">$${item.price.toFixed(2)}</p>
              <div class="flex items-center gap-2 mt-2">
                <button onclick="addToCart(${item.id}); showNotification('Added to cart!')" class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-2 py-1 rounded text-xs font-semibold transition">
                  🛒 Add to Cart
                </button>
                <button onclick="removeFromWishlist(${item.id})" class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">✕</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    wishlistHTML += `
      </div>
    `;
  }

  wishlistHTML += `
        </div>
      </div>
    </div>
  `;

  let existingModal = document.getElementById("wishlist-modal");
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML("beforeend", wishlistHTML);
}

function closeWishlist(event) {
  if (event && event.target.id !== "wishlist-modal") return;
  const modal = document.getElementById("wishlist-modal");
  if (modal) modal.remove();
}

function updateProductCards() {
  // Re-render product cards to update heart icon status
  if (window.loadProduct) {
    window.loadProduct();
  }
}

// Update wishlist count on page load
document.addEventListener("DOMContentLoaded", function () {
  updateWishlistCount();
});
