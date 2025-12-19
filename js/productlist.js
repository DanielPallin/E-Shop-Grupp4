/*
* Oscar Nilsson
* oscar.nilsson@medieinstitutet.se
*/

let catList = [];

(() => {

    /* Run buy buttons and random categories */
    buyButtons();
    if (catList.length == 0) randCategories();

})();

(() => {

    /* Checking for changes to input field for mockup categories and products. */
    const inputC = document.querySelector('input#mockupCategories');
    const inputP = document.querySelector('input#mockupProducts');
    if (!inputC || !inputP) return;

    const intvC = { 
        'min' : inputC.getAttribute('min'), 
        'max' : inputC.getAttribute('max') 
    };

    const intvP = { 
        'min' : inputP.getAttribute('min'), 
        'max' : inputP.getAttribute('max') 
    };

    const events = ['change', 'keyup'];
    events.forEach(ev => {
        inputC.addEventListener(ev, () => {
            inputC.value = Math.min(Math.max(inputC.value, intvC.min), intvC.max);
            randCategories();
        });
        inputP.addEventListener(ev, () => { // Check if events occur on input field.
            inputP.value  = Math.min(Math.max(inputP.value, intvP.min), intvP.max); // Set input value to value in interval between min and max.
            updateMockups(); // Update mockup products.
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
function updateMockups () {
    const numProducts = Number(document.querySelector('input#mockupProducts').value);
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
            
            img.setAttribute('src', img.getAttribute('src').split('1').join((index % 10) + 1))

            title.innerHTML = title.innerHTML.split('1').join(index + 1);

            randCategories(article);

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

/* Uppdate all .category innerHTML with random category */
function randCategories(single) {

    const numCategories = Number(document.querySelector('input#mockupCategories').value); // Get value from input field.

    const domCategories = (!single)
        ? document.querySelectorAll('.category') // If single-element isn't set declare domCategories as array of all .category elements from page.
        : single.querySelectorAll('.category'); // Else, use the provided element.

    const s = new Set([...domCategories].map(el => el.textContent.trim())); // Make a list of categories where everything but the text is stripped.
    let uniqueCat = [...s]; // Filter and keep unique values in list.

    if (!single) catList = randCatList(numCategories); // If single-element is not set, create a new random categories list.

    domCategories.forEach(category => {
        category.innerHTML = catList[Math.floor(Math.random() * numCategories)]; //
    });
    
}