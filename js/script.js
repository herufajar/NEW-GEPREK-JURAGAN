// Fungsi untuk format angka menjadi format rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
  }).format(number);
};

// Toggle class active untuk hamburger-menu
const navbarNav = document.querySelector('.navbar-nav');
// ketika hamburger menu di klik
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

// Toggle class active untuk search-form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');

document.querySelector('#search-button').onclick = (e) => {
  searchForm.classList.toggle('active');
  searchBox.focus();
  e.preventDefault();
};

// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// Klik di luar elemen
const hamburger = document.querySelector('#hamburger-menu');
const searchButton = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function(e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove('active');
  }

  if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
      searchForm.classList.remove('active');
  }
  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
      shoppingCart.classList.remove('active');
  }
});

// Modal Box
const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
      itemDetailModal.style.display = 'flex';
      e.preventDefault();
  };
});

// Klik tombol close
document.querySelector('.modal .close-icon').onclick = (e) => {
  itemDetailModal.style.display = 'none';
  e.preventDefault();
};

// Klik di luar modal
window.onclick = (e) => {
  if (e.target === itemDetailModal) {
      itemDetailModal.style.display = 'none';
  }
};

// Fungsi untuk menangani pencarian
const resultsContainer = document.getElementById('search-results');
const products = [
  { name: 'Ayam Geprek Sambal Bawang' },
  { name: 'Ayam Geprek Sambal Ijo' },
  { name: 'Ayam Geprek Sambal Matah' },
  { name: 'Ayam Geprek Mozarella' },
  { name: 'Ayam Geprek Bakar Hot' },
  { name: 'Crispy Chicken Skin Rice' },
  { name: 'Crispy Chicken Skin' },
  { name: 'Ca Kangkung' },
  { name: 'Es Teh Juragan' },
  { name: 'Es Teh Lemon Juragan' },
  { name: 'Promo' },
  
];

const handleSearch = () => {
  const query = searchBox.value.toLowerCase();
  const results = products.filter(product => product.name.toLowerCase().includes(query));

  // Bersihkan hasil pencarian sebelumnya
  resultsContainer.innerHTML = '';

  // Tampilkan hasil pencarian
  if (results.length > 0) {
      results.forEach(product => {
          const resultItem = document.createElement('div');
          resultItem.textContent = product.name; // Menampilkan nama produk
          resultsContainer.appendChild(resultItem);
      });
  } else {
      resultsContainer.textContent = 'Tidak ada hasil ditemukan.';
  }
};

// Tambahkan event listener pada search box
searchBox.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') { // Jika menekan tombol Enter
      handleSearch();
  }
});
