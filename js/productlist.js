/*
* Oscar Nilsson
* oscar.nilsson@medieinstitutet.se
*/

(() => {

    /* Run buy buttons */
    buyButtons();

})();

(() => {

    /* Have to do this nicer */
    const mockupCategories = document.querySelector('input#mockupCategories');
    let randomCategories = randCategories(mockupCategories.value);

    mockupCategories.addEventListener('change', () => {
        let randomCategories = randCategories(mockupCategories.value);

        const categories = document.querySelectorAll('span.category');
        categories.forEach(category => {
            let randomNumber = Math.floor(Math.random() * (mockupCategories.value));

            category.innerHTML = randomCategories[randomNumber];
        });

    });

    /* Checking for changes to input field for mockup categories and products. */
    const inputP = document.querySelector('input#mockupProducts');
    
    if (!inputP) return;

    const minVal = inputP.getAttribute('min');
    const maxVal = inputP.getAttribute('max');
    const events = ['change', 'keyup'];

    events.forEach(ev => {

        inputP.addEventListener(ev, () => { // Check if events occur on input field.

            let mockupProducts = Math.min(Math.max(inputP.value, minVal), maxVal); // Assign input value in interval between min and max.
            inputP.value = mockupProducts; // Set input value to value in interval.
            updateMockups(mockupProducts, randomCategories); // Update amount of mockup products.

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
function updateMockups (mockupProducts, randomCategories) {
    const main = document.querySelector('main'); // Declare main.
    const productCards = main?.querySelectorAll('article.productCard'); // If main exists, create an array of all productCards in main.

    if (!productCards || productCards.length === 0) return; // If no productCards exist, stop.

    if (productCards.length < mockupProducts) { // If input value is greater than current amount of productCards.

        const categories = document.querySelectorAll('span.category');

        for (let index = productCards.length; index < mockupProducts; index++) {

            article = document.createElement('article'); // Create new productCard.
            article.className = 'productCard';
            article.innerHTML = productCards[0].innerHTML.split('1').join(index + 1);

            let randomNumber = Math.floor(Math.random() * (randomCategories.length));

            article.querySelector('span.category')
                .innerHTML = randomCategories[Math.floor(Math.random() * (randomNumber))];

            main.append(article); // Append new productCard to main.
        }

        buyButtons(); // Refresh buyButtons so that new productCards get functional buttons.
    }

    if (productCards.length > mockupProducts) { // If input value is less than current amount of productCards.

        for (let index = productCards.length; index > mockupProducts; index--) {
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
function randCategories(num) {
    const words = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium reiciendis tenetur quibusdam molestias fugit a velit. Nesciunt, eaque harum. Earum sed, cum quia incidunt maxime vero alias laborum saepe sint.'
        .replace(/[^a-zA-Z ]/g, '')
        .split(' ')
        .filter(w => w.length >= 2);

    // Gör en unik pool (case-insensitive) så att "lorem" och "Lorem" räknas som samma
    const pool = [...new Set(words.map(w => w.toLowerCase()))];

    num = Math.min(num, pool.length);

    const arr = [];
    while (arr.length < num) {
        const i = Math.floor(Math.random() * pool.length);
        const [picked] = pool.splice(i, 1);   // tar bort ordet ur poolen => kan aldrig väljas igen
        arr.push(capitalize(picked));
    }

    return arr;
}