// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open'); // class 'open' toggle
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);
