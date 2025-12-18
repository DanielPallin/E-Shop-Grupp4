(() => {

    /* Run buy buttons */
    buyButtons();

    /* Checking for changes to input field for mockup products. */
    const input = document.querySelector('input#mockupProducts');
    if (!input) return;

    const minVal = input.getAttribute('min');
    const maxVal = input.getAttribute('max');
    const events = ['change', 'keyup'];

    events.forEach(ev => {
        input.addEventListener(ev, () => { // Check if events occur on input field.
            let mockupProducts = Math.min(Math.max(input.value, minVal), maxVal); // Assign input value in interval between min and max.
            input.value = mockupProducts; // Set input value to value in interval.
            updateMockups(mockupProducts); // Update amount of mockup products.
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
function updateMockups (mockupProducts) {
    const main = document.querySelector('main'); // Declare main.
    const productCards = main?.querySelectorAll('article.productCard'); // If main exists, create an array of all productCards in main.

    if (!productCards || productCards.length === 0) return; // If no productCards exist, stop.

    if (productCards.length < mockupProducts) { // If input value is greater than current amount of productCards.
        for (let index = productCards.length; index < mockupProducts; index++) {
            article = document.createElement('article'); // Create new productCard.
            article.className = 'productCard';
            article.innerHTML = productCards[0].innerHTML.split('1').join(index + 1);
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