const hamburger = document.querySelector('.hamburger');
const navLeft = document.querySelector('.nav-left');
const dropdown = document.querySelector('.dropdown');
const dropBtn = document.querySelector('.dropbtn');

let dropdownOpen = false;

/* Hamburger */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLeft.classList.toggle('active');
});

/* Products – dubbelklick-logik på mobil */
dropBtn.addEventListener('click', (e) => {
  if (window.innerWidth <= 960) {
    if (!dropdownOpen) {
      e.preventDefault(); // stoppa navigation
      dropdown.classList.add('active');
      dropdownOpen = true;
    } else {
      dropdownOpen = false;
      window.location.href = dropBtn.getAttribute('href');
    }
  }
});

/* Stäng vid klick utanför */
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-header')) {
    navLeft.classList.remove('active');
    dropdown.classList.remove('active');
    hamburger.classList.remove('active');
    dropdownOpen = false;
  }
});

/* Reset vid desktop */
window.addEventListener('resize', () => {
  if (window.innerWidth > 960) {
    navLeft.classList.remove('active');
    dropdown.classList.remove('active');
    hamburger.classList.remove('active');
    dropdownOpen = false;
  }
});
