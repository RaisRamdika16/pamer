// Product Description Modal Functions

function showProductDescription(productId) {
  const product = window.products.find((p) => p.id === productId);
  if (!product) return;

  const inWishlist = isInWishlist(product.id);
  const heartIcon = inWishlist ? "❤️" : "🤍";

  const modalHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="product-modal" onclick="closeProductDescription(event)">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg max-w-sm w-full max-h-[75vh] overflow-y-auto border border-purple-500/30" onclick="event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="sticky top-0 bg-black/50 p-3 border-b border-purple-500/30 flex justify-between items-center">
          <h2 class="text-lg font-bold text-white">Product Details</h2>
          <button onclick="closeProductDescription()" class="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <!-- Modal Content -->
        <div class="p-3">
          <!-- Product Image -->
          <div class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-2 mb-3 flex items-center justify-center min-h-20">
            <img src="${product.image}" alt="${product.title}" class="max-h-20 max-w-20 object-contain">
          </div>

          <!-- Product Info -->
          <div class="mb-3">
            <!-- Category -->
            <div class="mb-2">
              <span class="inline-block px-2 py-0.5 bg-purple-500/30 text-purple-200 text-xs font-semibold rounded-full capitalize">${product.category}</span>
            </div>

            <!-- Title -->
            <h3 class="text-base font-bold text-white mb-2 line-clamp-2">${product.title}</h3>

            <!-- Rating and Price -->
            <div class="flex items-center justify-between mb-3 pb-3 border-b border-purple-500/20">
              <div class="flex items-center gap-1">
                <span class="text-yellow-400 text-base">★</span>
                <span class="text-white font-bold text-xs">${product.rating ? product.rating.rate : "N/A"}/5</span>
                <span class="text-gray-400 text-xs">(${product.rating ? product.rating.count : 0})</span>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$${product.price.toFixed(2)}</span>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <h4 class="text-xs font-bold text-white mb-1">Description</h4>
              <p class="text-gray-300 text-xs leading-relaxed line-clamp-3">${product.description}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button onclick="addToCart(${product.id}); closeProductDescription();" class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-1.5 rounded-lg transition duration-200 flex items-center justify-center gap-1 text-xs">
                <span>🛒</span> Add to Cart
              </button>
              <button onclick="addToWishlist(${product.id})" class="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-1.5 rounded-lg transition duration-200 flex items-center justify-center gap-1 text-xs">
                <span>${heartIcon}</span> Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function closeProductDescription(event) {
  // Allow closing by clicking the X button or outside the modal
  if (event && event.target.id !== "product-modal") return;

  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.remove();
  }
}
