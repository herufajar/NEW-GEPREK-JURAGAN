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
const hamburgerMenu = document.querySelector('#hamburger-menu');

// ketika hamburger menu di klik
hamburgerMenu.onclick = () => {
  navbarNav.classList.toggle('active');
};

// Toggle class active untuk search-form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const searchButton = document.querySelector('#search-button');

searchButton.onclick = (e) => {
  searchForm.classList.toggle('active');
  searchBox.focus();  // Fokus ke input saat form dibuka
  e.preventDefault(); // Mencegah reload halaman
};

// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector('.shopping-cart');
const shoppingCartButton = document.querySelector('#shopping-cart-button');

shoppingCartButton.onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault(); // Mencegah reload halaman
};

// Klik di luar elemen untuk menutup navbar, search form, dan shopping cart
document.addEventListener('click', function(e) {
  // Tutup navbar jika klik di luar
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove('active');
  }

  // Tutup search form jika klik di luar
  if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
      searchForm.classList.remove('active');
  }

  // Tutup shopping cart jika klik di luar
  if (!shoppingCartButton.contains(e.target) && !shoppingCart.contains(e.target)) {
      shoppingCart.classList.remove('active');
  }
});

// Modal Box
const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');

// Buka modal saat tombol detail item di klik
itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
      itemDetailModal.style.display = 'flex';
      e.preventDefault(); // Mencegah reload halaman
  };
});

// Klik tombol close pada modal
document.querySelector('.modal .close-icon').onclick = (e) => {
  itemDetailModal.style.display = 'none';
  e.preventDefault(); // Mencegah reload halaman
};

// Klik di luar modal untuk menutup modal
window.onclick = (e) => {
  if (e.target === itemDetailModal) {
      itemDetailModal.style.display = 'none';
  }
};
