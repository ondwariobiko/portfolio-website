// sticky-nav.js

window.addEventListener('scroll', function() {
    const nav = document.querySelector('.fh5co-nav');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
    if (scrollPosition > 100) {
      nav.classList.add('sticky-nav');
    } else {
      nav.classList.remove('sticky-nav');
    }
  });