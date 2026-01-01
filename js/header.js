const hamburger = document.querySelector('.hamburger');
const navLeft = document.querySelector('.nav-left');
const dropdown = document.querySelector('.dropdown');
const dropBtn = document.querySelector('.dropbtn');

let dropdownOpen = false;

function updateAria() {
    hamburger.setAttribute(
        'aria-expanded',
        navLeft.classList.contains('active')
    );
    dropBtn.setAttribute(
        'aria-expanded',
        dropdown.classList.contains('active')
    );
}

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLeft.classList.toggle('active');
    hamburger.classList.toggle('active');
    updateAria();
});

dropBtn.addEventListener('click', (e) => {
    if (window.innerWidth <= 960) {
        if (!dropdownOpen) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.add('active');
            dropdownOpen = true;
            updateAria();
        } else {
            dropdownOpen = false;
        }
    }
});

dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.remove('active');
    navLeft.classList.remove('active');
    hamburger.classList.remove('active');
    dropdownOpen = false;
    updateAria();
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 960 && !navLeft.contains(e.target)) {
        dropdown.classList.remove('active');
        navLeft.classList.remove('active');
        hamburger.classList.remove('active');
        dropdownOpen = false;
        updateAria();
    }
});

hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') hamburger.click();
});

dropBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') dropBtn.click();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navLeft.classList.remove('active');
        dropdown.classList.remove('active');
        hamburger.classList.remove('active');
        dropdownOpen = false;
        updateAria();
    }
});

document.querySelectorAll('.nav-left a').forEach(link => {
    link.addEventListener('click', () => {
        navLeft.classList.remove('active');
        dropdown.classList.remove('active');
        hamburger.classList.remove('active');
        dropdownOpen = false;
        updateAria();
    });
});

