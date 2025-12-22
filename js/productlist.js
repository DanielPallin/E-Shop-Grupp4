/*
* Gruppuppgift: E-shop
* Grupp 4 / FaceRoots
* Oscar Nilsson
* oscar.nilsson@medieinstitutet.se
*/

let catList = [];

let img = document.querySelector('article img.productImage');
let imgBgColor = rgbToHex(window.getComputedStyle(document.querySelector('article'))
    .backgroundColor)
    .split('#')[1]
    .toLowerCase();

(() => {
    const inputC = document.querySelector('input#mockupCategories');
    const inputP = document.querySelector('input#mockupProducts');
    if (!inputC || !inputP) return;

    const url = new URL(location);

    url.searchParams.has('mcats')
        ? (inputC.value = url.searchParams.get('mcats'))
        : url.searchParams.set('mcats', inputC.value);

    url.searchParams.has('mprods')
        ? (inputP.value = url.searchParams.get('mprods'))
        : url.searchParams.set('mprods', inputP.value);

    history.replaceState(null, '', url);

})();

(() => {
    buyButtons();

    if (catList.length === 0) mockupCategories();
    mockupProducts();          // viktigt så att mprods används vid load
    updSidebar();

    changeImgBgColor(img, imgBgColor);
})();

(() => {
    const inputC = document.querySelector('input#mockupCategories');
    const inputP = document.querySelector('input#mockupProducts');
    if (!inputC || !inputP) return;

    const intvC = { min: Number(inputC.getAttribute('min')), max: Number(inputC.getAttribute('max')) };
    const intvP = { min: Number(inputP.getAttribute('min')), max: Number(inputP.getAttribute('max')) };

    const events = ['change', 'keyup'];

    const setParam = (key, value) => {
        const url = new URL(location);
        url.searchParams.set(key, value);
        history.replaceState(null, '', url);
    };

    events.forEach(ev => {
        inputC.addEventListener(ev, () => {
        const value = Math.min(Math.max(Number(inputC.value), intvC.min), intvC.max);
        inputC.value = value;

        setParam('mcats', value);

        mockupCategories();
        updSidebar();
    });

    inputP.addEventListener(ev, () => {
        const value = Math.min(Math.max(Number(inputP.value), intvP.min), intvP.max);
        inputP.value = value;

        setParam('mprods', value);

        mockupProducts();
        updSidebar();
        });
    });
})();

/* Making buyButtons add items to cart. */
function buyButtons() {

    let buyBtns = document.querySelectorAll('button.buy'); // Declare array with all buyBtns on page.
    const cartItems = document.querySelector('span.cartItems'); // Declare constant cartItems.

    if (buyBtns.length == 0 || !cartItems) return; // If there aren't any buyBtns or cartItems on page, stop.

    let i = cartItems.innerHTML; // Take current value from span.cartItems.

    buyBtns.forEach(btn => { // Make each button.btn on page listen for click events.

        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default behavior of button.
            i++; // Increment items.
            cartItems.innerHTML = i; // Replace .cartItems' current html with incremented value.
        });

    });
}

/* Creating mockup products */
function mockupProducts () {
    // const numProducts = Number(document.querySelector('input#mockupProducts').value);
    const params = new URLSearchParams(location.search);
    const inputP = document.querySelector('input#mockupProducts');
    const fallback = Number(inputP?.value ?? 1);

    const numProducts = Number(params.get('mprods')) || fallback;

    const main = document.querySelector('main'); // Declare main.
    const productCards = main?.querySelectorAll('article.productCard'); // If main exists, create an array of all productCards in main.

    if (!numProducts || !productCards || productCards.length === 0) return; // If no productCards exist, stop.

    if (productCards.length < numProducts) { // If input value is greater than current amount of productCards.

        const categories = document.querySelectorAll('span.category');

        for (let index = productCards.length; index < numProducts; index++) {

            article = document.createElement('article'); // Create new productCard.
            article.className = 'productCard';
            article.innerHTML = productCards[0].innerHTML;
            
            const img = article.querySelector('img');
            const title = article.querySelector('h3');

            // const re = /_bg(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;
            // img.setAttribute('src', img.getAttribute('src').replace(re, '_bg' + imgBgColor));

            changeImgBgColor(img, imgBgColor);

            img.setAttribute('src', img.getAttribute('src').split('1').join((index % 10) + 1))

            title.innerHTML = title.innerHTML.split('1').join(index + 1);

            mockupCategories(article);

            main.append(article); // Append new productCard to main.
        }

        buyButtons(); // Refresh buyButtons so that new productCards get functional buttons.
    }

    if (productCards.length > numProducts) { // If input value is less than current amount of productCards.

        for (let index = productCards.length; index > numProducts; index--) {
            productCards[index-1].remove(); // Remove productCard.
        }
        
    }
    cEvent(mockupProducts, 'products:changed');
}

/* Capitalize first letter of string */
function capitalize(s) {
    if (typeof s !== "string") return s; // If given variable isn't a string, return it.
    const t = s.trimStart(); // Trim space.
    return t ? t[0].toUpperCase() + t.slice(1) : t; // Make first letter uppercase and return string.
};

