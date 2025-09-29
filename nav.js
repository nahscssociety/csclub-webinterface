// nav.js — handles mobile nav toggle and active link highlighting
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('nav-toggle');
  const navbar = document.querySelector('.navbar');
  if (toggle && navbar) {
    toggle.addEventListener('click', () => navbar.classList.toggle('open'));
  }

  // set active link based on current path
  const links = document.querySelectorAll('.navbar .menu a');
  const path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (href === 'index.html' && path === '')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
});
