/*
* Gruppuppgift: E-shop
* Grupp 4 / FaceRoots
* Oscar Nilsson
* oscar.nilsson@medieinstitutet.se
*/

let catList = [];

(() => {
    buyButtons();
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

/* Capitalize first letter of string */
function capitalize(s) {
    if (typeof s !== "string") return s; // If given variable isn't a string, return it.
    const t = s.trimStart(); // Trim space.
    return t ? t[0].toUpperCase() + t.slice(1) : t; // Make first letter uppercase and return string.
};

let selectedCategories = [];

/* Add/remove class filtered depending on if product-category exists in selectedCategories. */
function applyFilter() {
    const productList = document.querySelectorAll('article.productCard');
    productList.forEach(product => {
        const productCat = product.getAttribute('data-product-cat');
        const productCatId = product.getAttribute('data-product-catid');
        const filtered = selectedCategories.length === 0 || selectedCategories.includes(productCat);
        product.classList.toggle('filtered', filtered);
    });
};

/* Updates heading with filtered categories. */
function updateHeading() {
    const heading = document.querySelector('main > h3');
    if (!heading) return;

    let headingSpan = document.querySelector('span[data-headingcats]');
    if (!headingSpan) {
        headingSpan = document.createElement('span');
        headingSpan.dataset.headingcats = '1';
        heading.append(headingSpan);
    }

    if (selectedCategories.length) {
        // headingSpan.textContent = ': ' + [...selectedCategories].sort().join(', '); // Join selected categories to one string.
        heading.textContent = [...selectedCategories].sort().join(', '); // Join selected categories to one string.
    } else {
        // headingSpan.remove();
        heading.textContent = 'All products';
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

            catList.addEventListener('scroll', () => { // Update classes when user is scrolling the categoryList.
                updClasses();
            });

        });
    });

})();

/* Get products from JSON */
let productsPromise;

function getProducts() {
    if (!productsPromise) { // If productPromise not already set.
        productsPromise = fetch("db/products.json").then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        });
    }
    return productsPromise;
}

/* List categories */
async function listCategories() {
    const data = await getProducts(); // Get products from JSON.
    if (!data?.length) return; // If fetch faild, stop.

    const byId = new Map();
    data.forEach(({ productCategory: cat }) => {
        if (cat?.id != null) byId.set(cat.id, cat);
    });

    const catList = [...byId.values()] // Make sorted list of categories with unique values.
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'sv'));

    const categoryLists = document.querySelectorAll('.categoryList'); // Get all elements with the categorylist-class.

    if (categoryLists.length === 0) return; // If no elements were found, stop.

    categoryLists.forEach(categoryList => { // Loop the list of lists.
        const firstEl = categoryList.firstElementChild; // Get first childelement of list.
        if (!firstEl) return; // If no chidelement was found, stop.

        const templateEl = firstEl.cloneNode(true); // Clone the first child element.
        categoryList.replaceChildren(); // Remove the original child elements.

        const templateLink = (templateEl.tagName.toLocaleLowerCase() == 'a') // If the child element is a link, set it as template element. If not, try to set child to template element.
            ? templateEl
            : templateEl.querySelector('a');

        const templateInput = templateEl.querySelector('input');
        const templateLabel = templateEl.querySelector('label');

        if (!templateLink && !(templateInput && templateLabel)) return; // If no template elements were found, stop.

        catList.forEach(cat => { // Loop through the sorted categories list.
            const el = templateEl.cloneNode(true); // Clone the template element.

            if (templateLink) { // If the content of the element == link.
                const a = (el.tagName.toLocaleLowerCase() == 'a') // Check if the cloned element is an anchor.
                    ? el
                    : el.querySelector('a');

                const newHref = templateLink.href.split('#')[0].split('?')[0];
                a.href = `${newHref}?catid=${cat.id}`; // Add href.

                a.textContent = cat.name ?? ''; // Add text content.

            } else {
                const input = el.querySelector('input');
                const label = el.querySelector('label');

                input.dataset.catid = cat.id;
                input.id = label.htmlFor = `catid_${cat.id}`; // Add id to input and for to label.
                label.textContent = cat.name ?? ''; // Add text content to label.
            }
            categoryList.append(el); // Append the newly created element to the category list.
        });
        templateEl.remove(); // Remove the template element.
    });
}

/* List products */
async function listProducts() {
    const data = await getProducts();
    if(!data) return; // If no data were fetched, stop.

    const productCard = document.querySelector('article.productCard');

    if(!productCard) return;

    data.forEach(obj => { // Loop through fetched data.

        const newProductCard = productCard.cloneNode(true);

        const productAttr = [
            "productId",
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

            newProductCard.dataset.productId = obj.productId; // Set data attribute to product id.

            if (!el) return; // If not found, stop.

            if (attr == 'productImage') { // If image, set src and alt.

                el.src = `img/products/${obj[attr]}`;
                el.alt = obj.productName ?? '';

            } else if (attr == 'productCategory') { // If category, set the productCards data-attribute to category name.

                newProductCard.dataset.productCat = obj.productCategory.name;
                newProductCard.dataset.productCatid = obj.productCategory.id;
                //newProductCard.setAttribute('data-productcategory', obj.productCategory.name);
                el.textContent = obj[attr].name ?? '';

            } else if (attr == 'productPrice') { // If price, set both price and currency.

                const price = new Intl.NumberFormat("se-SE").format(obj.productPrice['amount']);
                el.textContent = `${price} ${obj.productPrice['currency']}`;

            } else if (attr == 'productDetails' && obj[attr].length > 1) {

                const detailsUl = document.createElement('ul');
                obj[attr].forEach(detail => {
                    const detailsLi         = document.createElement('li');
                    detailsLi.innerText     = detail ?? '';
                    detailsUl.className     = attr;
                    detailsUl.append(detailsLi)
                    
                });
                el.replaceWith(detailsUl);
            
            } else if (attr == 'productName') {

                const anchor        = el.querySelector('a');
                anchor.innerText    = obj.productName;
                anchor.href         = `productpage-one.html?id=${obj.productId}`;
                newProductCard.querySelector('a.action').href = `productpage-one.html?id=${obj.productId}`;

            } else {

                el.textContent = obj[attr] ?? '';

            }
        });

        productCard.parentNode.append(newProductCard); // Append to parent node.
    });

    productCard.remove(); // Remove the hard coded productCard.
}

/* Apply category id from URL */
const applyCatidFromUrl = () => {
    const url = new URL(location.href);
    const catid = url.searchParams.get('catid'); // Get catid from url
    if (!catid) return;

    const sidebarNav = document.querySelector('aside#sidebar nav');
    const input = sidebarNav.querySelector(`input[data-catid="${catid}"]`); // Get element with same data-catid attribute as catid in URL.
    if (!input) return;

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true })); // "Bubble" event so that the eventlistener on parent element can catch it.
};

(async () => {
    await Promise.all([listCategories(), listProducts()]);
    applyCatidFromUrl();
})();
