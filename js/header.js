const hamburger = document.querySelector('.hamburger');
const navLeft = document.querySelector('.nav-left');

hamburger.addEventListener('click', () => {
    navLeft.classList.toggle('active');
});
