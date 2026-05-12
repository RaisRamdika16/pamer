// kategori.js - Mengelola kategori produk

let categories = [];
let selectedCategory = "all";

// Fungsi untuk mendapatkan kategori unik dari produk
function getUniqueCategories(products) {
  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];
  categories = ["all", ...uniqueCategories]; // Tambahkan 'all' untuk menampilkan semua
  return categories;
}

// Fungsi untuk membuat filter kategori
function createCategoryFilter() {
  const filterContainer = document.createElement("div");
  filterContainer.id = "category-filter";
  filterContainer.className = "flex flex-wrap gap-2 mb-8 justify-center";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
      selectedCategory === category
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
        : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white backdrop-blur-md border border-purple-500/20"
    }`;
    button.textContent =
      category === "all"
        ? "All Categories"
        : category.charAt(0).toUpperCase() + category.slice(1);
    button.onclick = () => filterProductsByCategory(category);
    filterContainer.appendChild(button);
  });

  return filterContainer;
}

// Fungsi untuk filter produk berdasarkan kategori
function filterProductsByCategory(category) {
  selectedCategory = category;

  // Update tombol filter
  const buttons = document.querySelectorAll("#category-filter button");
  buttons.forEach((button, index) => {
    const cat = categories[index];
    if (cat === selectedCategory) {
      button.className =
        "px-4 py-2 rounded-full text-sm font-medium transition duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg";
    } else {
      button.className =
        "px-4 py-2 rounded-full text-sm font-medium transition duration-300 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white backdrop-blur-md border border-purple-500/20";
    }
  });

  // Filter produk
  let filteredProducts;
  if (category === "all") {
    filteredProducts = window.products || [];
  } else {
    filteredProducts = (window.products || []).filter(
      (product) => product.category === category,
    );
  }

  // Update tampilan produk
  loadFilteredProducts(filteredProducts);
}

// Fungsi untuk memuat produk yang sudah difilter
function loadFilteredProducts(filteredProducts) {
  let container = document.getElementById("product-container");
  let emptyState = document.getElementById("empty-state");

  if (filteredProducts.length === 0) {
    container.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  let hasil = "";
  filteredProducts.forEach((product) => {
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

// Fungsi untuk menginisialisasi kategori setelah produk dimuat
function initializeCategories() {
  if (window.products && window.products.length > 0) {
    getUniqueCategories(window.products);

    // Cari tempat untuk menambahkan filter
    const sectionHeader = document.querySelector(".mb-12.fade-in");
    if (sectionHeader) {
      const filterContainer = createCategoryFilter();
      sectionHeader.appendChild(filterContainer);
    }
  }
}

// Export fungsi untuk digunakan di file lain
window.getUniqueCategories = getUniqueCategories;
window.createCategoryFilter = createCategoryFilter;
window.filterProductsByCategory = filterProductsByCategory;
window.initializeCategories = initializeCategories;
