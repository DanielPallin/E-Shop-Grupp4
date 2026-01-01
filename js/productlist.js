/*
* Gruppuppgift: E-shop
* Grupp 4 / FaceRoots
* Oscar Nilsson
* oscar.nilsson@medieinstitutet.se
*/

let catList = [];

let img = document.querySelector('article img.productImage');
let imgBgColor = rgbToHex(window.getComputedStyle(document.querySelector('article.productCard'))
    .backgroundColor)
    .split('#')[1]
    .toLowerCase(); // Get the background-color of the product card in hex-format.

(() => {
    const inputC = document.querySelector('input#mockupCategories');
    const inputP = document.querySelector('input#mockupProducts');
    if (!inputC || !inputP) return;

    const url = new URL(location);

    url.searchParams.has('mcats') // If search-params has mcats and mprods, use them, if not get amount of mockup categories and products from input field.
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
    mockupProducts();
    updSidebar();

    changeImgBgColor(img, imgBgColor); // Get images with same bg-color as product card.
})();

(() => {
    /* Get amount of mockup categories and products from input field, on change and keyup. */
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

        const categories = document.querySelectorAll('span.productCategory');

        for (let index = productCards.length; index < numProducts; index++) {

            article = document.createElement('article'); // Create new productCard.
            article.className = 'productCard';
            article.innerHTML = productCards[0].innerHTML;
            
            const img = article.querySelector('img.productImage');
            const title = article.querySelector('h3.productName');
            const price = article.querySelector('span.productPrice');

            // const re = /_bg(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;
            // img.setAttribute('src', img.getAttribute('src').replace(re, '_bg' + imgBgColor));

            changeImgBgColor(img, imgBgColor);

            img.setAttribute('src', img.getAttribute('src').split('1').join((index % 10) + 1))

            title.innerHTML = title.innerHTML.split('1').join(index + 1);
            price.innerHTML = mockupPrice(200, 2500, null, 'SEK');

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

/* Uppdate all .productCategory innerHTML with random category */
function mockupCategories(single) {

    // const numCategories = Number(document.querySelector('input#mockupCategories').value); // Get value from input field.
    const params = new URLSearchParams(location.search);

    const inputC = document.querySelector('input#mockupCategories');
    const fallback = Number(inputC?.value ?? 1);

    const numCategories = Number(params.get('mcats')) || fallback;

    const domCategories = (!single)
        ? document.querySelectorAll('.productCategory') // If single-element isn't set declare domCategories as array of all .productCategory elements from page.
        : single.querySelectorAll('.productCategory'); // Else, use the provided element.

    const s = new Set([...domCategories].map(el => el.textContent.trim())); // Make a list of categories where everything but the text is stripped.
    let uniqueCat = [...s]; // Filter and keep unique values in list.

    if (!single) catList = randCatList(numCategories); // If single-element is not set, create a new random categories list.

    domCategories.forEach(category => {
        let catName = catList[Math.floor(Math.random() * numCategories)];
        category.innerHTML = catName; //
        category.closest('article.productCard').setAttribute('data-productCategory', catName)
    });
}

/* Update sidebar */
// To do: use existing UL and clone LI instead of deleting and creating new ones.
function updSidebar() {
    if (catList.length == 0) return;
    const sidebar = document.querySelector('aside#sidebar nav');
    const currUl = sidebar.querySelector('ul');

    if (currUl) currUl.remove(); // Remove existing ul.

    const ul = document.createElement('ul'); // Create new ul.
    ul.setAttribute('class', 'categoryList'); // Add class to new list.

    const productCards = document.querySelectorAll('article.productCard'); // Create array of productCards.

    let productCatlist = {};
    productCards.forEach(productCard => { // Loop through all productCards.
        const name = productCard.querySelector('h3.productName').textContent.trim();
        const cat = productCard.querySelector('span.productCategory').textContent.trim();
        (productCatlist[cat] ??= []).push(name); // Add every productname to their corresponding category.
    });

    const list = Object.entries(productCatlist) // Create new list with categories sorted alphabetically.
        .sort(([catA], [catB]) => catA.localeCompare(catB, 'sv'))
        .map(([cat, names]) => ({ cat, names }));

    list.forEach(({cat, names}) => {
        const li = document.createElement('li'); // Create list items with inputs and labels.
        const checkbox = document.createElement('input');
        const label = document.createElement('label');

        checkbox.setAttribute('type', 'checkbox'); // Add attributes to checkbox.
        checkbox.setAttribute('id', 'id_' + cat);

        label.setAttribute('for', 'id_' + cat); // Add attribute "for" to label.
        label.innerText = cat;

        li.append(checkbox);
        li.append(label);

        ul.append(li);

        if (names.length > 0) {
            const subUl = document.createElement('ul'); // Create sublist to accommodate products.

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
    document.dispatchEvent(new Event('categoryList:updated')); // Trigger event.
}

/* Translate RGB value to HEX. */
function rgbToHex (color) {
    const m = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!m) return color;
    const [r, g, b] = m.slice(1, 4).map(Number);
    
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
};

/* Change image name depending on provided background color (hex) */
function changeImgBgColor (img, imgBgColor) {
    const re = /_bg(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;
    img.setAttribute('src', img.getAttribute('src').replace(re, '_bg' + imgBgColor));
}

/* Mockup panel */
const mockupPanel = document.querySelector('#mockupPanel');
const mockupPanelClose = mockupPanel.querySelector('a.close');
mockupPanelClose.addEventListener('click', (event) => {
    event.preventDefault();
    mockupPanel.classList.toggle('open');
    mockupPanelClose.textContent = (mockupPanel.classList.contains('open'))
        ? 'Close'
        : 'Open';
});

/* Mockup price */
function mockupPrice(min, max, round, curr) {
    if (!round) round = 100;
    let price = Math.floor(Math.random() * ((max + 1) - min) + min);
    price = (Math.round(price/round)*round-1).toLocaleString('se-SE');

    return `${price} ${curr}`;
}

let selectedCategories = [];

/* Add/remove class filtered depending on if product-category exists in selectedCategories. */
function applyFilter() {
    const productList = document.querySelectorAll('article.productCard');
    productList.forEach(product => {
        const productCat = product.getAttribute('data-productCategory');
        const filtered = selectedCategories.length === 0 || selectedCategories.includes(productCat);
        product.classList.toggle('filtered', filtered);
    });
};

/* Updates heading with filtered categories. */
function updateHeading() {
    const heading = document.querySelector('main > h2');
    if (!heading) return;

    let headingSpan = document.querySelector('span[data-headingcats]');
    if (!headingSpan) {
        headingSpan = document.createElement('span');
        headingSpan.dataset.headingcats = '1';
        heading.append(headingSpan);
    }

    if (selectedCategories.length) {
        headingSpan.textContent = ': ' + [...selectedCategories].sort().join(', '); // Join selected categories to one string.
    } else {
        headingSpan.remove();
    }
};

(() => {
    const sidebarNav = document.querySelector('aside#sidebar nav');
    if (!sidebarNav) return;

    const syncSelectedFromDOM = () => {
        selectedCategories = [...sidebarNav.querySelectorAll('input[type="checkbox"]:checked')]
            .map(inp => inp.closest('li')?.querySelector('label')?.innerText.trim())
            .filter(Boolean);
    };

    sidebarNav.addEventListener('change', (e) => {
        const input = e.target;
        if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') return;
        if (!input.closest('.categoryList')) return;

        const label = input.closest('li')?.querySelector('label');
        if (!label) return;

        const catName = label.innerText.trim();

        if (input.checked) {
            if (!selectedCategories.includes(catName)) selectedCategories.push(catName); // Add category to selectedCategories list (if not already in the list).
        } else {
            selectedCategories = selectedCategories.filter(x => x !== catName); // Remove category from selectedCategories.
        }

        applyFilter();
        updateHeading();
    });

    document.addEventListener('categoryList:updated', () => {
        syncSelectedFromDOM();
        applyFilter();
        updateHeading();
    });

    syncSelectedFromDOM();
    applyFilter();
    updateHeading();
})();

/* Scroll arrows for horizontal scroll in navbar */
(() => {
    const nav = document.querySelector('aside#sidebar > nav');
    const catList = nav.querySelector('ul.categoryList');
    const scrollOffset = 10;

    const updClasses = () => {
            const hasScroll = (catList.scrollWidth - catList.clientWidth) > 1; // Check if content is wider than container.
        
            nav.classList.toggle('scrollLeft', (catList.scrollLeft > 0 + scrollOffset)); // If user has scrolled to the right, add class scrollLeft.
            nav.classList.toggle('scrollRight', (hasScroll && catList.scrollLeft + catList.clientWidth < catList.scrollWidth - scrollOffset));  // If it is posible to scroll to the right, add class scrollRight.
    }

    ['load', 'resize'].forEach(event => {
        window.addEventListener(event, () => { // Listen for load and resize.
            const vW = document.documentElement.clientWidth;
            if (vW > 960) return; // If viewport is wider than 960px, do nothing.

            updClasses(); // Update classes.

            catList.addEventListener('scroll', () => { // Opdate classes when user is scrolling the categoryList.
                updClasses();
            });

        });
    });

})();

/* Get products from JSON */
let productsPromise;

function getProducts() {
  if (!productsPromise) { // If productPromise not already set.
    productsPromise = fetch("db/products.json")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      });
  }
  return productsPromise;
}

async function listCategories() {
  const data = await getProducts();
  if (!data?.length) return;

  const byId = new Map();
  data.forEach(({ productCategory: cat }) => {
    if (cat?.id != null) byId.set(cat.id, cat);
  });

  const catList = [...byId.values()]
    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'sv'));

  const categoryLists = document.querySelectorAll('ul.categoryList');
  if (categoryLists.length === 0) return;

  categoryLists.forEach(categoryList => {
    const templateLi = categoryList.firstElementChild;
    if (!templateLi) return;

    const templateLink = templateLi.querySelector('a');
    const templateInput  = templateLi.querySelector('input');
    const templateLabel  = templateLi.querySelector('label');

    if (!templateLink && (!templateInput && !templateLabel)) return;

    catList.forEach(cat => {
      const li = templateLi.cloneNode(true);

      if (templateLink) {
        const a = li.querySelector('a');
        a.href = `${templateLink.href}?catid=${cat.id}`;
        a.textContent = cat.name ?? '';

      } else {
        const input = li.querySelector('input');
        const label = li.querySelector('label');

        input.id = label.htmlFor = `catid_${cat.id}`;
        
        label.textContent = cat.name ?? '';
      }

      categoryList.append(li);
    });

    templateLi.remove();
  });
}


async function listProducts() {
    const data = await getProducts();
    if(!data) return; // If no data were fetched, stop.

    const productCard = document.querySelector('article.productCard');

    if(!productCard) return;

    data.forEach(obj => { // Loop through fetched data.

        const newProductCard = productCard.cloneNode(true);

        const productAttr = [
            "productName",
            "productImage",
            "productCategory",
            "productBrand",
            "productPrice",
            "productDescription",
            "productDetails"
        ]; // Create list of all product attributes (class names) included in a product card.

        productAttr.forEach(attr => { // Loop through list of attributes.
            const el = newProductCard.querySelector(`.${attr}`); // Define constant based on class name.

            if (!el) return; // If not found, stop.

            if (attr == 'productImage') { // If image, set src and alt.

                el.src = `img/products/${obj[attr]}`;
                el.alt = obj.productName ?? '';

            } else if (attr == 'productCategory') { // If category, set the productCards data-attribute to category name.

                newProductCard.setAttribute('data-productcategory', obj.productCategory.name);
                el.textContent = obj[attr].name ?? '';

            } else if (attr == 'productPrice') { // If price, set both price and currency.

                const price = new Intl.NumberFormat("se-SE").format(obj.productPrice['amount']);
                el.textContent = `${price} ${obj.productPrice['currency']}`;

            } else if (attr == 'productDetails' && obj[attr].length > 1) {

                const detailsUl = document.createElement('ul');
                obj[attr].forEach(detail => {
                    const detailsLi = document.createElement('li');
                    detailsLi.innerText = detail ?? '';
                    detailsUl.append(detailsLi)
                    detailsUl.className = attr;
                });
                el.replaceWith(detailsUl);

            } else {

                el.textContent = obj[attr] ?? '';

            }
        });

        productCard.parentNode.append(newProductCard); // Append to parent node.
    });

    productCard.remove(); // Remove the hard coded productCard.
}

listCategories();

listProducts();

// const url = new URL(location);

// if (url.searchParams.has('cat') && url.searchParams.get('cat').length > 0) {
//     const test = document.getElementById('catid_' + url.searchParams.get('cat'));
// }