/* Create mockup categories */
function randCatList(num) {
    const words = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium reiciendis tenetur quibusdam molestias fugit a velit. Nesciunt, eaque harum. Earum sed, cum quia incidunt maxime vero alias laborum saepe sint.'
        .replace(/[^a-zA-Z ]/g, '')
        .split(' ')
        .filter(w => w.length >= 2); // Remove special characters, split the string into array, and filter words shorter than 2 characters.

    // Make a list of the unique words in the array and make them lowercase.
    const pool = [...new Set(words.map(w => w.toLowerCase()))];
    num = Math.min(num, pool.length); // Adjust the pool to defined max number of words.

    const arr = [];
    while (arr.length < num) {
        const i = Math.floor(Math.random() * pool.length);
        const [picked] = pool.splice(i, 1); // Remove picked word from the pool.
        arr.push(capitalize(picked)); // Push picked word to return array and capitalize first letter.
    }

    return arr;
}

/* Uppdate all .category innerHTML with random category */
function mockupCategories(single) {

    // const numCategories = Number(document.querySelector('input#mockupCategories').value); // Get value from input field.
    const params = new URLSearchParams(location.search);

    const inputC = document.querySelector('input#mockupCategories');
    const fallback = Number(inputC?.value ?? 1);

    const numCategories = Number(params.get('mcats')) || fallback;

    const domCategories = (!single)
        ? document.querySelectorAll('.category') // If single-element isn't set declare domCategories as array of all .category elements from page.
        : single.querySelectorAll('.category'); // Else, use the provided element.

    const s = new Set([...domCategories].map(el => el.textContent.trim())); // Make a list of categories where everything but the text is stripped.
    let uniqueCat = [...s]; // Filter and keep unique values in list.

    if (!single) catList = randCatList(numCategories); // If single-element is not set, create a new random categories list.

    domCategories.forEach(category => {
        category.innerHTML = catList[Math.floor(Math.random() * numCategories)]; //
    });
    
    cEvent(mockupCategories, 'categories:changed');
}

function updSidebar() {
    if (catList.length == 0) return;
    const sidebar = document.querySelector('aside#sidebar nav');
    const currUl = sidebar.querySelector('ul');
    if (currUl) currUl.remove(); 

    const ul = document.createElement('ul');

    const productCards = document.querySelectorAll('article.productCard');

    let productCatlist = {};
    productCards.forEach(productCard => {
        const name = productCard.querySelector('h3').textContent.trim();
        const cat = productCard.querySelector('.category').textContent.trim();
        (productCatlist[cat] ??= []).push(name);
    });

    const list = Object.entries(productCatlist)
        .sort(([catA], [catB]) => catA.localeCompare(catB, 'sv'))
        .map(([cat, names]) => ({ cat, names }));

    list.forEach(({cat, names}) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        const label = document.createElement('label');

        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'id_' + cat);

        label.setAttribute('for', 'id_' + cat);
        label.innerText = cat;

        li.append(checkbox);
        li.append(label);

        ul.append(li);

        if (names.length > 0) {
            const subUl = document.createElement('ul');

            names.forEach(name => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.setAttribute('href', 'product.html');
                a.textContent = name;
                li.append(a)
                subUl.append(li);
            });
            ul.append(subUl);
        }
    });

    sidebar.append(ul);
    cEvent(updSidebar, 'sidebar:updated');
}

function rgbToHex (color) {
    const m = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!m) return color;
    const [r, g, b] = m.slice(1, 4).map(Number);
    
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
};

function changeImgBgColor (img, imgBgColor) {
    const re = /_bg(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;
    img.setAttribute('src', img.getAttribute('src').replace(re, '_bg' + imgBgColor));
}

/* Scroll and fixed sidebar */
const sidebar = document.querySelector('aside#sidebar');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const mockupPanel = document.querySelector('#mockupPanel');

let headerTop, headerHeight, sidebarTop, sidebarHeight, stopY;

function getTop(el) {
    return el.getBoundingClientRect().top + window.scrollY;
}

function initSidebar() {
    const prevPos = sidebar.style.position;
    const prevTop = sidebar.style.top;

    sidebar.style.position = 'absolute';
    sidebar.style.top = ''; 

    headerTop = getTop(header);
    headerHeight = header.offsetHeight;
    sidebarTop = getTop(sidebar);
    sidebarHeight = sidebar.offsetHeight;
    parentTop = getTop(sidebar.offsetParent);
    stopY = getTop(footer);

    sidebar.style.position = prevPos;
    sidebar.style.top = prevTop;

    onScroll();
}

function onScroll() {
    const y = window.scrollY;
    const fixedTop = sidebarTop - (headerTop + headerHeight);

    if (y <= headerTop + headerHeight ) {
        sidebar.style.position = 'absolute';
        sidebar.style.top = '';
        return;
    }
    
    if (y + fixedTop + sidebarHeight < stopY) {
        sidebar.style.position = 'fixed';
        sidebar.style.top = `${fixedTop}px`;
        return;
    }

    sidebar.style.position = 'absolute';
    sidebar.style.top = `${(stopY - sidebarHeight) - parentTop}px`; //sidebar.style.top = `${stopY - sidebarHeight - (headerTop + headerHeight)}px`;
}

window.addEventListener('scroll', onScroll);

['load', 'resize']
    .forEach(event => { window.addEventListener(event, initSidebar) });

['sidebar:updated']
    .forEach(event => { document.addEventListener(event, initSidebar) });

function cEvent(fn, eventName) {
    document.dispatchEvent(
        new CustomEvent(eventName, {
            detail: { source: fn }
        })
    );
}

/* Mockup panel */
const mockupPanelClose = mockupPanel.querySelector('a.close');
mockupPanelClose.addEventListener('click', (event) => {
    event.preventDefault();
    mockupPanel.classList.toggle('open');
    mockupPanelClose.textContent = (mockupPanel.classList.contains('open'))
        ? 'Close'
        : 'Open';
});